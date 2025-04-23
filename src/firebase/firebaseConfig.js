import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Ensure this key is correctly set in your environment variables
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fonction pour inscrire un utilisateur avec un pseudo
export const signUpWithEmailAndPseudo = async (email, password, pseudo) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        // Enregistrer le pseudo dans Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            pseudo: pseudo,
            createdAt: new Date(),
        });
        console.log('Utilisateur créé avec succès :', user);
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
    }
};

// Fonction pour récupérer les données utilisateur (pseudo inclus)
export const fetchUserData = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data(); // Retourne les données utilisateur
        } else {
            console.error('Aucun document trouvé pour cet utilisateur.');
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        return null;
    }
};

// Fonction pour gérer les cookies utilisateur
export const setUserCookies = (user) => {
    if (user) {
        Cookies.set('user', JSON.stringify({
            email: user.email,
            uid: user.uid,
            pseudo: user.pseudo,
        }), { expires: 7 });
    } else {
        Cookies.remove('user');
    }
};