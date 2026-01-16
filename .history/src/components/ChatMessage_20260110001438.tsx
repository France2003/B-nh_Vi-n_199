import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">🤖</div>}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl break-words ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm' 
            : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200 shadow-sm'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          
          {message.files && message.files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message.files.map((file) => (
                <div key={file.id} className="relative group">
                  {file.type === 'image' && file.preview ? (
                    <img src={file.preview} alt={file.name} className="w-24 h-24 object-cover rounded-lg" />
                  ) : (
                    <div className={`w-20 h-20 flex items-center justify-center rounded-lg ${
                      isUser ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                    }`}>
                      <span className="text-2xl">📄</span>
                    </div>
                  )}
                  {file.description && (
                    <p className={`text-xs mt-1 max-w-xs ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>{file.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className={`text-xs mt-1 px-2 ${
          isUser ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {message.timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};
