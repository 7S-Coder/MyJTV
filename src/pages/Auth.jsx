import React, { useState } from 'react';
import { auth, signInWithGoogle } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'js-cookie';
import { setUserCookies } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../css/Auth.scss';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [cookiesAccepted, setCookiesAccepted] = useState(Cookies.get('cookiesAccepted') === 'true');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.(fr|com)$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
    if (!cookiesAccepted) {
      alert('Vous devez accepter les cookies pour continuer.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("L'email n'est pas correcte.");
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
      if (error.code === 'auth/weak-password') {
        setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
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
    <div className='centered-container auth-container'>
      {!cookiesAccepted && (
        <div className="cookies-popup">
          <p>Nous utilisons des cookies pour améliorer votre expérience. Acceptez-vous les cookies ?</p>
          <button onClick={handleAcceptCookies}>Accepter</button>
        </div>
      )}
      <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
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

        <div>
        <button type="submit">{isLogin ? 'Se connecter' : "S'inscrire"}</button>
        <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Créer un compte" : 'Se connecter'}
      </button>
        </div>
      <button
        onClick={async () => {
          await signInWithGoogle();
          navigate('/'); // Redirige vers la page d'accueil après la connexion Google
        }}
        className="google-auth-button"
      >
        Se connecter avec Google
      </button>
      </form>
      
      
    </div>
  );
};

export default Auth;
