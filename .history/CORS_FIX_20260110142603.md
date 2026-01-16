# 🔧 CORS Fix - Backend Proxy Setup

## ✅ Vấn Đề Đã Giải Quyết

**Lỗi CORS** khi gọi API Flowise trực tiếp từ frontend đã được sửa bằng cách tạo một **backend proxy server** với Express.

### Trước (Không Hoạt Động):
```
Frontend → Flowise API (Bị CORS block)
```

### Sau (Hoạt Động):
```
Frontend → Backend Proxy (Port 3001) → Flowise API
```

## 🚀 Cách Chạy

### 1️⃣ Chạy Cả Frontend và Backend Cùng Lúc (Khuyến Khích)
```bash
npm run dev:full
```
Điều này sẽ:
- Chạy backend proxy trên `http://localhost:3001`
- Chạy frontend trên `http://localhost:5173`

### 2️⃣ Hoặc Chạy Riêng Rẽ (Nếu Cần)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 📁 File Mới / Thay Đổi

```
chat199/
├── server.js                    ✨ NEW - Backend proxy server
├── package.json                 ✏️ UPDATED - Thêm scripts & dependencies
├── src/utils/flowise.ts        ✏️ UPDATED - Gọi local proxy thay vì direct API
```

## 🔌 API Endpoints

### Backend Proxy Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Kiểm tra backend có chạy không |
| `/api/flowise` | POST | Gọi Flowise API (proxy) |

### Request Format:
```json
POST http://localhost:3001/api/flowise
Content-Type: application/json

{
  "question": "Tôi bị sốt, làm sao?"
}
```

### Response Format:
```json
{
  "text": "Câu trả lời từ Flowise...",
  "...": "Các field khác"
}
```

## 🛠️ Dependencies Mới

- **express** - Web framework
- **cors** - CORS middleware
- **concurrently** - Chạy nhiều scripts cùng lúc

## 📝 Thay Đổi Code

### flowise.ts
```typescript
// Trước
const FLOWISE_API_URL = "https://flowise.imagentu.cloud/api/v1/prediction/...";

// Sau
const PROXY_API_URL = "http://localhost:3001/api/flowise";
```

## ✨ Tính Năng

✅ **CORS đã được giải quyết** - Frontend có thể gọi Flowise API
✅ **Tự động restart** - Khi code thay đổi
✅ **Concurrent servers** - Frontend + Backend chạy cùng lúc
✅ **Error handling** - Server proxy xử lý lỗi gracefully

## 🐛 Troubleshooting

### Backend không chạy?
```bash
# Kiểm tra port 3001 có được dùng không
netstat -ano | findstr :3001

# Kill process đang dùng port (nếu cần)
taskkill /PID <PID> /F
```

### Frontend kết nối tới backend?
1. Mở **Developer Tools** (F12)
2. **Network** tab
3. Gửi tin nhắn
4. Xem request tới `localhost:3001`

### API vẫn không phản hồi?
1. Kiểm tra internet connection
2. Kiểm tra Flowise endpoint có online không
3. Kiểm tra console cho chi tiết lỗi

## 📊 Port Summary

| Service | Port | Status |
|---------|------|--------|
| Frontend (Vite) | 5173 | ✅ |
| Backend Proxy | 3001 | ✅ |
| Flowise (Upstream) | - | External |

## 🔐 Security Note

Proxy này đã cấu hình CORS cho local development. Để production:
- Thêm authentication
- Rate limiting
- Input validation
- HTTPS

---

**Tất cả đã sẵn sàng!** Gửi tin nhắn và kiểm tra phản hồi từ Flowise. 🎉
