import React from 'react';
import { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  onMessageClick: (message: Message) => void;
  isModerator: boolean;
  onDeleteMessage: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onMessageClick, isModerator, onDeleteMessage }) => {
  return (
    <div className="messages">
      {messages.map((message) => (
        <div
          key={message.id}
          className="message"
          onClick={() => onMessageClick(message)}
        >
          <span className="timestamp">
            {new Date(message.timestamp?.toDate()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })} :
          </span>
          <strong
            className="user-color"
            style={{
              color: message.color || '#fff',
            }}
          >
            {message.pseudo || 'User'}:
          </strong>{' '}
          {message.text}
          {isModerator && (
            <button
              className="delete-button"
              onClick={() => onDeleteMessage(message.id)}
            >
              Supprimer
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;