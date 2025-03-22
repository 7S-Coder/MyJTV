import React from 'react';

const Chat = () => {
  const messages = [
    { id: 1, text: 'Hello!' },
    { id: 2, text: 'How are you?' },
  ];

  const handleSendMessage = () => {
    console.log('Message sent!');
  };

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <input type="text" placeholder="Envoyer un message" />
      <button onClick={handleSendMessage}>Envoyer</button>
    </div>
  );
};

export default Chat;
