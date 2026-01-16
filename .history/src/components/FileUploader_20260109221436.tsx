import React, { useState, useRef } from 'react';
import type { UploadedFile } from '../types';

interface FileUploaderProps {
  onFilesUpload: (files: UploadedFile[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesUpload }) => {
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
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer mb-4 ${
        isDragActive 
          ? 'border-hospital-600 bg-hospital-50 shadow-lg shadow-hospital-500/20' 
          : 'border-hospital-700 bg-hospital-50 hover:bg-blue-50 hover:border-hospital-600'
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
        <svg
          className="w-12 h-12 text-hospital-700 mx-auto mb-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <p className="m-0 mb-1 text-base font-semibold text-hospital-700">Kéo và thả tệp hoặc nhấp để chọn</p>
        <p className="m-0 text-sm text-gray-600">Hỗ trợ hình ảnh, PDF, Word, Excel</p>
      </div>
    </div>
  );
};
