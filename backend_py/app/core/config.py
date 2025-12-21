import os
from functools import lru_cache

from pydantic import BaseModel, AnyUrl


class Settings(BaseModel):
    PORT: int = int(os.getenv("PORT", "5000"))
    CLIENT: str | None = os.getenv("CLIENT")

    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/sneaker-shop")

    REDIS_HOST: str = os.getenv("REDIS_HOST", "127.0.0.1")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_PASSWORD: str | None = os.getenv("REDIS_PASSWORD")

    MY_ACCESS_KEY: str = os.getenv("MY_ACCESS_KEY", "access-secret")
    MY_REFRESH_ACCESS_KEY: str = os.getenv("MY_REFRESH_ACCESS_KEY", "refresh-secret")

    EMAIL_USER: str | None = os.getenv("EMAIL_USER")
    EMAIL_PASSWORD: str | None = os.getenv("EMAIL_PASSWORD")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()


