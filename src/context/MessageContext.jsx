import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseConfig';

// Création du contexte pour les messages
const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Écoute des messages en temps réel depuis Firestore
    const q = collection(db, 'messages');
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedMessages = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const messageData = doc.data();
          const userRef = doc(db, 'users', messageData.uid);
          const userDoc = await getDoc(userRef);
          const userBadges = userDoc.exists() && userDoc.data() ? userDoc.data().badges || [] : [];

          return {
            id: doc.id,
            ...messageData,
            badges: userBadges, // Ajoute les badges au message
          };
        })
      );
      console.log('Messages with badges in MessageContext:', fetchedMessages); // Vérifiez ici
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
