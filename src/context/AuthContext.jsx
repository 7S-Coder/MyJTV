import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase/firebaseConfig';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { assignRole as assignUserRole } from '../functions/user/updateUser';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Liste des routes publiques
  const publicRoutes = ['/forgot-password', '/login'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/network-request-failed') {
        console.error("Network error: Please check your internet connection.");
      } else {
        console.error("Authentication error:", error.message);
      }
      throw error; // Re-throw the error for further handling
    }
  };

  // Fonction pour assigner un rôle à un utilisateur
  const assignRole = async (userId, role) => {
    try {
      // Appeler la fonction assignRole pour mettre à jour le rôle en base de données
      await assignUserRole(userId, role);

      // Récupérer les nouvelles données utilisateur depuis Firebase
      const updatedUser = auth.currentUser;
      if (updatedUser) {
        setUser({ ...updatedUser, role }); // Mettre à jour le contexte avec le nouveau rôle
      }
    } catch (error) {
      console.error('Erreur lors de l\'assignation du rôle :', error);
      throw error; // Relancer l'erreur pour une gestion en amont
    }
  };

  // Vérifiez si la route actuelle est publique
  const isPublicRoute = publicRoutes.includes(window.location.pathname);

  return (
    <AuthContext.Provider value={{ user, loading, logout, login, assignRole }}>
      {/* Affiche les enfants immédiatement pour les routes publiques */}
      {isPublicRoute ? children : !loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
