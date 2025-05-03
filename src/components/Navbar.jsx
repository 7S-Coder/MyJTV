import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../css/Navbar.scss';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchUserData, setUserCookies, getUserFromCookies } from '../firebase/firebaseConfig';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userColor, setUserColor] = useState('#fff'); // State for user color
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = getUserFromCookies(); // Récupère l'utilisateur depuis les cookies
        if (savedUser) {
            setUser(savedUser);
            setUserColor(savedUser.color || '#fff'); // Utilise la couleur depuis les cookies
        }

        const unsubscribe = onAuthStateChanged(getAuth(), async (currentUser) => {
            if (currentUser) {
                console.log('Utilisateur connecté :', currentUser.uid);
                const userData = await fetchUserData(currentUser.uid); // Récupère les données utilisateur
                const userWithColor = {
                    email: currentUser.email,
                    uid: currentUser.uid,
                    pseudo: userData?.pseudo || 'Utilisateur',
                    color: userData?.color || '#fff', // Ajoute la couleur
                };
                setUser(userWithColor);
                setUserColor(userWithColor.color);
                setUserCookies(userWithColor); // Stocke les données utilisateur dans les cookies
            } else {
                console.log('Aucun utilisateur connecté.');
                setUser(null);
                setUserColor('#fff'); // Réinitialise la couleur par défaut
                Cookies.remove('user');
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.user-menu')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);

    const handleLogout = () => {
        getAuth().signOut();
        setMenuOpen(false);
    };

    return (
        <nav>
            <Link to="/"><img src="/jeezy.jpg" alt="Logo" /></Link>
            <ul>
                {user ? (
                    <li 
                        className={`user-menu ${menuOpen ? 'open' : ''}`} 
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span style={{ color: userColor }}>{user.pseudo}</span> {/* Affiche le pseudo avec couleur */}
                        <div className="dropdown-menu">
                            <button onClick={handleLogout}>Déconnexion</button>
                        </div>
                    </li>
                ) : (
                    <li><Link to="/login">Connexion</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;