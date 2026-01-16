import React from 'react';
import { User, FileText } from 'lucide-react';
import type { Message } from '../types';
import Avatar from '../assets/images/avatar.png';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';
  const formatContent = (text: string) => {
    if (!text) return '';

    return text
      // Chuẩn hóa xuống dòng
      .replace(/\r\n/g, '\n')

      // Đảm bảo mỗi dấu * là đầu dòng
      .replace(/\s*\*\s*/g, '\n- ')

      // Heading: số + nội dung + :
      .replace(/(^|\n)(\d+\.\s.*?):/g, '\n## $2')

      // Heading thường kết thúc bằng :
      .replace(/(^|\n)([^-\n].*?):(?=\n|$)/g, '\n## $2')

      // Dọn dòng trống dư
      .replace(/\n{3,}/g, '\n\n')

      .trim();
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-4 items-end max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* AVATAR */}
        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-md border-2
          ${isUser ? 'bg-[#1e5b8d] border-white text-white' : 'bg-white border-blue-100 text-[#1e5b8d]'}`}>
          {isUser ? <User size={20} /> : <img src={Avatar} className="font-black text-[10px]"></img>}
        </div>
        {/* BUBBLE */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3 rounded-[20px] shadow-sm text-[15px] leading-relaxed
            ${isUser ? 'bg-[#1e5b8d] text-white rounded-br-none' : 'bg-white text-slate-700 border border-blue-50 rounded-bl-none'}`}>
            <div className={`markdown-content ${isUser ? 'text-white' : 'text-slate-700'} text-[15px] md:text-[16px] leading-relaxed`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Tối ưu các thẻ xuống dòng và khoảng cách
                  p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 border-b pb-1" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 mt-3 border-l-4 border-blue-400 pl-2" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  // Làm nổi bật chữ đậm trong tin nhắn bot
                  strong: ({ node, ...props }) => (
                    <strong className={`font-black ${isUser ? 'text-white' : 'text-[#1e5b8d]'}`} {...props} />
                  ),
                  code: ({ node, ...props }) => <code className="bg-slate-100 px-1 rounded text-pink-600 font-mono text-sm" {...props} />,
                }}
              >
                {formatContent(message.content)}
              </ReactMarkdown>
            </div>
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