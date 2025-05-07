import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';

export const updatePseudo = async (userId: string): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const currentPseudo: string | undefined = userData?.pseudo;

            if (currentPseudo && typeof currentPseudo === 'string') {
                const newPseudo = currentPseudo.replace(/ /g, '_');
                if (newPseudo !== currentPseudo) {
                    await updateDoc(userRef, { pseudo: newPseudo });
                    console.log(`Pseudo updated: "${currentPseudo}" -> "${newPseudo}"`);
                } else {
                    console.log('No spaces in pseudo, no update needed.');
                }
            } else {
                console.warn('Pseudo field is missing or invalid.');
            }
        } else {
            console.warn('User document does not exist.');
        }
    } catch (err) {
        console.error('Error updating pseudo:', err);
    }
};
