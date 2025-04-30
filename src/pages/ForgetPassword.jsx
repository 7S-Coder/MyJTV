import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const ForgetPassword = () => { // Renommé pour correspondre au fichier
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!auth) {
      setError("Erreur de configuration Firebase.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Un email de réinitialisation a été envoyé.');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError("Aucun compte n'est associé à cet email.");
      } else {
        setError("Erreur lors de l'envoi de l'email.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Réinitialiser le mot de passe</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleReset} className="auth-form">
        <label>Email</label>
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="primary-button">Envoyer</button>
      </form>
    </div>
  );
};

export default ForgetPassword; // Renommé pour correspondre au fichier
