import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Courses from './components/Courses';
import Attendance from './components/Attendance';
import Fees from './components/Fees';
import Results from './components/Results';
import Timetable from './components/Timetable';
import Reports from './components/Reports';
import ManageUsers from './components/ManageUsers';
import './App.css';
import './responsive.css';
import './components/Layout.css';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="/dashboard" />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="students" element={<Students />} />
                        <Route path="courses" element={<Courses />} />
                        <Route path="attendance" element={<Attendance />} />
                        <Route path="fees" element={<Fees />} />
                        <Route path="results" element={<Results />} />
                        <Route path="timetable" element={<Timetable />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="manage-users" element={<ManageUsers />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;