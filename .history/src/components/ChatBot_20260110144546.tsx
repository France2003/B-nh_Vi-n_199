import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, PhoneCall, Activity, HeartPulse, Menu, X } from 'lucide-react';
import type { Message, UploadedFile } from '../types';
import type { Conversation } from '../utils/storageService';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';
import { ConversationSidebar } from './ConversationSidebar';
import Avatar from '../assets/images/avatar.png';
import { storageService } from '../utils/storageService';
import { floWiseService } from '../utils/flowise';

const INITIAL_BOT_MESSAGE = 'Xin chào! 👋 Bệnh viện 199 Đà Nẵng sẵn sàng hỗ trợ bạn. Bạn cần tư vấn chuyên khoa hay đặt lịch khám?';

export const ChatBot: React.FC = () => {
  // Logic cũ giữ nguyên
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', content: INITIAL_BOT_MESSAGE, timestamp: new Date() },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

  // THÊM DUY NHẤT: State để đóng mở menu trên điện thoại
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedConversations = storageService.getAllConversations();
    setConversations(savedConversations);
    const savedCurrentId = storageService.getCurrentConversationId();
    if (savedCurrentId && savedConversations.find(c => c.id === savedCurrentId)) {
      handleSelectConversation(savedCurrentId);
    } else if (savedConversations.length === 0) {
      handleNewConversation();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const generateConversationTitle = (userMessage: string): string => {
    const maxLength = 50;
    const cleaned = userMessage.trim().slice(0, maxLength);
    return cleaned.length > 0 ? cleaned : 'Cuộc trò chuyện mới';
  };

  const handleNewConversation = () => {
    const newConversation = storageService.createConversation('Cuộc trò chuyện mới', [
      { id: '1', type: 'bot', content: INITIAL_BOT_MESSAGE, timestamp: new Date() },
    ]);
    setConversations(prev => [newConversation, ...prev]);
    handleSelectConversation(newConversation.id);
    setHasUserSentMessage(false);
    setIsSidebarOpen(false); // Đóng menu khi tạo mới
  };

  const handleSelectConversation = (id: string) => {
    const conversation = storageService.getConversation(id);
    if (conversation) {
      setCurrentConversation(conversation);
      setCurrentConversationId(id);
      setMessages(conversation.messages);
      setUploadedFiles([]);
      setInputValue('');
      storageService.setCurrentConversationId(id);
      setHasUserSentMessage(true);
      setIsSidebarOpen(false); // Đóng menu khi chọn chat
    }
  };

  const handleDeleteConversation = (id: string) => {
    storageService.deleteConversation(id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      const remaining = storageService.getAllConversations();
      if (remaining.length > 0) handleSelectConversation(remaining[0].id);
      else handleNewConversation();
    }
  };

  const autoSaveConversation = (updatedMessages: Message[], userMessage?: string) => {
    if (currentConversation) {
      let conversation = currentConversation;
      if (!hasUserSentMessage && userMessage) {
        conversation.title = generateConversationTitle(userMessage);
        setHasUserSentMessage(true);
      }
      const updatedConversation: Conversation = {
        ...conversation,
        messages: updatedMessages,
        updatedAt: new Date(),
      };
      storageService.saveConversation(updatedConversation);
      setCurrentConversation(updatedConversation);
      setConversations(prev => prev.map(c => (c.id === updatedConversation.id ? updatedConversation : c)));
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;
    const userInputContent = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setUploadedFiles([]);
    setIsLoading(true);
    autoSaveConversation(newMessages, userInputContent);
    try {
      const response = await floWiseService.query(userInputContent);
      const botContent = response.text || response.answer || 'Không có phản hồi từ hệ thống';
      const botMessage: Message = { id: (Date.now() + 1).toString(), type: 'bot', content: botContent, timestamp: new Date() };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);
      autoSaveConversation(updatedMessages);
    } catch (error) {
      console.error('Error calling API:', error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), type: 'bot', content: 'Xin lỗi, có lỗi xảy ra khi kết nối với hệ thống.', timestamp: new Date() };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      autoSaveConversation(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-sans relative">

      {/* SIDEBAR: Drawer linh hoạt trên Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-[#1e5b8d] shrink-0 shadow-2xl md:shadow-none
      `}>
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        {/* Nút X để đóng menu trên Mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-4 right-[-45px] bg-[#1e5b8d] p-2 text-white rounded-r-xl shadow-lg"
        >
          <X size={24} />
        </button>
      </div>

      {/* Overlay mờ nền khi mở Sidebar trên Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* MODERN HEADER: Responsive Padding & Hidden Elements */}
        <header className="bg-linear-to-r from-[#1e5b8d] to-[#2a7bb7] text-white py-3 md:py-4 px-4 md:px-6 z-20 shrink-0 shadow-lg">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">

              {/* Nút Hamburger cho Mobile */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-1.5 hover:bg-white/10 rounded-lg shrink-0 transition-colors"
              >
                <Menu size={26} />
              </button>

              <div className="relative shrink-0">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center shadow-xl rotate-2 overflow-hidden p-1">
                  <img src={Avatar} className="w-full h-full object-contain" alt="Logo" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-5 md:h-5 bg-green-400 border-2 md:border-4 border-[#1e5b8d] rounded-full animate-pulse"></div>
              </div>

              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-black truncate tracking-tight uppercase">
                  Bệnh viện 199 <HeartPulse size={18} className="hidden xs:inline text-red-300 ml-1" />
                </h1>
                <div className="flex items-center gap-1.5 opacity-90">
                  <Activity size={12} className="text-blue-200 shrink-0" />
                  <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest truncate">Trợ lý y tế thông minh</span>
                </div>
              </div>
            </div>

            {/* Hotline & Bảo mật: Tự động ẩn bớt trên màn hình nhỏ */}
            <div className="hidden sm:flex items-center gap-4 md:gap-10">
              <div className="hidden lg:flex flex-col items-end border-r border-white/20 pr-10">
                <span className="text-[10px] text-blue-100 font-bold uppercase tracking-widest opacity-70">Tổng đài hỗ trợ</span>
                <a href="tel:1900986868" className="text-lg font-black hover:text-blue-100 transition-colors flex items-center gap-2">
                  <PhoneCall size={18} /> 1900 986 868
                </a>
              </div>
              <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-2 whitespace-nowrap">
                <ShieldCheck size={14} /> <span className="hidden md:inline">Kết nối bảo mật</span>
              </div>
            </div>
          </div>
        </header>

        {/* CHAT AREA: Padding tối ưu cho Mobile */}
        <main className="flex-1 overflow-y-auto hospital-chat-bg relative px-2 md:px-8 py-6 md:py-10 scrollbar-thin">
          <div className="max-w-full mx-auto relative z-10 flex flex-col">
            {messages.map(m => <ChatMessage key={m.id} message={m} />)}
            {isLoading && (
              <div className="flex gap-3 items-center animate-pulse text-[#1e5b8d] font-bold text-xs uppercase italic px-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">...</div>
                <span className="hidden xs:inline">Bác sĩ đang phân tích yêu cầu...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* FOOTER: Slim & Responsive paddings */}
        <footer className="glass-effect py-3 md:py-5 px-2 md:px-8 shrink-0 z-30 border-t border-slate-100/50">
          <div className="max-w-full mx-auto relative">
            <div className="absolute bottom-[calc(100%+10px)] left-0 w-full px-2">
              <FilePreview files={uploadedFiles} onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))} />
            </div>

            <div className="bg-white border border-slate-200 rounded-[22px] p-1.5 flex items-center gap-2 md:gap-4 shadow-xl focus-within:border-[#1e5b8d]/50 transition-all w-full min-h-[48px] md:min-h-[56px]">
              <div className="shrink-0 ml-1">
                <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />
              </div>

              <textarea
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Nhập câu hỏi tại đây..."
                className="flex-1 bg-transparent border-none outline-none text-[15px] md:text-[16px] py-1.5 md:py-2 resize-none max-h-32 text-slate-700 font-medium placeholder:text-slate-400 leading-normal"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !uploadedFiles.length}
                className="w-10 h-9 md:w-12 md:h-11 rounded-[16px] bg-linear-to-br from-[#1e5b8d] to-[#0d4a73] text-white flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-20 shrink-0 mr-1"
              >
                <Send size={18} className="md:size-5" />
              </button>
            </div>

            {/* Copyright: Ẩn bớt text dài trên mobile cực nhỏ */}
            <div className="flex justify-between items-center mt-3 px-4 opacity-50 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e5b8d] animate-pulse"></span>
                <span className="hidden xs:inline">Hệ thống phản hồi y tế trực tuyến</span>
              </div>
              <span>© Bệnh viện 199 - Bộ Công An</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};