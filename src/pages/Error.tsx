import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Error.scss';

const Error = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className='centered-container'>
      <h1 className='error-title'>Erreur</h1>
      <p className='error-message'>Une erreur est survenue.</p>
      <button className='error-button' onClick={goToHome}>
        Retour à l'accueil
      </button>
    </div>
  );
};

export default Error;
