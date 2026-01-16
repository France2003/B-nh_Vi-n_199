import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, PhoneCall } from 'lucide-react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Xin chào! 👋 Tôi là trợ lý AI của Bệnh viện 199. Bạn cần tư vấn về dịch vụ y tế hay đặt lịch khám?',
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
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsLoading(true);

    // Giả lập Bot phản hồi
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: '✓ Bệnh viện 199 đã nhận được thông tin. Bác sĩ chuyên khoa sẽ phản hồi bạn trong giây lát.',
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#f8fafc] overflow-hidden">

      {/* HEADER - MODERN & PROFESSIONAL */}
      <header className="bg-gradient-to-r from-[#1e5b8d] to-[#2a7bb7] text-white shadow-xl z-20 shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1e5b8d] font-black text-xl shadow-inner rotate-3">
              199
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">BỆNH VIỆN 199</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[11px] text-blue-100 font-bold uppercase tracking-widest">Trực tuyến 24/7</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-5 border-l border-white/20 pl-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={18} className="text-blue-200" />
              <span>An toàn & Bảo mật</span>
            </div>
            <a href="tel:1900986868" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
              <PhoneCall size={16} />
              <span className="text-sm font-bold">1900 986 868</span>
            </a>
          </div>
        </div>
      </header>

      {/* CHAT MAIN AREA - FULL SCREEN WITH WATERMARK */}
      <main className="flex-1 overflow-y-auto hospital-chat-bg relative scroll-smooth px-4 py-8">
        <div className="max-w-4xl mx-auto relative z-10">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {isLoading && (
            <div className="flex gap-3 mb-8 items-center">
              <div className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-bold animate-pulse">Bác sĩ đang xem tin nhắn...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* INPUT AREA AREA - MODERN FLOATING STYLE */}
      <footer className="bg-white border-t border-slate-100 p-4 md:p-6 shrink-0 z-20 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto">

          {/* Files Preview Bar */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4 animate-in slide-in-from-bottom-4 duration-300">
              <FilePreview
                files={uploadedFiles}
                onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))}
                onDescriptionChange={(id, desc) =>
                  setUploadedFiles(f => f.map(x => x.id === id ? { ...x, description: desc } : x))
                }
              />
            </div>
          )}

          {/* Input Box */}
          <div className="flex items-end gap-3 bg-slate-100 hover:bg-slate-200/60 transition-colors rounded-[28px] p-2 md:p-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1e5b8d]/20 border border-transparent focus-within:border-[#1e5b8d]/30">
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
              placeholder="Gửi tin nhắn cho bác sĩ tại đây..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] py-2.5 px-2 resize-none max-h-32 text-slate-700 placeholder:text-slate-400 font-medium"
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && !uploadedFiles.length}
              className="w-12 h-12 rounded-2xl bg-[#1e5b8d] text-white flex items-center justify-center hover:bg-[#15436b] transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-20 disabled:grayscale"
            >
              <Send size={22} className="ml-1" />
            </button>
          </div>

          <div className="flex justify-center gap-4 mt-4 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">216 Nguyễn Công Trứ, Đà Nẵng</span>
          </div>
        </div>
      </footer>
    </div>
  );
};