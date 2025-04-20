import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../css/Navbar.scss';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Hook pour la navigation

    useEffect(() => {
        // Écoute les changements d'état de l'utilisateur
        const unsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
            if (currentUser) {
                setUser({
                    email: currentUser.email,
                    uid: currentUser.uid,
                });
                Cookies.set('user', JSON.stringify({ email: currentUser.email, uid: currentUser.uid }), { expires: 7 });
            } else {
                setUser(null);
                Cookies.remove('user');
                navigate('/login'); // Redirige vers la page de connexion après déconnexion
            }
        });

        // Nettoyage de l'écouteur
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = () => {
        getAuth().signOut();
        setMenuOpen(false); // Ferme le menu après la déconnexion
    };

    return (
        <nav>
            <Link to="/"><img src="public\jeezy.png" alt=""  /></Link>
            <ul>
                <li><Link to="/">Accueil</Link></li>
                {user ? (
                    <li className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
                        {user.email}
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
