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
    <div className="mb-5 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-sm">
      <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
        <span>📎</span> Tệp đã tải lên ({files.length})
      </h3>
      <div className="flex flex-col gap-3">
        {files.map((file) => (
          <div key={file.id} className="flex gap-3 p-3 bg-white rounded-xl border border-blue-200 items-start shadow-sm hover:shadow-md transition-shadow group">
            {file.type === 'image' && file.preview ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg text-blue-600 flex-shrink-0">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
            )}
            <div className="flex-1 flex flex-col gap-2">
              <p className="m-0 font-semibold text-gray-900 text-sm break-all leading-tight">{file.name}</p>
              <input
                type="text"
                placeholder="Thêm mô tả (không bắt buộc)..."
                value={file.description || ''}
                onChange={(e) => onDescriptionChange(file.id, e.target.value)}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-xs text-gray-900 bg-white font-sans placeholder-gray-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
              onClick={() => onRemove(file.id)}
              title="Xóa tệp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
