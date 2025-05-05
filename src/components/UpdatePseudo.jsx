import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseConfig';
import { getUserFromCookies, setUserCookies } from '../utils/cookies';
import { useNavigate } from 'react-router-dom';

const UpdatePseudo = () => {
    const [newPseudo, setNewPseudo] = useState('');
    const navigate = useNavigate();

    const handleSavePseudo = async () => {
        if (!newPseudo.trim()) {
            alert('Le pseudo est obligatoire.');
            return;
        }

        const user = getUserFromCookies();
        if (!user || !user.uid) {
            alert('Utilisateur introuvable.');
            return;
        }

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { pseudo: newPseudo });
            const updatedUser = { ...user, pseudo: newPseudo };
            setUserCookies(updatedUser);
            navigate('/'); // Redirect to home after updating pseudo
        } catch (error) {
            console.error('Erreur lors de la mise à jour du pseudo :', error);
            alert('Une erreur est survenue.');
        }
    };

    return (
        <div className="update-pseudo-container">
            <h1>Veuillez choisir un pseudo.</h1>
            <p>Le pseudonyme que vous choisirez apparaîtra dans le tchat et vous permettra d’échanger avec les autres utilisateurs.</p>
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
