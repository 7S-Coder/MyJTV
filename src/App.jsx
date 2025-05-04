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
import Chat from './pages/Chat.jsx';
import ForgetPassword from './pages/ForgetPassword.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx'; // Import ErrorBoundary

function App() {
    return (
        <Router>
            <AuthProvider>
                <StreamProvider>
                    <ErrorBoundary>
                        <Navbar />
                        <Routes>
                            {/* Route publique pour mot de passe oublié */}
                            <Route path="/forgot-password" element={<ForgetPassword />} />
                            
                            {/* Routes protégées et autres */}
                            <Route path="/login" element={<Auth />} />
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
                    </ErrorBoundary>
                </StreamProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
