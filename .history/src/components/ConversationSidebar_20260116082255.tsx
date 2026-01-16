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

  const handleDeleteConversation = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-24 left-4 z-50 p-2 bg-[#1e5b8d] text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen md:h-[calc(100vh-180px)] 
        w-64 bg-white  z-40 transform transition-transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <button
            onClick={() => {
              onNewConversation();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3
            bg-linear-to-r from-[#1e5b8d] to-[#2a7bb7] text-white rounded-lg font-semibold"
          >
            <Plus size={18} />
            Cuộc trò chuyện mới
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {filteredConversations.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className={`p-3 rounded-lg cursor-pointer group
                ${currentConversationId === c.id
                    ? 'bg-blue-50 border-l-4 border-[#1e5b8d]'
                    : 'hover:bg-gray-50'}`}
                onClick={() => handleSelectConversation(c.id)}
              >
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{c.title}</p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {formatDate(c.createdAt)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDeleteConversation(e, c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-3 text-xs text-gray-600 border-t bg-gray-50">
          Tổng: {conversations.length} cuộc trò chuyện
        </div>
      </aside>

      {/* ===== CONFIRM DELETE MODAL ===== */}
      <AnimatePresence>
        {confirmDeleteId && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteId(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              w-[90%] max-w-sm bg-white rounded-xl shadow-2xl p-5"
            >
              <h3 className="text-sm font-bold text-gray-800">
                🗑️ Xóa cuộc trò chuyện?
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Hành động này không thể hoàn tác.
              </p>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 text-xs border rounded-lg hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    onDeleteConversation(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="px-4 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
