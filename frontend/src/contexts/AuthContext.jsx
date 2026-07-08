import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                api.defaults.headers.Authorization = `Bearer ${token}`;
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(user);
        
        return user;
    };

    const signup = async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    };

    const getSecurityQuestion = async (data) => {
        const response = await api.post('/auth/security-question', data);
        return response;
    };

    const resetPassword = async (data) => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.Authorization;
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        getSecurityQuestion,
        resetPassword,
        isAdmin: user?.role === 'admin',
        isLecturer: user?.role === 'lecturer',
        isStudent: user?.role === 'student',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};