from typing import Dict, Any

from fastapi import Depends, Header, HTTPException, status

from ..core.security import decode_access_token


async def get_current_user(
    token: str | None = Header(default=None, alias="token"),
) -> Dict[str, Any]:
    """
    Tương đương middlewareController.verifyToken trong Node:
    - Header `token: Bearer <accessToken>`
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You're not authenticated",
        )

    parts = token.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is not valid",
        )

    access_token = parts[1]
    try:
        user = decode_access_token(access_token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is not valid",
        )
    return user


async def get_admin_user(
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Tương đương middlewareController.verifyAdminToken
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You're not allowed to perform this action",
        )
    return current_user


