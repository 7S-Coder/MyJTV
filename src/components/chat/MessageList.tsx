import React, { useRef, useEffect } from 'react';
import { Message, User, MessageListProps } from '../../types';
const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMessageClick,
  isModerator,
  onDeleteMessage,
  currentUser,
  onTogglePinnedStatus,
}) => {
  console.log('Messages passed to MessageList:', messages); // Vérifiez ici
  const currentUserPseudo = currentUser?.pseudo || ''; // Définit une chaîne vide si le pseudo est undefined
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Génère dynamiquement l'URL complète du badge
  const getCertifBadgeUrl = (): string => {
    const baseUrl = window.location.origin; // Récupère l'URL de base du site
    return `${baseUrl}/certif.png`; // Construit l'URL complète
  };

  useEffect(() => {
    // Scroll automatiquement vers le dernier message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`message ${
            message.mentions?.includes(currentUserPseudo) ? 'highlight' : ''
          }`}
          onClick={() => onMessageClick && onMessageClick(message)}
          ref={index === messages.length - 1 ? messagesEndRef : null} // Associe la référence au dernier message
        >
          <span className="timestamp">
            {new Date(message.timestamp?.toDate()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            &nbsp;
          </span>
          <strong
            className="user-color"
            style={{
              color: message.color || '#fff',
            }}
          >
            {message.badges?.map((badgeUrl, index) => (
              <img
                key={index}
                src={badgeUrl}
                alt="Badge"
                style={{ width: '12px', marginRight: '4px' }}
              />
            ))}
            {message.pseudo || 'User'}
          </strong>:{' '}
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
          {/* Bouton Pencil à la fin du message */}
        </div>
      ))}
    </div>
  );
};

export default MessageList;