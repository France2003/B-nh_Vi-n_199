import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, PhoneCall } from 'lucide-react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', content: 'Xin chào! 👋 Bệnh viện 199 Đà Nẵng có thể giúp gì cho bạn?', timestamp: new Date() },
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
        content: 'Cảm ơn bạn. Chúng tôi đã nhận được thông tin và sẽ phản hồi sớm nhất.',
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden">
      <header className="bg-gradient-to-r from-[#1e5b8d] to-[#2a7bb7] text-white p-4 shadow-xl z-20 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1e5b8d] font-black text-xl shadow-inner">199</div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">BỆNH VIỆN 199</h1>
              <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Trợ lý thông minh 24/7</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm"><ShieldCheck size={18} /> Bảo mật</div>
            <a href="tel:1900986868" className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><PhoneCall size={16} /> 1900 986 868</a>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto hospital-chat-bg px-4 py-8">
        <div className="max-w-4xl mx-auto relative z-10">
          {messages.map(m => <ChatMessage key={m.id} message={m} />)}
          {isLoading && <div className="animate-pulse text-xs text-slate-400 font-bold">Bác sĩ đang phản hồi...</div>}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t p-4 md:p-6 shadow-[0_-10px_25px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-4xl mx-auto">
          <FilePreview files={uploadedFiles} onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))} />
          <div className="flex items-end gap-3 bg-slate-100 rounded-[24px] p-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1e5b8d]/20 border border-transparent focus-within:border-[#1e5b8d]/30 transition-all">
            <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Nhập nội dung tư vấn..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] py-2.5 px-1 resize-none max-h-32 text-slate-700"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && !uploadedFiles.length}
              className="w-12 h-12 rounded-2xl bg-[#1e5b8d] text-white flex items-center justify-center shadow-lg disabled:opacity-20 transition-all active:scale-95"
            >
              <Send size={20} className="ml-1" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider">216 Nguyễn Công Trứ, Đà Nẵng</p>
        </div>
      </footer>
    </div>
  );
};