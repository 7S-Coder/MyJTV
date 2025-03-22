import React, { useState } from 'react';
import { auth, signInWithGoogle } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'js-cookie';
import { setUserCookies } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [cookiesAccepted, setCookiesAccepted] = useState(Cookies.get('cookiesAccepted') === 'true');
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cookiesAccepted) {
      alert('Vous devez accepter les cookies pour continuer.');
      return;
    }
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      setUserCookies(userCredential.user); // Stocke les données utilisateur dans les cookies
      navigate('/'); // Redirige vers la page d'accueil
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleAcceptCookies = () => {
    Cookies.set('cookiesAccepted', 'true', { expires: 365 });
    setCookiesAccepted(true);
  };

  return (
    <div className='centered-container auth-container'>
      {!cookiesAccepted && (
        <div className="cookies-popup">
          <p>Nous utilisons des cookies pour améliorer votre expérience. Acceptez-vous les cookies ?</p>
          <button onClick={handleAcceptCookies}>Accepter</button>
        </div>
      )}
      <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{isLogin ? 'Se connecter' : "S'inscrire"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Créer un compte" : 'Se connecter'}
      </button>
      <hr />
      <button
        onClick={async () => {
          await signInWithGoogle();
          navigate('/'); // Redirige vers la page d'accueil après la connexion Google
        }}
        className="google-auth-button"
      >
        Se connecter avec Google
      </button>
    </div>
  );
};

export default Auth;
