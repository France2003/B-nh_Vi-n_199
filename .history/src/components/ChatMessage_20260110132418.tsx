import React from 'react';
import { User, FileText } from 'lucide-react';
import type { Message } from '../types';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    // Dùng justify-end và justify-start sát lề
    <div className={`flex w-full mb-10 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-5 items-start max-w-[90%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* AVATAR - Đã làm lớn hơn (w-14 h-14) */}
        <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-lg border-2
          ${isUser
            ? 'bg-[#1e5b8d] border-white text-white'
            : 'bg-white border-blue-200 text-[#1e5b8d]'}`}>
          {isUser ? <User size={28} /> : <div className="font-black text-sm">199</div>}
        </div>

        {/* BUBBLE CONTENT */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-6 py-4 rounded-[26px] shadow-md text-[16px] leading-relaxed
            ${isUser
              ? 'bg-[#1e5b8d] text-white rounded-tr-none'
              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>

            {message.content && <p className="font-medium">{message.content}</p>}

            {/* FILES TRONG TIN NHẮN */}
            {message.files && message.files.length > 0 && (
              <div className="mt-4 space-y-3">
                {message.files.map(file => (
                  <div key={file.id} className={`p-3 rounded-2xl border ${isUser ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                    {file.type === 'image' && file.preview ? (
                      <img src={file.preview} alt="" className="max-w-full rounded-xl max-h-80 object-contain mx-auto shadow-sm" />
                    ) : (
                      <div className="flex items-center gap-3 p-1 font-bold">
                        <FileText size={22} />
                        <span className="truncate max-w-[250px]">{file.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TIMESTAMP */}
          <span className="text-[11px] text-slate-500 mt-2 font-bold uppercase tracking-widest px-2 opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};