import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash, faGraduationCap, faUniversity } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@school.com',
    password: '@Jozzam10650',
    name: 'Admin User',
    role: 'admin'
  },
  student: {
    email: 'Joseph',
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
    
    const [forgotStep, setForgotStep] = useState(0);
    const [forgotUsername, setForgotUsername] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotMessage, setForgotMessage] = useState('');
    
    const { login, signup, resetPassword, getSecurityQuestion } = useAuth();
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

        if (username === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) {
            localStorage.setItem('user', JSON.stringify({ 
                name: DEMO_CREDENTIALS.admin.name, 
                email: DEMO_CREDENTIALS.admin.email,
                role: DEMO_CREDENTIALS.admin.role,
                isDemo: true
            }));
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('loggedInUser', 'admin');
            alert('✅ Login successful! Welcome Admin!');
            navigate('/dashboard');
            setLoading(false);
            return; 
        }

        if (username === DEMO_CREDENTIALS.student.email && password === DEMO_CREDENTIALS.student.password) {
            localStorage.setItem('user', JSON.stringify({ 
                name: DEMO_CREDENTIALS.student.name, 
                email: DEMO_CREDENTIALS.student.email,
                role: DEMO_CREDENTIALS.student.role,
                isDemo: true
            }));
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('loggedInUser', 'Joseph');
            alert('✅ Login successful! Welcome Student!');
            navigate('/dashboard');
            setLoading(false);
            return; 
        }
      
        try {
            await login(username, password);
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            } else {
                localStorage.removeItem('rememberedUser');
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(signupData);
            setError('✅ Account created successfully! Please login.');
            setIsLogin(true);
            setSignupData({ username: '', password: '', full_name: '', security_question: '', security_answer: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGetSecurityQuestion = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await getSecurityQuestion({ username: forgotUsername });
            setSecurityQuestion(response.data.security_question);
            setForgotStep(2);
            setForgotMessage('Please answer your security question.');
        } catch (err) {
            setError(err.response?.data?.message || 'User not found.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setError('');
        setLoading(true);
        try {
            await resetPassword({
                username: forgotUsername,
                securityAnswer: securityAnswer,
                newPassword: newPassword
            });
            setForgotMessage('✅ Password reset successfully! Please login.');
            setForgotStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid answer. Please try again.');
        } finally {
            setLoading(false);
        }
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

            <div style={{ textAlign: 'right', marginBottom: '12px' }}>
                <span 
                    className="forgot-link"
                    onClick={(e) => { 
                        e.preventDefault(); 
                        setForgotStep(1); 
                        setForgotMessage(''); 
                        setError(''); 
                        setIsLogin(false); 
                    }}
                    style={{ cursor: 'pointer', fontSize: '12px', color: '#00d4ff' }}
                >
                    Forgot Password?
                </span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Login'}
            </button>

            {/* ===== DEMO CREDENTIALS NOTE ===== */}
            <div className="demo-credentials" style={{ marginTop: '15px', padding: '10px', background: '#f0f8ff', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
                <p style={{ margin: '0', color: '#333', fontWeight: 'bold' }}>🎓 Demo Credentials:</p>
                <p style={{ margin: '5px 0', color: '#555' }}>
                    <strong>Admin:</strong> admin@school.com / @Jozzam10650
                </p>
                <p style={{ margin: '0', color: '#555' }}>
                    <strong>Student:</strong> Joseph / @Jozzzam10650
                </p>
            </div>
            {/* ===== END DEMO CREDENTIALS ===== */}

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
                        Sign Up
                    </span>
                </p>
            </div>
        </form>
    );

    // ===== RENDER SIGNUP FORM (Student Only) =====
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
                {loading ? <span className="spinner"></span> : 'Create Student Account'}
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
                        style={{ cursor: 'pointer' }}
                    >
                        Login
                    </span>
                </p>
            </div>
        </form>
    );

    const renderForgotPassword = () => (
        <div className="forgot-container">
            {forgotStep === 1 && (
                <>
                    <h3>Reset Password</h3>
                    <p className="forgot-desc">Enter your username to get your security question.</p>
                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-group">
                            <span className="input-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={forgotUsername}
                                onChange={(e) => setForgotUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {forgotMessage && <div className="success-message">{forgotMessage}</div>}
                    <button 
                        type="button" 
                        className="login-btn" 
                        onClick={handleGetSecurityQuestion}
                        disabled={loading}
                    >
                        {loading ? <span className="spinner"></span> : 'Get Security Question'}
                    </button>
                </>
            )}

            {forgotStep === 2 && (
                <>
                    <h3>Answer Security Question</h3>
                    <p className="forgot-desc"><strong>Question:</strong> {securityQuestion}</p>
                    <div className="form-group">
                        <label>Your Answer</label>
                        <div className="input-group">
                            <span className="input-icon">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter your answer"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <div className="input-group">
                            <span className="input-icon">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {forgotMessage && <div className="success-message">{forgotMessage}</div>}
                    <button 
                        type="button" 
                        className="login-btn" 
                        onClick={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? <span className="spinner"></span> : 'Reset Password'}
                    </button>
                </>
            )}

            {forgotStep === 3 && (
                <>
                    <h3>✅ Password Reset Complete</h3>
                    <p className="forgot-desc">{forgotMessage}</p>
                    <button 
                        type="button" 
                        className="login-btn" 
                        onClick={() => { setForgotStep(1); setIsLogin(true); setForgotMessage(''); setError(''); }}
                    >
                        Back to Login
                    </button>
                </>
            )}

            <div className="login-footer">
            <span 
                className="link-btn"
                onClick={(e) => { 
                    e.preventDefault(); 
                    setForgotStep(0); 
                    setIsLogin(true); 
                    setForgotMessage(''); 
                    setError(''); 
                }}
                style={{ cursor: 'pointer' }}
            >
                ← Back to Login
            </span>
            </div>
        </div>
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
                            {forgotStep === 1 || forgotStep === 2 || forgotStep === 3 ? (
                                'Reset Your Password'
                            ) : isLogin ? (
                                'Welcome back. Access academic records, attendance, course management, fee tracking, and institutional reports from a single secure university platform.'
                            ) : (
                                'Create your student account'
                            )}
                        </p>
                    </div>

                    {forgotStep === 1 || forgotStep === 2 || forgotStep === 3 ? (
                        renderForgotPassword()
                    ) : isLogin ? (
                        renderLoginForm()
                    ) : (
                        renderSignupForm()
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
