import React, { useState, useEffect } from 'react';
import { Message } from '../../types';
import { Pin, PinOff } from 'lucide-react';
import { togglePinnedStatus } from '../../functions/database/saveUpdates';
import "../../css/AdminModal.scss"; // Assurez-vous que le chemin est correct

interface AdminModalProps {
  selectedMessage: Message | null;
  onDeleteMessage: (messageId: string) => void;
  onClose: () => void;
  assignAdminRole: () => void; // Updated to match the parent function signature
  selectedRole: string; // Added prop for the selected role
  setSelectedRole: (role: string) => void; // Added prop for updating the selected role
  onUnpinMessage?: () => void; // Ajout de la prop optionnelle
}

const AdminModal: React.FC<AdminModalProps> = ({
  selectedMessage,
  onDeleteMessage,
  onClose,
  assignAdminRole,
  selectedRole,
  setSelectedRole,
  onUnpinMessage, // Ajout ici
}) => {
  // Ajoute un état local pour isPinned
  const [localIsPinned, setLocalIsPinned] = useState(selectedMessage?.isPinned ?? false);

  // Synchronise l'état local si le message change
  useEffect(() => {
    setLocalIsPinned(selectedMessage?.isPinned ?? false);
  }, [selectedMessage]);

  if (!selectedMessage) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Actions Admin</h3>
        {onUnpinMessage && (
          <button className='unpinMessage' onClick={onUnpinMessage}><PinOff size={12}/></button>
        )}
        <div className='message-details'>
          <button
            onClick={async () => {
              await togglePinnedStatus(selectedMessage.id, !localIsPinned);
              setLocalIsPinned(!localIsPinned);
            }}
            className={`pin-btn${localIsPinned ? " pinned" : ""}`}
          >
            <Pin />
          </button>
          <div>
            <p>
              Message : {selectedMessage.text} <br />
            </p>
            <p>
              Utilisateur : {selectedMessage.pseudo}
            </p>
          </div>
        </div>
        
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