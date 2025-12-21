from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from ..core.database import get_db
from ..dependencies.auth import get_admin_user, get_current_user
from ..utils.filter_empty_values import filter_empty_values
from ..utils.mongo import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/user", tags=["user"])


@router.delete("/{id}")
async def delete_user(id: str, admin=Depends(get_admin_user)):
    db = get_db()
    try:
        oid = ObjectId(id)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "success": False,
                "message": "Người dùng không tồn tại",
                "deletedUser": None,
            },
        )

    user = await db["users"].find_one_and_delete({"_id": oid})
    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "success": False,
                "message": "Người dùng không tồn tại",
                "deletedUser": None,
            },
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "message": "Xóa người dùng thành công",
            "deletedUser": serialize_doc(user),
        },
    )


@router.get("/getUserByid/{id}")
async def get_user(id: str):
    db = get_db()
    try:
        oid = ObjectId(id)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "ID người dùng không hợp lệ"},
        )

    user = await db["users"].find_one({"_id": oid}, projection={"password": 0})
    if not user:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Người dùng không tồn tại"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_doc(user)},
    )


@router.get("/allusers")
async def get_all_users(admin=Depends(get_admin_user)):
    db = get_db()
    cursor = db["users"].find()
    users = await cursor.to_list(length=None)

    data = [
        {
            "_id": str(u.get("_id")),
            "username": u.get("username"),
            "email": u.get("email"),
            "role": u.get("role"),
            "avatar": u.get("avatar"),
        }
        for u in users
    ]
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": data},
    )


@router.post("/updateUserInfo")
async def update_user_info(
    update_body: dict,
    current_user=Depends(get_current_user),
):
    db = get_db()
    user_id = current_user["id"]
    update_data = filter_empty_values(update_body)

    update_data.pop("role", None)
    update_data.pop("shopping_cart", None)

    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="User not found")

    result = await db["users"].update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "User not found"},
        )

    updated = await db["users"].find_one({"_id": oid})
    user_response = serialize_doc(updated)
    user_response.pop("password", None)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "user": user_response,
            "message": "Please log in again to see all updated changes across the application.",
            "life": 8000,
        },
    )



