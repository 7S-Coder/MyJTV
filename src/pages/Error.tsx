import React from 'react';
import { Link } from 'react-router-dom';
import '../css/pages/Error.scss';

const Error = () => {
  return (
    <div className='container'>
      <div>
      <h1 className='error-title'>Erreur</h1>
      <p className='error-message'>Une erreur est survenue.</p>
      <Link to='/' className='error-link'>
        Retour à l'accueil
      </Link>
      </div>
      
    </div>
  );
};

export default Error;
