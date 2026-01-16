import React from 'react';
import type { Message } from '../types';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-end gap-3">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            🤖
          </div>
        )}

        <div
          className={`
            inline-block w-fit
            max-w-[85%] sm:max-w-[70%] lg:max-w-[60%]
            px-4 py-3 rounded-2xl shadow
            ${isUser
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-900 border'
            }
          `}
        >
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
          <div className="mt-1 text-[11px] opacity-70 text-right">
            {message.timestamp.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-200 text-blue-700 flex items-center justify-center text-xs">
            Bạn
          </div>
        )}
      </div>
    </div>
  );
};
