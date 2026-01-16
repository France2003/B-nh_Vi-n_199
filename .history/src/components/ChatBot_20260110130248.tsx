import React, { useState, useRef, useEffect } from 'react';
import { Send, PhoneCall, ShieldCheck, Activity } from 'lucide-react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', content: 'Xin chào! 👋 Bệnh viện 199 Đà Nẵng sẵn sàng hỗ trợ bạn.', timestamp: new Date() },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Tự động cuộn xuống
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Tự động giãn độ cao textarea
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
        content: 'Bác sĩ chuyên khoa của Bệnh viện 199 đã tiếp nhận thông tin và sẽ trả lời bạn ngay.',
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      {/* HEADER */}
      <header className="bg-white border-b py-3 px-6 z-20 shrink-0">
        <div className="max-w-[95%] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1e5b8d] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg rotate-2">199</div>
            <div>
              <h1 className="text-xl font-black text-[#1e5b8d]">BỆNH VIỆN 199</h1>
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-blue-500" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Trợ lý y tế 24/7</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:1900986868" className="text-lg font-black text-[#1e5b8d] flex items-center gap-2 uppercase tracking-tighter"><PhoneCall size={18} /> 1900 986 868</a>
            <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-green-100 uppercase tracking-widest"><ShieldCheck size={14} className="inline mr-1" /> Kết nối an toàn</div>
          </div>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto hospital-chat-bg relative px-6 py-8">
        <div className="max-w-[95%] md:max-w-[90%] mx-auto relative z-10">
          {messages.map(m => <ChatMessage key={m.id} message={m} />)}
          {isLoading && <div className="text-[10px] font-bold text-slate-400 italic">Bác sĩ đang phản hồi...</div>}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* FOOTER: SLIM & FULL WIDTH */}
      <footer className="glass-effect py-4 px-4 md:px-8 shrink-0 z-30 border-t border-slate-100">
        <div className="max-w-full mx-auto relative">

          <div className="absolute bottom-[calc(100%+10px)] left-0 w-full px-4">
            <FilePreview files={uploadedFiles} onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))} />
          </div>

          <div className="bg-white border border-slate-200 rounded-[22px] p-1.5 flex items-center gap-3 shadow-sm focus-within:border-[#1e5b8d]/50 transition-all w-full">
            <div className="ml-1 flex-shrink-0">
              <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />
            </div>

            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Nhập nội dung tư vấn..."
              className="flex-1 bg-transparent border-none outline-none text-[16px] py-2 px-1 resize-none overflow-hidden max-h-40 text-slate-700 font-medium placeholder:text-slate-400 leading-normal"
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && !uploadedFiles.length}
              className="w-11 h-11 rounded-[16px] bg-[#1e5b8d] text-white flex items-center justify-center shadow-md hover:bg-[#15436b] transition-all disabled:opacity-10 shrink-0 mr-1"
            >
              <Send size={20} />
            </button>
          </div>

          <div className="flex justify-between items-center mt-3 px-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">© Bệnh viện 199 - Bộ Công An</span>
            <div className="flex gap-2">
              <span className="w-1 h-1 rounded-full bg-blue-200"></span>
              <span className="w-1 h-1 rounded-full bg-blue-300"></span>
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};