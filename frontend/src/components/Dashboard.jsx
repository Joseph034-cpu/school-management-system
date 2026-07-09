import React, { useState, useEffect } from 'react';
import { students, courses, fees, attendance } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, faBook, faCoins, faChartBar, 
    faClipboardList, faPlus, faMoneyBillWave,
    faCalendarAlt, faDatabase, faServer, 
    faShieldAlt, faClock, faGraduationCap,
    faFileAlt, faUsers
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const mockData = {
  stats: {
    students: 156,
    teachers: 24,
    classes: 12,
    attendance: '94%'
  },
  recentActivity: [
    { id: 1, action: 'John Doe enrolled in Math', time: '2 hours ago' },
    { id: 2, action: 'Jane Smith submitted assignment', time: '4 hours ago' },
    { id: 3, action: 'New teacher added: Mrs. Johnson', time: '1 day ago' },
    { id: 4, action: 'Student fees updated for 10 students', time: '2 days ago' },
  ],
  upcomingEvents: [
    { id: 1, event: 'Parent-Teacher Meeting', date: '2026-07-15' },
    { id: 2, event: 'Mid-Term Exams', date: '2026-07-20' },
  ]
};

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalStudents: mockData.stats.students,
        totalCourses: 12,
        totalFees: 45600,
        attendanceRate: parseInt(mockData.stats.attendance),
        totalStaff: 24,
        totalResults: 89
    });
    const [recentStudents, setRecentStudents] = useState([
        { id: 1, name: 'John Doe', class: '10A' },
        { id: 2, name: 'Jane Smith', class: '10B' },
        { id: 3, name: 'Bob Johnson', class: '12A' },
        { id: 4, name: 'Sarah Williams', class: '11C' },
        { id: 5, name: 'Michael Brown', class: '9A' }
    ]);
    
    const [recentActivity, setRecentActivity] = useState(mockData.recentActivity);
        const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // ===== USE MOCK DATA - NO API CALLS =====
            // Just simulate loading delay
            setTimeout(() => {
                setStats({
                    totalStudents: mockData.stats.students,
                    totalCourses: 12,
                    totalFees: 45600,
                    attendanceRate: parseInt(mockData.stats.attendance),
                    totalStaff: 24,
                    totalResults: 89
                });
                
                setRecentStudents([
                    { id: 1, name: 'John Doe', class: '10A' },
                    { id: 2, name: 'Jane Smith', class: '10B' },
                    { id: 3, name: 'Bob Johnson', class: '12A' },
                    { id: 4, name: 'Sarah Williams', class: '11C' },
                    { id: 5, name: 'Michael Brown', class: '9A' }
                ]);
                
                setRecentActivity(mockData.recentActivity);
                setLoading(false);
            }, 500);
            // ===== END MOCK DATA =====
            
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, {user?.full_name || user?.username}!</p>
                </div>
                <div className="dashboard-actions">
                    <button className="btn btn-primary">
                        <FontAwesomeIcon icon={faFileAlt} /> Generate Report
                    </button>
                    <button className="btn btn-outline">
                        <FontAwesomeIcon icon={faCalendarAlt} /> Today's Schedule
                    </button>
                </div>
            </div>

            {/* Stats Cards - Font Awesome Icons */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className="stat-info">
                        <h3>{user?.role === 'student' ? 'My Profile' : 'Total Students'}</h3>
                        <p>{stats.totalStudents}</p>
                        <span className="stat-change positive">
                            {user?.role === 'student' ? 'Active' : '+12% this month'}
                        </span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FontAwesomeIcon icon={faBook} />
                    </div>
                    <div className="stat-info">
                        <h3>{user?.role === 'student' ? 'My Courses' : 'Total Courses'}</h3>
                        <p>{stats.totalCourses}</p>
                        <span className="stat-change positive">
                            {user?.role === 'student' ? 'Enrolled' : '+3 new this term'}
                        </span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FontAwesomeIcon icon={faCoins} />
                    </div>
                    <div className="stat-info">
                        <h3>{user?.role === 'student' ? 'My Fees Paid' : 'Fees Collected'}</h3>
                        <p>KES {stats.totalFees.toFixed(2)}</p>
                        <span className="stat-change positive">
                            {user?.role === 'student' ? 'Paid' : '85% collection rate'}
                        </span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                        <FontAwesomeIcon icon={faChartBar} />
                    </div>
                    <div className="stat-info">
                        <h3>{user?.role === 'student' ? 'My Attendance' : 'Attendance Rate'}</h3>
                        <p>{stats.attendanceRate}%</p>
                        <span className="stat-change negative">
                            {stats.attendanceRate < 80 ? 'Below target' : 'On track'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>
                        <FontAwesomeIcon icon={faChartBar} /> Student Enrollment
                    </h3>
                    <div className="chart-placeholder">
                        <div className="bar-chart">
                            <div className="bar" style={{ height: '80%' }}></div>
                            <div className="bar" style={{ height: '60%' }}></div>
                            <div className="bar" style={{ height: '90%' }}></div>
                            <div className="bar" style={{ height: '45%' }}></div>
                            <div className="bar" style={{ height: '75%' }}></div>
                            <div className="bar" style={{ height: '65%' }}></div>
                            <div className="bar" style={{ height: '95%' }}></div>
                        </div>
                        <div className="chart-labels">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                </div>
                <div className="chart-card">
                    <h3>
                        <FontAwesomeIcon icon={faGraduationCap} /> Course Distribution
                    </h3>
                    <div className="chart-placeholder pie-chart">
                        <div className="pie-container">
                            <div className="pie-segment" style={{ background: '#00d4ff', width: '40%' }}>CS</div>
                            <div className="pie-segment" style={{ background: '#7c3aed', width: '25%' }}>ENG</div>
                            <div className="pie-segment" style={{ background: '#10b981', width: '20%' }}>BUS</div>
                            <div className="pie-segment" style={{ background: '#f59e0b', width: '15%' }}>MED</div>
                        </div>
                        <div className="pie-legend">
                            <span><span style={{ background: '#00d4ff' }}></span> Computer Science</span>
                            <span><span style={{ background: '#7c3aed' }}></span> Engineering</span>
                            <span><span style={{ background: '#10b981' }}></span> Business</span>
                            <span><span style={{ background: '#f59e0b' }}></span> Medicine</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Students */}
            <div className="activity-grid">
                <div className="activity-card">
                    <h3>
                        <FontAwesomeIcon icon={faClock} /> Recent Activity
                    </h3>
                    <div className="activity-list">
                        {recentActivity.length === 0 ? (
                            <p className="no-activity">No recent activity</p>
                        ) : (
                            recentActivity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <span className="activity-time">Now</span>
                                    <p>{activity}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="activity-card">
                    <h3>
                        <FontAwesomeIcon icon={faUser} /> Recent Students
                    </h3>
                    <div className="student-list">
                        {recentStudents.length === 0 ? (
                            <p className="no-activity">No students enrolled yet</p>
                        ) : (
                            recentStudents.map((student, index) => (
                                <div key={index} className="student-item">
                                    <div className="student-avatar">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <div className="student-info">
                                        <p className="student-name">{student.name}</p>
                                        <span className="student-course">{student.course}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions - Font Awesome Icons */}
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-grid">
                    <button className="action-btn" onClick={() => window.location.href = '/students'}>
                        <FontAwesomeIcon icon={faPlus} /> Add Student
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = '/attendance'}>
                        <FontAwesomeIcon icon={faClipboardList} /> Mark Attendance
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = '/fees'}>
                        <FontAwesomeIcon icon={faMoneyBillWave} /> Record Payment
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = '/results'}>
                        <FontAwesomeIcon icon={faChartBar} /> Add Results
                    </button>
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="events-section">
                <h3>
                    <FontAwesomeIcon icon={faCalendarAlt} /> Upcoming Events
                </h3>
                <div className="events-list">
                    <div className="event-item">
                        <div className="event-date">
                            <span className="event-day">15</span>
                            <span className="event-month">JUL</span>
                        </div>
                        <div className="event-info">
                            <h4>Mid-Semester Examinations</h4>
                            <p>All departments • 8:00 AM - 5:00 PM</p>
                        </div>
                    </div>
                    <div className="event-item">
                        <div className="event-date">
                            <span className="event-day">22</span>
                            <span className="event-month">JUL</span>
                        </div>
                        <div className="event-info">
                            <h4>Faculty Meeting</h4>
                            <p>Conference Room • 2:00 PM - 4:00 PM</p>
                        </div>
                    </div>
                    <div className="event-item">
                        <div className="event-date">
                            <span className="event-day">30</span>
                            <span className="event-month">JUL</span>
                        </div>
                        <div className="event-info">
                            <h4>Graduation Ceremony</h4>
                            <p>Main Hall • 10:00 AM - 2:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="system-status">
                <h3>System Status</h3>
                <div className="status-grid">
                    <div className="status-item">
                        <span className="status-dot green"></span>
                        <div>
                            <p className="status-label">
                                <FontAwesomeIcon icon={faDatabase} /> Database
                            </p>
                            <span className="status-text">Operational</span>
                        </div>
                    </div>
                    <div className="status-item">
                        <span className="status-dot green"></span>
                        <div>
                            <p className="status-label">
                                <FontAwesomeIcon icon={faServer} /> Server
                            </p>
                            <span className="status-text">Running</span>
                        </div>
                    </div>
                    <div className="status-item">
                        <span className="status-dot yellow"></span>
                        <div>
                            <p className="status-label">
                                <FontAwesomeIcon icon={faClock} /> Backup
                            </p>
                            <span className="status-text">In Progress</span>
                        </div>
                    </div>
                    <div className="status-item">
                        <span className="status-dot green"></span>
                        <div>
                            <p className="status-label">
                                <FontAwesomeIcon icon={faShieldAlt} /> Security
                            </p>
                            <span className="status-text">All Systems Protected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
