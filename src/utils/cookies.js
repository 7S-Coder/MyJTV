import Cookies from 'js-cookie';

export const setUserCookies = (user) => {
    if (user) {
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
    } else {
        Cookies.remove('user');
    }
};

export const getUserFromCookies = () => {
    const userCookie = Cookies.get('user');
    return userCookie ? JSON.parse(userCookie) : null;
};

// Ajout de la fonction setUserInCookies
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
