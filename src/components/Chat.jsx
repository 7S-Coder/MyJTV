import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Assurez-vous que le chemin est correct
import { auth, fetchUserData } from '../firebase/firebaseConfig'; // Importer fetchUserData pour récupérer le pseudo
import '../css/chat.scss';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userPseudo, setUserPseudo] = useState('');
  const [userColors, setUserColors] = useState({});
  const messagesEndRef = useRef(null); // Reference to the end of the messages container

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
    // Assign colors to users based on their Firestore data
    const assignColors = async () => {
      const newColors = {};
      for (const message of messages) {
        if (!message.uid) {
          console.warn(`Message sans UID détecté :`, message);
          continue;
        }
        if (!newColors[message.pseudo] && !userColors[message.pseudo]) {
          const userData = await fetchUserData(message.uid); // Récupère les données utilisateur
          if (userData && userData.color) {
            newColors[message.pseudo] = userData.color; // Utilise la couleur stockée
            console.log(`Couleur assignée à ${message.pseudo}: ${userData.color}`); // Log pour vérifier
          }
        }
      }
      setUserColors((prevColors) => ({ ...prevColors, ...newColors }));
    };

    assignColors();
  }, [messages]);

  useEffect(() => {
    // Scroll to the most recent message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Trigger scrolling when messages change

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
    <div className="chat-container scroller">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            {/* Affiche l'heure du message */}
            <span className="timestamp">
              {new Date(message.timestamp?.toDate()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })} : 
            </span>
            <strong
              className="user-color"
              style={{ color: userColors[message.pseudo] || '#fff' }} // Applique la couleur récupérée
            >
              {message.pseudo || 'User'}:
            </strong>{' '}
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Invisible div to scroll into view */}
      </div>
      <div className="message-form">
        <input
          type="text"
          placeholder="Écrivez votre message..."
          enterKeyHint="send" // Affiche "Envoyer" sur le clavier
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage(); // Fonction pour envoyer le message
              e.preventDefault(); // Empêche le saut de ligne
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chat;