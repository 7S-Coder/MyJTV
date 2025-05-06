import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase/firebaseConfig';
import { assignModeratorRoleAutomatically } from '../RoleManager';

interface MessageFormProps {
  onSendMessage: (message: string) => void;
  forbiddenWords: string[];
  currentUserPseudo: string;
  recentPseudos: string[]; // Add recentPseudos prop
}

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage, forbiddenWords, currentUserPseudo, recentPseudos }) => {
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({}); // Stocke les couleurs des utilisateurs
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Référence pour l'input

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { pseudo: data.pseudo, color: data.color || '#fff' }; // Couleur par défaut si non définie
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
        .filter((user) => user !== currentUserPseudo); // Exclut le pseudo de l'utilisateur actuel

      // Combine recentPseudos with matches, ensuring no duplicates
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

  const handleSendMessage = () => {
    if (currentUserPseudo === 'Utilisateur') {
      alert('Vous devez modifier votre pseudo avant d\'envoyer des messages.');
      return;
    }
    if (newMessage.trim() === '') return;

    if (forbiddenWords.some((word) => newMessage.toLowerCase().includes(word))) {
      alert('Votre message contient des mots interdits.');
      return;
    }

    onSendMessage(newMessage);
    setNewMessage('');
    inputRef.current?.blur(); // Retire le focus de l'input pour fermer le clavier sur iOS
  };

  return (
    <div className="message-form" style={{ position: 'relative' }} ref={suggestionsRef}>
      <input
        ref={inputRef} // Associe la référence à l'input
        type="text"
        placeholder="Écrivez votre message..."
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
              style={{ color: userColors[user] || '#fff' }} // Applique la couleur de l'utilisateur
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

