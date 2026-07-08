import React, { useState, useEffect } from 'react';
import { courses as coursesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBook, faPlus, faTrash, faTimes, 
    faSearch, faCode, faAlignLeft
} from '@fortawesome/free-solid-svg-icons';
import './Courses.css';

const Courses = () => {
    const { user, isAdmin, isLecturer } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '', description: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    const canManage = isAdmin || isLecturer;

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await coursesApi.getAll();
            setCourses(response.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await coursesApi.create(formData);
            setMessage('Course added successfully!');
            setFormData({ name: '', code: '', description: '' });
            setShowForm(false);
            fetchCourses();
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || 'Failed to add course'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await coursesApi.delete(id);
            fetchCourses();
        } catch (error) {
            alert('Error deleting course');
        }
    };

    const filteredCourses = courses.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading courses...</div>;

    return (
        <div className="courses-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Courses</h1>
                    <p>{canManage ? 'Manage all courses offered' : 'View available courses'}</p>
                </div>
                {canManage && (
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <FontAwesomeIcon icon={faPlus} /> {showForm ? 'Cancel' : 'Add Course'}
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                </div>
                <span className="result-count">{filteredCourses.length} courses found</span>
            </div>

            {/* Add Course Form */}
            {showForm && canManage && (
                <div className="form-container">
                    <h2>
                        <FontAwesomeIcon icon={faBook} /> Add New Course
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faBook} /> Course Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter course name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faCode} /> Course Code
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter course code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faAlignLeft} /> Description
                            </label>
                            <textarea
                                placeholder="Enter course description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                            />
                        </div>
                        {message && (
                            <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} /> Add Course
                        </button>
                    </form>
                </div>
            )}

            {/* Course Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Course Name</th>
                            <th>Code</th>
                            <th>Description</th>
                            {canManage && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.length === 0 ? (
                            <tr>
                                <td colSpan={canManage ? 5 : 4} className="empty-state">
                                    <FontAwesomeIcon icon={faBook} />
                                    <p>No courses found</p>
                                    <span>Add your first course to get started</span>
                                </td>
                            </tr>
                        ) : (
                            filteredCourses.map((course, index) => (
                                <tr key={course.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="course-name-cell">
                                            <FontAwesomeIcon icon={faBook} className="course-icon" />
                                            {course.name}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="code-tag">{course.code}</span>
                                    </td>
                                    <td className="description-cell">{course.description || '-'}</td>
                                    {canManage && (
                                        <td>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDelete(course.id)}
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

export default Courses;