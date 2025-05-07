import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, fetchUserData } from '../../utils/firebase/firebaseConfig';
import { getUserFromCookies, setUserCookies } from '../../utils/cookies';
import { assignModeratorRoleAutomatically } from '../RoleManager.tsx';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import AdminModal from './AdminModal';
import { Message, User } from '../../types';
import '../../css/chat.scss';
import { useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userPseudo, setUserPseudo] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentPseudos, setRecentPseudos] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const forbiddenWords = ['hitler', '/[A-Z]{3,}/' , 'salope', 'connard', 'enculé', 'merde', 'fils de pute', 'fdp', 'merde', 'putain', 'pute', 'connasse'];

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
    const savedUser = getUserFromCookies();
    if (savedUser?.pseudo === 'Utilisateur' && auth.currentUser?.emailVerified) {
      navigate('/update-pseudo'); // Redirige uniquement si l'email est vérifié
    }
  }, [navigate]);

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
          const userWithRole: User = {
            ...auth.currentUser,
            pseudo: userData.pseudo,
            color: userData.color,
            role: userData.role || 'user',
            email: auth.currentUser.email || '', // S'assure que l'email est toujours une chaîne
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
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    scrollToBottom();
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update the list of the last three unique pseudonyms whenever messages change
    const uniquePseudos = [...new Set(messages.map((msg) => msg.pseudo))];
    setRecentPseudos(uniquePseudos.slice(-3));
  }, [messages]);

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
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat</h1>
      </div>
      <div className="messages">
        <MessageList
          messages={messages}
          onMessageClick={async (message) => {
            let savedUser = getUserFromCookies();
            savedUser = await fetchUserWithRole(savedUser);

            if (isAdmin(savedUser)) {
              handleOpenModal(message);
            }
          }}
          isModerator={isModerator(getUserFromCookies())}
          onDeleteMessage={handleDeleteMessage}
          currentUser={getUserFromCookies()}
        />
      </div>
      <div className="message-form">
        <MessageForm
          onSendMessage={() => {}} // Simplified callback
          forbiddenWords={forbiddenWords}
          currentUserPseudo={getUserFromCookies()?.pseudo || ''}
          recentPseudos={recentPseudos}
        />
      </div>
      {isModalOpen && (
        <AdminModal
          selectedMessage={selectedMessage}
          onDeleteMessage={handleDeleteMessage}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Chat;