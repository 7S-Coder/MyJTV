import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../css/Navbar.scss';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchUserData } from '../firebase/firebaseConfig';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), async (currentUser) => {
            if (currentUser) {
                const userData = await fetchUserData(currentUser.uid); // Récupère les données utilisateur
                setUser({
                    email: currentUser.email,
                    uid: currentUser.uid,
                    pseudo: userData?.pseudo || 'Utilisateur', // Utilise le pseudo ou un fallback
                });
                Cookies.set('user', JSON.stringify({ email: currentUser.email, uid: currentUser.uid, pseudo: userData?.pseudo }), { expires: 7 });
            } else {
                setUser(null);
                Cookies.remove('user');
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = () => {
        getAuth().signOut();
        setMenuOpen(false);
    };

    return (
        <nav>
            <Link to="/"><img src="public/jeezy.png" alt="Logo" /></Link>
            <ul>
                <li><Link to="/">Accueil</Link></li>
                {user ? (
                    <li className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
                        {user.pseudo} {/* Affiche le pseudo */}
                        {menuOpen && (
                            <div className="dropdown-menu">
                                <button onClick={handleLogout}>Déconnexion</button>
                            </div>
                        )}
                    </li>
                ) : (
                    <li><Link to="/login">Connexion</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;