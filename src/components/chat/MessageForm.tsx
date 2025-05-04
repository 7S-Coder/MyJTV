import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

type MessageFormProps = {
  onSendMessage: (message: string) => void;
  forbiddenWords: string[];
  currentUserPseudo: string; // Ajout du pseudo de l'utilisateur actuel
};

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage, forbiddenWords, currentUserPseudo }) => {
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({}); // Store user colors
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { pseudo: data.pseudo, color: data.color || '#fff' }; // Default color if not set
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
        .filter((user) => user !== currentUserPseudo); // Exclure le pseudo de l'utilisateur actuel
      setFilteredUsers(matches);
      setShowSuggestions(matches.length > 0);
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
    if (newMessage.trim() === '') return;

    if (forbiddenWords.some((word) => newMessage.toLowerCase().includes(word))) {
      alert('Votre message contient des mots interdits.');
      return;
    }

    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="message-form" style={{ position: 'relative' }} ref={suggestionsRef}>
      <input
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
              style={{ color: userColors[user] || '#fff' }} // Apply user color
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

// Add CSS for the suggestions dropdown
// .mention-suggestions {
//   position: absolute;
//   background: white;
//   border: 1px solid #ccc;
//   list-style: none;
//   margin: 0;
//   padding: 0;
//   max-height: 150px;
//   overflow-y: auto;
//   z-index: 1000;
// }
// .mention-suggestions li {
//   padding: 5px 10px;
//   cursor: pointer;
// }
// .mention-suggestions li:hover {
//   background: #f0f0f0;
// }