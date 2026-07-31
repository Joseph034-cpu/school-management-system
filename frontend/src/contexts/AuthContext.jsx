import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Demo credentials
const DEMO_CREDENTIALS = {
  admin: {
    username: 'admin@school.com',
    password: '@Jozzam10650',
    name: 'Admin User',
    role: 'admin'
  },
  student: {
    username: 'Joseph',
    password: '@Jozzzam10650',
    name: 'Joseph Student',
    role: 'student'
  }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const userData = localStorage.getItem('user');
        
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

const login = async (username, password) => {
    console.log('🔑 Login attempt for:', username);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check admin credentials
    if (username === DEMO_CREDENTIALS.admin.username && password === DEMO_CREDENTIALS.admin.password) {
        const userData = {
            name: DEMO_CREDENTIALS.admin.name,
            email: DEMO_CREDENTIALS.admin.username,
            role: DEMO_CREDENTIALS.admin.role,
            isDemo: true
        };
        console.log('✅ Admin login successful:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('loggedInUser', 'admin');
        setUser(userData);
        return userData;
    }

        // Check student credentials
        if (username === DEMO_CREDENTIALS.student.username && password === DEMO_CREDENTIALS.student.password) {
            const userData = {
                name: DEMO_CREDENTIALS.student.name,
                email: DEMO_CREDENTIALS.student.username,
                role: DEMO_CREDENTIALS.student.role,
                isDemo: true
            };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('loggedInUser', 'Joseph');
            setUser(userData);
            return userData;
        }

        // Invalid credentials
        throw new Error('Invalid credentials. Please use the demo credentials.');
    };

    const signup = async (userData) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Demo signup - just return success
        return { 
            message: 'Account created successfully! Please login with your credentials.',
            user: userData
        };
    };

    const getSecurityQuestion = async (data) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return a demo security question
        return {
            data: {
                security_question: 'What is your favorite color? (Demo Question)'
            }
        };
    };

    const resetPassword = async (data) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Demo password reset - always succeeds
        return {
            message: 'Password reset successful! Please login with your new password.'
        };
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('rememberedUser');
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
