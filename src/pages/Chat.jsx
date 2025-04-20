import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import '../css/chat.scss'; // Ensure this matches the renamed file

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Écoute l'état de l'authentification
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Récupération des messages en temps réel
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) {
      console.warn("Le message est vide, envoi annulé.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        createdBy: user?.displayName || "Anonyme",
        userId: user?.uid || "anonyme",
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error.message);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong>{message.createdBy}:</strong> {message.text}
          </div>
        ))}
      </div>
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          id="message-input" // Ajout d'un id
          name="message" // Ajout d'un name
          type="text"
          placeholder="Écrivez un message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={!user}
        >
          Envoyer
        </button>
      </form>
      {!user && <p className="login-warning">Connectez-vous pour envoyer des messages.</p>}
    </div>
  );
};

export default Chat;
