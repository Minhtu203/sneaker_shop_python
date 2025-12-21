## Backend Python cho Sneaker Shop

Backend này là bản chuyển đổi từ Node.js/Express sang **FastAPI** nhưng vẫn giữ nguyên:

- **Endpoints** (URL) giống hệt backend cũ, ví dụ:
  - `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refreshToken`, ...
  - `GET /api/user/allusers`, `POST /api/user/updateUserInfo`, ...
  - `GET /api/shoes/getAllShoes`, `POST /api/cart/add`, `GET /api/favourite/getUserFavourites`, ...
- **Định dạng JSON response** tối đa giống với backend Node hiện tại.
- Dùng lại **cùng MongoDB & Redis & .env**.

### 1. Cài đặt

Từ thư mục gốc project (nơi có folder `sneaker_shop`):

```bash
cd sneaker_shop/backend_py
python -m venv .venv
.venv\Scripts\activate  # Windows PowerShell
pip install -r requirements.txt
```

Đảm bảo file `.env` (ở cùng mức với backend Node) đã có các biến:

- `PORT`
- `CLIENT`
- `MONGO_URI`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` (nếu có)
- `MY_ACCESS_KEY`, `MY_REFRESH_ACCESS_KEY`
- `EMAIL_USER`, `EMAIL_PASSWORD` (nếu muốn gửi mail OTP)

### 2. Chạy server

Trong thư mục `backend_py` (đã kích hoạt venv):

```bash
uvicorn app.main:app --host 0.0.0.0 --port %PORT% --reload
```

Hoặc nếu muốn cố định cổng:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
```

Endpoint test:

- `GET /` → trả về `{ "message": "Server is running on Vercel", "status": "OK" }`

### 3. Tích hợp với frontend

Frontend hiện tại đang gọi tới backend Node theo các endpoint:

- Auth: `/api/auth/...`
- User: `/api/user/...`
- Shoes: `/api/shoes/...`
- Cart: `/api/cart/...`
- Favourites: `/api/favourite/...`
- Orders: `/api/order/...`

Chỉ cần trỏ `BASE_URL`/`VITE_BACKEND_URL` (hoặc biến tương đương trong frontend) sang URL mà FastAPI đang chạy (ví dụ `http://localhost:3000`) là dùng được, không cần đổi code API phía frontend.
