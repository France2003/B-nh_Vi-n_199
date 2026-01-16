import React from 'react';
import { User, FileText, CheckCircle2 } from 'lucide-react';
import type { Message } from '../types';
import AvatarImg from '../assets/images/avatar.png';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex w-full mb-6 md:mb-10 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 md:gap-5 items-start max-w-[92%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* AVATAR: Nhỏ hơn trên mobile, lớn trên desktop */}
        <div className={`
          w-9 h-9 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg border-2 overflow-hidden transform transition-transform hover:scale-105
          ${isUser ? 'bg-[#1e5b8d] border-white text-white' : 'bg-white border-blue-200'}
        `}>
          {isUser ? (
            <User size={20} className="md:size-8" />
          ) : (
            <img src={AvatarImg} alt="Bot" className="w-full h-full object-contain p-0.5" />
          )}
        </div>

        {/* CONTENT AREA: Nới rộng tối đa cho mobile */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0`}>
          <div className={`
            relative px-4 py-2.5 md:px-6 md:py-4 rounded-[18px] md:rounded-[26px] shadow-sm text-[15px] md:text-[17px] leading-relaxed font-semibold transition-all
            ${isUser
              ? 'bg-[#1e5b8d] text-white rounded-br-none shadow-blue-900/10'
              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-slate-200/50'}
          `}>

            {message.content && <p className="break-words">{message.content}</p>}

            {/* FILES */}
            {message.files && message.files.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.files.map(file => (
                  <div key={file.id} className={`p-2 md:p-3 rounded-xl border ${isUser ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                    {file.type === 'image' && file.preview ? (
                      <img src={file.preview} alt="" className="max-w-full rounded-lg max-h-60 md:max-h-80 object-contain mx-auto shadow-sm" />
                    ) : (
                      <div className="flex items-center gap-2 md:gap-3 p-1">
                        <FileText size={18} className="md:size-22" />
                        <span className="text-xs md:text-sm font-bold truncate max-w-[150px] md:max-w-[300px]">{file.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`flex items-center gap-1.5 mt-1.5 px-2 ${isUser ? 'flex-row-reverse' : ''}`}>
            <span className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isUser && <CheckCircle2 size={10} className="text-[#1e5b8d] md:size-12" />}
          </div>
        </div>
      </div>
    </div>
  );
};