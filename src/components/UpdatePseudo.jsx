import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseConfig';
import { getUserFromCookies, setUserCookies } from '../utils/cookies';
import { useNavigate } from 'react-router-dom';
import '../css/UpdatePseudo.scss'; // Import your CSS file for styling

const UpdatePseudo = () => {
    const [newPseudo, setNewPseudo] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // État pour le message d'erreur
    const navigate = useNavigate();

    const handleSavePseudo = async () => {
        setErrorMessage(''); // Réinitialise le message d'erreur

        const user = getUserFromCookies();
        if (!user || !user.uid) {
            setErrorMessage('Utilisateur introuvable.');
            return;
        }

        if (user.pseudo !== 'Utilisateur') {
            setErrorMessage('Vous ne pouvez pas changer de pseudo .');
            return;
        }

        if (!newPseudo.trim()) {
            setErrorMessage('Le pseudo est obligatoire.');
            return;
        }

        if (/\s/.test(newPseudo)) {
            setErrorMessage('Le pseudo ne doit pas contenir d\'espaces.');
            return;
        }

        if (newPseudo.length > 10) {
            setErrorMessage('Le pseudo ne doit pas dépasser 10 caractères.');
            return;
        }

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { pseudo: newPseudo });
            const updatedUser = { ...user, pseudo: newPseudo };
            setUserCookies(updatedUser);
            navigate('/'); // Redirige vers la page d'accueil après la mise à jour
        } catch (error) {
            console.error('Erreur lors de la mise à jour du pseudo :', error);
            setErrorMessage('Une erreur est survenue lors de la mise à jour du pseudo.');
        }
    };

    return (
        <div className="update-pseudo-container">
            <h1>Veuillez choisir un pseudo.</h1>
            <p>Le pseudonyme que vous choisirez apparaîtra dans le chat et vous permettra d’échanger avec les autres utilisateurs.</p>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Affiche le message d'erreur */}
            <input
                type="text"
                placeholder="Nouveau pseudo"
                value={newPseudo}
                onChange={(e) => setNewPseudo(e.target.value)}
            />
            <button onClick={handleSavePseudo}>Enregistrer</button>
        </div>
    );
};

export default UpdatePseudo;
