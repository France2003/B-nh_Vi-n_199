import React, { useState, useRef, useEffect } from 'react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Xin chào! 👋 Tôi là trợ lý thông minh của Bệnh viện 199 Đà Nẵng. Bạn cần tôi hỗ trợ vấn đề gì?',
      timestamp: new Date(),
    },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      files: uploadedFiles.length ? [...uploadedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: '✓ Bệnh viện 199 đã nhận được thông tin. Chúng tôi sẽ phản hồi bạn ngay lập tức.',
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-white">
      {/* HEADER - Tông màu xanh BV 199 */}
      <header className="bg-[#1e5b8d] text-white py-3 px-6 shadow-lg shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-inner">🏥</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">BỆNH VIỆN 199</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[11px] text-blue-100 font-medium">TRỢ LÝ THÔNG MINH 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CHAT AREA - Có background bệnh viện */}
      <main className="flex-1 overflow-y-auto hospital-chat-bg px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {isLoading && (
            <div className="flex gap-2 mb-6">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* INPUT AREA */}
      <footer className="bg-white border-t border-gray-100 p-4 shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* File Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4">
              <FilePreview
                files={uploadedFiles}
                onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))}
                onDescriptionChange={(id, desc) =>
                  setUploadedFiles(f => f.map(x => x.id === id ? { ...x, description: desc } : x))
                }
              />
            </div>
          )}

          <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-[#1e5b8d] focus-within:ring-1 focus-within:ring-[#1e5b8d] transition-all">
            <FileUploader
              onFilesUpload={(f) => setUploadedFiles(p => [...p, ...f])}
              showLabel={false}
            />

            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Nhập nội dung cần tư vấn..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] py-2 px-1 resize-none max-h-32"
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && !uploadedFiles.length}
              className="w-10 h-10 rounded-xl bg-[#1e5b8d] text-white flex items-center justify-center hover:bg-[#15436b] transition-colors disabled:opacity-30 disabled:grayscale"
            >
              <span className="text-xl">✈</span>
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-2">
            © Bệnh viện 199 - 216 Nguyễn Công Trứ, Đà Nẵng
          </p>
        </div>
      </footer>
    </div>
  );
};