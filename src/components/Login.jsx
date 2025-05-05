import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, generateRandomColor, setUserInCookies } from '../utils/firebase/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            console.log('Connexion réussie, utilisateur :', user);

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                // Si l'utilisateur n'a pas encore de document dans Firestore, créez-le
                const color = generateRandomColor();
                await setDoc(userRef, {
                    email: user.email,
                    pseudo: 'Utilisateur',
                    color,
                    role: 'user',
                    createdAt: new Date(),
                });
                console.log('Document utilisateur créé avec un pseudo par défaut.');
            }

            const userWithRole = await setUserInCookies(user);
            if (userWithRole) {
                console.log('Utilisateur connecté avec rôle :', userWithRole);
                // Redirigez ou mettez à jour l'état de l'application après la connexion
            }
        } catch (err) {
            console.error('Erreur lors de la connexion :', err);
            setError('Erreur lors de la connexion. Veuillez vérifier vos identifiants.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Se connecter</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Login;
