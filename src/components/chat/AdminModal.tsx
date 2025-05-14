import React from 'react';
import { Message } from '../../types';

interface AdminModalProps {
  selectedMessage: Message | null;
  onDeleteMessage: (messageId: string) => void;
  onClose: () => void;
  assignAdminRole: () => void; // Updated to match the parent function signature
  selectedRole: string; // Added prop for the selected role
  setSelectedRole: (role: string) => void; // Added prop for updating the selected role
}

const AdminModal: React.FC<AdminModalProps> = ({
  selectedMessage,
  onDeleteMessage,
  onClose,
  assignAdminRole,
  selectedRole,
  setSelectedRole,
}) => {
  if (!selectedMessage) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Actions Admin</h3>
        <p>Message : {selectedMessage.text}</p>
        <p>Utilisateur : {selectedMessage.pseudo}</p>
        <button onClick={() => onDeleteMessage(selectedMessage.id)}>Supprimer le message</button>
        <div className="role-selection">
          <h4>Attribuer un rôle</h4>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
        </div>
        <button onClick={assignAdminRole}>Attribuer le rôle sélectionné</button>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default AdminModal;