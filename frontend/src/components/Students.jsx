import React, { useState, useEffect } from 'react';
import { students as studentsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, faPlus, faSearch, faTrash, 
    faEdit, faTimes, faUsers, faGraduationCap,
    faIdCard, faBook
} from '@fortawesome/free-solid-svg-icons';
import './Students.css';

const Students = () => {
    const { user, isAdmin } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', admission: '', course: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const role = localStorage.getItem('userRole');
            const username = localStorage.getItem('loggedInUser');
            
            const response = await studentsApi.getAll();
            let data = response.data || [];
            
            if (role === 'student') {
                data = data.filter(s => s.name === username);
            }
            
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await studentsApi.create(formData);
            setMessage('Student added successfully!');
            setFormData({ name: '', admission: '', course: '' });
            setShowForm(false);
            fetchStudents();
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || 'Failed to add student'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await studentsApi.delete(id);
            fetchStudents();
        } catch (error) {
            alert('Error deleting student');
        }
    };

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.admission?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading students...</div>;

    return (
        <div className="students-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Students</h1>
                    <p>View and manage all registered students</p>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <FontAwesomeIcon icon={faPlus} /> {showForm ? 'Cancel' : 'Add Student'}
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or admission number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                </div>
                <span className="result-count">{filteredStudents.length} students found</span>
            </div>

            {/* Add Student Form */}
            {showForm && isAdmin && (
                <div className="form-container">
                    <h2>
                        <FontAwesomeIcon icon={faUser} /> Add New Student
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faUser} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter student name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faIdCard} /> Admission Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter admission number"
                                    value={formData.admission}
                                    onChange={(e) => setFormData({ ...formData, admission: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faBook} /> Course
                            </label>
                            <input
                                type="text"
                                placeholder="Enter course name"
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                required
                            />
                        </div>
                        {message && (
                            <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} /> Add Student
                        </button>
                    </form>
                </div>
            )}

            {/* Student Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Admission</th>
                            <th>Course</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} className="empty-state">
                                    <FontAwesomeIcon icon={faUsers} />
                                    <p>No students found</p>
                                    <span>Add your first student to get started</span>
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="student-name-cell">
                                            <FontAwesomeIcon icon={faUser} className="name-icon" />
                                            {student.name}
                                        </div>
                                    </td>
                                    <td>{student.admission}</td>
                                    <td>
                                        <span className="course-tag">{student.course}</span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDelete(student.id)}
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

export default Students;