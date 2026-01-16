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
      return `✓ Đã nhận ${fileCount} tệp: ${fileNames}. ${
        userMessage.content
          ? `Yêu cầu: ${userMessage.content}`
          : 'Đang xử lý tệp của bạn...'
      }`;
    }

    const responses = [
      '✓ Cảm ơn bạn đã liên hệ! Chúng tôi đang xử lý yêu cầu của bạn.',
      '✓ Bệnh viện 199 sẵn sàng hỗ trợ! Hãy cho tôi biết thêm thông tin chi tiết.',
      '✓ Tôi đã ghi nhận thông tin của bạn. Có gì khác tôi có thể giúp?',
      '✓ Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi! 🏥',
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-white shadow-2xl px-8 py-6 border-b-4 border-blue-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm ring-2 ring-white ring-opacity-30">
                <span className="text-4xl">🏥</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Bệnh viện 199</h1>
                <p className="text-blue-100 text-sm mt-1">Đà Nẵng - Trợ lý ảo thông minh</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 bg-blue-500 bg-opacity-40 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Trực tuyến</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-5">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-end gap-3">
              <div className="flex gap-2 bg-white px-5 py-4 rounded-3xl shadow-md">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <footer className="bg-white border-t-4 border-blue-100 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {uploadedFiles.length > 0 && (
            <div className="mb-5">
              <FilePreview
                files={uploadedFiles}
                onDescriptionChange={handleFileDescriptionChange}
                onRemove={handleRemoveFile}
              />
            </div>
          )}

          <div className="flex gap-4 items-end">
            <div className="flex-1 bg-white border-2 border-blue-200 rounded-full px-4 py-3 flex items-center gap-2 transition-all focus-within:border-blue-500 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-blue-100 hover:border-blue-300">
              <div className="flex-shrink-0">
                <FileUploader onFilesUpload={handleFilesUpload} showLabel={false} />
              </div>
              
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn hoặc tải file..."
                className="flex-1 text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none text-base font-medium"
                disabled={isLoading}
              />
              
              <button
                onClick={handleSendMessage}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white font-bold flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                disabled={isLoading || (!inputValue.trim() && uploadedFiles.length === 0)}
                title="Gửi (Enter)"
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
