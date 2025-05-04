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

// Fonction pour gérer les cookies utilisateur
export const setUserCookies = (user) => {
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

// Fonction centralisée pour gérer la récupération et le stockage des données utilisateur
export const handleUserAfterAuth = async (user) => {
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

// Fonction pour inscrire un utilisateur avec un pseudo et gérer ses données
export const signUpWithEmailAndPseudo = async (email, password, pseudo) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userColor = generateRandomColor();

        // Enregistrer les données utilisateur dans Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            pseudo,
            color: userColor,
            role: 'user',
            createdAt: new Date(),
        });

        // Gérer l'utilisateur après l'inscription
        return await handleUserAfterAuth(user);
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        throw error;
    }
};

// Fonction pour connecter un utilisateur et gérer ses données
export const signInWithEmailAndPasswordAndFetchRole = async (email, password) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        // Gérer l'utilisateur après la connexion
        return await handleUserAfterAuth(user);
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        throw error;
    }
};

// Fonction utilitaire pour générer une couleur aléatoire
export const generateRandomColor = () => {
    const colors = ['#FF4500', '#32CD32', '#1E90FF', '#FFD700', '#FF69B4', '#8A2BE2', '#00CED1'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const setUserInCookies = async (user) => {
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

            Cookies.set('user', JSON.stringify(userWithRole), { expires: 7 });

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

export const isEmailVerified = (user) => {
    return user?.emailVerified || false;
};

export const createUserInFirestore = async (user) => {
    try {
        const pseudo = Cookies.get('pendingPseudo') || 'Utilisateur'; // Récupérer le pseudo temporaire
        Cookies.remove('pendingPseudo'); // Supprimer le pseudo temporaire après utilisation

        const userColor = generateRandomColor();
        const userData = {
            pseudo,
            email: user.email,
            color: userColor,
            role: 'user', // Rôle par défaut
            createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), userData);
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur dans Firestore :', error);
    }
};