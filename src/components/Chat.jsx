import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Assurez-vous que le chemin est correct
import { auth, fetchUserData } from '../firebase/firebaseConfig'; // Importer fetchUserData pour récupérer le pseudo
import '../css/chat.scss';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userPseudo, setUserPseudo] = useState('');
  const [userColors, setUserColors] = useState({});

  const generateRandomColor = () => {
    const colors = ['#FF4500', '#32CD32', '#1E90FF', '#FFD700', '#FF69B4', '#8A2BE2', '#00CED1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    // Récupérer les messages en temps réel depuis Firestore
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Nettoyage de l'écouteur
  }, []);

  useEffect(() => {
    // Récupérer le pseudo de l'utilisateur connecté
    const fetchPseudo = async () => {
      if (auth.currentUser) {
        const userData = await fetchUserData(auth.currentUser.uid);
        if (userData) {
          setUserPseudo(userData.pseudo);
        }
      }
    };
    fetchPseudo();
  }, []);

  useEffect(() => {
    // Assign random colors to users dynamically
    const assignColors = () => {
      const newColors = {};
      messages.forEach((message) => {
        if (!newColors[message.pseudo]) {
          newColors[message.pseudo] = generateRandomColor();
        }
      });
      setUserColors((prevColors) => ({ ...prevColors, ...newColors }));
    };

    assignColors();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        pseudo: userPseudo, // Ajouter le pseudo de l'utilisateur
        timestamp: new Date(),
      });
      setNewMessage(''); // Réinitialiser le champ de saisie
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong
              className="user-color"
              style={{ color: userColors[message.pseudo] || '#fff' }}
            >
              {message.pseudo || 'User'}:
            </strong>{' '}
            {message.text}
          </div>
        ))}
      </div>
      <div className="message-form">
        <input
          type="text"
          placeholder="Envoyer un message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Trigger message send on Enter key press
        />
      </div>
    </div>
  );
};

export default Chat;