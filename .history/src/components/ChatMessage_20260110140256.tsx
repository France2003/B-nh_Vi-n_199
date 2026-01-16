import React from 'react';
import { User, FileText} from 'lucide-react';
import type { Message } from '../types';
import Avatar from '../assets/images/avatar.jpg';
export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-4 items-end max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* AVATAR */}
        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-md border-2
          ${isUser ? 'bg-[#1e5b8d] border-white text-white' : ' border-blue-100 text-[#1e5b8d]'}`}>
          {isUser ? <User size={20} /> : <img src ={Avatar} className="font-black text-[10px]"></img>}
        </div>
        {/* BUBBLE */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3 rounded-[20px] shadow-sm text-[15px] leading-relaxed
            ${isUser ? 'bg-[#1e5b8d] text-white rounded-br-none' : 'bg-white text-slate-700 border border-blue-50 rounded-bl-none'}`}>

            {message.content && <p className="font-medium">{message.content}</p>}

            {message.files && message.files.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.files.map(file => (
                  <div key={file.id} className={`p-2 rounded-xl border ${isUser ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                    {file.type === 'image' && file.preview ? (
                      <img src={file.preview} alt="" className="max-w-full rounded-lg max-h-60 object-contain mx-auto" />
                    ) : (
                      <div className="flex items-center gap-2 text-sm p-1 font-bold">
                        <FileText size={18} />
                        <span className="truncate max-w-[150px]">{file.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="text-[10px] text-slate-600 mt-1 font-bold uppercase tracking-widest px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};