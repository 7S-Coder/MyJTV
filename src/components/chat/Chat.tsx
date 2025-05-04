import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { auth, fetchUserData } from '../../firebase/firebaseConfig';
import { getUserFromCookies, setUserCookies } from '../../utils/cookies';
import { assignModeratorRoleAutomatically } from '../RoleManager';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import AdminModal from './AdminModal';
import { Message, User } from '../../types';
import '../../css/chat.scss';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userPseudo, setUserPseudo] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const forbiddenWords = ['hitler'];

  const isModerator = (user: User | null) => user?.role === 'moderator';

  const isAdmin = (user: User | null) => user?.role === 'admin' || user?.role === 'moderator';

  const fetchUserWithRole = async (user: User | null): Promise<User | null> => {
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
      })) as Message[];
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
        if (!auth.currentUser) return; // Vérification explicite
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

  const handleSendMessage = async (message: string) => {
    try {
      const savedUser = getUserFromCookies();
      await addDoc(collection(db, 'messages'), {
        text: message,
        pseudo: savedUser?.pseudo || userPseudo,
        color: savedUser?.color || '#fff',
        uid: auth.currentUser?.uid,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const savedUser = getUserFromCookies();

      if (!auth.currentUser) {
        alert('Vous devez être connecté pour supprimer un message.');
        return;
      }

      const messageRef = doc(db, 'messages', messageId);
      await deleteDoc(messageRef);

      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du message :', error);
    }
  };

  const handleOpenModal = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="chat-container scroller">
      <MessageList
        messages={messages}
        onMessageClick={async (message) => {
          let savedUser = getUserFromCookies();
          savedUser = await fetchUserWithRole(savedUser);

          if (isAdmin(savedUser)) {
            handleOpenModal(message);
          } else {
            alert('Vous n\'avez pas les permissions nécessaires.');
          }
        }}
        isModerator={isModerator(getUserFromCookies())}
        onDeleteMessage={handleDeleteMessage}
      />
      <MessageForm onSendMessage={handleSendMessage} forbiddenWords={forbiddenWords} />
      {isModalOpen && (
        <AdminModal
          selectedMessage={selectedMessage}
          onDeleteMessage={handleDeleteMessage}
          onClose={handleCloseModal}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chat;