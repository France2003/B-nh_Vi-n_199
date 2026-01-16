import React from 'react';
import { X, FileText } from 'lucide-react';
import type { UploadedFile } from '../types';

interface Props {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

export const FilePreview: React.FC<Props> = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {files.map((file) => (
        <div key={file.id} className="group relative flex items-center gap-2 p-1.5 bg-white border border-blue-100 rounded-lg shadow-sm">
          <div className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 overflow-hidden">
            {file.type === 'image' && file.preview ? (
              <img src={file.preview} alt="" className="w-full h-full object-cover" />
            ) : (
              <FileText size={16} className="text-[#1e5b8d]" />
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-600 truncate max-w-[120px]">{file.name}</span>
          <button
            onClick={() => onRemove(file.id)}
            className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  );
};