import React, { useState } from 'react';

type MessageFormProps = {
  onSendMessage: (message: string) => void;
  forbiddenWords: string[];
};

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage, forbiddenWords }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    if (forbiddenWords.some((word) => newMessage.toLowerCase().includes(word))) {
      alert('Votre message contient des mots interdits.');
      return;
    }

    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="message-form">
      <input
        type="text"
        placeholder="Écrivez votre message..."
        enterKeyHint="send"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
            e.preventDefault();
          }
        }}
      />
    </div>
  );
};

export default MessageForm;