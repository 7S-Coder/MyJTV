import React, { useState } from 'react';

interface WalletProps {
  onEmojiSelect: (emoji: string) => void;
}

const Wallet: React.FC<WalletProps> = ({ onEmojiSelect }) => {
  const [showEmojis, setShowEmojis] = useState(false);

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '🫠', '😉', '😇', '😤', '😡', '😈', '💀', '😫', '😞', '😭', '🫤', '🥳', '🤯', '🥵', '🥶', '😌', '🙄', '😮‍💨', '🈷️', '💯', '🔥', '🧊'];

  return (
    <div className="emoji">
      <button onClick={() => setShowEmojis(!showEmojis)}>
        {showEmojis ? 'X' : '👆'}
      </button>
      {showEmojis && (
        <div className="emoji-list">
          {emojis.map((emoji) => (
            <span
              key={emoji}
              className="emoji"
              onClick={() => {
                onEmojiSelect(emoji);
                setShowEmojis(false);
              }}
              style={{ cursor: 'pointer', margin: '5px', fontSize: '1.5rem' }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wallet;
