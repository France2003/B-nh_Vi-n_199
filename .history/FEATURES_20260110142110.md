# 🏥 Hệ Thống Tư Vấn Chatbot Bệnh Viện 199

## ✨ Tính Năng Mới

### 📁 Menu Quản Lý Cuộc Trò Chuyện
- **Sidebar tổ chức**: Hiển thị danh sách tất cả cuộc trò chuyện đã lưu
- **Tạo cuộc trò chuyện mới**: Nút "+ Cuộc trò chuyện mới"
- **Tìm kiếm**: Tìm kiếm nhanh theo tên hoặc nội dung
- **Xóa cuộc trò chuyện**: Xóa các cuộc trò chuyện không cần thiết

### 💾 Lưu Trữ Tự Động
- Tất cả tin nhắn được **tự động lưu** vào localStorage
- Khi **tải lại trang**, nội dung trò chuyện **không bị mất**
- Hỗ trợ **đặt tên tùy chỉnh** cho cuộc trò chuyện

### 🤖 Tích Hợp Flowise API
- Kết nối trực tiếp với workflow Flowise
- Nhận phản hồi thực tế từ hệ thống AI
- Hỗ trợ các tập tin đính kèm

## 🚀 Hướng Dẫn Sử Dụng

### Tạo Cuộc Trò Chuyện Mới
1. Nhấp nút **"+ Cuộc trò chuyện mới"** ở sidebar
2. Hệ thống sẽ tạo cuộc trò chuyện mới và chuyển đến đó

### Lưu & Đặt Tên Cuộc Trò Chuyện
1. Nhấp nút **"Lưu"** ở header
2. Nhập tên mong muốn (ví dụ: "Tư vấn về bệnh cao huyết áp")
3. Nhấp **"Lưu"** để xác nhận

### Chuyển Đổi Giữa Các Cuộc Trò Chuyện
- Nhấp trên cuộc trò chuyện trong sidebar để tải lại nó
- Nội dung sẽ được khôi phục hoàn toàn

### Tìm Kiếm Cuộc Trò Chuyện
- Sử dụng thanh tìm kiếm ở sidebar
- Tìm theo tên hoặc nội dung tin nhắn

### Xóa Cuộc Trò Chuyện
- Hover vào cuộc trò chuyện và nhấp icon **🗑️**
- Xác nhận xóa khi cần thiết

## 📱 Responsive Design
- **Desktop**: Sidebar hiển thị thường xuyên
- **Mobile**: Sidebar ẩn/hiển thị với nút toggle
- **Tablet**: Hỗ trợ tốt cả hai chế độ

## 🔧 Cấu Hình API

API endpoint Flowise đã được cấu hình tại: `src/utils/flowise.ts`

```typescript
const FLOWISE_API_URL = "https://flowise.imagentu.cloud/api/v1/prediction/3cc3bd56-726c-4cc6-baa4-eae9719b8d36";
```

### Thay Đổi Endpoint
Nếu cần thay đổi endpoint, chỉnh sửa file `src/utils/flowise.ts`:

```typescript
const FLOWISE_API_URL = "YOUR_NEW_ENDPOINT_HERE";
```

## 📦 Cấu Trúc Dữ Liệu

### Conversation Interface
```typescript
interface Conversation {
  id: string;              // ID duy nhất
  title: string;           // Tên cuộc trò chuyện
  messages: Message[];     // Danh sách tin nhắn
  createdAt: Date;         // Thời điểm tạo
  updatedAt: Date;         // Lần cập nhật cuối
}
```

### Storage
- Dữ liệu lưu tại: `localStorage` với key `hospital_199_conversations`
- Cuộc trò chuyện hiện tại: `current_conversation_id`

## 🎨 Tùy Chỉnh Giao Diện

### Màu Sắc
- **Chính**: `#1e5b8d` (Xanh đậm)
- **Phụ**: `#2a7bb7` (Xanh sáng)

### Cập Nhật Màu
Sửa các class CSS hoặc xem file Tailwind config

## ⚙️ Các Lệnh Phát Triển

```bash
# Chạy dev server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Dữ liệu không được lưu
- Kiểm tra localStorage có được enable không
- Kiểm tra browser console cho các lỗi

### API không phản hồi
- Kiểm tra kết nối internet
- Kiểm tra endpoint Flowise
- Xem browser console cho chi tiết lỗi

### Sidebar không hiển thị trên mobile
- Nhấp nút menu (☰) ở góc trên trái
- Nhấp ngoài sidebar để đóng

## 📞 Liên Hệ Hỗ Trợ
- **Điện thoại**: 1900 986 868
- **Email**: support@benhvien199.com

---

**Cập nhật lần cuối**: Tháng 1 năm 2026
