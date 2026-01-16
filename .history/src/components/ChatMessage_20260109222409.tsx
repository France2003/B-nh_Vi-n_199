import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-5 py-4 rounded-2xl break-words shadow-md ${
        isUser 
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none' 
          : 'bg-white text-gray-900 rounded-bl-none border border-blue-100'
      }`}>
        <p className="text-sm leading-relaxed mb-2 last:mb-0 font-medium">{message.content}</p>
        
        {message.files && message.files.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-current border-opacity-10">
            {message.files.map((file) => (
              <div key={file.id} className="flex flex-col items-start gap-2">
                {file.type === 'image' && file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-32 h-32 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow" />
                ) : (
                  <div className={`w-28 h-28 flex items-center justify-center rounded-lg shadow-sm ${isUser ? 'bg-white bg-opacity-20' : 'bg-blue-50'}`}>
                    <svg className={`w-10 h-10 ${isUser ? 'text-white' : 'text-blue-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                  </div>
                )}
                {file.description && (
                  <p className={`text-xs max-w-xs ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>{file.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center justify-end">
        <p className={`text-xs mt-1 font-medium ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};
