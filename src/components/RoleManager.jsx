import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Chat from './chat/Chat';

export const assignModeratorRole = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId); // Référence au document utilisateur
    await updateDoc(userRef, { role: 'moderator' }); // Mettre à jour le rôle de l'utilisateur
    alert('Le rôle de modérateur a été attribué avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'attribution du rôle de modérateur :', error);
  }
};

export const assignModeratorRoleAutomatically = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid); // Référence au document utilisateur
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await updateDoc(userRef, { role: 'user' });
    }

    const moderatorEmails = ['admin@example.com', 'dylan.e33@hotmail.fr', 'JasonKnt94@gmail.com', 'yoyo@hotmail.fr'];
    if (moderatorEmails.includes(user.email)) {
      await updateDoc(userRef, { role: 'moderator' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'attribution automatique du rôle :', error);
  }
};

export const fetchUserRole = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().role; // Retourne le rôle de l'utilisateur
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle utilisateur :', error);
    return null;
  }
};
