import React, { useState, useEffect } from 'react';
import { timetable as timetableApi, courses as coursesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, faPlus, faTrash, faTimes,
    faClock, faBook, faSearch, faUser,
    faCalendarDay, faCalendarWeek
} from '@fortawesome/free-solid-svg-icons';
import './Timetable.css';

const Timetable = () => {
    const { user, isAdmin, isLecturer } = useAuth();
    const [timetable, setTimetable] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ day: '', course_id: '', time_slot: '' });
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const canManage = isAdmin || isLecturer;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [timetableRes, coursesRes] = await Promise.all([
                timetableApi.getAll(),
                coursesApi.getAll()
            ]);
            setTimetable(timetableRes.data || []);
            setCourses(coursesRes.data || []);
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
            await timetableApi.create(formData);
            setMessage('Timetable entry added successfully!');
            setFormData({ day: '', course_id: '', time_slot: '' });
            setShowForm(false);
            fetchData();
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || 'Failed to add entry'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this timetable entry?')) return;
        try {
            await timetableApi.delete(id);
            fetchData();
        } catch (error) {
            alert('Error deleting entry');
        }
    };

    const getDayIcon = (day) => {
        const icons = {
            'Monday': faCalendarDay,
            'Tuesday': faCalendarDay,
            'Wednesday': faCalendarDay,
            'Thursday': faCalendarDay,
            'Friday': faCalendarDay
        };
        return icons[day] || faCalendarDay;
    };

    const filteredTimetable = timetable.filter(t =>
        t.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.day?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedTimetable = days.map(day => ({
        day,
        entries: filteredTimetable.filter(t => t.day === day)
    }));

    if (loading) return <div className="loading">Loading timetable...</div>;

    return (
        <div className="timetable-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Timetable</h1>
                    <p>{canManage ? 'Manage class timetables' : 'View your class schedule'}</p>
                </div>
                {canManage && (
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <FontAwesomeIcon icon={faPlus} /> {showForm ? 'Cancel' : 'Add Entry'}
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="timetable-stats">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Classes</h3>
                        <p>{timetable.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FontAwesomeIcon icon={faCalendarWeek} />
                    </div>
                    <div className="stat-info">
                        <h3>Days Scheduled</h3>
                        <p>{new Set(timetable.map(t => t.day)).size}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FontAwesomeIcon icon={faBook} />
                    </div>
                    <div className="stat-info">
                        <h3>Courses</h3>
                        <p>{new Set(timetable.map(t => t.course_id)).size}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="stat-info">
                        <h3>Time Slots</h3>
                        <p>{new Set(timetable.map(t => t.time_slot)).size}</p>
                    </div>
                </div>
            </div>

            {/* Add Entry Form */}
            {showForm && canManage && (
                <div className="form-container">
                    <h2>
                        <FontAwesomeIcon icon={faPlus} /> Add Timetable Entry
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faCalendarDay} /> Day
                                </label>
                                <select
                                    value={formData.day}
                                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Day --</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faBook} /> Course
                                </label>
                                <select
                                    value={formData.course_id}
                                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Course --</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faClock} /> Time Slot
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 9:00 AM - 10:30 AM"
                                value={formData.time_slot}
                                onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                                required
                            />
                        </div>
                        {message && (
                            <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} /> Add Entry
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
                        placeholder="Search by day or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                </div>
                <span className="result-count">{filteredTimetable.length} entries found</span>
            </div>

            {/* Timetable Grid - Grouped by Day */}
            <div className="timetable-grid">
                {groupedTimetable.map(({ day, entries }) => (
                    <div key={day} className="day-card">
                        <div className="day-header">
                            <FontAwesomeIcon icon={getDayIcon(day)} />
                            <h3>{day}</h3>
                            <span className="entry-count">{entries.length} classes</span>
                        </div>
                        <div className="day-entries">
                            {entries.length === 0 ? (
                                <div className="no-entries">
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                    <p>No classes scheduled</p>
                                </div>
                            ) : (
                                entries.map((entry) => (
                                    <div key={entry.id} className="entry-card">
                                        <div className="entry-time">
                                            <FontAwesomeIcon icon={faClock} />
                                            <span>{entry.time_slot}</span>
                                        </div>
                                        <div className="entry-course">
                                            <FontAwesomeIcon icon={faBook} />
                                            <span>{entry.course_name || 'Unknown'}</span>
                                        </div>
                                        {canManage && (
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDelete(entry.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Table View (Alternative) */}
            <div className="table-container" style={{ marginTop: '24px' }}>
                <h3 style={{ color: '#e8e9ea', padding: '16px 16px 0 16px', marginBottom: '0' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} /> Full Timetable View
                </h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Day</th>
                            <th>Course</th>
                            <th>Time Slot</th>
                            {canManage && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTimetable.length === 0 ? (
                            <tr>
                                <td colSpan={canManage ? 5 : 4} className="empty-state">
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                    <p>No timetable entries</p>
                                    <span>Add your first entry to get started</span>
                                </td>
                            </tr>
                        ) : (
                            filteredTimetable.map((entry, index) => (
                                <tr key={entry.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <span className="day-tag">
                                            <FontAwesomeIcon icon={getDayIcon(entry.day)} />
                                            {entry.day}
                                        </span>
                                    </td>
                                    <td>{entry.course_name || 'Unknown'}</td>
                                    <td>
                                        <span className="time-tag">
                                            <FontAwesomeIcon icon={faClock} />
                                            {entry.time_slot}
                                        </span>
                                    </td>
                                    {canManage && (
                                        <td>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDelete(entry.id)}
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

export default Timetable;