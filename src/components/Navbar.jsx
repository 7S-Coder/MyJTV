import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../css/Navbar.scss';
import { auth, db, fetchUserData } from '../utils/firebase/firebaseConfig'; // Assurez-vous que le chemin pointe vers firebaseConfig.ts
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { setUserCookies, getUserFromCookies } from '../utils/cookies';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userColor, setUserColor] = useState('#fff'); // State for user color
    const [isPseudoChangeDisabled, setIsPseudoChangeDisabled] = useState(false); // Disable pseudo change
    const [isEditingPseudo, setIsEditingPseudo] = useState(false); // Track if pseudo is being edited
    const [newPseudo, setNewPseudo] = useState(''); // Temporary state for new pseudo
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = getUserFromCookies(); // Récupère l'utilisateur depuis les cookies
        if (savedUser) {
            setUser(savedUser);
            setUserColor(savedUser.color || '#fff'); // Utilise la couleur des cookies
            if (savedUser.pseudo === 'Utilisateur' && auth.currentUser?.emailVerified) {
                navigate('/update-pseudo'); // Redirige uniquement si l'email est vérifié
            } else {
                setIsPseudoChangeDisabled(true); // Désactive la modification si le pseudo n'est pas "Utilisateur"
            }
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userData = await fetchUserData(currentUser.uid); // Fetch user data
                const userWithColor = {
                    email: currentUser.email,
                    uid: currentUser.uid,
                    pseudo: userData?.pseudo || 'Utilisateur', // Ensure pseudo is retrieved
                    color: userData?.color || '#fff', // Add color
                };

                // Vérifiez si les données utilisateur ont changé avant de mettre à jour les cookies
                const currentCookiesUser = getUserFromCookies();
                if (
                    !currentCookiesUser ||
                    currentCookiesUser.pseudo !== userWithColor.pseudo ||
                    currentCookiesUser.color !== userWithColor.color
                ) {
                    setUserCookies(userWithColor); // Store user data in cookies
                }

                setUser(userWithColor);
                setUserColor(userWithColor.color);
                if (userWithColor.pseudo === 'Utilisateur' && currentUser.emailVerified) {
                    navigate('/update-pseudo'); // Redirige uniquement si l'email est vérifié
                } else {
                    setIsPseudoChangeDisabled(true); // Désactive la modification si le pseudo n'est pas "Utilisateur"
                }
            } else {
                setUser(null);
                setUserColor('#fff'); // Reset to default color
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
        auth.signOut();
        setMenuOpen(false);
    };

    const handlePseudoEdit = () => {
        if (isPseudoChangeDisabled) return; // Do nothing if modification is disabled
        setIsEditingPseudo(true);
        setNewPseudo(user.pseudo); // Set current pseudo as initial value
    };

    const handlePseudoSave = async () => {
        if (!newPseudo.trim()) {
            alert('Le pseudo est obligatoire.');
            return;
        }

        try {
            if (!user.uid) {
                throw new Error('L\'UID de l\'utilisateur est introuvable.');
            }

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { pseudo: newPseudo });
            const updatedUser = { ...user, pseudo: newPseudo };
            setUser(updatedUser);
            setUserCookies(updatedUser);
            setIsPseudoChangeDisabled(true); // Désactive la modification après mise à jour
            setIsEditingPseudo(false); // Quittez le mode édition
        } catch (error) {
            console.error('Erreur lors de la mise à jour du pseudo :', error);
            alert(`Une erreur est survenue lors de la mise à jour de votre pseudo : ${error.message}`);
        }
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
                        {isEditingPseudo ? (
                            <input
                                type="text"
                                value={newPseudo}
                                onChange={(e) => setNewPseudo(e.target.value)}
                                onBlur={handlePseudoSave} // Save pseudo on blur
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handlePseudoSave(); // Save pseudo on Enter
                                }}
                                autoFocus
                                style={{
                                    color: userColor,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid #fff',
                                    outline: 'none',
                                    fontSize: 'inherit',
                                    fontFamily: 'inherit',
                                    width: '100px',
                                }}
                            />
                        ) : (
                            <p>
                                Salut&nbsp;
                                <span 
                                    style={{ color: userColor, cursor: isPseudoChangeDisabled ? 'default' : 'pointer' }} 
                                    onClick={handlePseudoEdit}
                                >
                                    {user.pseudo}
                                </span>
                                &nbsp;!
                            </p>
                        )}
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