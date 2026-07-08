import React, { useState, useEffect } from 'react';
import { users as usersApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ManageUsers = () => {
    const { user, isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ 
        username: '', 
        password: '', 
        full_name: '', 
        department: '', 
        email: '' 
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await usersApi.getAll();
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await usersApi.createLecturer(formData);
            setMessage('✅ Lecturer created successfully!');
            setFormData({ username: '', password: '', full_name: '', department: '', email: '' });
            setShowForm(false);
            fetchUsers();
        } catch (error) {
            setMessage('❌ Error: ' + (error.response?.data?.message || 'Failed to create lecturer'));
        }
    };

    const handleDelete = async (username) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) return;
        try {
            await usersApi.delete(username);
            fetchUsers();
        } catch (error) {
            alert('Error deleting user');
        }
    };

    const handleResetPassword = async (username) => {
        const newPassword = prompt(`Enter new password for ${username}:`);
        if (!newPassword) return;
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        try {
            await usersApi.resetPassword({ username, newPassword });
            alert('✅ Password reset successfully!');
        } catch (error) {
            alert('Error resetting password');
        }
    };

    if (!isAdmin) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h1 style={{ color: '#ef4444' }}>Access Denied</h1>
                <p style={{ color: '#8b92a8' }}>Only administrators can manage users.</p>
            </div>
        );
    }

    if (loading) return <div className="loading">Loading users...</div>;

    return (
        <div className="manage-users-page">
            <h1>Manage Users</h1>
            <p>Create and manage user accounts.</p>

            <button 
                className="btn btn-primary" 
                onClick={() => setShowForm(!showForm)}
                style={{ marginBottom: '20px' }}
            >
                {showForm ? 'Cancel' : '+ Create Lecturer'}
            </button>

            {showForm && (
                <div className="form-container">
                    <h2>Create Lecturer Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="text"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        {message && <p style={{ color: message.includes('✅') ? '#10b981' : '#ef4444' }}>{message}</p>}
                        <button type="submit" className="btn btn-primary">Create Lecturer</button>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Full Name</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', color: '#8b92a8' }}>No users found</td></tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id}>
                                    <td><strong>{u.username}</strong></td>
                                    <td>
                                        <span style={{
                                            color: u.role === 'admin' ? '#ef4444' : 
                                                   u.role === 'lecturer' ? '#3b82f6' : '#10b981',
                                            fontWeight: 'bold'
                                        }}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{u.full_name || '-'}</td>
                                    <td>{u.department || '-'}</td>
                                    <td>
                                        {u.role !== 'admin' && (
                                            <>
                                                <button 
                                                    className="btn btn-warning btn-sm" 
                                                    onClick={() => handleResetPassword(u.username)}
                                                    style={{ marginRight: '5px' }}
                                                >
                                                    Reset
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm" 
                                                    onClick={() => handleDelete(u.username)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                        {u.role === 'admin' && <span style={{ color: '#8b92a8' }}>Protected</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;