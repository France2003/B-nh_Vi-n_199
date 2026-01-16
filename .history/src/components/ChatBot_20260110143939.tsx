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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

  // State điều khiển Sidebar trên Mobile
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
    return userMessage.trim().slice(0, 30) || 'Cuộc trò chuyện mới';
  };

  const handleNewConversation = () => {
    const newChat = storageService.createConversation('Cuộc trò chuyện mới', [
      { id: '1', type: 'bot', content: INITIAL_BOT_MESSAGE, timestamp: new Date() },
    ]);
    setConversations(prev => [newChat, ...prev]);
    handleSelectConversation(newChat.id);
    setIsSidebarOpen(false); // Đóng sidebar sau khi tạo mới trên mobile
  };

  const handleSelectConversation = (id: string) => {
    const conversation = storageService.getConversation(id);
    if (conversation) {
      setCurrentConversation(conversation);
      setCurrentConversationId(id);
      setMessages(conversation.messages);
      storageService.setCurrentConversationId(id);
      setIsSidebarOpen(false); // Đóng sidebar sau khi chọn trên mobile
    }
  };

  const handleDeleteConversation = (id: string) => {
    storageService.deleteConversation(id);
    const remaining = storageService.getAllConversations();
    setConversations(remaining);
    if (currentConversationId === id) {
      if (remaining.length > 0) handleSelectConversation(remaining[0].id);
      else handleNewConversation();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;
    const userInput = inputValue;
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

    // Cập nhật title và lưu storage
    if (currentConversation) {
      const updatedChat = { ...currentConversation, messages: newMessages, updatedAt: new Date() };
      if (updatedChat.title === 'Cuộc trò chuyện mới') updatedChat.title = generateConversationTitle(userInput);
      storageService.saveConversation(updatedChat);
      setConversations(storageService.getAllConversations());
    }

    try {
      const response = await floWiseService.query(userInput);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.text || response.answer || 'Hệ thống đã ghi nhận.',
        timestamp: new Date(),
      };
      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      if (currentConversationId) storageService.updateMessages(currentConversationId, finalMessages);
    } catch (error) {
      console.error(error);
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
        {/* Nút đóng sidebar chỉ hiện trên mobile */}
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-4 right-[-45px] bg-[#1e5b8d] p-2 text-white rounded-r-xl shadow-lg">
          <X size={24} />
        </button>
      </div>

      {/* Overlay khi mở menu trên mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* HEADER: Tối ưu khoảng cách cho Mobile */}
        <header className="bg-gradient-to-r from-[#1e5b8d] to-[#2a7bb7] text-white py-3 md:py-4 px-3 md:px-6 z-20 shrink-0 shadow-lg">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              {/* Nút Menu cho mobile */}
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1.5 hover:bg-white/10 rounded-lg shrink-0">
                <Menu size={26} />
              </button>

              <div className="relative shrink-0">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center shadow-xl rotate-2 overflow-hidden">
                  <img src={Avatar} className="w-full h-full object-contain p-1" alt="Avatar" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-5 md:h-5 bg-green-400 border-2 md:border-4 border-[#1e5b8d] rounded-full animate-pulse"></div>
              </div>

              <div className="min-w-0">
                <h1 className="text-base md:text-2xl font-black truncate tracking-tight uppercase">Bệnh viện 199</h1>
                <div className="flex items-center gap-1 opacity-90">
                  <Activity size={12} className="text-blue-200 shrink-0" />
                  <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest truncate">Trợ lý y tế AI</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-10">
              <div className="flex flex-col items-end border-r border-white/20 pr-10">
                <span className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Cấp cứu</span>
                <a href="tel:1900986868" className="text-xl font-black flex items-center gap-2 hover:text-blue-100"><PhoneCall size={20} /> 1900 986 868</a>
              </div>
              <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <ShieldCheck size={16} /> Bảo mật
              </div>
            </div>
          </div>
        </header>

        {/* CHAT AREA: Padding hẹp hơn trên mobile */}
        <main className="flex-1 overflow-y-auto hospital-chat-bg relative px-2 md:px-8 py-6 md:py-10 scrollbar-thin">
          <div className="max-w-full mx-auto relative z-10">
            {messages.map(m => <ChatMessage key={m.id} message={m} />)}
            {isLoading && (
              <div className="flex gap-3 items-center animate-pulse text-[#1e5b8d] font-bold text-xs uppercase italic px-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">...</div>
                Bác sĩ đang phân tích yêu cầu...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* FOOTER: Cố định sát đáy và mỏng hơn trên mobile */}
        <footer className="glass-effect py-3 md:py-5 px-2 md:px-8 shrink-0 z-30 border-t border-slate-200">
          <div className="max-w-full mx-auto relative">
            <div className="absolute bottom-[calc(100%+10px)] left-0 w-full px-2">
              <FilePreview files={uploadedFiles} onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))} />
            </div>

            <div className="bg-white border border-slate-200 rounded-[22px] p-1.5 flex items-center gap-2 md:gap-4 shadow-xl focus-within:border-[#1e5b8d]/50 transition-all w-full min-h-[50px] md:min-h-[56px]">
              <div className="shrink-0 ml-1">
                <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />
              </div>
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Nhập câu hỏi tại đây..."
                className="flex-1 bg-transparent border-none outline-none text-[15px] md:text-[16px] py-2 resize-none overflow-hidden max-h-32 text-slate-700 font-medium"
              />
              <button onClick={handleSendMessage} disabled={isLoading} className="w-10 h-9 md:w-12 md:h-11 rounded-[16px] bg-[#1e5b8d] text-white flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-20 shrink-0 mr-1">
                <Send size={20} />
              </button>
            </div>
            <div className="hidden xs:flex justify-between items-center mt-3 px-4 opacity-40 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
              <span>Hệ thống phản hồi y tế trực tuyến</span>
              <span>© Bệnh viện 199 - Bộ Công An</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};