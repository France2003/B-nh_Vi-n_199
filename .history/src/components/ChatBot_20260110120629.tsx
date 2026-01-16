import React, { useState, useRef, useEffect } from 'react';
import type { Message, UploadedFile } from '../types';
import { ChatMessage } from './ChatMessage';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-4xl mx-auto px-4">{children}</div>
);

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content:
        'Xin chào! 👋 Tôi là trợ lý thông minh của Bệnh viện 199 Đà Nẵng. Bạn cần tôi hỗ trợ vấn đề gì?',
      timestamp: new Date(),
    },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      files: uploadedFiles.length ? [...uploadedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: '✓ Bệnh viện 199 sẵn sàng hỗ trợ. Bạn cần tôi giúp gì thêm?',
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow">
        <Container>
          <div className="flex items-center gap-3 py-4">
            <div className="text-3xl">🏥</div>
            <div>
              <h1 className="text-lg font-semibold">
                Bệnh viện 199 Đà Nẵng
              </h1>
              <p className="text-xs text-blue-100">
                Trợ lý thông minh 24/7
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium">Trực tuyến</span>
            </div>
          </div>
        </Container>
      </header>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto py-6">
        <Container>
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {isLoading && (
            <div className="flex gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                🤖
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl shadow flex gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </Container>
      </div>

      {/* INPUT */}
      <div className="border-t bg-white py-4">
        <Container>
          {uploadedFiles.length > 0 && (
            <FilePreview
              files={uploadedFiles}
              onRemove={(id) =>
                setUploadedFiles((f) => f.filter((x) => x.id !== id))
              }
              onDescriptionChange={(id, desc) =>
                setUploadedFiles((f) =>
                  f.map((x) => (x.id === id ? { ...x, description: desc } : x))
                )
              }
            />
          )}

          <div className="flex items-center gap-3 mt-2">
            <div className="flex flex-1 items-center gap-3 px-4 py-3 rounded-2xl border bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
              <FileUploader
                onFilesUpload={(f) => setUploadedFiles((p) => [...p, ...f])}
                showLabel={false}
              />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && !uploadedFiles.length}
              className="w-11 h-11 rounded-full bg-blue-600 text-white text-lg shadow hover:scale-105 transition disabled:opacity-50"
            >
              →
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
};
