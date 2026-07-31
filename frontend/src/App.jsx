import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import './App.css';

// Simple test dashboard
const TestDashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            color: 'white',
            background: '#1a1a2e',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>✅ Dashboard Working!</h1>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>Welcome, {user?.name || 'User'}!</p>
            <p style={{ fontSize: '16px', color: '#888', marginBottom: '20px' }}>Role: {user?.role || 'Unknown'}</p>
            <button 
                onClick={logout}
                style={{
                    padding: '10px 30px',
                    fontSize: '16px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Logout
            </button>
        </div>
    );
};

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <TestDashboard />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<TestDashboard />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
