import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, PhoneCall, Activity, HeartPulse, MoreVertical } from 'lucide-react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', content: 'Chào bạn! 👋 Bệnh viện 199 Đà Nẵng sẵn sàng hỗ trợ bạn. Mọi thông tin của bạn đều được bảo mật tuyệt đối.', timestamp: new Date() },
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
        content: 'Bác sĩ chuyên khoa đã nhận được yêu cầu. Chúng tôi sẽ phản hồi lại ngay lập tức qua khung chat này.',
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f4f8] overflow-hidden">

      {/* HEADER: Glassmorphism + Accent Color */}
      <header className="glass-effect py-4 px-8 z-30 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-blue-100/50">
        <div className="max-w-[98%] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1e5b8d] to-[#0d4a73] rounded-[22px] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-900/20 transform group-hover:rotate-6 transition-transform cursor-pointer">
                199
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full animate-pulse shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#1e5b8d] tracking-tighter flex items-center gap-2">
                BỆNH VIỆN 199 <HeartPulse className="text-red-500" size={20} />
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex gap-0.5">
                  <span className="w-1 h-3 bg-blue-400 rounded-full animate-[bounce_1s_infinite]"></span>
                  <span className="w-1 h-3 bg-blue-500 rounded-full animate-[bounce_1.2s_infinite]"></span>
                  <span className="w-1 h-3 bg-blue-600 rounded-full animate-[bounce_1.4s_infinite]"></span>
                </div>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.15em]">Smart AI Assistant</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Cấp cứu 24/7</span>
              <a href="tel:1900986868" className="px-5 py-2.5 bg-[#1e5b8d] text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-900/20 flex items-center gap-3 hover:scale-105 transition-transform">
                <PhoneCall size={20} /> 1900 986 868
              </a>
            </div>
            <button className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
              <MoreVertical size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* CHAT MAIN: Side-to-side alignment + Enhanced Background */}
      <main className="flex-1 overflow-y-auto relative px-8 py-10 scroll-smooth">
        <div className="hospital-chat-pattern"></div>
        <div className="hospital-watermark-center"></div>

        <div className="max-w-[98%] mx-auto relative z-10">
          <div className="flex flex-col gap-2">
            {messages.map(m => <ChatMessage key={m.id} message={m} />)}
          </div>

          {isLoading && (
            <div className="flex justify-start mb-6 animate-in slide-in-from-left-4 duration-300">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-[22px] border border-blue-100 shadow-sm flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-[#1e5b8d] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#1e5b8d] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-[#1e5b8d] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-xs font-black text-[#1e5b8d] uppercase tracking-widest">Đội ngũ y tế đang xử lý</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* FOOTER: Detached Floating Input */}
      <footer className="glass-effect p-8 shrink-0 z-30">
        <div className="max-w-5xl mx-auto relative">

          {/* File Preview Bar */}
          <div className="absolute bottom-[calc(100%+15px)] left-0 w-full animate-in slide-in-from-bottom-2">
            <FilePreview files={uploadedFiles} onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))} />
          </div>

          <div className="relative group">
            {/* Input Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[35px] opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity duration-500"></div>

            <div className="relative bg-white border-2 border-slate-200/60 rounded-[32px] p-3 flex items-end gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)] focus-within:border-[#1e5b8d]/30 focus-within:shadow-[0_20px_50px_rgba(30,91,141,0.12)] transition-all duration-300">
              <div className="mb-1.5 ml-2 hover:scale-110 transition-transform">
                <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />
              </div>

              <textarea
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Mô tả triệu chứng hoặc đặt câu hỏi tại đây..."
                className="flex-1 bg-transparent border-none outline-none text-[17px] py-3.5 px-2 resize-none max-h-48 text-slate-700 font-semibold placeholder:text-slate-300 placeholder:italic"
              />

              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !uploadedFiles.length}
                className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#1e5b8d] to-[#0d4a73] text-white flex items-center justify-center shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-10 disabled:grayscale mb-1 mr-1"
              >
                <Send size={28} className="ml-1" />
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center mt-6">
            <div className="flex items-center gap-3 text-slate-300">
              <span className="w-12 h-[1px] bg-slate-200"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1e5b8d]/40">Cộng đồng y tế Đà Nẵng</span>
              <span className="w-12 h-[1px] bg-slate-200"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};