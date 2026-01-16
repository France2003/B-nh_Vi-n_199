import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Cột chứa bubble + time */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Bubble */}
        <div
          className={`
            inline-block px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
            max-w-[720px]
            ${isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
            }
          `}
        >
          {message.content}
        </div>

        {/* Time */}
        <div
          className={`mt-1 text-[11px] text-gray-400 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {message.timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;