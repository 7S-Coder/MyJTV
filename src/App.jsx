import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Home from './pages/Home.jsx';
import Error from './pages/Error.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { StreamProvider } from './context/StreamContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Auth from './pages/Auth.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Chat from './pages/Chat.jsx'; // Import the Chat page
import ForgetPassword from './pages/ForgetPassword.jsx'; // Assurez-vous que le nom correspond

function App() {
    return (
        <AuthProvider>
            <StreamProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Auth />} /> {/* Page de connexion et inscription */}
                        <Route path="/forgot-password" element={<ForgetPassword />} /> {/* Route correcte */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/chat"
                            element={
                                <ProtectedRoute>
                                    <Chat />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Error />} />
                    </Routes>
                    <Footer />
                </Router>
            </StreamProvider>
        </AuthProvider>
    );
}

export default App;
