import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { auth, fetchUserData } from '../firebase/firebaseConfig';
import { getUserFromCookies, setUserCookies } from '../utils/cookies';
import { assignModeratorRoleAutomatically } from './RoleManager';
import '../css/chat.scss';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userPseudo, setUserPseudo] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const forbiddenWords = ['hitler'];

  const isModerator = (user) => {
    return user?.role === 'moderator';
  };

  const isAdmin = (user) => {
    return user?.role === 'admin' || user?.role === 'moderator';
  };

  const fetchUserWithRole = async (user) => {
    if (!user) return null;

    if (user.role) {
      return user;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { ...user, role: userData.role };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle utilisateur :', error);
    }

    return user;
  };

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedUser = getUserFromCookies();
    if (savedUser) {
      setUserCookies(savedUser);
      assignModeratorRoleAutomatically(savedUser);
      setUserPseudo(savedUser.pseudo);
    } else if (auth.currentUser) {
      const fetchPseudo = async () => {
        const userData = await fetchUserData(auth.currentUser.uid);
        if (userData) {
          const userWithRole = {
            ...auth.currentUser,
            pseudo: userData.pseudo,
            color: userData.color,
            role: userData.role || 'user',
          };
          setUserCookies(userWithRole);
          assignModeratorRoleAutomatically(userWithRole);
          setUserPseudo(userData.pseudo);
        }
      };
      fetchPseudo();
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    if (forbiddenWords.some((word) => newMessage.toLowerCase().includes(word))) {
      alert('Votre message contient des mots interdits.');
      return;
    }

    try {
      const savedUser = getUserFromCookies();
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        pseudo: savedUser?.pseudo || userPseudo,
        color: savedUser?.color || '#fff',
        uid: auth.currentUser?.uid,
        timestamp: new Date(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const savedUser = getUserFromCookies();
      console.log('Utilisateur récupéré pour suppression :', savedUser);

      // Vérifiez si l'utilisateur est authentifié
      if (!auth.currentUser) {
        alert('Vous devez être connecté pour supprimer un message.');
        return;
      }

      console.log('Suppression autorisée pour l\'utilisateur :', auth.currentUser.uid);

      // Utilisez deleteDoc avec une référence au document
      const messageRef = doc(db, 'messages', messageId);
      await deleteDoc(messageRef);

      setIsModalOpen(false); // Fermer la modale après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression du message :', error);
    }
  };

  const handleOpenModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="chat-container scroller">
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className="message"
            onClick={async () => {
              let savedUser = getUserFromCookies();
              savedUser = await fetchUserWithRole(savedUser);

              if (isAdmin(savedUser)) {
                handleOpenModal(message);
              } else {
                alert('Vous n\'avez pas les permissions nécessaires.');
              }
            }}
          >
            <span className="timestamp">
              {new Date(message.timestamp?.toDate()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })} :
            </span> 
            <strong
              className="user-color"
              style={{
                color: message.color || '#fff',
              }}
            >
              {message.pseudo || 'User'}:
            </strong>{' '}
            {message.text}
            {isModerator(getUserFromCookies()) && (
              <button
                className="delete-button"
                onClick={() => handleDeleteMessage(message.id)}
              >
                Supprimer
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
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

      {isModalOpen && selectedMessage && (
        <div className="modal">
          <div className="modal-content">
            <h3>Actions Admin</h3>
            <p>Message : {selectedMessage.text}</p>
            <p>Utilisateur : {selectedMessage.pseudo}</p>
            <button onClick={() => handleDeleteMessage(selectedMessage.id)}>Supprimer le message</button>
            <button onClick={handleCloseModal}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;