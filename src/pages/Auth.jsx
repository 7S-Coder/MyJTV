import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Login from '../components/AuthLogics/Login';
import Register from '../components/AuthLogics/Register';
import '../css/pages/Auth.scss';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [cookiesAccepted, setCookiesAccepted] = useState(Cookies.get('cookiesAccepted') === 'true');
    const [errorMessage, setErrorMessage] = useState('');

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
                {isLogin ? (
                    <Login setErrorMessage={setErrorMessage} />
                ) : (
                    <Register setErrorMessage={setErrorMessage} />
                )}
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
