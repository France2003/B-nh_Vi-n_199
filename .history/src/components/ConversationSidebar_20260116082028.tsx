import React, { useState } from 'react';
import { Menu, X, Plus, Trash2, Search } from 'lucide-react';
import type { Conversation } from '../utils/storageService';
import { storageService } from '../utils/storageService';
import { motion, AnimatePresence } from 'framer-motion';
interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const filteredConversations = searchQuery
    ? storageService.searchConversations(searchQuery)
    : conversations;

  const handleSelectConversation = (id: string) => {
    onSelectConversation(id);
    setIsOpen(false);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-24 left-4 z-50 p-2 bg-[#1e5b8d] text-white rounded-lg shadow-lg hover:bg-[#2a7bb7] transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen md:h-[calc(100vh-180px)] w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 shrink-0">
          <button
            onClick={() => {
              onNewConversation();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#1e5b8d] to-[#2a7bb7] text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <Plus size={18} />
            Cuộc trò chuyện mới
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200 shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1e5b8d]"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có cuộc trò chuyện'}
            </div>
          ) : (
            <div className="space-y-2 p-3">
              <AnimatePresence initial={false}>
                {filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    layout
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -40, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer group transition-colors
          ${currentConversationId === conversation.id
                        ? 'bg-blue-50 border-l-4 border-[#1e5b8d]'
                        : 'hover:bg-gray-50'}
        `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {conversation.title}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium">
                          {formatDate(conversation.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleDeleteConversation(e, conversation.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-500"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-gray-200 shrink-0 bg-gray-50 text-xs text-gray-600">
          <p>Tổng: {conversations.length} cuộc trò chuyện</p>
        </div>
        <AnimatePresence>
          {confirmDeleteId && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute bottom-6 left-4 right-4 z-50"
            >
              <div className="bg-white border border-red-200 shadow-2xl rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-800">
                  🗑️ Xóa cuộc trò chuyện?
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Hành động này không thể hoàn tác.
                </p>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-300
            hover:bg-gray-100 transition"
                  >
                    Hủy
                  </button>

                  <button
                    onClick={() => {
                      onDeleteConversation(confirmDeleteId);
                      setConfirmDeleteId(null);
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg
            bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
