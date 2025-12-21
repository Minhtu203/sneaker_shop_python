from bson import ObjectId
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from ..core.database import get_db
from ..dependencies.auth import get_admin_user, get_current_user
from ..utils.mongo import serialize_doc, serialize_docs

router = APIRouter(prefix="/api/order", tags=["order"])


@router.get("/getAllOrders")
async def get_all_orders(admin=Depends(get_admin_user)):
    db = get_db()
    orders = await db["orders"].find().to_list(length=None)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "allOrders": serialize_docs(orders)},
    )


@router.post("/createOrder")
async def create_order(body: dict, admin=Depends(get_admin_user), current_user=Depends(get_current_user)):
    db = get_db()
    total_amount = body.get("totalAmount")
    items = body.get("items")
    shipping_address = body.get("shippingAddress")
    payment_method = body.get("paymentMethod")
    note = body.get("note")

    user_id = current_user["id"]

    if not user_id:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Missing userId"},
        )

    if not total_amount or total_amount < 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Missing totalAmount"},
        )

    if not items or len(items) == 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Items cannot be empty"},
        )

    if not shipping_address or not all(
        [
            shipping_address.get("fullName"),
            shipping_address.get("phone"),
            shipping_address.get("address"),
            shipping_address.get("city"),
        ]
    ):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Missing shippingAddress fields"},
        )

    user_oid = ObjectId(user_id)

    order_doc = {
        "userId": user_oid,
        "totalAmount": total_amount,
        "items": items,
        "shippingAddress": shipping_address,
        "paymentMethod": payment_method,
        "note": note,
    }
    res = await db["orders"].insert_one(order_doc)
    new_order = await db["orders"].find_one({"_id": res.inserted_id})

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"success": True, "data": serialize_doc(new_order)},
    )



