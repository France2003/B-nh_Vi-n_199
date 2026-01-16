import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg break-words ${
        isUser 
          ? 'text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}
      style={isUser ? {backgroundColor: '#1e5b8d'} : {}}
      >
        <p className="text-sm leading-relaxed mb-2 last:mb-0">{message.content}</p>
        {message.files && message.files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.files.map((file) => (
              <div key={file.id} className={`rounded-lg overflow-hidden ${!isUser ? 'bg-white border border-gray-200' : ''}`}>
                {file.type === 'image' && file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-40 h-40 object-cover rounded-lg" />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded-lg" style={{color: '#1e5b8d'}}>
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                  </div>
                )}
                {file.description && (
                  <p className="text-xs p-2 bg-gray-100 text-gray-700">{file.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <p className={`text-xs mt-1 ${isUser ? 'text-gray-600' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};
