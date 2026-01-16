import React, { useState, useRef, useEffect } from 'react';
import { Send, PhoneCall, ShieldCheck, Activity } from 'lucide-react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

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
        content: 'Bác sĩ chuyên khoa của Bệnh viện 199 đã tiếp nhận thông tin và sẽ phản hồi bạn ngay.',
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      {/* HEADER */}
      <header className="bg-white border-b py-4 px-6 z-20 shrink-0 shadow-sm">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#1e5b8d] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl rotate-2">199</div>
            <div>
              <h1 className="text-2xl font-black text-[#1e5b8d]">BỆNH VIỆN 199</h1>
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-blue-500" />
                <span className="text-[12px] text-slate-500 font-bold uppercase tracking-widest">Trợ lý thông minh 24/7</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="tel:1900986868" className="text-xl font-black text-[#1e5b8d] flex items-center gap-2 uppercase tracking-tighter hover:text-blue-700 transition-colors">
              <PhoneCall size={20} /> 1900 986 868
            </a>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold border border-green-100 uppercase tracking-widest">
              <ShieldCheck size={16} className="inline mr-2" /> Kết nối an toàn
            </div>
          </div>
        </div>
      </header>

      {/* CHAT MAIN AREA - Đã mở rộng container sát biên (max-w-full) */}
      <main className="flex-1 overflow-y-auto hospital-chat-bg relative px-4 md:px-8 py-10 scrollbar-thin">
        <div className="max-w-full mx-auto relative z-10">
          {messages.map(m => <ChatMessage key={m.id} message={m} />)}
          {isLoading && (
            <div className="flex gap-3 items-center animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#1e5b8d] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#1e5b8d] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#1e5b8d] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 italic uppercase">Bác sĩ đang phản hồi...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="glass-effect py-5 px-4 md:px-8 shrink-0 z-30 border-t border-slate-100">
        <div className="max-w-full mx-auto relative">
          
          <div className="absolute bottom-[calc(100%+12px)] left-0 w-full px-4">
            <FilePreview files={uploadedFiles} onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))} />
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-2 flex items-center gap-4 shadow-xl focus-within:border-[#1e5b8d]/50 transition-all w-full min-h-[60px]">
            <div className="ml-2 flex-shrink-0">
              <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />
            </div>

            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Nhập nội dung tư vấn sức khỏe tại đây..."
              className="flex-1 bg-transparent border-none outline-none text-[17px] py-3 px-1 resize-none overflow-hidden max-h-40 text-slate-700 font-medium placeholder:text-slate-400 leading-normal"
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && !uploadedFiles.length}
              className="w-14 h-12 rounded-[18px] bg-gradient-to-br from-[#1e5b8d] to-[#2a7bb7] text-white flex items-center justify-center shadow-lg hover:shadow-blue-900/30 active:scale-95 transition-all disabled:opacity-20 shrink-0 mr-1"
            >
              <Send size={22} />
            </button>
          </div>

          <div className="flex justify-between items-center mt-4 px-6">
            <div className="flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">HỆ THỐNG PHẢN HỒI Y TẾ TRỰC TUYẾN</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">© BỆNH VIỆN 199 - BỘ CÔNG AN</span>
          </div>
        </div>
      </footer>
    </div>
  );
};