import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, PhoneCall, Activity, Menu, X } from 'lucide-react';
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

  // State quản lý Sidebar trên Mobile
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
    const maxLength = 35; // Giới hạn độ dài tiêu đề để Sidebar đẹp hơn
    const cleaned = userMessage.trim().slice(0, maxLength);
    return cleaned.length > 0 ? cleaned + (userMessage.length > maxLength ? '...' : '') : 'Cuộc trò chuyện mới';
  };

  const handleNewConversation = () => {
    const newConversation = storageService.createConversation('Cuộc trò chuyện mới', [
      { id: '1', type: 'bot', content: INITIAL_BOT_MESSAGE, timestamp: new Date() },
    ]);
    setConversations(prev => [newConversation, ...prev]);
    handleSelectConversation(newConversation.id);
    setIsSidebarOpen(false);
  };

  // FIX: Nhận diện cuộc trò chuyện mới để biết khi nào cần đổi tiêu đề
  const handleSelectConversation = (id: string) => {
    const conversation = storageService.getConversation(id);
    if (conversation) {
      setCurrentConversation(conversation);
      setCurrentConversationId(id);
      setMessages(conversation.messages);
      setUploadedFiles([]);
      setInputValue('');
      storageService.setCurrentConversationId(id);

      // Kiểm tra xem user đã gửi tin nhắn nào trong cuộc hội thoại này chưa
      const hasSent = conversation.messages.some(m => m.type === 'user');
      setHasUserSentMessage(hasSent);

      setIsSidebarOpen(false);
    }
  };

  const handleDeleteConversation = (id: string) => {
    storageService.deleteConversation(id);
    const remain = storageService.getAllConversations();
    setConversations(remain);

    if (currentConversationId === id) {
      if (remain.length > 0) handleSelectConversation(remain[0].id);
      else handleNewConversation();
    }
  };

  // FIX: Logic tự động lưu và cập nhật tiêu đề ngay lập tức
  const autoSaveConversation = (updatedMessages: Message[], userMessage?: string) => {
    if (currentConversation) {
      let conversation = { ...currentConversation };

      // Nếu tiêu đề là mặc định và đây là tin nhắn đầu tiên của User -> Đổi tên
      if (conversation.title === 'Cuộc trò chuyện mới' && userMessage && !hasUserSentMessage) {
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

      // Cập nhật lại danh sách bên Sidebar để thấy tiêu đề mới ngay
      setConversations(storageService.getAllConversations());
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

    // FIX: Gọi autoSave với nội dung tin nhắn để cập nhật tiêu đề
    autoSaveConversation(newMessages, userInputContent);

    try {
      const response = await floWiseService.query(userInputContent);
      const botContent = response.text || response.answer || 'Không có phản hồi từ hệ thống';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botContent,
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);
      autoSaveConversation(updatedMessages);
    } catch (error) {
      console.error('Error calling API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Xin lỗi, có lỗi xảy ra khi kết nối với hệ thống. Vui lòng thử lại sau.',
        timestamp: new Date(),
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      autoSaveConversation(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-sans relative">

      {/* SIDEBAR: Đã tích hợp Drawer cho Mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-[#1e5b8d] shrink-0 shadow-2xl md:shadow-none`}>
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-4 right-[-45px] bg-[#1e5b8d] p-2 text-white rounded-r-xl shadow-lg">
          <X size={24} />
        </button>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="bg-linear-to-r from-[#1e5b8d] to-[#2a7bb7] text-white py-3 md:py-4 px-4 md:px-6 z-20 shrink-0 shadow-lg">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1.5 hover:bg-white/10 rounded-lg shrink-0">
                <Menu size={26} />
              </button>
              <div className="relative shrink-0">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center shadow-xl rotate-2 overflow-hidden p-1">
                  <img src={Avatar} className="w-full h-full object-contain" alt="Logo" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-5 md:h-5 bg-green-400 border-2 md:border-4 border-[#1e5b8d] rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-black truncate uppercase tracking-tight">Bệnh viện 199</h1>
                <div className="flex items-center gap-1.5 opacity-90 text-[9px] md:text-[11px] font-bold uppercase tracking-widest">
                  <Activity size={12} className="text-blue-200" /> Tư vấn thông minh
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-10">
              <div className="flex flex-col items-end border-r border-white/20 pr-10">
                <span className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Hotline</span>
                <a href="tel:1900986868" className="text-xl font-black flex items-center gap-2 hover:text-blue-100"><PhoneCall size={20} /> 1900 986 868</a>
              </div>
              <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <ShieldCheck size={16} /> Bảo mật
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto hospital-chat-bg relative px-2 md:px-8 py-6 md:py-10 scrollbar-thin">
          <div className="max-w-full mx-auto relative z-10 flex flex-col">
            {messages.map(m => <ChatMessage key={m.id} message={m} />)}
            {isLoading && (
              <div className="flex gap-3 items-start animate-pulse px-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#1e5b8d] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#1e5b8d] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#1e5b8d] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-700 italic uppercase tracking-wide">🏥 Bác sĩ AI đang phân tích yêu cầu...</span>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-[11px] text-slate-600 max-w-sm hidden md:block">
                    <p className="font-semibold mb-1">⏳ Vui lòng đợi trong giây lát</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <footer className="glass-effect py-4 px-2 md:px-8 shrink-0 z-30 border-t border-slate-100/50">
          <div className="max-w-full mx-auto relative">
            <div className="absolute bottom-[calc(100%+10px)] left-0 w-full px-4">
              <FilePreview files={uploadedFiles} onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))} />
            </div>

            <div className="bg-white border border-slate-200 rounded-[22px] p-1.5 flex items-center gap-3 shadow-xl focus-within:border-[#1e5b8d]/50 transition-all w-full min-h-[50px] md:min-h-[56px]">
              <div className="ml-2 shrink-0"><FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} /></div>
              <textarea
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Nhập nội dung tư vấn..."
                className="flex-1 bg-transparent border-none outline-none text-[16px] py-1 md:py-2 px-1 resize-none max-h-32 text-slate-700 font-medium"
              />
              <button onClick={handleSendMessage} disabled={!inputValue.trim() && !uploadedFiles.length} className="w-10 h-10 md:w-12 md:h-12 rounded-[18px] bg-[#1e5b8d] text-white flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-30 shrink-0 mr-1 transition-all">
                <Send size={20} />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};