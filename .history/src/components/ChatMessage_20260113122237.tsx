import React from 'react';
import { User, FileText, Activity, ExternalLink } from 'lucide-react';
import type { Message } from '../types';
import Avatar from '../assets/images/avatar.png';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';

  // Hàm kiểm tra xem nội dung tin nhắn có phải là link NotebookLM hay không
  const isNotebookLink = (text: string) => {
    return typeof text === 'string' && text.trim().startsWith('https://notebooklm.google.com');
  };

  // Lấy link từ content hoặc từ thuộc tính notebookLink
  const notebookUrl = isNotebookLink(message.content) ? message.content.trim() : message.notebookLink;

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-4 items-end max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* AVATAR */}
        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-md border-2
          ${isUser ? 'bg-[#1e5b8d] border-white text-white' : 'bg-white border-blue-100 text-[#1e5b8d]'}`}>
          {isUser ? <User size={20} /> : <img src={Avatar} alt="AI" className="w-full h-full object-cover rounded-xl" />}
        </div>

        {/* BUBBLE */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3 rounded-[20px] shadow-sm text-[15px] leading-relaxed
            ${isUser ? 'bg-[#1e5b8d] text-white rounded-br-none' : 'bg-white text-slate-700 border border-blue-50 rounded-bl-none'}`}>

            <div className={`markdown-content ${isUser ? 'text-white' : 'text-slate-700'} text-[15px] md:text-[16px] leading-relaxed`}>

              {/* NẾU LÀ LINK NOTEBOOK LM: Hiển thị Nút bấm/Icon thay vì text */}
              {!isUser && isNotebookLink(message.content) ? (
                <div className="py-2 min-w-[240px]">
                  <div className="flex items-center gap-2 text-[#1e5b8d] font-bold text-sm mb-3">
                    <Activity size={16} className="animate-pulse" />
                    BÁO CÁO CHIẾN LƯỢC ĐÃ SẴN SÀNG
                  </div>

                  <a
                    href={notebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-slate-50 border-2 border-blue-100 hover:border-[#1e5b8d] p-4 rounded-2xl transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner group-hover:bg-[#1e5b8d] transition-colors">
                      <FileText size={24} className="text-[#1e5b8d] group-hover:text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-[#1e5b8d] text-sm uppercase">Mở Notebook LM</span>
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        XEM TRÊN GOOGLE <ExternalLink size={10} />
                      </span>
                    </div>
                  </a>
                </div>
              ) : (
                /* NẾU LÀ TIN NHẮN THÔNG THƯỜNG: Hiển thị Markdown */
                <>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 border-b pb-1" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 mt-3 border-l-4 border-blue-400 pl-2" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      strong: ({ node, ...props }) => (
                        <strong className={`font-black ${isUser ? 'text-white' : 'text-[#1e5b8d]'}`} {...props} />
                      ),
                      code: ({ node, ...props }) => <code className="bg-slate-100 px-1 rounded text-pink-600 font-mono text-sm" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>

                  {/* Hiển thị nút phụ nếu có notebookLink truyền riêng trong message object */}
                  {message.notebookLink && !isNotebookLink(message.content) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[#1e5b8d] font-bold text-sm">
                        <Activity size={16} /> Báo cáo phân tích chuyên sâu đã sẵn sàng
                      </div>
                      <a
                        href={message.notebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#1e5b8d] hover:bg-[#0d4a73] text-white py-2 px-4 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95"
                      >
                        🚀 TRUY CẬP NOTEBOOK LM
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* FILES ATTACHMENT */}
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

          {/* TIMESTAMP */}
          <span className="text-[10px] text-slate-600 mt-1 font-bold uppercase tracking-widest px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};