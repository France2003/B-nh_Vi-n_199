import React from 'react';
import { X, FileText } from 'lucide-react';
import type { UploadedFile } from '../types';

interface FilePreviewProps {
  files: UploadedFile[];
  onRemove: (fileId: string) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {files.map((file) => (
        <div key={file.id} className="group relative flex items-center gap-2 p-2 bg-white rounded-xl border border-blue-100 shadow-sm animate-in zoom-in duration-200">
          {/* Thumbnail */}
          <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 overflow-hidden">
            {file.type === 'image' && file.preview ? (
              <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
            ) : (
              <FileText size={16} className="text-[#1e5b8d]" />
            )}
          </div>

          {/* Tên file */}
          <span className="text-[11px] font-semibold text-slate-600 truncate max-w-[100px]">
            {file.name}
          </span>

          {/* Nút xóa */}
          <button
            onClick={() => onRemove(file.id)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  );
};