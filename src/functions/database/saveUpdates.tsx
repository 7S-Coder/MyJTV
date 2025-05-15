import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase/firebaseConfig';

// Fonction pour sauvegarder des mises à jour dans la base de données
export const saveUpdates = () => {
  // Implémentation ici
};

// Fonction pour attribuer ou retirer l'attribut isPinned à un message
export const togglePinnedStatus = async (messageId: string, p0: boolean) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    const messageSnapshot = await getDoc(messageRef);

    if (messageSnapshot.exists()) {
      const currentIsPinned = messageSnapshot.data().isPinned;
      const newIsPinned = !currentIsPinned;

      await updateDoc(messageRef, { isPinned: newIsPinned });
      console.log(`Le statut isPinned du message ${messageId} a été mis à jour à :`, newIsPinned);
    } else {
      console.error('Message introuvable dans la base de données.');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut isPinned :', error);
  }
};
