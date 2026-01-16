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
    <div className="flex flex-wrap gap-2 mb-2 p-2">
      {files.map((file) => (
        <div key={file.id} className="relative group w-16 h-16 bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
          {file.type === 'image' && file.preview ? (
            <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <FileText size={20} className="text-blue-500" />
            </div>
          )}
          <button
            onClick={() => onRemove(file.id)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};