from datetime import datetime
from typing import Any, Dict

from bson import ObjectId, Decimal128


def _serialize_value(value: Any) -> Any:
    """
    Chuyển các kiểu MongoDB/BSON đặc biệt sang kiểu JSON-serializable.
    """
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, Decimal128):
        # chuyển Decimal128 -> float (hoặc str nếu muốn giữ chính xác tuyệt đối)
        return float(value.to_decimal())
    if isinstance(value, list):
        return [_serialize_value(v) for v in value]
    if isinstance(value, dict):
        return {k: _serialize_value(v) for k, v in value.items()}
    return value


def serialize_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {k: _serialize_value(v) for k, v in doc.items()}


def serialize_docs(docs: list[Dict[str, Any]]) -> list[Dict[str, Any]]:
    return [serialize_doc(d) for d in docs]





