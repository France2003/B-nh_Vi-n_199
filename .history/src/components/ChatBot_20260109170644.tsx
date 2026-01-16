import React, { useState, useRef, useEffect } from 'react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';
import './ChatBot.css';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Xin chào! Tôi là trợ lý của Bệnh viện 199 Đà Nẵng. Bạn có thể gửi tin nhắn, tệp hoặc hình ảnh. Tôi sẽ giúp bạn xử lý các tệp đó.',
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
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <h1 className="header-title">
            <span className="hospital-icon">🏥</span>
            Bệnh viện 199 Đà Nẵng
          </h1>
          <p className="header-subtitle">Trợ lý ảo - Hỗ trợ 24/7</p>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-area">
        <FileUploader onFilesUpload={handleFilesUpload} />
        {uploadedFiles.length > 0 && (
          <FilePreview
            files={uploadedFiles}
            onDescriptionChange={handleFileDescriptionChange}
            onRemove={handleRemoveFile}
          />
        )}

        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Gửi tin nhắn..."
            className="message-input"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="send-button"
            disabled={isLoading || (!inputValue.trim() && uploadedFiles.length === 0)}
          >
            {isLoading ? '...' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
};
