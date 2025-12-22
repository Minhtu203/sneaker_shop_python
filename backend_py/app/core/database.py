from urllib.parse import urlparse

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from .config import settings


mongo_client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


def _get_db_name_from_uri(uri: str) -> str:
    parsed = urlparse(uri)
    if parsed.path and parsed.path != "/":
        return parsed.path.lstrip("/")
    # fallback
    return "sneaker-shop"


async def connect_to_mongo() -> None:
    global mongo_client, db
    if mongo_client is None:
        try:
            print(f"🔄 Connecting to MongoDB at {settings.MONGO_URI}...")

            mongo_kwargs: dict = {
                "serverSelectionTimeoutMS": 5000,  # Timeout 5 giây
            }
            
            if settings.MONGO_URI.startswith("mongodb+srv://"):
                mongo_kwargs.update(
                    {
                        "tls": True,
                        "tlsAllowInvalidCertificates": False,
                    }
                )

            mongo_client = AsyncIOMotorClient(
                settings.MONGO_URI,
                **mongo_kwargs,
            )
            # Test connection
            await mongo_client.admin.command('ping')
            db_name = _get_db_name_from_uri(settings.MONGO_URI)
            db = mongo_client[db_name]
            print(f"✅ Connected to MongoDB successfully (database: {db_name})")
        except Exception as e:
            print(f"❌ Connect to MongoDB failed: {e}")
            print(f"   MongoDB URI: {settings.MONGO_URI}")
            raise e


async def close_mongo_connection() -> None:
    global mongo_client, db
    if mongo_client is not None:
        mongo_client.close()
        mongo_client = None
        db = None


def get_db() -> AsyncIOMotorDatabase:
    if db is None:
        raise RuntimeError("Database not initialized")
    return db

