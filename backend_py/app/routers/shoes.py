from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse

from ..core.database import get_db
from ..dependencies.auth import get_admin_user, get_current_user
from ..utils.filter_empty_values import filter_empty_values
from ..utils.mongo import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/shoes", tags=["shoes"])


@router.get("/getAllShoes")
async def get_all_shoes(current_user=Depends(get_current_user)):
    db = get_db()
    shoes = await db["shoes"].find().to_list(length=None)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )


@router.post("/getShoesById")
async def get_shoes_by_id(body: dict, current_user=Depends(get_current_user)):
    db = get_db()
    shoe_id = body.get("id")
    if not shoe_id:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Missing product ID"},
        )
    try:
        oid = ObjectId(shoe_id)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Can't found product"},
        )

    shoe = await db["shoes"].find_one({"_id": oid})
    if not shoe:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Can't found product"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_doc(shoe)},
    )


@router.post("/createShoes")
async def create_shoes(body: dict, admin=Depends(get_admin_user)):
    db = get_db()
    data = body
    colors = data.get("colors", [])
    new_colors = []
    for color in colors:
        sizes = color.get("sizes", [])
        sizes_sorted = sorted(sizes, key=lambda s: s.get("size", 0))
        new_color = {**color, "sizes": sizes_sorted}
        new_colors.append(new_color)
    data["colors"] = new_colors

    result = await db["shoes"].insert_one(data)
    saved = await db["shoes"].find_one({"_id": result.inserted_id})
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "data": serialize_doc(saved),
            "message": "Create item successfully",
        },
    )


@router.put("/updateShoes/{id}")
async def update_shoes(id: str, body: dict, admin=Depends(get_admin_user)):
    db = get_db()
    images = body.get("images")
    other_data = {k: v for k, v in body.items() if k != "images"}
    filter_other_data = filter_empty_values(other_data)

    update_query: dict = {}
    if filter_other_data:
        update_query["$set"] = filter_other_data
    if images and isinstance(images, list) and len(images) > 0:
        update_query.setdefault("$push", {})
        update_query["$push"]["img"] = {"$each": images}

    try:
        oid = ObjectId(id)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Can't found product"},
        )

    if not update_query:
        # không có gì để update
        shoe = await db["shoes"].find_one({"_id": oid})
        if not shoe:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"success": False, "message": "Can't found product"},
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "data": serialize_doc(shoe),
                "message": "Item updated successfully",
            },
        )

    result = await db["shoes"].find_one_and_update(
        {"_id": oid},
        update_query,
        return_document=True,
    )
    if not result:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Can't found product"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "data": serialize_doc(result),
            "message": "Item updated successfully",
        },
    )


@router.delete("/deleteShoes/{id}")
async def delete_shoes(id: str, admin=Depends(get_admin_user)):
    db = get_db()
    if not id:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"error": "Missing product ID to delete"},
        )
    try:
        oid = ObjectId(id)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Can't found product"},
        )

    deleted = await db["shoes"].find_one_and_delete({"_id": oid})
    if not deleted:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Can't found product"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "message": "Delete product successfully"},
    )


@router.get("/getJordanShoes")
async def get_jordan_shoes(current_user=Depends(get_current_user)):
    db = get_db()
    shoes = await db["shoes"].find({"brand": "Jordan"}).to_list(length=None)
    if len(shoes) == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "No product found"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )


@router.get("/getNikeShoes")
async def get_nike_shoes(current_user=Depends(get_current_user)):
    db = get_db()
    shoes = await db["shoes"].find({"brand": "Nike"}).to_list(length=None)
    if len(shoes) == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "No product found"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )


@router.get("/getAdidasShoes")
async def get_adidas_shoes(current_user=Depends(get_current_user)):
    db = get_db()
    shoes = await db["shoes"].find({"brand": "Adidas"}).to_list(length=None)
    if len(shoes) == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "No product found"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )


@router.get("/getAirmaxShoes")
async def get_airmax_shoes(current_user=Depends(get_current_user)):
    db = get_db()
    shoes = await db["shoes"].find({"brand": "Airmax"}).to_list(length=None)
    if len(shoes) == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "No product found"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )


@router.get("/getIsFeaturedShoes")
async def get_is_featured_shoes(
    isFeatured: Optional[str] = Query(default=None),
    gender: Optional[str] = Query(default=None),
    price: Optional[str] = Query(default=None),
    sale: Optional[str] = Query(default=None),
    current_user=Depends(get_current_user),
):
    db = get_db()
    query: dict = {}
    if isFeatured:
        # Mongoose tự convert, ở đây ta convert tay từ string
        query["isFeatured"] = str(isFeatured).lower() == "true"
    if gender:
        query["gender"] = gender
    if price:
        try:
            min_str, max_str = price.split("-")
            min_price = float(min_str)
            max_price = float(max_str)
            query["price"] = {"$gte": min_price, "$lte": max_price}
        except Exception:
            pass
    if sale == "true":
        query["sale.sales"] = True

    shoes = await db["shoes"].find(query).to_list(length=None)
    if len(shoes) == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "No product found"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )


@router.get("/getBasketballShoes")
async def get_basketball_shoes(current_user=Depends(get_current_user)):
    db = get_db()
    shoes = await db["shoes"].find({"category": "Basketball"}).to_list(length=None)
    if len(shoes) == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "No product found"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )


@router.get("/getFootballShoes")
async def get_football_shoes(current_user=Depends(get_current_user)):
    db = get_db()
    shoes = await db["shoes"].find({"category": "Football"}).to_list(length=None)
    if len(shoes) == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "No product found"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )


@router.get("/getGolfShoes")
async def get_golf_shoes(current_user=Depends(get_current_user)):
    db = get_db()
    shoes = await db["shoes"].find({"category": "Golf"}).to_list(length=None)
    if len(shoes) == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "No product found"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )


@router.get("/getTennisShoes")
async def get_tennis_shoes(current_user=Depends(get_current_user)):
    db = get_db()
    shoes = await db["shoes"].find({"category": "Tennis"}).to_list(length=None)
    if len(shoes) == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "No product found"},
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_docs(shoes)},
    )



