import React from 'react';
import { User, Bot, FileText } from 'lucide-react';
import type { Message } from '../types';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm
          ${isUser ? 'bg-[#1e5b8d] text-white' : 'bg-white border border-blue-100 text-[#1e5b8d]'}`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed
            ${isUser ? 'bg-[#1e5b8d] text-white rounded-tr-none' : 'bg-white border text-slate-700 rounded-tl-none'}`}>

            {message.content && <p>{message.content}</p>}

            {message.files && message.files.length > 0 && (
              <div className={`mt-3 space-y-2 ${message.content ? 'pt-2 border-t border-white/20' : ''}`}>
                {message.files.map(file => (
                  <div key={file.id} className={`p-2 rounded-xl border ${isUser ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                    {file.type === 'image' && file.preview ? (
                      <img src={file.preview} alt="" className="max-w-full rounded-lg max-h-60 object-contain mx-auto" />
                    ) : (
                      <div className="flex items-center gap-2 text-sm p-1">
                        <FileText size={18} />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 font-medium italic">
            {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};