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
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🏥</div>
          <div>
            <h1 className="text-2xl font-bold">Bệnh viện 199 Đà Nẵng</h1>
            <p className="text-blue-100 text-xs font-medium">Trợ lý thông minh 24/7</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-green-400 bg-opacity-30 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold">Trực tuyến</span>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
        <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">🤖</div>
              <div className="flex gap-1.5 bg-white px-4 py-3 rounded-2xl shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto">
          {uploadedFiles.length > 0 && (
            <div className="mb-4">
              <FilePreview
                files={uploadedFiles}
                onDescriptionChange={handleFileDescriptionChange}
                onRemove={handleRemoveFile}
              />
            </div>
          )}

          <div className="flex gap-3 items-center">
            <div className="flex-1 flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-3 py-2 transition-all focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100">
              <FileUploader onFilesUpload={handleFilesUpload} showLabel={false} />

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 h-10 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
                disabled={isLoading}
              />

              {uploadedFiles.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">{uploadedFiles.length} tệp</div>
                </div>
              )}
            </div>

            <button
              onClick={handleSendMessage}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              disabled={isLoading || (!inputValue.trim() && uploadedFiles.length === 0)}
              title="Gửi tin nhắn"
            >
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
