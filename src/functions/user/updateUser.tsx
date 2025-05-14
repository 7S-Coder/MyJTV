import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase/firebaseConfig';
import { User } from '../../types';
import { setUserCookies } from '../../utils/cookies';

// Vérifie si l'utilisateur est un modérateur
export const isModerator = (user: User | null): boolean => {
  return user?.role === 'moderator';
};

// Vérifie si l'utilisateur est un administrateur ou un modérateur
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin' || user?.role === 'moderator';
};

export const fetchUserWithRole = async (user: User | null): Promise<User | null> => {
  if (!user) return null; // Retourne null si l'utilisateur est invalide.

  // Retourne directement l'utilisateur si un rôle valide est déjà défini.
  if (user.role && ['admin', 'moderator', 'user'].includes(user.role)) {
    return user;
  }

  try {
    // Récupère les données utilisateur depuis Firestore.
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { ...user, role: userData.role || 'user' }; // Définit un rôle par défaut si absent.
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle utilisateur :', error);
    return { ...user, role: 'user' }; // Retourne un rôle par défaut en cas d'erreur.
  }

  return { ...user, role: 'user' }; // Retourne un rôle par défaut si aucune donnée n'est trouvée.
};

// Fonction utilitaire pour mettre à jour les cookies utilisateur
const updateUserCookies = (userId: string, updatedUserData: Partial<User>): void => {
  setUserCookies({ ...updatedUserData, uid: userId });
};

// Assigne admin à un utilisateur 
export const assignAdminRole = async (userId: string, role: string): Promise<string> => {
  let message = "";
  try {
    // Vérifie si l'utilisateur actuel est un administrateur
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Vous devez être connecté pour effectuer cette action.");
    }

    const currentUserRef = doc(db, 'users', currentUser.uid);
    const currentUserDoc = await getDoc(currentUserRef);

    if (!currentUserDoc.exists() || currentUserDoc.data()?.role !== 'admin') {
      throw new Error("Seuls les administrateurs peuvent modifier le rôle d'un utilisateur.");
    }

    console.log(`Tentative d'attribution du rôle ${role} à l'utilisateur avec l'ID : ${userId}`);

    const userRef = doc(db, 'users', userId);

    // Vérifie si le document existe
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error(`Le document utilisateur avec l'ID ${userId} n'existe pas. Création du document.`);
      await setDoc(userRef, { role });
      setUserCookies({ uid: userId, role }); // Met à jour les cookies
      message = `Rôle ${role} attribué avec succès à l'utilisateur ${userId}`;
      return message; // Retourne le message
    }

    // Vérifie si l'utilisateur cible est déjà admin
    const userData = userDoc.data();
    if (userData?.role === 'admin') {
      console.error("Cet utilisateur est déjà admin."); // Log message
      message = "Cet utilisateur est déjà admin."; // Message d'erreur
      return message; // Retourne le message
    }

    // Met à jour le rôle de l'utilisateur
    await updateDoc(userRef, { role });

    // Récupérer les données utilisateur mises à jour
    const updatedUserDoc = await getDoc(userRef);
    if (updatedUserDoc.exists()) {
      const updatedUserData = updatedUserDoc.data();
      setUserCookies({ ...updatedUserData, uid: userId }); // Met à jour les cookies
    }

    message = `Rôle ${role} attribué avec succès à l'utilisateur ${userId}`; // Message de confirmation
    return message; // Retourne le message
  } catch (error) {
    console.error(`Erreur lors de l’attribution du rôle ${role} :`, error);
    throw error; // Relance l'erreur pour permettre une gestion en amont
  }
};
