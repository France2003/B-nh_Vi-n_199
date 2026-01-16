export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  files?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  file: File;
  preview?: string;
  description?: string;
}

export interface ChatState {
  messages: Message[];
  uploadedFiles: Attachment[];
  isLoading: boolean;
}
