import React from 'react';
import { Message } from '../../types';

interface AdminModalProps {
  selectedMessage: Message | null;
  onDeleteMessage: (messageId: string) => void;
  onClose: () => void;
  assignAdminRole: (userId: string) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ selectedMessage, onDeleteMessage, onClose, assignAdminRole }) => {
  if (!selectedMessage) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Actions Admin</h3>
        <p>Message : {selectedMessage.text}</p>
        <p>Utilisateur : {selectedMessage.pseudo}</p>
        <button onClick={() => onDeleteMessage(selectedMessage.id)}>Supprimer le message</button>
        <button onClick={() => assignAdminRole(selectedMessage.id)}>Attribuer le rôle d'administrateur</button>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default AdminModal;