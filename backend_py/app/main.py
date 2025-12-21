import os
import traceback
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from .core.config import settings
from .core.database import connect_to_mongo, close_mongo_connection
from .core.redis_client import init_redis, close_redis
from .routers import auth as auth_router, user as user_router, shoes as shoes_router, cart as cart_router, favourites as favourites_router, order as order_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting application...")
    try:
        await connect_to_mongo()
    except Exception as e:
        print(f"⚠️  MongoDB connection failed, but continuing: {e}")
    
    try:
        await init_redis()
    except Exception as e:
        print(f"⚠️  Redis connection failed, but continuing: {e}")
    
    print("✅ Application startup complete")
    yield
    
    # Shutdown
    print("🛑 Shutting down application...")
    await close_mongo_connection()
    await close_redis()
    print("✅ Application shutdown complete")


app = FastAPI(title="Sneaker Shop Backend (Python)", lifespan=lifespan)

# Exception handler tổng quát để log lỗi chi tiết
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_detail = str(exc)
    error_traceback = traceback.format_exc()
    print(f"❌ Unhandled exception: {error_detail}")
    print(f"Traceback:\n{error_traceback}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": error_detail,
            "path": str(request.url),
        },
    )


if settings.CLIENT:
    allow_origins = [settings.CLIENT]
else:
    allow_origins = ["*"]

# allow_origins = [
#     "http://localhost:5173",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(shoes_router.router)
app.include_router(cart_router.router)
app.include_router(favourites_router.router)
app.include_router(order_router.router)


def get_port() -> int:
    return settings.PORT


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="localhost", port=get_port(), reload=True)


