from bson import ObjectId
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from ..core.database import get_db
from ..dependencies.auth import get_current_user
from ..utils.mongo import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/favourite", tags=["favourites"])


@router.post("/add")
async def add_favourite(body: dict, current_user=Depends(get_current_user)):
    db = get_db()
    user_id = current_user["id"]
    product_id = body.get("productId")

    if not product_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"success": False, "message": "Missing required field"},
        )

    try:
        user_oid = ObjectId(user_id)
        product_oid = ObjectId(product_id)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Invalid id"},
        )

    existing = await db["favourites"].find_one(
        {"userId": user_oid, "productId": product_oid}
    )
    if existing:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Already added to favourites"},
        )

    favourite_doc = {
        "userId": user_oid,
        "productId": product_oid,
    }
    res = await db["favourites"].insert_one(favourite_doc)
    favourite = await db["favourites"].find_one({"_id": res.inserted_id})

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "message": "Added to favourites",
            "favourite": serialize_doc(favourite),
        },
    )


@router.post("/delete")
async def remove_favourite(body: dict, current_user=Depends(get_current_user)):
    db = get_db()
    user_id = current_user["id"]
    product_id = body.get("productId")

    try:
        user_oid = ObjectId(user_id)
        product_oid = ObjectId(product_id)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Invalid id"},
        )

    deleted = await db["favourites"].find_one_and_delete(
        {"userId": user_oid, "productId": product_oid}
    )
    if not deleted:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Something wrong"},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "message": "Removed from favourite"},
    )


@router.get("/getUserFavourites")
async def get_user_favourites(current_user=Depends(get_current_user)):
    db = get_db()
    user_id = current_user["id"]
    user_oid = ObjectId(user_id)

    favs = await db["favourites"].find({"userId": user_oid}).to_list(length=None)

    # populate productId
    for fav in favs:
        pid = fav.get("productId")
        if isinstance(pid, ObjectId):
            product = await db["shoes"].find_one({"_id": pid})
            if product:
                fav["productId"] = serialize_doc(product)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "fav": serialize_docs(favs)},
    )



