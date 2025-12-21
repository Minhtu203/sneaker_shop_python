from redis.asyncio import Redis

from .config import settings

redis_client: Redis = None

async def init_redis() -> None:
    global redis_client
    if redis_client is None:
        try:
            # Tạo instance mới
            client = Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                password=settings.REDIS_PASSWORD or None,
                ssl=False, 
                decode_responses=True,
            )
            await client.ping()
            redis_client = client # Gán lại cho biến toàn cục
            print(f"✅ Connect to Redis server successfully at {settings.REDIS_HOST}:{settings.REDIS_PORT}")
        except Exception as e:
            print(f"❌ Connect to Redis server failed: {e}")
            print(f"   Redis config: host={settings.REDIS_HOST}, port={settings.REDIS_PORT}")
            print("   ⚠️  App will continue but Redis features will not work until Redis is available")
            # Không raise exception để app vẫn có thể khởi động
            # redis_client sẽ vẫn là None và các endpoint sẽ kiểm tra
        
async def ensure_redis_connected() -> bool:
    """
    Đảm bảo Redis đã được kết nối. Nếu chưa, sẽ thử kết nối lại.
    Returns True nếu kết nối thành công, False nếu không thể kết nối.
    """
    global redis_client
    if redis_client is not None:
        try:
            await redis_client.ping()
            return True
        except Exception:
            # Kết nối bị mất, reset về None để thử lại
            redis_client = None
    
    # Thử kết nối lại
    try:
        client = Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            password=settings.REDIS_PASSWORD or None,
            ssl=False,
            decode_responses=True,
        )
        await client.ping()
        redis_client = client
        print(f"✅ Redis reconnected successfully at {settings.REDIS_HOST}:{settings.REDIS_PORT}")
        return True
    except Exception as e:
        print(f"❌ Redis reconnection failed: {e}")
        return False

def get_redis_client() -> Redis:
    """
    Lấy redis_client instance. Đảm bảo không None trước khi sử dụng.
    Raises RuntimeError nếu Redis chưa được khởi tạo.
    """
    global redis_client
    if redis_client is None:
        raise RuntimeError("Redis client is not initialized. Call ensure_redis_connected() first.")
    return redis_client

async def close_redis() -> None:
    global redis_client
    if redis_client is not None:
        await redis_client.close()
        redis_client = None


