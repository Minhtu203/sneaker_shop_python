import random
from datetime import datetime, timedelta

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse

from ..core.database import get_db
from ..core.redis_client import ensure_redis_connected, get_redis_client
from ..core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)
from ..schemas.auth import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from ..services.email import send_otp_email
from ..utils.mongo import serialize_doc

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


@router.post("/register")
async def register_user(payload: RegisterRequest):
    db = get_db()
    username = payload.username
    email = payload.email
    password = payload.password

    existing_user = await db["users"].find_one({"username": username})
    if existing_user:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"success": False, "message": "Username đã được đăng ký."},
        )

    existing_email = await db["users"].find_one({"email": email})
    if existing_email:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"success": False, "message": "Email đã được đăng ký."},
        )

    hashed = hash_password(password)
    doc = {
        "username": username,
        "email": email,
        "password": hashed,
        "role": "user",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }
    result = await db["users"].insert_one(doc)
    user = await db["users"].find_one({"_id": result.inserted_id})

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "data": serialize_doc(user),
            "message": "Register successfully",
        },
    )


@router.post("/login")
async def login_user(payload: LoginRequest):
    db = get_db()
    user = await db["users"].find_one({"username": payload.username})
    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Username is not valid!"},
        )

    if not verify_password(payload.password, user.get("password", "")):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Wrong password!"},
        )

    user_id_str = str(user["_id"])
    role = user.get("role", "user")

    access_token = create_access_token({"id": user_id_str, "role": role})
    refresh_token = create_refresh_token({"id": user_id_str, "role": role})

    # Đảm bảo Redis đã được kết nối và lưu refresh token
    try:
        if not await ensure_redis_connected():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Redis not available. Please check Redis server connection.",
            )

        redis = get_redis_client()
        expiry_seconds = 365 * 24 * 60 * 60
        await redis.set(f"refreshToken:{user_id_str}", refresh_token, ex=expiry_seconds)
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error saving refresh token to Redis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save refresh token: {str(e)}",
        )

    user_data = serialize_doc(user)
    user_data.pop("password", None)
    user_data["accessToken"] = access_token

    response = JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": user_data},
    )
    response.set_cookie(
        key="refreshToken",
        value=refresh_token,
        httponly=True,
        path="/",
        secure=False,
        samesite="strict",
    )
    return response


@router.post("/refreshToken")
async def request_refresh_token(
    response: Response,
    refresh_token: str | None = Cookie(default=None, alias="refreshToken"),
):
    if not refresh_token:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content="You're not authenticated",
        )

    try:
        user = decode_refresh_token(refresh_token)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content="Refresh Token is not valid or expired.",
        )

    # Đảm bảo Redis đã được kết nối và xử lý refresh token
    try:
        if not await ensure_redis_connected():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Redis not available. Please check Redis server connection.",
            )

        redis = get_redis_client()
        stored_token = await redis.get(f"refreshToken:{user['id']}")
        if not stored_token or stored_token != refresh_token:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content="Refresh Token mismatch or already revoked.",
            )

        new_access_token = create_access_token({"id": user["id"], "role": user.get("role")})
        new_refresh_token = create_refresh_token({"id": user["id"], "role": user.get("role")})

        expiry_seconds = 365 * 24 * 60 * 60
        await redis.set(
            f"refreshToken:{user['id']}",
            new_refresh_token,
            ex=expiry_seconds,
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing refresh token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process refresh token: {str(e)}",
        )

    response = JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"accessToken": new_access_token},
    )
    response.set_cookie(
        key="refreshToken",
        value=new_refresh_token,
        httponly=True,
        path="/",
        secure=False,
        samesite="strict",
    )
    return response


@router.post("/logout")
async def logout_user(
    response: Response,
    refresh_token: str | None = Cookie(default=None, alias="refreshToken"),
):
    cookie_kwargs = {
        "key": "refreshToken",
        "value": "",
        "httponly": True,
        "path": "/",
        "secure": False,
        "samesite": "strict",
        "max_age": 0,
    }
    response = JSONResponse(content="Logged out !")
    response.set_cookie(**cookie_kwargs)

    if not refresh_token:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content="No refresh token found",
        )

    # Đảm bảo Redis đã được kết nối và xóa refresh token
    try:
        if not await ensure_redis_connected():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Redis not available. Please check Redis server connection.",
            )

        decoded = decode_refresh_token(refresh_token)
        user_id = decoded["id"]
        redis = get_redis_client()
        await redis.delete(f"refreshToken:{user_id}")
        return response
    except HTTPException:
        raise
    except Exception as err:
        # nếu token hết hạn hoặc có lỗi, vẫn coi như logout thành công
        print(f"⚠️  Logout warning: {err}")
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content="Logged out (token expired or error occurred)!",
        )


@router.post("/forgotPassword")
async def forgot_password(payload: ForgotPasswordRequest):
    db = get_db()
    user = await db["users"].find_one({"username": payload.username})
    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Username không tồn tại"},
        )

    otp = _generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    await db["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "resetOtp": otp,
                "resetOtpExpires": expires_at,
            }
        },
    )

    await run_in_threadpool(send_otp_email, user["email"], otp)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "message": f"OTP đã được gửi vào email {user['email']}",
        },
    )


@router.post("/resetPassword")
async def reset_password(payload: ResetPasswordRequest):
    db = get_db()
    user = await db["users"].find_one({"username": payload.username})
    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Username is not exists"},
        )

    if user.get("resetOtp") != payload.otp:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "OTP không hợp lệ"},
        )

    expires = user.get("resetOtpExpires")
    if isinstance(expires, datetime) and datetime.utcnow() > expires:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "OTP đã hết hạn"},
        )

    hashed = hash_password(payload.newPassword)
    await db["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {"password": hashed},
            "$unset": {"resetOtp": "", "resetOtpExpires": ""},
        },
    )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "message": "Đặt lại mật khẩu thành công"},
    )



