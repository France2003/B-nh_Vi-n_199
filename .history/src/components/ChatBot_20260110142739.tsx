import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, PhoneCall, Activity, HeartPulse } from 'lucide-react';
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
  // Conversations Management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', content: INITIAL_BOT_MESSAGE, timestamp: new Date() },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    const savedConversations = storageService.getAllConversations();
    setConversations(savedConversations);

    const savedCurrentId = storageService.getCurrentConversationId();
    if (savedCurrentId && savedConversations.find(c => c.id === savedCurrentId)) {
      handleSelectConversation(savedCurrentId);
    } else if (savedConversations.length === 0) {
      // Create first conversation if none exist
      handleNewConversation();
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Tạo tên conversation từ nội dung tin nhắn đầu tiên
  const generateConversationTitle = (userMessage: string): string => {
    const maxLength = 50;
    const cleaned = userMessage.trim().slice(0, maxLength);
    return cleaned.length > 0 ? cleaned : 'Cuộc trò chuyện mới';
  };

  // Create new conversation
  const handleNewConversation = () => {
    const newConversation = storageService.createConversation('Cuộc trò chuyện mới', [
      { id: '1', type: 'bot', content: INITIAL_BOT_MESSAGE, timestamp: new Date() },
    ]);
    setConversations(prev => [newConversation, ...prev]);
    handleSelectConversation(newConversation.id);
    setHasUserSentMessage(false);
  };

  // Select conversation
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
    }
  };

  // Delete conversation
  const handleDeleteConversation = (id: string) => {
    storageService.deleteConversation(id);
    setConversations(prev => prev.filter(c => c.id !== id));

    if (currentConversationId === id) {
      const remaining = storageService.getAllConversations();
      if (remaining.length > 0) {
        handleSelectConversation(remaining[0].id);
      } else {
        handleNewConversation();
      }
    }
  };

  // Auto-save conversation to storage
  const autoSaveConversation = (updatedMessages: Message[], userMessage?: string) => {
    if (currentConversation) {
      let conversation = currentConversation;

      // Update title nếu lần đầu người dùng gửi tin nhắn
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
      setConversations(prev =>
        prev.map(c => (c.id === updatedConversation.id ? updatedConversation : c))
      );
    }
  };

  // Send message with Flowise API
  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

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

    try {
      // Call Flowise API
      const response = await floWiseService.query(inputValue);
      const botContent = response.text || response.answer || JSON.stringify(response);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botContent,
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);

      // Auto-save to current conversation
      if (currentConversation) {
        const updatedConversation: Conversation = {
          ...currentConversation,
          messages: updatedMessages,
          updatedAt: new Date(),
        };
        storageService.saveConversation(updatedConversation);
        setCurrentConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Xin lỗi, có lỗi xảy ra khi kết nối với hệ thống. Vui lòng thử lại sau.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-sans">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* MODERN HEADER */}
        <header className="bg-linear-to-r from-[#1e5b8d] to-[#2a7bb7] text-white py-4 px-6 z-20 shrink-0 shadow-lg">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl rotate-2">
                  <img src={Avatar} className="text-[#1e5b8d] font-black text-2xl tracking-tighter"></img>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-4 border-[#1e5b8d] rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  BỆNH VIỆN 199 <HeartPulse size={20} className="text-red-300" />
                </h1>
                <div className="flex items-center gap-2 opacity-90">
                  <Activity size={14} className="text-blue-200" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Hệ thống tư vấn thông minh</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <div className="flex flex-col items-end border-r border-white/20 pr-10">
                <span className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Tổng đài hỗ trợ</span>
                <a href="tel:1900986868" className="text-xl font-black flex items-center gap-2 hover:text-blue-100 transition-colors">
                  <PhoneCall size={20} /> 1900 986 868
                </a>
              </div>
              <button
                onClick={() => setShowSaveDialog(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                title="Lưu cuộc trò chuyện"
              >
                <Save size={16} /> Lưu
              </button>
              <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <ShieldCheck size={16} /> Kết nối bảo mật
              </div>
            </div>
          </div>
        </header>

        {/* CHAT AREA */}
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
        <footer className="glass-effect py-4 px-4 md:px-8 shrink-0 z-30 border-t border-slate-100/50">
          <div className="max-w-full mx-auto relative">
            {/* File Preview Bar */}
            <div className="absolute bottom-[calc(100%+10px)] left-0 w-full px-4">
              <FilePreview
                files={uploadedFiles}
                onRemove={(id) => setUploadedFiles(f => f.filter(x => x.id !== id))}
              />
            </div>

            <div className="relative group w-full">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-[26px] opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500"></div>
              {/* Input Box */}
              <div className="relative bg-white border border-slate-200 rounded-[24px] p-1.5 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus-within:border-blue-400/40 focus-within:shadow-[0_8px_30px_rgba(30,91,141,0.08)] transition-all duration-300 w-full">
                {/* File Uploader */}
                <div className="ml-2 hover:scale-110 transition-transform flex-shrink-0">
                  <FileUploader onFilesUpload={(f) => setUploadedFiles(prev => [...prev, ...f])} />
                </div>

                {/* Textarea */}
                <textarea
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Nhập nội dung tư vấn sức khỏe tại đây..."
                  className="flex-1 bg-transparent border-none outline-none text-[16px] py-2.5 px-2 resize-none max-h-32 text-slate-700 font-medium placeholder:text-slate-400 placeholder:italic"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && !uploadedFiles.length}
                  className="w-12 h-11 rounded-[18px] bg-linear-to-br from-[#1e5b8d] to-[#0d4a73] text-white flex items-center justify-center shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-10 disabled:grayscale shrink-0 group mr-1"
                >
                  <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 px-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e5b8d] animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-400/80 tracking-[0.2em] uppercase">
                  Hệ thống phản hồi y tế trực tuyến
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400/60 tracking-widest uppercase">
                © Bệnh viện 199 - Bộ Công An
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Save Conversation Dialog */}
      <SaveConversationDialog
        isOpen={showSaveDialog}
        currentTitle={currentConversation?.title || 'Cuộc trò chuyện mới'}
        onSave={handleSaveConversation}
        onCancel={() => setShowSaveDialog(false)}
      />
    </div>
  );
};