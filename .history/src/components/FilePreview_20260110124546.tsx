import React from 'react';
import type { UploadedFile } from '../types';

interface FilePreviewProps {
  files: UploadedFile[];
  onDescriptionChange: (fileId: string, description: string) => void;
  onRemove: (fileId: string) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  files,
  onDescriptionChange,
  onRemove,
}) => {
  if (files.length === 0) return null;

  return (
    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-gray-900">📎 {files.length} tệp</span>
      </div>
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="flex gap-2 p-2 bg-white rounded-lg border border-gray-200 items-start group">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100">
              {file.type === 'image' && file.preview ? (
                <img src={file.preview} alt={file.name} className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-lg">📄</span>
              )}
            </div>
            
            <button
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
              onClick={() => onRemove(file.id)}
              title="Xóa"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
