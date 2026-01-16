import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, PhoneCall, Activity } from 'lucide-react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', content: 'Xin chào! 👋 Bệnh viện 199 Đà Nẵng sẵn sàng hỗ trợ bạn. Bạn cần tư vấn chuyên khoa hay đặt lịch khám?', timestamp: new Date() },
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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Chúng tôi đã nhận được yêu cầu. Bác sĩ trực tuyến sẽ kết nối với bạn trong giây lát. Vui lòng giữ kết nối.',
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] overflow-hidden font-sans">
      {/* MODERN HEADER */}
      <header className="bg-white border-b border-slate-100 py-3 px-6 z-20 shrink-0">
        <div className="max-w-[95%] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-tr from-[#1e5b8d] to-[#2a7bb7] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200 rotate-2">
                199
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-black text-[#1e5b8d] tracking-tight">BỆNH VIỆN 199</h1>
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-blue-500" />
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Hệ thống tư vấn thông minh</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end border-r border-slate-200 pr-6">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Tổng đài hỗ trợ</span>
              <a href="tel:1900986868" className="text-lg font-black text-[#1e5b8d] hover:text-blue-600 transition-colors flex items-center gap-2">
                <PhoneCall size={18} /> 1900 986 868
              </a>
            </div>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-green-100">
              <ShieldCheck size={16} /> Kết nối bảo mật
            </div>
          </div>
        </div>
      </header>

      {/* CHAT AREA - ĐÃ NỚI RỘNG CONTAINER */}
      <main className="flex-1 overflow-y-auto hospital-chat-bg relative px-6 py-10 scrollbar-thin">
        <div className="max-w-[95%] md:max-w-[90%] mx-auto relative z-10">
          {messages.map(m => <ChatMessage key={m.id} message={m} />)}

          {isLoading && (
            <div className="flex gap-3 items-center animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
              </div>
              <span className="text-xs font-bold text-slate-400 italic">Bác sĩ đang xem yêu cầu của bạn...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* INPUT AREA AREA - FLOATING STYLE */}
      {/* FOOTER: Slim & Minimalist Floating Input */}
      <footer className="glass-effect py-3 px-6 shrink-0 z-30">
        <div className="max-w-5xl mx-auto relative">

          {/* File Preview: Hiển thị sát hơn vào thanh input */}
          <div className="absolute bottom-[calc(100%+8px)] left-0 w-full px-2">
            <FilePreview
              files={uploadedFiles}
              onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))}
            />
          </div>

          <div className="relative group">
            {/* Hiệu ứng glow nhẹ hơn */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[24px] opacity-0 group-focus-within:opacity-5 blur-lg transition-opacity duration-500"></div>

            {/* Input Box: Giảm padding từ p-3 xuống p-1.5 */}
            <div className="relative bg-white border border-slate-200 rounded-[22px] p-1.5 flex items-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:border-blue-400/50 transition-all duration-300">

              {/* File Uploader: Nút nhỏ hơn */}
              <div className="ml-1 hover:scale-105 transition-transform">
                <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />
              </div>

              {/* Textarea: Giảm padding dọc */}
              <textarea
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Nhập nội dung tư vấn..."
                className="flex-1 bg-transparent border-none outline-none text-[15px] py-2 px-1 resize-none max-h-32 text-slate-700 font-medium placeholder:text-slate-400 placeholder:italic"
              />

              {/* Nút gửi: Thu nhỏ từ w-16 xuống w-11 */}
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !uploadedFiles.length}
                className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-[#1e5b8d] to-[#0d4a73] text-white flex items-center justify-center shadow-md hover:shadow-blue-900/30 active:scale-95 transition-all disabled:opacity-10 disabled:grayscale group"
              >
                <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Footer Info: Làm mờ hơn và nhỏ hơn */}
          <div className="flex justify-between items-center mt-3 px-4">
            <span className="text-[9px] font-bold text-slate-400/60 tracking-widest uppercase italic">
              © Bệnh viện 199 - 216 Nguyễn Công Trứ
            </span>
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-100"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};