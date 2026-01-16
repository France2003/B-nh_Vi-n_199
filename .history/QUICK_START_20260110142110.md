# Quick Start Guide - Tính Năng Mới

## ✅ Những Gì Đã Hoàn Thành

### 1. **Menu Quản Lý Cuộc Trò Chuyện** ✓
   - Sidebar hiển thị danh sách tất cả cuộc trò chuyện
   - Tạo cuộc trò chuyện mới với 1 click
   - Tìm kiếm nhanh theo tên hoặc nội dung
   - Xóa cuộc trò chuyện khi không cần

### 2. **Lưu Trữ Tự Động** ✓
   - Dữ liệu tự động lưu vào **localStorage**
   - Khi **reload trang**, nội dung **không bị mất**
   - Lịch sử trò chuyện được bảo toàn

### 3. **Tích Hợp Flowise API** ✓
   - API endpoint đã được cấu hình
   - Gửi tin nhắn nhận phản hồi từ Flowise
   - Hỗ trợ upload file

## 🎯 Cách Sử Dụng

### Bước 1: Mở Ứng Dụng
```
http://localhost:5174
```

### Bước 2: Tạo Cuộc Trò Chuyện Mới
- Nhấp **"+ Cuộc trò chuyện mới"** ở sidebar trái

### Bước 3: Gửi Tin Nhắn
- Gõ câu hỏi vào ô nhập liệu
- Nhấp **Gửi** hoặc ấn **Enter**
- Hệ thống sẽ gọi API Flowise và trả lời

### Bước 4: Lưu Cuộc Trò Chuyện
- Nhấp nút **"Lưu"** ở header
- Đặt tên cho cuộc trò chuyện (ví dụ: "Tư vấn bệnh tim")
- Nhấp **"Lưu"** để xác nhận

### Bước 5: Load Lại Trang
- **Refresh** trang (F5 hoặc Ctrl+R)
- Tất cả cuộc trò chuyện vẫn còn đó
- Chọn cuộc trò chuyện để tiếp tục

## 🔧 Cấu Hình API Flowise

File: `src/utils/flowise.ts`

Thay đổi endpoint nếu cần:
```typescript
const FLOWISE_API_URL = "https://flowise.imagentu.cloud/api/v1/prediction/3cc3bd56-726c-4cc6-baa4-eae9719b8d36";
```

## 📁 File Mới Được Tạo

```
src/
├── utils/
│   ├── storageService.ts      # Quản lý lưu trữ cuộc trò chuyện
│   └── flowise.ts              # Tích hợp API Flowise
├── components/
│   ├── ConversationSidebar.tsx # Menu sidebar
│   ├── SaveConversationDialog.tsx # Dialog lưu cuộc trò chuyện
│   └── ChatBot.tsx             # (Đã cập nhật)
```

## 💾 Cách Dữ Liệu Được Lưu

- **Nơi lưu**: Browser localStorage
- **Key**: `hospital_199_conversations`
- **Dữ liệu**: JSON array các conversations
- **Tự động**: Lưu khi gửi tin nhắn hoặc khi người dùng nhấp nút "Lưu"

### Xem Dữ Liệu Lưu
Mở **Developer Tools** (F12) → **Console** → gõ:
```javascript
localStorage.getItem('hospital_199_conversations')
```

## 🎨 Giao Diện

- **Sidebar**: Hiển thị trên desktop, ẩn trên mobile (nhấp menu để hiện)
- **Danh sách cuộc trò chuyện**: Sắp xếp mới nhất ở trên
- **Nút Lưu**: Ở header phía trên cùng bên phải

## 📱 Responsive

- ✅ Desktop (1024px+): Sidebar hiển thị
- ✅ Tablet (768px-1024px): Sidebar auto-hide
- ✅ Mobile (<768px): Sidebar toggle

## 🚀 Commands

```bash
# Dev server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## ⚠️ Lưu Ý Quan Trọng

1. **localStorage có giới hạn ~5MB** - nếu tích lũy quá nhiều cuộc trò chuyện, có thể cần xóa cũ
2. **API Flowise cần online** - kiểm tra kết nối internet
3. **Clear cache** nếu gặp vấn đề cập nhật - Ctrl+Shift+Delete

## 🐛 Gỡ Lỗi

Nếu gặp lỗi:
1. Mở **Developer Tools** (F12)
2. Kiểm tra **Console** tab
3. Xem **Network** tab nếu API không phản hồi

---

**Xong! Ứng dụng đã sẵn sàng sử dụng với tất cả tính năng mới.** 🎉
