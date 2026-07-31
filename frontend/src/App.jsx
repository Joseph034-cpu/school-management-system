import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
    // Set admin user directly in localStorage
    localStorage.setItem('user', JSON.stringify({
        name: 'Admin User',
        email: 'admin@school.com',
        role: 'admin',
        isDemo: true
    }));
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('loggedInUser', 'admin');

    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
