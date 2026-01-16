import React from 'react';
import type { Message } from '../types';
import './ChatMessage.css';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`chat-message ${message.type}`}>
      <div className="message-content">
        <p className="message-text">{message.content}</p>
        {message.files && message.files.length > 0 && (
          <div className="message-files">
            {message.files.map((file) => (
              <div key={file.id} className="message-file">
                {file.type === 'image' && file.preview ? (
                  <img src={file.preview} alt={file.name} className="message-image" />
                ) : (
                  <div className="message-file-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                  </div>
                )}
                {file.description && (
                  <p className="file-description">{file.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="message-time">
        {message.timestamp.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  );
};
