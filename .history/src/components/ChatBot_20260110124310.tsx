import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', content: 'Chào bạn! Tôi có thể hỗ trợ gì cho bạn tại Bệnh viện 199?', timestamp: new Date() }
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
      content: inputValue, // Nội dung này chính là mô tả cho các file đính kèm
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Bệnh viện 199 đã nhận được thông tin và file đính kèm. Chúng tôi sẽ phản hồi sớm nhất.',
        timestamp: new Date()
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      {/* HEADER */}
      <header className="bg-[#1e5b8d] text-white px-6 py-4 flex items-center gap-4 shrink-0 shadow-md">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1e5b8d] font-bold">199</div>
        <div>
          <h1 className="font-bold text-lg">BỆNH VIỆN 199 ĐÀ NẴNG</h1>
          <p className="text-[10px] opacity-80 uppercase tracking-widest">Hỗ trợ y tế trực tuyến</p>
        </div>
      </header>

      {/* CHAT MAIN */}
      <main className="flex-1 overflow-y-auto hospital-chat-bg p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map(m => <ChatMessage key={m.id} message={m} />)}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* INPUT AREA */}
      <footer className="bg-white border-t p-4 md:p-6 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-[24px] overflow-hidden focus-within:ring-2 focus-within:ring-[#1e5b8d]/20 focus-within:bg-white transition-all">

            {/* Preview files nằm ngay trên input */}
            <FilePreview files={uploadedFiles} onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))} />

            <div className="flex items-end p-2 gap-2">
              <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />

              <textarea
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => (e.key === 'Enter' && !e.shiftKey) && (e.preventDefault(), handleSendMessage())}
                placeholder="Nhập tin nhắn hoặc mô tả file..."
                className="flex-1 bg-transparent border-none outline-none py-3 px-1 text-[15px] resize-none max-h-32"
              />

              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && uploadedFiles.length === 0}
                className="w-11 h-11 rounded-full bg-[#1e5b8d] text-white flex items-center justify-center hover:bg-[#15436b] transition-all disabled:opacity-20"
              >
                <Send size={20} className="ml-0.5" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-tighter">
            Trực tuyến 24/7 • Hotline: 1900 986 868
          </p>
        </div>
      </footer>
    </div>
  );
};