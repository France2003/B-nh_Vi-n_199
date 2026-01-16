import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, PhoneCall, Activity, Menu, X } from 'lucide-react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';
import { ConversationSidebar } from './ConversationSidebar';
import { storageService, type Conversation } from '../utils/storageService';
import { floWiseService } from '../utils/flowise';
import Avatar from '../assets/images/avatar.png';

export const ChatBot: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Khởi tạo dữ liệu
  useEffect(() => {
    const saved = storageService.getAllConversations();
    setConversations(saved);
    const lastId = storageService.getCurrentConversationId();
    if (lastId) handleSelectConversation(lastId);
    else handleNewChat();
  }, []);

  // Tự động giãn textarea và cuộn trang
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [inputValue, messages, isLoading]);

  const handleNewChat = () => {
    const newChat = storageService.createConversation('Cuộc trò chuyện mới', [
      { id: '1', type: 'bot', content: 'Xin chào! 👋 Tôi là trợ lý AI của Bệnh viện 199. Tôi có thể giúp gì cho bạn?', timestamp: new Date() }
    ]);
    setConversations(prev => [newChat, ...prev]);
    handleSelectConversation(newChat.id);
    setIsSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    const chat = storageService.getConversation(id);
    if (chat) {
      setCurrentId(id);
      setMessages(chat.messages);
      storageService.setCurrentConversationId(id);
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    
    // Cập nhật Storage
    if (currentId) {
      const chat = storageService.getConversation(currentId);
      if (chat) {
        chat.messages = updatedMessages;
        if (chat.title === 'Cuộc trò chuyện mới') chat.title = inputValue.slice(0, 30);
        storageService.saveConversation(chat);
        setConversations(storageService.getAllConversations());
      }
    }

    const question = inputValue;
    setInputValue('');
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      const response = await floWiseService.query(question);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.text || response.answer || "Hệ thống đã ghi nhận.",
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, botMsg];
      setMessages(finalMessages);
      if (currentId) {
        storageService.updateMessages(currentId, finalMessages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-sans relative">
      
      {/* SIDEBAR: Drawer mode on Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-[#1e5b8d] shrink-0 shadow-2xl md:shadow-none
      `}>
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewChat}
          onDeleteConversation={(id) => {
            storageService.deleteConversation(id);
            const remain = storageService.getAllConversations();
            setConversations(remain);
            if (remain.length > 0) handleSelectConversation(remain[0].id);
            else handleNewChat();
          }}
        />
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-4 right-[-45px] bg-[#1e5b8d] p-2 text-white rounded-r-xl shadow-lg">
          <X size={24} />
        </button>
      </div>

      {/* OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* HEADER: Màu xanh chuyên nghiệp */}
        <header className="bg-gradient-to-r from-[#1e5b8d] to-[#2a7bb7] text-white py-3 md:py-4 px-4 md:px-6 z-20 shrink-0 shadow-lg">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1.5 hover:bg-white/10 rounded-lg">
                <Menu size={26} />
              </button>
              <div className="relative shrink-0">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center shadow-xl rotate-2">
                  <img src={Avatar} className="w-full h-full object-contain p-1" alt="Logo" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-5 md:h-5 bg-green-400 border-2 md:border-4 border-[#1e5b8d] rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-black tracking-tight truncate uppercase">Bệnh viện 199</h1>
                <div className="flex items-center gap-1.5 opacity-90">
                  <Activity size={12} className="text-blue-200 shrink-0" />
                  <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest truncate">Trợ lý y tế thông minh</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-10">
              <a href="tel:1900986868" className="text-xl font-black flex items-center gap-2 hover:text-blue-100"><PhoneCall size={20} /> 1900 986 868</a>
              <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <ShieldCheck size={16} /> Kết nối bảo mật
              </div>
            </div>
          </div>
        </header>

        {/* CHAT AREA */}
        <main className="flex-1 overflow-y-auto hospital-chat-bg relative px-2 md:px-8 py-6 md:py-10 scrollbar-thin">
          <div className="max-w-full mx-auto relative z-10">
            {messages.map(m => <ChatMessage key={m.id} message={m} />)}
            {isLoading && (
              <div className="flex gap-3 items-center animate-pulse text-[#1e5b8d] font-bold text-xs uppercase italic px-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">...</div>
                Bác sĩ AI đang xử lý thông tin...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* FOOTER: Slim & Full Width */}
        <footer className="glass-effect py-4 px-2 md:px-8 shrink-0 z-30 border-t border-slate-200">
          <div className="max-w-full mx-auto relative">
            <div className="absolute bottom-[calc(100%+12px)] left-0 w-full px-4">
              <FilePreview files={uploadedFiles} onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))} />
            </div>

            <div className="bg-white border border-slate-200 rounded-[22px] p-1.5 flex items-center gap-3 shadow-xl focus-within:border-[#1e5b8d]/50 transition-all w-full min-h-[56px]">
              <div className="ml-2 shrink-0">
                <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />
              </div>
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Nhập nội dung tư vấn..."
                className="flex-1 bg-transparent border-none outline-none text-[16px] py-2 px-1 resize-none overflow-hidden max-h-40 text-slate-700 font-medium"
              />
              <button onClick={handleSendMessage} disabled={isLoading} className="w-12 h-11 rounded-[18px] bg-[#1e5b8d] text-white flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-20 shrink-0 mr-1">
                <Send size={20} />
              </button>
            </div>
            <div className="flex justify-between items-center mt-3 px-4 opacity-50 text-[9px] font-bold uppercase tracking-widest">
              <span>Hệ thống phản hồi y tế trực tuyến</span>
              <span>© Bệnh viện 199 - Bộ Công An</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};