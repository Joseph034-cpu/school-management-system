import React, { useState, useEffect } from 'react';
import { results as resultsApi, students as studentsApi, courses as coursesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartBar, faPlus, faTrash, faTimes,
    faSearch, faUser, faBook, faGraduationCap,
    faAward, faPercent
} from '@fortawesome/free-solid-svg-icons';
import './Results.css';

const Results = () => {
    const { user, isAdmin, isLecturer } = useAuth();
    const [results, setResults] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ student_id: '', course_id: '', marks: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    const canManage = isAdmin || isLecturer;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const role = localStorage.getItem('userRole');
            const username = localStorage.getItem('loggedInUser');
            
            const [resultsRes, studentsRes, coursesRes] = await Promise.all([
                resultsApi.getAll(),
                studentsApi.getAll(),
                coursesApi.getAll()
            ]);
            
            let resultsData = resultsRes.data || [];
            
            if (role === 'student') {
                const student = studentsRes.data?.find(s => s.name === username);
                if (student) {
                    resultsData = resultsData.filter(r => r.student_id === student.id);
                } else {
                    resultsData = [];
                }
            }
            
            setResults(resultsData);
            setStudents(studentsRes.data || []);
            setCourses(coursesRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateGrade = (marks) => {
        if (marks >= 90) return { grade: 'A+', color: '#10b981' };
        if (marks >= 80) return { grade: 'A', color: '#10b981' };
        if (marks >= 70) return { grade: 'B+', color: '#3b82f6' };
        if (marks >= 60) return { grade: 'B', color: '#3b82f6' };
        if (marks >= 50) return { grade: 'C', color: '#f59e0b' };
        if (marks >= 40) return { grade: 'D', color: '#ef4444' };
        return { grade: 'F', color: '#ef4444' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await resultsApi.create(formData);
            setMessage('Result recorded successfully!');
            setFormData({ student_id: '', course_id: '', marks: '' });
            setShowForm(false);
            fetchData();
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || 'Failed to record result'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this result?')) return;
        try {
            await resultsApi.delete(id);
            fetchData();
        } catch (error) {
            alert('Error deleting result');
        }
    };

    const filteredResults = results.filter(r =>
        r.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading results...</div>;

    return (
        <div className="results-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Results</h1>
                    <p>{canManage ? 'Record and manage student exam results' : 'View your exam results'}</p>
                </div>
                {canManage && (
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <FontAwesomeIcon icon={faPlus} /> {showForm ? 'Cancel' : 'Add Result'}
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="results-stats">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FontAwesomeIcon icon={faAward} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Results</h3>
                        <p>{results.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                        <FontAwesomeIcon icon={faGraduationCap} />
                    </div>
                    <div className="stat-info">
                        <h3>Students</h3>
                        <p>{new Set(results.map(r => r.student_id)).size}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FontAwesomeIcon icon={faPercent} />
                    </div>
                    <div className="stat-info">
                        <h3>Average Score</h3>
                        <p>
                            {results.length 
                                ? (results.reduce((sum, r) => sum + (parseFloat(r.marks) || 0), 0) / results.length).toFixed(1) + '%'
                                : '0%'}
                        </p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                        <FontAwesomeIcon icon={faChartBar} />
                    </div>
                    <div className="stat-info">
                        <h3>Pass Rate</h3>
                        <p>
                            {results.length 
                                ? ((results.filter(r => parseFloat(r.marks) >= 40).length / results.length) * 100).toFixed(0) + '%'
                                : '0%'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Result Form */}
            {showForm && canManage && (
                <div className="form-container">
                    <h2>
                        <FontAwesomeIcon icon={faPlus} /> Record Result
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
                                <FontAwesomeIcon icon={faPercent} /> Marks (0-100)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Enter marks (0-100)"
                                value={formData.marks}
                                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                                required
                            />
                        </div>
                        {message && (
                            <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} /> Record Result
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
                        placeholder="Search by student or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                </div>
                <span className="result-count">{filteredResults.length} records found</span>
            </div>

            {/* Results Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Student</th>
                            <th>Course</th>
                            <th>Marks</th>
                            <th>Grade</th>
                            {canManage && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan={canManage ? 6 : 5} className="empty-state">
                                    <FontAwesomeIcon icon={faChartBar} />
                                    <p>No results recorded</p>
                                    <span>Add your first result to get started</span>
                                </td>
                            </tr>
                        ) : (
                            filteredResults.map((result, index) => {
                                const { grade, color } = calculateGrade(parseFloat(result.marks));
                                return (
                                    <tr key={result.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="student-name-cell">
                                                <FontAwesomeIcon icon={faUser} className="name-icon" />
                                                {result.student_name || 'Unknown'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="course-tag">
                                                <FontAwesomeIcon icon={faBook} />
                                                {result.course_name || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="marks-cell">
                                            <span className="marks-tag">
                                                {result.marks}%
                                            </span>
                                        </td>
                                        <td>
                                            <span 
                                                className="grade-tag"
                                                style={{ 
                                                    background: `${color}20`,
                                                    color: color
                                                }}
                                            >
                                                {grade}
                                            </span>
                                        </td>
                                        {canManage && (
                                            <td>
                                                <button 
                                                    className="btn btn-danger btn-sm" 
                                                    onClick={() => handleDelete(result.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Results;