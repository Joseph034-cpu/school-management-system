import React, { useState } from 'react';
import api from '../services/api';

const TestLogin = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('@Jozzzam10650');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log('Sending login request...');
            console.log('Username:', username);
            console.log('Password:', password);

            const response = await api.post('/auth/login', { 
                username, 
                password 
            });

            console.log('Response received:', response);
            setResult(response.data);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setResult({ ...response.data, success: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            console.error('Error response:', err.response);
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Debug Login</h1>
                <p>Test login to see what's happening</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {error && <div className="error" style={{ color: '#ef4444', padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', marginBottom: '10px' }}>❌ Error: {error}</div>}
                    {result && result.success && <div className="success" style={{ color: '#10b981', padding: '10px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', marginBottom: '10px' }}>✅ Login Successful!</div>}
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'left', fontSize: '12px' }}>
                    <strong>Debug Info:</strong>
                    <br />API URL: {import.meta.env.VITE_API_URL || 'Not set'}
                    <br />Username: {username}
                    <br />Password: {password ? '✅ Set' : '❌ Empty'}
                    <br />Loading: {loading ? 'Yes' : 'No'}
                    <br />Error: {error || 'None'}
                    <br />Result: {result ? '✅ Received' : 'None'}
                </div>
            </div>
        </div>
    );
};

export default TestLogin;