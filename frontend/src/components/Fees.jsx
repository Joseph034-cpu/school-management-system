import React, { useState, useEffect } from 'react';
import { fees as feesApi, students as studentsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCoins, faPlus, faTrash, faTimes,
    faSearch, faCalendarAlt, faUser, faMoneyBillWave,
    faReceipt, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import './Fees.css';

const Fees = () => {
    const { user, isAdmin } = useAuth();
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ student_id: '', amount: '', payment_date: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [totalFees, setTotalFees] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const role = localStorage.getItem('userRole');
            const username = localStorage.getItem('loggedInUser');
            
            const [feesRes, studentsRes] = await Promise.all([
                feesApi.getAll(),
                studentsApi.getAll()
            ]);
            
            let feesData = feesRes.data || [];
            let studentsData = studentsRes.data || [];
            
            if (role === 'student') {
                const student = studentsData.find(s => s.name === username);
                if (student) {
                    feesData = feesData.filter(f => f.student_id === student.id);
                } else {
                    feesData = [];
                }
            }
            
            setFees(feesData);
            setStudents(studentsData);
            
            const total = feesData.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
            setTotalFees(total);
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
            await feesApi.create(formData);
            setMessage('Payment recorded successfully!');
            setFormData({ student_id: '', amount: '', payment_date: '' });
            setShowForm(false);
            fetchData();
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || 'Failed to record payment'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this payment record?')) return;
        try {
            await feesApi.delete(id);
            fetchData();
        } catch (error) {
            alert('Error deleting record');
        }
    };

    const filteredFees = fees.filter(f =>
        f.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading fees...</div>;

    return (
        <div className="fees-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Fees</h1>
                    <p>{isAdmin ? 'Manage student fee payments' : 'View your fee balance and payment history'}</p>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <FontAwesomeIcon icon={faPlus} /> {showForm ? 'Cancel' : 'Record Payment'}
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="fees-stats">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Collected</h3>
                        <p>KES {totalFees.toFixed(2)}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                        <FontAwesomeIcon icon={faReceipt} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Payments</h3>
                        <p>{fees.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FontAwesomeIcon icon={faChartLine} />
                    </div>
                    <div className="stat-info">
                        <h3>Average Payment</h3>
                        <p>KES {fees.length ? (totalFees / fees.length).toFixed(2) : '0.00'}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                        <FontAwesomeIcon icon={faCoins} />
                    </div>
                    <div className="stat-info">
                        <h3>Students Paid</h3>
                        <p>{new Set(fees.map(f => f.student_id)).size}</p>
                    </div>
                </div>
            </div>

            {/* Record Payment Form */}
            {showForm && isAdmin && (
                <div className="form-container">
                    <h2>
                        <FontAwesomeIcon icon={faPlus} /> Record Payment
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
                                    <FontAwesomeIcon icon={faCalendarAlt} /> Payment Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.payment_date}
                                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faMoneyBillWave} /> Amount (KES)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Enter amount in KES"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                        {message && (
                            <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} /> Record Payment
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
                <span className="result-count">{filteredFees.length} records found</span>
            </div>

            {/* Fees Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Student</th>
                            <th>Amount (KES)</th>
                            <th>Payment Date</th>
                            <th>Receipt ID</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFees.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 5} className="empty-state">
                                    <FontAwesomeIcon icon={faCoins} />
                                    <p>No payment records</p>
                                    <span>Record your first payment to get started</span>
                                </td>
                            </tr>
                        ) : (
                            filteredFees.map((fee, index) => (
                                <tr key={fee.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="student-name-cell">
                                            <FontAwesomeIcon icon={faUser} className="name-icon" />
                                            {fee.student_name || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="amount-cell">
                                        <span className="amount-tag">
                                            KES {fee.amount}
                                        </span>
                                    </td>
                                    <td>{fee.payment_date}</td>
                                    <td>
                                        <span className="receipt-tag">
                                            <FontAwesomeIcon icon={faReceipt} />
                                            {fee.receipt_id || 'N/A'}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDelete(fee.id)}
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

export default Fees;