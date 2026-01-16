# 🐳 Docker Setup - Hospital 199 Chatbot

## Yêu cầu
- **Docker Desktop** (hoặc Docker Engine + Docker Compose)
- Không cần cài Node.js, npm hay bất cứ thứ gì khác!

## Cách sử dụng

### 1️⃣ Clone Repository
```bash
git clone <your-repo-url>
cd Chat199
```

### 2️⃣ Chạy ứng dụng với Docker Compose (Khuyến nghị)
```bash
docker-compose up --build
```

Hoặc chạy ở chế độ detached (background):
```bash
docker-compose up --build -d
```

### 3️⃣ Mở trình duyệt
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Các lệnh Docker khác

### Dừng container
```bash
docker-compose down
```

### Xem logs
```bash
docker-compose logs -f
```

### Rebuild image
```bash
docker-compose build --no-cache
```

### Chạy trực tiếp mà không dùng docker-compose
```bash
# Build image
docker build -t hospital-199-chatbot .

# Chạy container
docker run -p 5173:5173 -p 3001:3001 hospital-199-chatbot
```

## Các cổng được sử dụng
| Port | Dịch vụ | URL |
|------|---------|-----|
| 5173 | Frontend (React + Vite) | http://localhost:5173 |
| 3001 | Backend API (Express) | http://localhost:3001 |

## Troubleshooting

### Port đã được sử dụng
Nếu port 5173 hoặc 3001 đã được dùng, sửa lại trong `docker-compose.yml`:
```yaml
ports:
  - "8080:5173"  # Sử dụng port 8080 cho frontend thay vì 5173
  - "8001:3001"  # Sử dụng port 8001 cho backend thay vì 3001
```

### Xóa image cũ
```bash
docker rmi hospital-199-chatbot
docker-compose build --no-cache
```

### Container không khởi động
```bash
docker-compose logs  # Xem chi tiết lỗi
```

## Build Info
- **Base Image**: `node:20-alpine` (lightweight)
- **Build Process**: 
  1. Build React app với Vite → `dist/`
  2. Serve static files trên port 5173
  3. Chạy Backend API (server.js) trên port 3001
- **Health Check**: Tự động kiểm tra mỗi 30 giây

## Phát triển với Docker

Nếu muốn phát triển (có watch mode), tạo file `docker-compose.dev.yml`:
```yaml
version: '3.8'
services:
  chat199:
    build: .
    ports:
      - "5173:5173"
      - "3001:3001"
    volumes:
      - .:/app
      - /app/node_modules
    command: sh -c "npm run dev:full"
```

Rồi chạy:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

---

**Enjoy! 🎉**
