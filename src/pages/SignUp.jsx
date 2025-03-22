import React from 'react';
import { signInWithGoogle } from '../firebase/firebaseConfig';

const SignUp = () => {
    return (
        <div className='centered-container'>
            <h1>Inscription</h1>
            <button onClick={signInWithGoogle}>S'inscrire avec Google</button>
        </div>
    );
};

export default SignUp;
