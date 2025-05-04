import React from 'react';
import { Message, User } from '../../types';

interface MessageListProps {
  messages: Message[];
  onMessageClick: (message: Message) => void;
  isModerator: boolean;
  onDeleteMessage: (messageId: string) => void;
  currentUser: User | null;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMessageClick,
  isModerator,
  onDeleteMessage,
  currentUser,
}) => {
  const currentUserPseudo = currentUser?.pseudo || ''; // Définit une chaîne vide si pseudo est undefined

  return (
    <div className="messages">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${
            message.mentions?.includes(currentUserPseudo) ? 'highlight' : ''
          }`}
          onClick={() => onMessageClick(message)}
        >
          <span className="timestamp">
            {new Date(message.timestamp?.toDate()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            :
          </span>
          <strong
            className="user-color"
            style={{
              color: message.color || '#fff',
            }}
          >
            {message.pseudo || 'User'}:
          </strong>{' '}
          {message.text.split(' ').map((word, index) =>
            word.startsWith('@') ? (
              <span
                key={index}
                className={`mention ${
                  word.substring(1) === currentUserPseudo
                    ? 'mention-current-user'
                    : ''
                }`}
              >
                {word}
              </span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
          {isModerator && (
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // Empêche le clic de se propager
                onDeleteMessage(message.id);
              }}
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