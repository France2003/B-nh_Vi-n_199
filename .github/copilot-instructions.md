# Copilot Instructions for Hospital 199 Chatbot

## Project Overview
- **Project Name**: Hospital 199 Chatbot Assistant
- **Language**: TypeScript
- **Framework**: React 18 + Vite
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Status
✅ Project successfully created and configured
✅ All components implemented with full TypeScript support
✅ Hospital 199 theme integrated with custom colors and styling
✅ File upload and image preview functionality working
✅ Dev server running on http://localhost:5173

## Key Features Implemented
- 💬 Real-time chat interface with smooth animations
- 📁 Drag-and-drop file upload with multiple file support
- 🖼️ Image preview with thumbnail display
- 📝 File description input for each uploaded file
- 🎨 Hospital 199 color scheme (Primary: #1e5b8d)
- 📱 Fully responsive design
- ⌨️ Keyboard shortcuts (Enter to send)

## Component Structure
1. **ChatBot.tsx** - Main chatbot container
2. **ChatMessage.tsx** - Message display component
3. **FileUploader.tsx** - File upload handler
4. **FilePreview.tsx** - File preview display

## How to Work with This Project

### Running the Development Server
```bash
npm run dev
```
Opens on http://localhost:5173

### Building for Production
```bash
npm run build
```

### For Future Modifications
1. Update components in `src/components/`
2. Modify theme colors in `src/theme/theme.ts`
3. Add new types in `src/types/index.ts`
4. Component styles are colocated (Component.tsx + Component.css)

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Notes for Future Development
- All components are fully typed with TypeScript
- CSS modules use Hospital 199 color scheme
- Messages store timestamp and file associations
- File upload supports images and documents
- Ready for API integration in ChatBot component

---
Last Updated: January 9, 2026
