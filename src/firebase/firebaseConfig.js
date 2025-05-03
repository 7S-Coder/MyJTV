import { initializeApp } from 'firebase/app';
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
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fonction pour inscrire un utilisateur avec un pseudo et envoyer un email de vérification
export const signUpWithEmailAndPseudo = async (email, password, pseudo) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        // Enregistrer le pseudo dans Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            pseudo: pseudo,
            createdAt: new Date(),
        });
        // Envoyer un email de vérification
        await sendEmailVerification(user);
        console.log('Email de vérification envoyé.');
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
    }
};

// Fonction pour récupérer les données utilisateur depuis Firestore
export const fetchUserData = async (uid) => {
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

// Fonction pour gérer les cookies utilisateur (ajout de la couleur)
export const setUserCookies = (user) => {
    if (user) {
        Cookies.set('user', JSON.stringify({
            email: user.email,
            uid: user.uid,
            pseudo: user.pseudo,
            color: user.color, // Ajout de la couleur
        }), { expires: 7 });
    } else {
        Cookies.remove('user');
    }
};

// Fonction pour récupérer les données utilisateur depuis les cookies
export const getUserFromCookies = () => {
    const userCookie = Cookies.get('user');
    return userCookie ? JSON.parse(userCookie) : null;
};