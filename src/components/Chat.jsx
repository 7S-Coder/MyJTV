import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Assurez-vous que le chemin est correct
import { auth, fetchUserData, getUserFromCookies } from '../firebase/firebaseConfig'; // Importer fetchUserData et getUserFromCookies
import '../css/chat.scss';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userPseudo, setUserPseudo] = useState('');
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
    const savedUser = getUserFromCookies(); // Récupère l'utilisateur depuis les cookies
    if (savedUser) {
      setUserPseudo(savedUser.pseudo);
    } else if (auth.currentUser) {
      const fetchPseudo = async () => {
        const userData = await fetchUserData(auth.currentUser.uid);
        if (userData) {
          setUserPseudo(userData.pseudo);
        }
      };
      fetchPseudo();
    }
  }, []);

  useEffect(() => {
    // Scroll to the most recent message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Trigger scrolling when messages change

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const savedUser = getUserFromCookies(); // Récupère la couleur depuis les cookies
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        pseudo: savedUser?.pseudo || userPseudo, // Utilise le pseudo depuis les cookies ou l'état
        color: savedUser?.color || '#fff', // Utilise la couleur depuis les cookies ou par défaut
        uid: auth.currentUser?.uid, // Inclure l'UID de l'utilisateur connecté
        timestamp: new Date(), // Ajouter un horodatage
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
            <span className="timestamp">
              {new Date(message.timestamp?.toDate()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })} :
            </span> 
            <strong
              className="user-color"
              style={{
                color: message.color || '#fff', // Utilise la couleur directement depuis le message
              }}
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