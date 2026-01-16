import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface SaveConversationDialogProps {
  isOpen: boolean;
  currentTitle: string;
  onSave: (title: string) => void;
  onCancel: () => void;
}

export const SaveConversationDialog: React.FC<SaveConversationDialogProps> = ({
  isOpen,
  currentTitle,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(currentTitle || 'Cuộc trò chuyện mới');

  if (!isOpen) return null;

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Lưu cuộc trò chuyện</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên cuộc trò chuyện
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên cuộc trò chuyện..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1e5b8d] focus:ring-1 focus:ring-[#1e5b8d]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-linear-to-r from-[#1e5b8d] to-[#2a7bb7] text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};
