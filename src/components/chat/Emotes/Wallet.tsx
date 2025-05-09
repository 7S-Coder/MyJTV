import React from 'react';

interface WalletProps {
  onEmojiSelect: (emoji: string) => void;
}

const Wallet: React.FC<WalletProps> = ({ onEmojiSelect }) => {
  const emojis = ['😀', '😃', '😄', '😅', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '🫠', '😉', '😇', '😤', '😡', '😈', '💀', '😫', '😞', '😭', '🫤', '🥳', '🤯', '🥵', '🥶', '😌', '🙄', '😮‍💨', '🈷️', '💯', '🔥', '🧊'];

  return (
    <div className="emoji-list">
      {emojis.map((emoji) => (
        <span
          key={emoji}
          className="emoji"
          onClick={() => onEmojiSelect(emoji)}
          style={{ cursor: 'pointer', margin: '5px', fontSize: '1.5rem' }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default Wallet;
