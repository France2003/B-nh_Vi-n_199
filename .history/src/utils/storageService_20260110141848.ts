import type { Message, UploadedFile } from '../types';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'hospital_199_conversations';
const CURRENT_CONVERSATION_KEY = 'current_conversation_id';

export const storageService = {
  // Lấy tất cả cuộc trò chuyện
  getAllConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const conversations = JSON.parse(data);
      // Chuyển đổi string timestamps thành Date objects
      return conversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  },

  // Lấy cuộc trò chuyện theo ID
  getConversation(id: string): Conversation | null {
    const conversations = this.getAllConversations();
    return conversations.find(c => c.id === id) || null;
  },

  // Tạo cuộc trò chuyện mới
  createConversation(title: string, messages: Message[] = []): Conversation {
    const id = Date.now().toString();
    const conversation: Conversation = {
      id,
      title,
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const conversations = this.getAllConversations();
    conversations.unshift(conversation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    
    return conversation;
  },

  // Lưu cuộc trò chuyện
  saveConversation(conversation: Conversation): void {
    const conversations = this.getAllConversations();
    const index = conversations.findIndex(c => c.id === conversation.id);
    
    const updatedConversation = {
      ...conversation,
      updatedAt: new Date(),
    };

    if (index >= 0) {
      conversations[index] = updatedConversation;
    } else {
      conversations.unshift(updatedConversation);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  },

  // Cập nhật messages của cuộc trò chuyện
  updateConversationMessages(conversationId: string, messages: Message[]): void {
    const conversation = this.getConversation(conversationId);
    if (conversation) {
      conversation.messages = messages;
      this.saveConversation(conversation);
    }
  },

  // Xóa cuộc trò chuyện
  deleteConversation(id: string): void {
    const conversations = this.getAllConversations();
    const filtered = conversations.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Lấy cuộc trò chuyện hiện tại
  getCurrentConversationId(): string | null {
    return localStorage.getItem(CURRENT_CONVERSATION_KEY);
  },

  // Đặt cuộc trò chuyện hiện tại
  setCurrentConversationId(id: string): void {
    localStorage.setItem(CURRENT_CONVERSATION_KEY, id);
  },

  // Xóa cuộc trò chuyện hiện tại
  clearCurrentConversationId(): void {
    localStorage.removeItem(CURRENT_CONVERSATION_KEY);
  },

  // Tìm kiếm cuộc trò chuyện
  searchConversations(query: string): Conversation[] {
    const conversations = this.getAllConversations();
    const lowerQuery = query.toLowerCase();
    return conversations.filter(
      c =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.messages.some(m => m.content.toLowerCase().includes(lowerQuery))
    );
  },
};
