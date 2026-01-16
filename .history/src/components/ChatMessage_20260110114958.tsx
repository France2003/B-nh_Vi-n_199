import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} px-2`}>
      <div className="flex items-end gap-3">
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">🤖</div>
        )}

        <div className={`inline-block w-fit max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] rounded-2xl p-3 break-words shadow-sm ${isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-2xl rounded-bl-2xl rounded-tl-2xl'
            : 'bg-white text-gray-900 rounded-bl-2xl rounded-br-2xl border border-gray-200'
          }`}>
          <div className="flex flex-col gap-2">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
            {message.files && message.files.length > 0 && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.files.map((file) => (
                  <div key={file.id} className="flex items-start gap-2">
                    {file.type === 'image' && file.preview ? (
                      <img src={file.preview} alt={file.name} className="w-20 h-20 object-cover rounded-md" />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center rounded-md bg-gray-100">
                        <span className="text-2xl">📄</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{file.name}</p>
                      {file.description && <p className="text-xs text-gray-500 mt-1 truncate">{file.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`text-[11px] mt-2 ${isUser ? 'text-white/80 text-right' : 'text-gray-400 text-left'}`}>
            {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 text-sm shadow-sm">Bạn</div>
        )}
      </div>
    </div>
  );
};
export default ChatMessage;
