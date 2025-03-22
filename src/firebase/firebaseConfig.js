import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Cookies from 'js-cookie';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Fonction pour la connexion Google
const googleProvider = new GoogleAuthProvider();

// Fonction pour stocker les données utilisateur dans des cookies
export const setUserCookies = (user) => {
    const userData = {
        email: user.email,
        uid: user.uid,
    };
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // Expire dans 7 jours
};

export const clearUserCookies = () => {
    Cookies.remove('user');
};

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Utilisateur connecté :', result.user);
        setUserCookies(result.user); // Stocke les données utilisateur dans les cookies
    } catch (error) {
        console.error('Erreur lors de la connexion Google :', error);
    }
};
