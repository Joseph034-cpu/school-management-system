const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// Get all attendance
router.get('/', auth, async (req, res) => {
    try {
        const attendance = await Attendance.getAll();
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get attendance for a student (Student sees own)
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Check if student is viewing own attendance
        const student = await Student.getAll();
        const studentRecord = student.find(s => s.id === parseInt(studentId));
        
        if (req.user.role === 'student' && req.user.username !== studentRecord?.name) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const attendance = await Attendance.getByStudent(studentId);
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add attendance (Admin & Lecturer)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            return res.status(403).json({ message: 'Students cannot mark attendance' });
        }
        
        const { student_id, date, status } = req.body;
        
        // Check duplicate
        const duplicate = await Attendance.checkDuplicate(student_id, date);
        if (duplicate) {
            return res.status(400).json({ message: 'Attendance already marked for this date' });
        }
        
        const attendance = await Attendance.create(req.body);
        res.status(201).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete attendance (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete attendance records' });
        }
        
        await Attendance.delete(req.params.id);
        res.json({ message: 'Attendance deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;