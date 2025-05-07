import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase/firebaseConfig';
import { auth } from '../../utils/firebase/firebaseConfig';
import { getUserFromCookies } from '../../utils/cookies';

interface MessageFormProps {
  onSendMessage: (message: string) => void;
  forbiddenWords: string[];
  currentUserPseudo: string;
  recentPseudos: string[];
}

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage, forbiddenWords, currentUserPseudo, recentPseudos }) => {
  const [newMessage, setNewMessage] = useState('');
  const [placeholder, setPlaceholder] = useState('Écrivez votre message...');
  const [users, setUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({});
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { pseudo: data.pseudo, color: data.color || '#fff' };
        });
        setUsers(userList.map((user) => user.pseudo));
        setUserColors(
          userList.reduce((acc, user) => {
            acc[user.pseudo] = user.color;
            return acc;
          }, {} as { [key: string]: string })
        );
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (value: string) => {
    setNewMessage(value);

    const mentionMatch = value.match(/@(\w*)$/);
    if (mentionMatch) {
      const searchTerm = mentionMatch[1].toLowerCase();
      const matches = users
        .filter((user) => user.toLowerCase().startsWith(searchTerm))
        .filter((user) => user !== currentUserPseudo);

      const combinedSuggestions = [...new Set([...recentPseudos, ...matches])];
      setFilteredUsers(combinedSuggestions);
      setShowSuggestions(combinedSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectUser = (user: string) => {
    const updatedMessage = newMessage.replace(/@\w*$/, `@${user} `);
    setNewMessage(updatedMessage);
    setShowSuggestions(false);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const uppercasePattern = /[A-Z]{3,}/;
    const repeatedLettersPattern = /(.)\1{2,}/; // Détecte trois lettres identiques ou plus qui se suivent

    // Vérifie si le message contient des mots interdits, plus de trois majuscules consécutives ou des lettres répétées
    if (
      forbiddenWords.some((word) => newMessage.toLowerCase().includes(word)) ||
      uppercasePattern.test(newMessage) ||
      repeatedLettersPattern.test(newMessage)
    ) {
      setNewMessage(''); // Clear the input field
      setPlaceholder('Message non autorisé'); // Show error message
      setTimeout(() => setPlaceholder('Écrivez votre message...'), 9000); // Reset placeholder after 3 seconds
      return;
    }

    try {
      const mentions = newMessage.match(/@\w+/g)?.map((mention) => mention.substring(1)) || [];
      const savedUser = getUserFromCookies();

      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        pseudo: savedUser?.pseudo || currentUserPseudo,
        color: savedUser?.color || '#fff',
        uid: auth.currentUser?.uid,
        timestamp: new Date(),
        mentions,
      });

      setNewMessage('');
      inputRef.current?.blur();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  return (
    <div className="message-form" style={{ position: 'relative' }} ref={suggestionsRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        enterKeyHint="send"
        value={newMessage}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
            e.preventDefault();
          }
        }}
      />
      {showSuggestions && (
        <ul className="mention-suggestions">
          {filteredUsers.map((user) => (
            <li
              key={user}
              onClick={() => handleSelectUser(user)}
              style={{ color: userColors[user] || '#fff' }}
            >
              {user}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageForm;

