import React, { useState, useEffect } from 'react';
import '../css/pages/Profile.scss';
import { auth, db, fetchUserData } from '../utils/firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { setUserCookies, getUserFromCookies } from '../utils/cookies';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPseudo, setNewPseudo] = useState('');
  const [newColor, setNewColor] = useState('#fff');
  const navigate = useNavigate();

  const colorOptions = [
    '#FF4500', '#32CD32', '#1E90FF', '#FFD700', '#FF69B4', 
    '#8A2BE2', '#00CED1', '#FF6347', '#4682B4', '#7FFF00', 
    '#FFB6C1', '#6A5ACD'
  ];

  useEffect(() => {
    const savedUser = getUserFromCookies();
    if (savedUser) {
      setUser(savedUser);
      setNewPseudo(savedUser.pseudo);
      setNewColor(savedUser.color || '#fff');
    }
  }, []);

  const handleSave = async () => {
    if (!user?.uid) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { pseudo: newPseudo, color: newColor });
      const updatedUser = { ...user, pseudo: newPseudo, color: newColor };
      setUser(updatedUser);
      setUserCookies(updatedUser);
      setIsEditing(false);
    } catch (error) {
      alert('Erreur lors de la mise à jour du profil.');
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  if (!user) return <div className="profile-page"><p>Chargement...</p></div>;

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>
      <div className="profile-info">
        <div><strong>Email :</strong> {user.email}</div>
        <div>
          <strong>Pseudo :</strong> {isEditing ? (
            <input value={newPseudo} onChange={e => setNewPseudo(e.target.value)} />
          ) : (
            <span style={{ color: user.color }}>{user.pseudo}</span>
          )}
        </div>
        <div>
          <strong>Couleur :</strong> {isEditing ? (
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {colorOptions.map((color) => (
                <span
                  key={color}
                  onClick={() => setNewColor(color)}
                  style={{
                    display: 'inline-block',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: color,
                    border: newColor === color ? '3px solid #fff' : '2px solid #888',
                    cursor: 'pointer',
                    boxShadow: newColor === color ? '0 0 6px #fff' : 'none',
                  }}
                  title={color}
                />
              ))}
            </div>
          ) : (
            <span style={{ color: user.color }}>{user.color}</span>
          )}
        </div>
      </div>
      {isEditing ? (
        <>
          <button onClick={handleSave}>Enregistrer</button>
          <button onClick={() => setIsEditing(false)}>Annuler</button>
        </>
      ) : (
        <button onClick={() => setIsEditing(true)}>Modifier le profil</button>
      )}
      <button className="logout" onClick={handleLogout}>Déconnexion</button>
    </div>
  );
};

export default Profile;
