export interface Message {
  id: string;
  text: string;
  pseudo: string;
  color?: string;
  uid?: string;
  timestamp: any; // Vous pouvez remplacer `any` par un type plus précis si nécessaire
  mentions?: string[]; // Ajout de la propriété mentions (liste des pseudos mentionnés)
  isPinned?: boolean; // Ajout de la propriété isPinned pour indiquer si le message est épinglé
}

export interface User {
  uid: string;
  pseudo: string;
  color: string;
  role: 'user' | 'moderator' | 'admin';
  email: string; 
  badges: string[]; // Liste des badges de l'utilisateur, y compris badgeAdmin
}

export interface MessageListProps {
  messages: Message[];
  onMessageClick?: (message: Message) => void;
  onDeleteMessage?: (messageId: string) => void;
  onTogglePinnedStatus?: (messageId: string) => void; // Added onTogglePinnedStatus
  isModerator?: boolean;
  currentUser?: User;
}
