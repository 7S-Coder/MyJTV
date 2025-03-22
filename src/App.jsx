import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Home from './pages/Home.jsx';
import Error from './components/Error.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Admin from './pages/Admin.jsx';
import { StreamProvider } from './context/StreamContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Auth from './pages/Auth.jsx';
import { signInWithGoogle } from './firebase/firebaseConfig';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Utilisez uniquement cette version

const SignUp = () => {
    return (
        <div>
            <h1>Inscription</h1>
            <button onClick={signInWithGoogle}>S'inscrire avec Google</button>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <StreamProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <div>Contenu protégé</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Auth />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                    <Footer />
                </Router>
            </StreamProvider>
        </AuthProvider>
    );
}

export default App;
