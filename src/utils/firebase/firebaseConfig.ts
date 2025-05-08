// firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Vérifiez si une application Firebase existe déjà avant d'en créer une nouvelle
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fonction pour gérer les cookies utilisateur
export const setUserCookies = (user: any) => {
  if (user) {
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
  } else {
    Cookies.remove('user');
  }
};

// Fonction pour récupérer les données utilisateur depuis les cookies
export const getUserFromCookies = () => {
  const userCookie = Cookies.get('user');
  return userCookie ? JSON.parse(userCookie) : null;
};

// Fonction pour récupérer les données utilisateur depuis Firestore
export const fetchUserData = async (uid: string) => {
  try {
    if (!uid) {
      console.error('UID non défini. Impossible de récupérer les données utilisateur.');
      return null;
    }
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.error(`Aucun document trouvé pour l'utilisateur avec UID: ${uid}`);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur :', error);
    return null;
  }
};

// Fonction centralisée pour gérer la récupération et le stockage des données utilisateur
export const handleUserAfterAuth = async (user: any) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      const userWithRole = {
        email: user.email,
        uid: user.uid,
        pseudo: userData.pseudo || 'User',
        color: userData.color || '#fff',
        role: userData.role || 'user',
      };

      setUserCookies(userWithRole); // Stocker l'utilisateur avec le rôle dans les cookies
      return userWithRole;
    } else {
      console.error('Aucun document trouvé pour cet utilisateur dans Firestore.');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la gestion de l\'utilisateur après authentification :', error);
    return null;
  }
};

// Fonction utilitaire pour générer une couleur aléatoire
export const generateRandomColor = () => {
  const colors = [
    '#FF4500', '#32CD32', '#1E90FF', '#FFD700', '#FF69B4', 
    '#8A2BE2', '#00CED1', '#FF6347', '#4682B4', '#7FFF00', 
    '#FFB6C1', '#6A5ACD'
  ]; // Ajout de nouvelles couleurs
  return colors[Math.floor(Math.random() * colors.length)];
};

// Fonction pour définir les cookies utilisateur
export const setUserInCookies = async (user) => {
  const userData = {
    uid: user.uid,
    email: user.email,
    // Ajoutez d'autres propriétés nécessaires
  };
  document.cookie = `user=${JSON.stringify(userData)}; path=/;`;
};