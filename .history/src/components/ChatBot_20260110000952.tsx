import React, { useState, useRef, useEffect } from 'react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Xin chào! 👋 Tôi là trợ lý thông minh của Bệnh viện 199 Đà Nẵng. Hãy chia sẻ những thắc mắc hoặc tệp cần xử lý của bạn. Tôi sẽ giúp bạn ngay!',
      timestamp: new Date(),
    },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFilesUpload = (files: UploadedFile[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileDescriptionChange = (fileId: string, description: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, description } : file
      )
    );
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    setIsLoading(true);

    // Create user message
    const userMessage: Message = {
      id: `${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: `${Date.now() + 1}`,
        type: 'bot',
        content: generateBotResponse(userMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateBotResponse = (userMessage: Message): string => {
    if (userMessage.files && userMessage.files.length > 0) {
      const fileCount = userMessage.files.length;
      const fileNames = userMessage.files.map((f) => f.name).join(', ');
      return `Đã nhận ${fileCount} tệp: ${fileNames}. ${
        userMessage.content
          ? `Yêu cầu của bạn: ${userMessage.content}`
          : 'Vui lòng chờ xử lý tệp của bạn.'
      }`;
    }

    const responses = [
      'Cảm ơn bạn đã liên hệ! Chúng tôi đang xử lý yêu cầu của bạn.',
      'Bệnh viện 199 sẵn sàng hỗ trợ. Vui lòng cung cấp thêm thông tin chi tiết.',
      'Tôi đã ghi nhận thông tin của bạn. Có gì khác tôi có thể giúp bạn?',
      'Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{background: 'linear-gradient(to bottom, #1e5b8d, #2a7bb7)', boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.1)'}}>
      <div className="text-white px-6 py-5 shadow-md" style={{background: 'linear-gradient(to right, #0d4a73, #1e5b8d)', borderBottom: '4px solid #2a7bb7'}}>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-4xl">🏥</span>
            Bệnh viện 199 Đà Nẵng
          </h1>
          <p className="text-sm opacity-90 mt-1.5 ml-10.5">Trợ lý ảo - Hỗ trợ 24/7</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col bg-cover bg-center"
           style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='url(%23grad)' width='100%' height='100%'/%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgba(30,91,141,0.03);stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:rgba(42,123,183,0.08);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E\")"}}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex gap-1.5 items-center py-3 px-4 bg-gray-100 w-fit rounded-lg mb-4">
            <span className="w-2 h-2 bg-gray-600 rounded-full opacity-50 animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-600 rounded-full opacity-50 animate-bounce delay-200"></span>
            <span className="w-2 h-2 bg-gray-600 rounded-full opacity-50 animate-bounce delay-400"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white px-6 py-5 shadow-lg" style={{borderTop: '2px solid #dceef9'}}>
        <FileUploader onFilesUpload={handleFilesUpload} />
        {uploadedFiles.length > 0 && (
          <FilePreview
            files={uploadedFiles}
            onDescriptionChange={handleFileDescriptionChange}
            onRemove={handleRemoveFile}
          />
        )}

        <div className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Gửi tin nhắn..."
            className="flex-1 px-4 py-3 border-2 rounded-full text-sm font-sans bg-white text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:shadow-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{borderColor: '#dceef9'}}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="w-11 h-11 border-none text-white rounded-full text-lg font-bold cursor-pointer transition-all flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            style={{background: 'linear-gradient(to bottom right, #1e5b8d, #2a7bb7)'}}
            disabled={isLoading || (!inputValue.trim() && uploadedFiles.length === 0)}
          >
            {isLoading ? '...' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
};
