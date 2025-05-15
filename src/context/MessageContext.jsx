import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseConfig';

// Création du contexte pour les messages
const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Écoute des messages en temps réel depuis Firestore
    const q = collection(db, 'messages');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const addMessage = async (newMessage) => {
    try {
      await addDoc(collection(db, 'messages'), newMessage);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du message :', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Erreur lors de la suppression du message :', error);
    }
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage, deleteMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
