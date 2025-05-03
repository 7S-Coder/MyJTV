import React, { useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'js-cookie';
import { setUserCookies, setUserInCookies, handleUserAfterAuth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../css/Auth.scss';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [cookiesAccepted, setCookiesAccepted] = useState(Cookies.get('cookiesAccepted') === 'true');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.(fr|com)$/;
    return emailRegex.test(email);
  };

  const generateRandomColor = () => {
    const colors = ['#FF4500', '#32CD32', '#1E90FF', '#FFD700', '#FF69B4', '#8A2BE2', '#00CED1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!cookiesAccepted) {
      alert('Vous devez accepter les cookies pour continuer.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Veuillez entrer un email valide.");
      return;
    }

    try {
      let user;
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;

        // Mettez à jour les cookies uniquement si nécessaire
        await setUserInCookies(user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;

        const userColor = generateRandomColor();
        const userData = {
          pseudo,
          email,
          color: userColor,
          role: 'user', // Rôle par défaut
          createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), userData);

        // Parsez immédiatement les cookies avec les données utilisateur
        Cookies.set('user', JSON.stringify({ ...user, ...userData }), { expires: 7 });
        console.log('Utilisateur inscrit et stocké dans les cookies :', { ...user, ...userData });
      }

      navigate('/');
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Cet email est déjà utilisé.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Utilisateur non trouvé.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Mot de passe incorrect.');
      } else {
        setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      }
      console.error('Authentication error:', error);
    }
  };

  const handleAcceptCookies = () => {
    Cookies.set('cookiesAccepted', 'true', { expires: 365 });
    setCookiesAccepted(true);
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>{isLogin ? "T'es là ?" : 'Créer un compte'}</h2>
          <p>{isLogin ? 'Quel plaisir de te revoir. Ne rate pas le RDV !' : 'Rejoignez-nous dès maintenant.'}</p>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="pseudo">Pseudo</label>
              <input
                id="pseudo"
                type="text"
                placeholder="Votre pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          )}
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
              autoComplete="current-password"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </button>
            <div className="switch-auth-mode">
              {isLogin ? (
                <>
                  <p>Pas encore de compte ?</p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogin(false);
                    }}
                  >
                    Créer un compte
                  </a>
                </>
              ) : (
                <>
                  <p>Déjà un compte ?</p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogin(true);
                    }}
                  >
                    Se connecter
                  </a>
                </>
              )}
            </div>
          </div>
        </form>
        {!cookiesAccepted && (
          <div className="cookies-popup">
            <p>Nous utilisons des cookies pour améliorer votre expérience. Acceptez-vous les cookies ?</p>
            <button onClick={handleAcceptCookies}>Accepter</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Auth;
