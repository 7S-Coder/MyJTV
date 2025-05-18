import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase/firebaseConfig';
import { User } from '../../types';
import { setUserCookies } from '../../utils/cookies';

// Génère dynamiquement l'URL complète du badge
const getCertifBadgeUrl = (): string => {
  const baseUrl = window.location.origin; // Récupère l'URL de base du site (ex: https://jeezzy-tv.com)
  return `${baseUrl}/certif.png`; // Construit l'URL complète
};

const certifBadge = getCertifBadgeUrl(); // Utilise la fonction pour obtenir l'URL dynamique

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

    // Vérifie si le document existe
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, { role }, { merge: true }); // Utilise merge pour éviter d'écraser les champs existants
    } else {
      // Met à jour le rôle de l'utilisateur
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

    // Ajoute le badge certifié si le rôle est admin
    if (role === 'admin') {
      await addAdminBadge(userId);
    }

    // Ajouter le badge modérateur si le rôle est admn, est retiré le badge admin si il est présent

    //Si le rôle edst user, retirer le badge admin et le badge modérateur si ils sont présents

    // Récupérer les données utilisateur mises à jour
    const updatedUserDoc = await getDoc(userRef);
    if (updatedUserDoc.exists()) {
      const updatedUserData = updatedUserDoc.data();
      setUserCookies({ ...updatedUserData, uid: userId }); // Met à jour les cookies avec les données les plus récentes
    } else {
      console.error("Impossible de récupérer les données utilisateur mises à jour.");
    }

    message = `Rôle ${role} attribué avec succès à l'utilisateur ${userId}`; // Message de confirmation
    return message; // Retourne le message
  } catch (error) {
    console.error(`Erreur lors de l’attribution du rôle ${role} :`, error);
    throw error; // Relance l'erreur pour permettre une gestion en amont
  }
};

//Ajoute automatique le badge certifié aux administrateurs
export const addAdminBadge = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      const badges: string[] = userData.badges || []; // Récupère les badges existants ou initialise un tableau vide

      // Vérifie si le badge "certified" est déjà présent
      const certifiedBadge = certifBadge; // Chemin mis à jour pour le dossier public
      if (!badges.includes(certifiedBadge)) {
        badges.push(certifiedBadge); // Ajoute le chemin de l'image du badge "certified"
        await updateDoc(userRef, { badges });
      }
    } else {
      console.error("L'utilisateur n'existe pas.");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du badge administrateur :", error);
  }
}