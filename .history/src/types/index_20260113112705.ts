export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  notebookLink?: string;
  files?: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'file';
  file: File;
  preview?: string;
  // description?: string;
}

export interface ChatState {
  messages: Message[];
  uploadedFiles: UploadedFile[];
  isLoading: boolean;
}
