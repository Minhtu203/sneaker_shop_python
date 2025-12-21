# from datetime import datetime, timedelta, timezone
# from typing import Any, Dict

# import jwt
# import bcrypt

# if not hasattr(bcrypt, "__about__"):
#     bcrypt.__about__ = type('about', (object,), {'__version__': bcrypt.__version__})

# from passlib.context import CryptContext
# from .config import settings

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)


# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)


# def create_access_token(data: Dict[str, Any], expires_delta: timedelta | None = None) -> str:
#     to_encode = data.copy()
#     expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=30))
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, settings.MY_ACCESS_KEY, algorithm="HS256")


# def create_refresh_token(data: Dict[str, Any], expires_delta: timedelta | None = None) -> str:
#     to_encode = data.copy()
#     expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=365))
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, settings.MY_REFRESH_ACCESS_KEY, algorithm="HS256")


# def decode_access_token(token: str) -> Dict[str, Any]:
#     return jwt.decode(token, settings.MY_ACCESS_KEY, algorithms=["HS256"])


# def decode_refresh_token(token: str) -> Dict[str, Any]:
#     return jwt.decode(token, settings.MY_REFRESH_ACCESS_KEY, algorithms=["HS256"])


import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from typing import Any, Dict
from .config import settings

# Sử dụng trực tiếp bcrypt để tương thích hoàn toàn với Python 3.13
# Loại bỏ hoàn toàn passlib để tránh lỗi 500

def hash_password(password: str) -> str:
    """Mã hóa mật khẩu sang chuỗi hash."""
    # Chuyển đổi password sang bytes
    pwd_bytes = password.encode('utf-8')
    # Tạo salt và thực hiện hash
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    # Trả về dạng string để lưu vào MongoDB
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception as e:
        print(f"Lỗi xác thực mật khẩu: {e}")
        return False

def create_access_token(data: Dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.MY_ACCESS_KEY, algorithm="HS256")

def create_refresh_token(data: Dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=365))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.MY_REFRESH_ACCESS_KEY, algorithm="HS256")

def decode_access_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, settings.MY_ACCESS_KEY, algorithms=["HS256"])

def decode_refresh_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, settings.MY_REFRESH_ACCESS_KEY, algorithms=["HS256"])