import React from 'react';
import type { Message } from '../types';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} max-w-full`}>
        {/* AVATAR */}
        <div
          className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-medium
            ${isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
            }`}
        >
          {isUser ? 'Bạn' : '🤖'}
        </div>

        {/* BUBBLE */}
        <div
          className={`
            max-w-[70%]
            px-4 py-3 rounded-2xl
            text-sm leading-7 break-words
            shadow-sm
            ${isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-white border text-gray-900 rounded-bl-md'
            }
          `}
        >
          {message.content}

          <div
            className={`mt-1 text-[11px] opacity-60 ${
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
    </div>
  );
};
