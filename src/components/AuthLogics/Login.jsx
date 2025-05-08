import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, setUserInCookies } from '../../utils/firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import ForgetPassword from '../../pages/ForgetPassword';

const Login = ({ setErrorMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);

            if (!user.emailVerified) {
                setErrorMessage('Veuillez vérifier votre email avant de vous connecter.');
                return;
            }

            await setUserInCookies(user);
            navigate('/');
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setErrorMessage('Utilisateur non trouvé.');
            } else if (err.code === 'auth/wrong-password') {
                setErrorMessage('Mot de passe incorrect.');
            } else {
                setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
            }
            console.error('Erreur lors de la connexion :', err);
        }
    };

    return (
        <>
            <form onSubmit={handleLogin} className="auth-form">
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
                <p className="switch-auth-mode">
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowForgetPasswordModal(true); }}>
                        Mot de passe oublié ?
                    </a>
                </p>
                <button type="submit" className="primary-button">Se connecter</button>
            </form>
            {showForgetPasswordModal && (
                <>
                    <div className="modal-backdrop-forget" onClick={() => setShowForgetPasswordModal(false)}></div>
                    <div className="modal-forget">
                        <div className="modal-content-forget">
                            <button
                                onClick={() => setShowForgetPasswordModal(false)}
                                className="close-button-forget"
                            >
                                &times;
                            </button>
                            <ForgetPassword />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Login;
