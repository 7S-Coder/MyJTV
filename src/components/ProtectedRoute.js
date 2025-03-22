import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';

const ProtectedRoute = ({ children }) => {
    const user = auth.currentUser;

    if (!user) {
        return <Navigate to="/signup" />;
    }

    return children;
};

export default ProtectedRoute;
