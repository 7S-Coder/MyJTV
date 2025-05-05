import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase/firebaseConfig';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';

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

  // Vérifiez si la route actuelle est publique
  const isPublicRoute = publicRoutes.includes(window.location.pathname);

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {/* Affiche les enfants immédiatement pour les routes publiques */}
      {isPublicRoute ? children : !loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
