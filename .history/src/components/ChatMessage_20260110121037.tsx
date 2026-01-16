import React from 'react';
import type { Message } from '../types';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* AVATAR */}
        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm text-sm font-bold
            ${isUser ? 'bg-[#1e5b8d] text-white' : 'bg-white border-2 border-[#1e5b8d] text-[#1e5b8d]'}`}>
          {isUser ? 'Bạn' : '199'}
        </div>

        {/* CONTENT AREA */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed break-words
              ${isUser
              ? 'bg-[#1e5b8d] text-white rounded-tr-none'
              : 'bg-white border text-gray-800 rounded-tl-none'}`}>

            {message.content}

            {/* HIỂN THỊ FILE TRONG TIN NHẮN ĐÃ GỬI */}
            {message.files && message.files.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.files.map((file) => (
                  <div key={file.id} className={`p-2 rounded-lg border ${isUser ? 'bg-white/10 border-white/20' : 'bg-gray-50'}`}>
                    {file.type === 'image' && file.preview ? (
                      <img src={file.preview} alt="upload" className="max-w-full rounded-md max-h-60 object-contain" />
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        <span>📄</span>
                        <span className="truncate w-40">{file.name}</span>
                      </div>
                    )}
                    {file.description && (
                      <p className={`text-[12px] mt-1 italic ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        Mô tả: {file.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <span className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
            {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};