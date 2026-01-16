import React from 'react';
import { User, FileText, CheckCircle2 } from 'lucide-react';
import type { Message } from '../types';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex w-full mb-10 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-5 items-end max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* AVATAR BOX */}
        <div className={`w-12 h-12 shrink-0 rounded-[20px] flex items-center justify-center shadow-lg border-2 transform transition-transform hover:scale-110
          ${isUser
            ? 'bg-[#1e5b8d] border-white text-white'
            : 'bg-white border-blue-100 text-[#1e5b8d]'}`}>
          {isUser ? <User size={24} /> : <div className="font-black text-xs">199</div>}
        </div>

        {/* MESSAGE CONTENT */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative px-6 py-4 rounded-[28px] shadow-sm text-[16px] leading-relaxed font-semibold transition-all
            ${isUser
              ? 'bg-gradient-to-br from-[#1e5b8d] to-[#0d4a73] text-white rounded-br-none shadow-blue-900/10'
              : 'bg-white text-slate-700 border border-blue-50/50 rounded-bl-none shadow-slate-200/50'}`}>

            {message.content && <p>{message.content}</p>}

            {/* FILES RENDERING */}
            {message.files && message.files.length > 0 && (
              <div className="mt-4 space-y-3">
                {message.files.map(file => (
                  <div key={file.id} className={`group overflow-hidden rounded-2xl border transition-all cursor-pointer
                    ${isUser ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-slate-50 border-slate-100 hover:border-blue-200'}`}>
                    {file.type === 'image' && file.preview ? (
                      <img src={file.preview} alt="" className="max-w-full rounded-xl max-h-80 object-contain block group-hover:scale-[1.02] transition-transform" />
                    ) : (
                      <div className="flex items-center gap-4 p-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUser ? 'bg-white/10' : 'bg-blue-100'}`}>
                          <FileText size={24} className={isUser ? 'text-white' : 'text-[#1e5b8d]'} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-black truncate">{file.name}</span>
                          <span className={`text-[10px] uppercase font-bold ${isUser ? 'text-white/60' : 'text-slate-400'}`}>Tài liệu y khoa</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* META INFO */}
          <div className={`flex items-center gap-2 mt-2 px-2 ${isUser ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isUser && <CheckCircle2 size={12} className="text-[#1e5b8d]" />}
          </div>
        </div>
      </div>
    </div>
  );
};