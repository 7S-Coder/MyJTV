import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db, generateRandomColor } from '../../utils/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const Register = ({ setErrorMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = doc(db, 'users', user.uid);
            const userData = {
                email: user.email,
                pseudo: 'Utilisateur',
                color: generateRandomColor(),
                role: 'user',
                createdAt: new Date(),
            };
            await setDoc(userRef, userData);

            await sendEmailVerification(user);
            setErrorMessage('Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception.');
            auth.signOut();
        } catch (err) {
            if (err.code === 'auth/weak-password') {
                setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
            } else if (err.code === 'auth/email-already-in-use') {
                setErrorMessage('Cet email est déjà utilisé.');
            } else {
                setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
            }
            console.error('Erreur lors de la création de compte :', err);
        }
    };

    return (
        <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
                <label htmlFor="email">Email <span>*</span></label>
                <input
                    id="email"
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Mot de passe <span>*</span></label>
                <input
                    id="password"
                    type="password"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                />
            </div>
            <button type="submit" className="primary-button">S'inscrire</button>
        </form>
    );
};

export default Register;
