import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash, faGraduationCap, faUniversity } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

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

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    const [signupData, setSignupData] = useState({
        username: '',
        password: '',
        full_name: '',
        security_question: '',
        security_answer: ''
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('rememberedUser');
        if (savedUser) {
            setUsername(savedUser);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Check admin credentials
        if (username === DEMO_CREDENTIALS.admin.username && password === DEMO_CREDENTIALS.admin.password) {
            localStorage.setItem('user', JSON.stringify({ 
                name: DEMO_CREDENTIALS.admin.name, 
                email: DEMO_CREDENTIALS.admin.username,
                role: DEMO_CREDENTIALS.admin.role,
                isDemo: true
            }));
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('loggedInUser', 'admin');
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            setLoading(false);
            navigate('/dashboard');
            return;
        }

        // Check student credentials
        if (username === DEMO_CREDENTIALS.student.username && password === DEMO_CREDENTIALS.student.password) {
            localStorage.setItem('user', JSON.stringify({ 
                name: DEMO_CREDENTIALS.student.name, 
                email: DEMO_CREDENTIALS.student.username,
                role: DEMO_CREDENTIALS.student.role,
                isDemo: true
            }));
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('loggedInUser', 'Joseph');
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            setLoading(false);
            navigate('/dashboard');
            return;
        }

        // Invalid credentials
        setError('Invalid credentials. Please use the demo credentials shown below.');
        setLoading(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Demo signup - just show success message
        setError('✅ Demo: Account creation simulated! Please login with your new credentials.');
        setIsLogin(true);
        setSignupData({ username: '', password: '', full_name: '', security_question: '', security_answer: '' });
        setLoading(false);
    };

    const renderLoginForm = () => (
        <form onSubmit={handleLogin}>
            <div className="form-group">
                <label>Username</label>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Password</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
            </div>

            <div className="form-options">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Login'}
            </button>

            {/* Demo Credentials */}
            <div className="demo-credentials" style={{ marginTop: '15px', padding: '12px', background: '#f0f8ff', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px solid #b8d4e3' }}>
                <p style={{ margin: '0', color: '#0066cc', fontWeight: 'bold' }}>🎓 Demo Credentials (Use these to login)</p>
                <p style={{ margin: '5px 0', color: '#333' }}>
                    <strong>👤 Admin:</strong> admin@school.com / @Jozzam10650
                </p>
                <p style={{ margin: '0', color: '#333' }}>
                    <strong>👤 Student:</strong> Joseph / @Jozzzam10650
                </p>
            </div>

            <div className="login-footer">
                <p>
                    Don't have an account?{' '}
                    <span 
                        className="link-btn"
                        onClick={(e) => { 
                            e.preventDefault(); 
                            setIsLogin(false); 
                            setError(''); 
                        }}
                        style={{ cursor: 'pointer', color: '#00d4ff' }}
                    >
                        Sign Up (Demo)
                    </span>
                </p>
            </div>
        </form>
    );

    const renderSignupForm = () => (
        <form onSubmit={handleSignup}>
            <div className="form-group">
                <label>Full Name</label>
                <div className="input-group">
                    <span className="input-icon">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={signupData.full_name}
                        onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Username</label>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Choose a username"
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Password</label>
                <div className="input-group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                    />
                    <span
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>
            </div>

            <div className="form-group">
                <label>Security Question (For Account Recovery)</label>
                <select
                    className="security-select"
                    value={signupData.security_question}
                    onChange={(e) => setSignupData({ ...signupData, security_question: e.target.value })}
                    required
                >
                    <option value="">-- Select a question --</option>
                    <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                    <option value="What is the name of your first pet?">What is the name of your first pet?</option>
                    <option value="What city were you born in?">What city were you born in?</option>
                    <option value="What is your favorite teacher's name?">What is your favorite teacher's name?</option>
                </select>
            </div>

            <div className="form-group">
                <label>Security Answer</label>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Enter your answer"
                        value={signupData.security_answer}
                        onChange={(e) => setSignupData({ ...signupData, security_answer: e.target.value })}
                        required
                    />
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Create Student Account (Demo)'}
            </button>

            <div className="login-footer">
                <p>
                    Already have an account?{' '}
                    <span 
                        className="link-btn"
                        onClick={(e) => { 
                            e.preventDefault(); 
                            setIsLogin(true); 
                            setError(''); 
                        }}
                        style={{ cursor: 'pointer', color: '#00d4ff' }}
                    >
                        Login
                    </span>
                </p>
            </div>
        </form>
    );

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-brand">
                        <div className="brand-icon">
                            <FontAwesomeIcon icon={faUniversity} />
                        </div>
                        <h1 style={{ fontSize: '18px', lineHeight: '1.2' }}>Student Management System Portal</h1>
                        <p className="brand-subtitle">
                            {isLogin ? (
                                'Welcome back. Access academic records, attendance, course management, fee tracking, and institutional reports from a single secure university platform.'
                            ) : (
                                'Create your student account (Demo)'
                            )}
                        </p>
                    </div>

                    {isLogin ? renderLoginForm() : renderSignupForm()}
                </div>
            </div>
        </div>
    );
};

export default Login;
