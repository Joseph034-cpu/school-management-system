import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartPie, faUsers, faBook, faClipboardList, faCoins, 
    faChartBar, faCalendarAlt, faFileAlt, faUserCog, faUser,
    faSignOutAlt, faBars, faTimes
} from '@fortawesome/free-solid-svg-icons';
import './Layout.css';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button text
        const btn = document.querySelector('.theme-toggle-btn');
        if (btn) {
            btn.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    };

    const menuItems = {
        admin: [
            { path: '/dashboard', icon: faChartPie, label: 'Dashboard' },
            { path: '/students', icon: faUsers, label: 'All Students' },
            { path: '/courses', icon: faBook, label: 'Manage Courses' },
            { path: '/attendance', icon: faClipboardList, label: 'All Attendance' },
            { path: '/fees', icon: faCoins, label: 'All Fees' },
            { path: '/results', icon: faChartBar, label: 'All Results' },
            { path: '/timetable', icon: faCalendarAlt, label: 'Timetable' },
            { path: '/reports', icon: faFileAlt, label: 'Reports' },
            { path: '/manage-users', icon: faUserCog, label: 'Manage Users' }
        ],
        lecturer: [
            { path: '/dashboard', icon: faChartPie, label: 'Dashboard' },
            { path: '/students', icon: faUsers, label: 'Students' },
            { path: '/courses', icon: faBook, label: 'My Courses' },
            { path: '/attendance', icon: faClipboardList, label: 'Mark Attendance' },
            { path: '/results', icon: faChartBar, label: 'Record Results' },
            { path: '/timetable', icon: faCalendarAlt, label: 'My Timetable' },
            { path: '/reports', icon: faFileAlt, label: 'Reports' }
        ],
        student: [
            { path: '/dashboard', icon: faChartPie, label: 'Dashboard' },
            { path: '/students', icon: faUser, label: 'My Profile' },
            { path: '/courses', icon: faBook, label: 'My Courses' },
            { path: '/results', icon: faChartBar, label: 'My Results' },
            { path: '/fees', icon: faCoins, label: 'My Fees' },
            { path: '/timetable', icon: faCalendarAlt, label: 'My Timetable' }
        ]
    };

    const items = menuItems[user?.role] || menuItems.student;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app-container">
            {/* Mobile Hamburger Menu */}
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
            </button>

            {/* Sidebar Overlay */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <h2>SMS Portal</h2>
                <div className="user-info">
                    <div className="avatar">👤</div>
                    <div className="username">{user?.username}</div>
                    <div className="role">{user?.role?.toUpperCase()}</div>
                </div>

                <div className="theme-toggle-container" style={{ marginBottom: '16px', textAlign: 'center' }}>
                    <button 
                        onClick={toggleTheme} 
                        className="theme-toggle-btn"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid #2a2f38',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            color: '#e8e9ea',
                            cursor: 'pointer',
                            fontSize: '14px',
                            width: '100%',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                </div>
                <ul>
                    {items.map((item) => (
                        <li key={item.path}>
                            <Link 
                                to={item.path} 
                                className={location.pathname === item.path ? 'active' : ''}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <FontAwesomeIcon icon={item.icon} style={{ width: '18px', marginRight: '10px' }} />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li className="logout-btn" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
                        Logout
                    </li>
                </ul>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;