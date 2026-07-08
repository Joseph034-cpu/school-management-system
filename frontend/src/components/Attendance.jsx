import React, { useState, useEffect } from 'react';
import { attendance as attendanceApi, students as studentsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClipboardList, faPlus, faTrash, faTimes,
    faSearch, faCalendarAlt, faUser, faCheckCircle,
    faTimesCircle, faClock
} from '@fortawesome/free-solid-svg-icons';
import './Attendance.css';

const Attendance = () => {
    const { user, isAdmin, isLecturer } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ student_id: '', date: '', status: 'Present' });
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    const canManage = isAdmin || isLecturer;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [attendanceRes, studentsRes] = await Promise.all([
                attendanceApi.getAll(),
                studentsApi.getAll()
            ]);
            setAttendance(attendanceRes.data || []);
            setStudents(studentsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await attendanceApi.create(formData);
            setMessage('Attendance marked successfully!');
            setFormData({ student_id: '', date: '', status: 'Present' });
            fetchData();
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || 'Failed to mark attendance'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
        try {
            await attendanceApi.delete(id);
            fetchData();
        } catch (error) {
            alert('Error deleting record');
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'Present') return faCheckCircle;
        if (status === 'Late') return faClock;
        return faTimesCircle;
    };

    const getStatusColor = (status) => {
        if (status === 'Present') return '#10b981';
        if (status === 'Late') return '#f59e0b';
        return '#ef4444';
    };

    const filteredAttendance = attendance.filter(a =>
        a.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading attendance...</div>;

    return (
        <div className="attendance-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Attendance</h1>
                    <p>{canManage ? 'Mark and manage student attendance' : 'View your attendance records'}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="attendance-stats">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div className="stat-info">
                        <h3>Present</h3>
                        <p>{attendance.filter(a => a.status === 'Present').length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="stat-info">
                        <h3>Late</h3>
                        <p>{attendance.filter(a => a.status === 'Late').length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </div>
                    <div className="stat-info">
                        <h3>Absent</h3>
                        <p>{attendance.filter(a => a.status === 'Absent').length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                        <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Records</h3>
                        <p>{attendance.length}</p>
                    </div>
                </div>
            </div>

            {/* Mark Attendance Form */}
            {canManage && (
                <div className="form-container">
                    <h2>
                        <FontAwesomeIcon icon={faPlus} /> Mark Attendance
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faUser} /> Student
                                </label>
                                <select
                                    value={formData.student_id}
                                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Student --</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faCalendarAlt} /> Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faClipboardList} /> Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                required
                            >
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                            </select>
                        </div>
                        {message && (
                            <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} /> Mark Attendance
                        </button>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by student name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                </div>
                <span className="result-count">{filteredAttendance.length} records found</span>
            </div>

            {/* Attendance Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Student</th>
                            <th>Date</th>
                            <th>Status</th>
                            {canManage && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAttendance.length === 0 ? (
                            <tr>
                                <td colSpan={canManage ? 5 : 4} className="empty-state">
                                    <FontAwesomeIcon icon={faClipboardList} />
                                    <p>No attendance records</p>
                                    <span>Mark attendance to get started</span>
                                </td>
                            </tr>
                        ) : (
                            filteredAttendance.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="student-name-cell">
                                            <FontAwesomeIcon icon={faUser} className="name-icon" />
                                            {record.student_name || 'Unknown'}
                                        </div>
                                    </td>
                                    <td>{record.date}</td>
                                    <td>
                                        <span 
                                            className="status-tag"
                                            style={{ 
                                                background: `${getStatusColor(record.status)}20`,
                                                color: getStatusColor(record.status)
                                            }}
                                        >
                                            <FontAwesomeIcon icon={getStatusIcon(record.status)} />
                                            {record.status}
                                        </span>
                                    </td>
                                    {canManage && (
                                        <td>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDelete(record.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;