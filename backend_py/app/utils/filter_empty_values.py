from typing import Any, Dict


def filter_empty_values(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Tương đương filterEmptyValues trong Node:
    - Bỏ qua các field có giá trị None hoặc chuỗi rỗng ""
    - Giữ lại giá trị 0, false, ...
    """
    filtered: Dict[str, Any] = {}
    for key, value in data.items():
        if value is None:
            continue
        if isinstance(value, str) and value == "":
            continue
        filtered[key] = value
    return filtered



