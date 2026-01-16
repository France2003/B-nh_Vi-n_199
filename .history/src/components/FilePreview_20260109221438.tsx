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
    <div className="file-preview-container">
      <div className="file-preview-list">
        {files.map((file) => (
          <div key={file.id} className="file-preview-item">
            {file.type === 'image' && file.preview ? (
              <div className="image-preview">
                <img src={file.preview} alt={file.name} />
              </div>
            ) : (
              <div className="file-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
            )}
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <input
                type="text"
                placeholder="Mô tả tệp..."
                value={file.description || ''}
                onChange={(e) => onDescriptionChange(file.id, e.target.value)}
                className="file-description-input"
              />
            </div>
            <button
              className="remove-button"
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
