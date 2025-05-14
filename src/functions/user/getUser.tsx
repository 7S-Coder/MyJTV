// Fonction pour récupérer les données utilisateur

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebaseConfig";
import { User as FirebaseUser } from "firebase/auth";

// Extend the Firebase User type to include a role property
export interface User extends FirebaseUser {
  role?: 'admin' | 'moderator' | 'user';
}

// Vérifie si l'utilisateur est un modérateur
export const isModerator = (user: User | null): boolean => {
  return user?.role === 'moderator';
};

// Vérifie si l'utilisateur est un administrateur ou un modérateur
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin' || user?.role === 'moderator';
};

// Fonction pour récupérer les données utilisateur avec le rôle
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