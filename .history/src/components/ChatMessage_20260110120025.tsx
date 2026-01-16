import React from 'react';
import type { Message } from '../types';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex items-end gap-4 max-w-[92%] ${isUser ? 'flex-row-reverse' : ''
          }`}
      >
        {/* AVATAR */}
        <div
          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm shadow
            ${isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
            }`}
        >
          {isUser ? 'Bạn' : '🤖'}
        </div>

        {/* MESSAGE BUBBLE */}
        <div
          className={`
            max-w-[80%] sm:max-w-[68%] lg:max-w-[60%]
            px-5 py-4 rounded-3xl shadow-sm
            text-sm leading-relaxed
            ${isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-white text-gray-900 border rounded-bl-md'
            }
          `}
        >
          <div className="break-words leading-7">{message.content}</div>

          <div
            className={`mt-2 text-[11px] opacity-70 ${isUser ? 'text-right' : 'text-left'
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
