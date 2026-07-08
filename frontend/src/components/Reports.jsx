import React, { useState } from 'react';
import { students, courses, attendance, fees, results } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileAlt, faUsers, faBook, faClipboardList, 
    faCoins, faChartBar, faDownload, faPrint,
    faUserGraduate, faCalendarAlt, faMoneyBillWave,
    faAward
} from '@fortawesome/free-solid-svg-icons';
import './Reports.css';

const Reports = () => {
    const { user, isAdmin, isLecturer } = useAuth();
    const [reportData, setReportData] = useState(null);
    const [reportType, setReportType] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportTitle, setReportTitle] = useState('');

    const canAccess = isAdmin || isLecturer;

    const reportTypes = [
        { id: 'students', icon: faUsers, label: 'Student List', description: 'View all registered students' },
        { id: 'attendance', icon: faClipboardList, label: 'Attendance Report', description: 'View attendance records' },
        { id: 'fees', icon: faCoins, label: 'Fee Report', description: 'View payment history' },
        { id: 'results', icon: faChartBar, label: 'Results Report', description: 'View exam results' },
        { id: 'courses', icon: faBook, label: 'Courses Report', description: 'View all courses' },
    ];

    const generateReport = async (type) => {
        setLoading(true);
        setReportType(type);
        setReportTitle(reportTypes.find(r => r.id === type)?.label || '');
        
        try {
            let data;
            let headers = [];
            let rows = [];

            switch(type) {
                case 'students':
                    const studentsRes = await students.getAll();
                    data = studentsRes.data || [];
                    headers = ['#', 'Name', 'Admission', 'Course'];
                    rows = data.map((s, i) => [i + 1, s.name, s.admission, s.course]);
                    break;
                    
                case 'attendance':
                    const attendanceRes = await attendance.getAll();
                    data = attendanceRes.data || [];
                    headers = ['#', 'Student', 'Date', 'Status'];
                    rows = data.map((a, i) => [
                        i + 1, 
                        a.student_name || 'Unknown', 
                        a.date, 
                        a.status
                    ]);
                    break;
                    
                case 'fees':
                    const feesRes = await fees.getAll();
                    data = feesRes.data || [];
                    headers = ['#', 'Student', 'Amount (KES)', 'Date', 'Receipt ID'];
                    rows = data.map((f, i) => [
                        i + 1, 
                        f.student_name || 'Unknown', 
                        f.amount, 
                        f.payment_date,
                        f.receipt_id || 'N/A'
                    ]);
                    break;
                    
                case 'results':
                    const resultsRes = await results.getAll();
                    data = resultsRes.data || [];
                    headers = ['#', 'Student', 'Course', 'Marks', 'Grade'];
                    rows = data.map((r, i) => {
                        const grade = r.marks >= 90 ? 'A+' : r.marks >= 80 ? 'A' : r.marks >= 70 ? 'B+' : r.marks >= 60 ? 'B' : r.marks >= 50 ? 'C' : r.marks >= 40 ? 'D' : 'F';
                        return [i + 1, r.student_name || 'Unknown', r.course_name || 'Unknown', r.marks, grade];
                    });
                    break;
                    
                case 'courses':
                    const coursesRes = await courses.getAll();
                    data = coursesRes.data || [];
                    headers = ['#', 'Name', 'Code', 'Description'];
                    rows = data.map((c, i) => [i + 1, c.name, c.code, c.description || '-']);
                    break;
                    
                default:
                    data = [];
            }
            
            setReportData({ headers, rows });
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Error generating report');
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        if (!reportData) return;
        
        const { headers, rows } = reportData;
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.join(',') + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (!canAccess) {
        return (
            <div className="reports-page">
                <div className="access-denied">
                    <FontAwesomeIcon icon={faFileAlt} />
                    <h1>Access Denied</h1>
                    <p>You do not have permission to view reports.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Reports</h1>
                    <p>Generate and view system reports</p>
                </div>
            </div>

            {/* Report Type Cards */}
            <div className="reports-grid">
                {reportTypes.map((type) => (
                    <div 
                        key={type.id} 
                        className="report-card"
                        onClick={() => generateReport(type.id)}
                    >
                        <div className="report-icon">
                            <FontAwesomeIcon icon={type.icon} />
                        </div>
                        <h3>{type.label}</h3>
                        <p>{type.description}</p>
                        <button className="btn btn-outline">
                            <FontAwesomeIcon icon={faFileAlt} /> Generate
                        </button>
                    </div>
                ))}
            </div>

            {/* Report Output */}
            {loading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Generating report...</p>
                </div>
            )}

            {reportData && !loading && (
                <div className="report-output">
                    <div className="report-header">
                        <div>
                            <h2>
                                <FontAwesomeIcon icon={faFileAlt} /> {reportTitle} Report
                            </h2>
                            <p>
                                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                        <div className="report-actions">
                            <button className="btn btn-primary" onClick={handlePrint}>
                                <FontAwesomeIcon icon={faPrint} /> Print
                            </button>
                            <button className="btn btn-success" onClick={handleExport}>
                                <FontAwesomeIcon icon={faDownload} /> Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="report-table-container">
                        <table>
                            <thead>
                                <tr>
                                    {reportData.headers.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={reportData.headers.length} className="empty-state">
                                            <FontAwesomeIcon icon={faFileAlt} />
                                            <p>No data found for this report</p>
                                        </td>
                                    </tr>
                                ) : (
                                    reportData.rows.map((row, index) => (
                                        <tr key={index}>
                                            {row.map((cell, cellIndex) => (
                                                <td key={cellIndex}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="report-footer">
                        <p>
                            <FontAwesomeIcon icon={faFileAlt} /> 
                            {reportData.rows.length} records found
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;