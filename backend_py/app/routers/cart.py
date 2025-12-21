from bson import ObjectId
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from ..core.database import get_db
from ..dependencies.auth import get_current_user
from ..utils.mongo import serialize_doc

router = APIRouter(prefix="/api/cart", tags=["cart"])


@router.post("/add")
async def add_to_cart(body: dict, current_user=Depends(get_current_user)):
    db = get_db()
    product_id = body.get("productId")
    color = body.get("color")
    size = body.get("size")
    quantity = body.get("quantity")
    user_id = current_user["id"]

    if not size:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Please select a size to continue",
            },
        )
    if not product_id or not quantity:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Missing required field"},
        )

    try:
        product_oid = ObjectId(product_id)
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Product not found"},
        )

    product = await db["shoes"].find_one({"_id": product_oid})
    if not product:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Product not found"},
        )

    user_oid = ObjectId(user_id)
    cart = await db["carts"].find_one({"userId": user_oid})
    if not cart:
        cart = {
            "userId": user_oid,
            "items": [],
        }
        res = await db["carts"].insert_one(cart)
        cart["_id"] = res.inserted_id

    selected_color = None
    for c in product.get("colors", []):
        if c.get("colorName") == color:
            selected_color = c
            break

    if not selected_color:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Selected color not found for this product",
            },
        )

    items = cart.get("items", [])
    existing_item = None
    for item in items:
        if (
            str(item.get("productId")) == product_id
            and item.get("size") == size
            and item.get("color", {}).get("colorName") == color
        ):
            existing_item = item
            break

    if existing_item:
        existing_item["quantity"] = existing_item.get("quantity", 0) + quantity
    else:
        items.append(
            {
                "productId": product_oid,
                "name": product.get("name"),
                "brand": product.get("brand"),
                "price": product.get("price"),
                "color": {
                    "colorName": selected_color.get("colorName") or color,
                    "color": selected_color.get("color") or "",
                    "img": selected_color.get("img") or [],
                },
                "size": size,
                "quantity": quantity,
            }
        )

    await db["carts"].update_one(
        {"_id": cart["_id"]},
        {"$set": {"items": items}},
    )

    user = await db["users"].find_one({"_id": user_oid})
    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "User not found"},
        )
    if not user.get("shopping_cart"):
        await db["users"].update_one(
            {"_id": user_oid},
            {"$set": {"shopping_cart": cart["_id"]}},
        )

    saved_cart = await db["carts"].find_one({"_id": cart["_id"]})
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "message": "Added item to cart",
            "cart": serialize_doc(saved_cart),
        },
    )


@router.get("/getAllItems")
async def get_all_items_in_cart(current_user=Depends(get_current_user)):
    db = get_db()
    user_id = current_user["id"]
    user_oid = ObjectId(user_id)

    user = await db["users"].find_one({"_id": user_oid})
    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "User not found"},
        )

    cart_id = user.get("shopping_cart")
    if not cart_id:
        cart_items = {"items": []}
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "cartItems": cart_items,
                "count": 0,
            },
        )

    cart = await db["carts"].find_one({"_id": cart_id})
    if not cart:
        cart_items = {"items": []}
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "cartItems": cart_items,
                "count": 0,
            },
        )

    # populate items.productId
    for item in cart.get("items", []):
        pid = item.get("productId")
        if isinstance(pid, ObjectId):
            product = await db["shoes"].find_one({"_id": pid})
            if product:
                item["productId"] = serialize_doc(product)

    cart_serialized = serialize_doc(cart)
    count = len(cart_serialized.get("items", []))
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "cartItems": cart_serialized,
            "count": count,
        },
    )


@router.post("/deleteItem")
async def delete_item(body: dict, current_user=Depends(get_current_user)):
    db = get_db()
    user_id = current_user["id"]
    product_id = body.get("productId")
    size = body.get("size")
    color = body.get("color")

    if not product_id or not size or not color:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Missing required field"},
        )

    user_oid = ObjectId(user_id)
    cart = await db["carts"].find_one({"userId": user_oid})
    if not cart:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Cart not found"},
        )

    user = await db["users"].find_one({"_id": user_oid})
    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "User not found"},
        )

    try:
        product_oid = ObjectId(product_id)
    except Exception:
        product_oid = product_id  # nếu đã lưu dạng string

    result = await db["carts"].update_one(
        {"userId": user_oid},
        {
            "$pull": {
                "items": {
                    "productId": product_oid,
                    "size": size,
                    "color.colorName": color,
                }
            }
        },
    )
    if result.modified_count == 0:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "success": False,
                "message": "Item not found in cart with specified details",
            },
        )

    updated_cart = await db["carts"].find_one({"userId": user_oid})
    # populate productId
    for item in updated_cart.get("items", []):
        pid = item.get("productId")
        if isinstance(pid, ObjectId):
            product = await db["shoes"].find_one({"_id": pid})
            if product:
                item["productId"] = serialize_doc(product)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "updateCart": serialize_doc(updated_cart),
            "message": "Remove item from cart successfully",
        },
    )



