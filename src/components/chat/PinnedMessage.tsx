import React from 'react';
import { Message } from '../../types';
import "../../css/PinnedMessage.scss"; // Assurez-vous que le fichier CSS existe

interface PinnedMessageProps {
  pinnedMessage: Message | null;
}

const PinnedMessage: React.FC<PinnedMessageProps> = ({ pinnedMessage }) => {
  if (!pinnedMessage) return null;

  return (
    <div className="pinned-message">
      <p>
        {pinnedMessage.text}
      </p>
      <p>
        <em>Par :</em> {pinnedMessage.pseudo}
      </p>
    </div>
  );
};

export default PinnedMessage;
