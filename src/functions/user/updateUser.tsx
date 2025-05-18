import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase/firebaseConfig';
import { User } from '../../types';
import { setUserCookies } from '../../utils/cookies';

// Génère dynamiquement l'URL complète du badge certif
const getCertifBadgeUrl = (): string => {
  const baseUrl = window.location.origin; // Récupère l'URL de base du site (ex: https://jeezzy-tv.com)
  return `${baseUrl}/certif.png`; // Construit l'URL complète
};

const certifBadge = getCertifBadgeUrl(); // Utilise la fonction pour obtenir l'URL dynamique

// Génère dynamiquement l'URL complète du badge modérateur
const getModeratorBadgeUrl = (): string => {
  const baseUrl = window.location.origin; // Récupère l'URL de base du site (ex: https://jeezzy-tv.com)
  return `${baseUrl}/moderator.png`; // Construit l'URL complète
};

const moderatorBadge = getModeratorBadgeUrl(); // Utilise la fonction pour obtenir l'URL dynamique

// Fonction utilitaire pour ajouter un badge
const addBadge = async (userId: string, badgeUrl: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      const badges: string[] = userData.badges || [];

      if (!badges.includes(badgeUrl)) {
        badges.push(badgeUrl);
        await updateDoc(userRef, { badges });
      }
    } else {
      console.error("L'utilisateur n'existe pas.");
    }
  } catch (error) {
    console.error(`Erreur lors de l'ajout du badge (${badgeUrl}) :`, error);
  }
};

// Fonction utilitaire pour supprimer un badge
const removeBadge = async (userId: string, badgeUrl: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      const badges: string[] = userData.badges || [];

      if (badges.includes(badgeUrl)) {
        const updatedBadges = badges.filter((badge) => badge !== badgeUrl);
        await updateDoc(userRef, { badges: updatedBadges });
      }
    } else {
      console.error("L'utilisateur n'existe pas.");
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression du badge (${badgeUrl}) :`, error);
  }
};

// Assigne un rôle à un utilisateur (admin, moderator, user)
export const assignRole = async (userId: string, role: string): Promise<string> => {
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

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, { role }, { merge: true });
    } else {
      await updateDoc(userRef, { role });

      // Supprime le badge admin si le rôle n'est plus admin
      if (role !== 'admin') {
        const userData = userDoc.data() as User;
        const badges = userData.badges || [];
        const adminBadge = certifBadge;
        if (badges.includes(adminBadge)) {
          const updatedBadges = badges.filter((badge) => badge !== adminBadge);
          await updateDoc(userRef, { badges: updatedBadges });
        }
      }
    }

    // Ajoute ou supprime les badges en fonction du rôle
    if (role === 'admin') {
      await addAdminBadge(userId);
    } else if (role === 'moderator') {
      await removeAdminBadge(userId); // Utilisation de await
      await addModeratorBadge(userId);
    } else if (role === 'user') {
      await removeAdminBadge(userId); // Utilisation de await
      await removeModeratorBadge(userId); // Utilisation de await
    }

    // Récupérer les données utilisateur mises à jour
    const updatedUserDoc = await getDoc(userRef);
    if (updatedUserDoc.exists()) {
      const updatedUserData = updatedUserDoc.data();
      setUserCookies({ ...updatedUserData, uid: userId });
    } else {
      console.error("Impossible de récupérer les données utilisateur mises à jour.");
    }

    message = `Rôle ${role} attribué avec succès à l'utilisateur ${userId}`;
    return message;
  } catch (error) {
    console.error(`Erreur lors de l’attribution du rôle ${role} :`, error);
    throw error;
  }
};

// Ajoute automatique le badge certifié aux administrateurs
export const addAdminBadge = async (userId: string): Promise<void> => {
  await addBadge(userId, certifBadge);
};

// Ajoute automatique le badge modérateur aux modérateurs
export const addModeratorBadge = async (userId: string): Promise<void> => {
  await addBadge(userId, moderatorBadge);
};

// Supprime le badge administrateur
export const removeAdminBadge = async (userId: string): Promise<void> => {
  await removeBadge(userId, certifBadge);
};

// Supprime le badge modérateur
export const removeModeratorBadge = async (userId: string): Promise<void> => {
  await removeBadge(userId, moderatorBadge);
}