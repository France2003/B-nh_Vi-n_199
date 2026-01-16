# 🏥 Bệnh viện 199 Đà Nẵng - Chatbot Assistant

Một ứng dụng chatbot hiện đại được xây dựng với React + TypeScript, cho phép người dùng tương tác với trợ lý ảo, upload file và hình ảnh.

## ✨ Tính năng

- 💬 **Chat realtime**: Giao diện chat trực quan với animation mượt mà
- 📁 **Upload File**: Hỗ trợ upload nhiều loại file (PDF, Word, Excel, v.v.)
- 🖼️ **Upload Hình ảnh**: Upload và hiển thị preview hình ảnh
- 📝 **Mô tả tệp**: Thêm mô tả chi tiết cho mỗi file và hình ảnh
- 🎨 **Giao diện Hospital 199**: Thiết kế chuyên nghiệp với màu sắc bệnh viện
- 📱 **Responsive Design**: Hoạt động tốt trên mọi kích thước màn hình
- ⌨️ **Keyboard Shortcuts**: Nhấn Enter để gửi tin nhắn

## 🛠️ Công nghệ sử dụng

- **React 18+** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool (siêu nhanh)
- **CSS3** - Modern styling

## 🚀 Bắt đầu

### Yêu cầu
- Node.js 16+
- npm hoặc yarn

### Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy dev server (localhost:5173)
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── ChatBot.tsx          # Component chính
│   ├── ChatMessage.tsx      # Hiển thị tin nhắn
│   ├── FileUploader.tsx     # Upload file/hình ảnh
│   └── FilePreview.tsx      # Preview file
├── types/
│   └── index.ts             # TypeScript interfaces
├── theme/
│   └── theme.ts             # Theme Hospital 199
└── main.tsx                 # Entry point
```

## 🎨 Màu sắc Hospital 199

- **Primary**: `#1e5b8d` (Xanh chủ đạo)
- **Secondary**: `#2a7bb7` (Xanh phụ)
- **Dark**: `#0d4a73` (Xanh tối)

## 💡 Cách sử dụng

1. **Gửi tin nhắn**: Nhập và Enter hoặc click nút gửi
2. **Upload file**: Kéo thả hoặc click để chọn
3. **Thêm mô tả**: Nhập mô tả cho mỗi file

---

Phát triển cho Bệnh viện 199 Đà Nẵng 🏥

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
