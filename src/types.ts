export interface Message {
  id: string;
  text: string;
  pseudo: string;
  color: string;
  uid: string;
  timestamp: any; // Replace with Firebase Timestamp type if available
}

export interface User {
  uid: string;
  pseudo: string;
  color: string;
  role: 'user' | 'moderator' | 'admin';
}
