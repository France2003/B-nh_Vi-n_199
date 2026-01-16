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
    <div className="mb-4 p-3 bg-hospital-50 rounded-lg border border-hospital-100">
      <div className="flex flex-col gap-3">
        {files.map((file) => (
          <div key={file.id} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200 items-start">
            {file.type === 'image' && file.preview ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-lg text-hospital-700 flex-shrink-0">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
            )}
            <div className="flex-1 flex flex-col gap-2">
              <p className="m-0 font-semibold text-gray-900 text-sm break-words">{file.name}</p>
              <input
                type="text"
                placeholder="Mô tả tệp..."
                value={file.description || ''}
                onChange={(e) => onDescriptionChange(file.id, e.target.value)}
                className="w-full px-3 py-2 border border-hospital-100 rounded text-sm text-gray-900 bg-white font-sans placeholder-gray-400 transition-all focus:outline-none focus:border-hospital-700 focus:shadow-sm"
              />
            </div>
            <button
              className="w-8 h-8 p-0 border-none bg-red-50 text-red-600 rounded text-sm font-bold cursor-pointer transition-all hover:bg-red-100 hover:text-red-700 flex-shrink-0"
              onClick={() => onRemove(file.id)}
              title="Xóa tệp"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
