import React from 'react';
import { User, Bot, FileText} from 'lucide-react';
import type { Message } from '../types';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    // Dùng w-full và justify- để đẩy về 2 biên
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-3 items-end max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* AVATAR */}
        <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center shadow-md border-2
          ${isUser
            ? 'bg-gradient-to-br from-[#1e5b8d] to-[#2a7bb7] text-white border-white'
            : 'bg-white border-blue-50 text-[#1e5b8d]'}`}>
          {isUser ? <User size={22} /> : <Bot size={22} />}
        </div>

        {/* BUBBLE CONTENT */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative px-5 py-3.5 rounded-[22px] shadow-sm transition-all
            ${isUser
              ? 'bg-[#1e5b8d] text-white rounded-br-none hover:bg-[#1a4f7a]'
              : 'bg-white text-slate-700 border border-blue-50 rounded-bl-none hover:shadow-md'}`}>

            {message.content && <p className="leading-relaxed font-medium">{message.content}</p>}

            {/* HIỂN THỊ FILES */}
            {message.files && message.files.length > 0 && (
              <div className={`mt-3 space-y-2 ${message.content ? 'pt-3 border-t border-white/10' : ''}`}>
                {message.files.map(file => (
                  <div key={file.id} className={`overflow-hidden rounded-xl border transition-transform hover:scale-[1.02]
                    ${isUser ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                    {file.type === 'image' && file.preview ? (
                      <img src={file.preview} alt="" className="max-w-full rounded-lg max-h-72 object-contain block" />
                    ) : (
                      <div className="flex items-center gap-3 p-3">
                        <div className={`p-2 rounded-lg ${isUser ? 'bg-white/20' : 'bg-blue-100'}`}>
                          <FileText size={20} className={isUser ? 'text-white' : 'text-[#1e5b8d]'} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-bold truncate">{file.name}</span>
                          <span className="text-[10px] opacity-70 uppercase tracking-tighter">Tài liệu đính kèm</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TIME & STATUS */}
          <div className="flex items-center gap-1.5 mt-1.5 px-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {!isUser && <span className="w-1 h-1 bg-green-400 rounded-full"></span>}
          </div>
        </div>
      </div>
    </div>
  );
};