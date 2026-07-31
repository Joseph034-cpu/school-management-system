import React from 'react';

const Dashboard = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0c10',
            color: 'white',
            padding: '40px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ color: '#00d4ff', fontSize: '32px' }}>🏫 Student Management System</h1>
            <p style={{ fontSize: '20px', marginTop: '20px' }}>Welcome, Admin User!</p>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginTop: '40px'
            }}>
                <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '10px' }}>
                    <h3>Total Students</h3>
                    <p style={{ fontSize: '28px', color: '#00d4ff' }}>1,234</p>
                </div>
                <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '10px' }}>
                    <h3>Total Courses</h3>
                    <p style={{ fontSize: '28px', color: '#10b981' }}>45</p>
                </div>
                <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '10px' }}>
                    <h3>Attendance</h3>
                    <p style={{ fontSize: '28px', color: '#f59e0b' }}>94%</p>
                </div>
                <div style={{ background: '#1a1a2e', padding: '20px', borderRadius: '10px' }}>
                    <h3>Fees Collected</h3>
                    <p style={{ fontSize: '28px', color: '#8b5cf6' }}>KES 45,600</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
