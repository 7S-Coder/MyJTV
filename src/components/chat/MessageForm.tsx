import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase/firebaseConfig';
import { auth } from '../../utils/firebase/firebaseConfig';
import { getUserFromCookies } from '../../utils/cookies';
import Wallet from './Emotes/Wallet';
import emojiRegex from 'emoji-regex'; // Importez la bibliothèque emoji-regex

interface MessageFormProps {
  onSendMessage: (message: string) => void;
  forbiddenWords: string[];
  currentUserPseudo: string;
  recentPseudos: string[];
  enableEmojiPicker?: boolean; // Option to enable/disable emoji picker
}

const MessageForm: React.FC<MessageFormProps> = ({
  onSendMessage,
  forbiddenWords,
  currentUserPseudo,
  recentPseudos,
  enableEmojiPicker = true,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [placeholder, setPlaceholder] = useState('Écrivez votre message...');
  const [users, setUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Nouvel état pour gérer l'affichage du sélecteur d'émojis
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null); // Référence pour la boîte emoji

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
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowEmojiPicker(false); // Ferme la boîte emoji si le clic est en dehors
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setVh);
    setVh(); // Initial call

    return () => window.removeEventListener('resize', setVh);
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

      // Auto-complète si une seule suggestion correspond
      if (combinedSuggestions.length === 1) {
        const updatedMessage = value.replace(/@\w*$/, `@${combinedSuggestions[0]} `);
        setNewMessage(updatedMessage);
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
      e.preventDefault();
    } else if (e.key === 'Tab' && showSuggestions && filteredUsers.length > 0) {
      e.preventDefault();
      // Complète avec la première suggestion
      const updatedMessage = newMessage.replace(/@\w*$/, `@${filteredUsers[0]} `);
      setNewMessage(updatedMessage);
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
    const repeatedLettersPattern = /(.)\1{3,}/;
    const regex = emojiRegex(); // Utilisez emoji-regex pour détecter les emojis

    // Vérifie si le message contient plus de 6 émotes consécutives
    const emojiMatches = newMessage.match(regex);
    if (emojiMatches && emojiMatches.length > 6) {
      setNewMessage('');
      setPlaceholder('Doucement sur les émojis)');
      setTimeout(() => setPlaceholder('Écrivez votre message...'), 2000);
      return;
    }

    // Exclure les mentions combinées avec des emojis de la validation
    const sanitizedMessage = newMessage.replace(/@\w+/g, '').trim();

    // Vérifie si le message contient des mots interdits, plus de trois majuscules consécutives ou des lettres répétées
    if (
      forbiddenWords.some((word) => sanitizedMessage.toLowerCase().includes(word)) ||
      uppercasePattern.test(sanitizedMessage) ||
      repeatedLettersPattern.test(sanitizedMessage)
    ) {
      setNewMessage('');
      setPlaceholder('Message non autorisé');
      setTimeout(() => setPlaceholder('Écrivez votre message...'), 2000);
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
      setShowEmojiPicker(false); // Cache la barre des emojis
      inputRef.current?.blur();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
    inputRef.current?.focus();
  };

  return (
    <>
      {enableEmojiPicker && showEmojiPicker && (
        <div
          className="emoji-picker-container"
          ref={emojiPickerRef}
          style={{
            position: 'absolute',
            bottom: '100%', // Positionne la boîte emoji au-dessus de l'input
            left: 0,
            backgroundColor: '#1f1f23',
            border: '1px solid #333',
            borderRadius: '4px',
            padding: '10px',
            zIndex: 1000,
          }}
        >
          <Wallet onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        enterKeyHint="send"
        value={newMessage}
        onFocus={() => setShowEmojiPicker(false)} // Désactive la boîte emoji au focus
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown} // Utilise la nouvelle fonction handleKeyDown
        style={{ flex: 1 }} // Permet à l'input de prendre tout l'espace disponible
      />
      <div className="emoji">
        <button className='emoji-btn'
          onClick={() => setShowEmojiPicker((prev) => !prev)} // Affiche ou masque la boîte emoji
          style={{
            width: '50px',
            height: '100%',
            backgroundColor: '#1f1f23',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          ☺︎
        </button>
      </div>
      <div className="send-button">
        <button
          className='send-btn'
          onClick={handleSendMessage} // Appelle la fonction handleSendMessage au clic
          style={{
            width: '50px',
            height: '100%',
            backgroundColor: '#1f1f23',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <img src="../../send.png" alt="Envoyer" />
        </button>
      </div>
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
    </>
  );
};

export default MessageForm;

