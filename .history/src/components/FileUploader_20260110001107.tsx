import React, { useState, useRef } from 'react';
import type { UploadedFile } from '../types';

interface FileUploaderProps {
  onFilesUpload: (files: UploadedFile[]) => void;
  showLabel?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesUpload, showLabel = true }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFiles = (files: FileList) => {
    const uploadedFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        type: isImage ? 'image' : 'file',
        file,
      };

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      uploadedFiles.push(uploadedFile);
    });

    onFilesUpload(uploadedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer mb-5 ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
          : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleChange}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        className="hidden"
      />
      <div className="pointer-events-none">
        <div className="text-4xl mb-3">📁</div>
        <p className="m-0 mb-2 text-base font-bold text-blue-900">Kéo thả file tại đây</p>
        <p className="m-0 text-sm text-blue-600 mb-3">hoặc nhấp để chọn từ máy tính</p>
        <p className="m-0 text-xs text-blue-500">Hỗ trợ: Hình ảnh, PDF, Word, Excel</p>
      </div>
    </div>
  );
};
