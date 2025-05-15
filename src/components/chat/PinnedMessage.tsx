import React from 'react';
import { Message } from '../../types';
import "../../css/PinnedMessage.scss"; // Assurez-vous que le fichier CSS existe
import { Pin } from 'lucide-react';

interface PinnedMessageProps {
  pinnedMessage: Message | null;
}

const PinnedMessage: React.FC<PinnedMessageProps> = ({ pinnedMessage }) => {
  if (!pinnedMessage) return null;

  return (
    <div className="pinned-message">
      <p>
        <Pin  size={16} color="#ffffff" /> &nbsp; <em>Épinglé par </em> &nbsp; {pinnedMessage.pseudo}
      </p>
      <p>
        {pinnedMessage.text}
      </p>
      
    </div>
  );
};

export default PinnedMessage;
