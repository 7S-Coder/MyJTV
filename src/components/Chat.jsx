import React from 'react';
import '../css/chat.scss';

const Chat = () => {
  const messages = [
    { id: 1, text: 'Hello!' },
    { id: 2, text: 'How are you?' },
  ];

  const handleSendMessage = () => {
    console.log('Message envoyé!');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong>User:</strong> {message.text}
          </div>
        ))}
      </div>
      <div className="message-form">
        <input type="text" placeholder="Envoyer un message" />
        <button onClick={handleSendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default Chat;
