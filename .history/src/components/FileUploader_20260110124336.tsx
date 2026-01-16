import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';
import type { UploadedFile } from '../types';

export const FileUploader: React.FC<{ onFilesUpload: (files: UploadedFile[]) => void }> = ({ onFilesUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file' as const,
        file: file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      onFilesUpload(newFiles);
    }
  };

  return (
    <>
      <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleChange} accept="image/*,.pdf,.doc,.docx" />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-slate-500 hover:text-[#1e5b8d] hover:bg-white rounded-full transition-all"
      >
        <Paperclip size={22} />
      </button>
    </>
  );
};