const express = require('express');
const Result = require('../models/Result');
const Student = require('../models/Student');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// Get all results
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const results = await Result.getAll();
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get results for a student
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const students = await Student.getAll();
        const studentRecord = students.find(s => s.id === parseInt(studentId));
        
        // Student can only see own results
        if (req.user.role === 'student') {
            const student = students.find(s => s.name === req.user.username);
            if (student && student.id !== parseInt(studentId)) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        
        const results = await Result.getByStudent(studentId);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add result (Admin & Lecturer)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            return res.status(403).json({ message: 'Students cannot add results' });
        }
        
        const { student_id, course_id, marks } = req.body;
        
        // Calculate grade
        let grade = 'F';
        if (marks >= 90) grade = 'A+';
        else if (marks >= 80) grade = 'A';
        else if (marks >= 70) grade = 'B+';
        else if (marks >= 60) grade = 'B';
        else if (marks >= 50) grade = 'C';
        else if (marks >= 40) grade = 'D';
        
        // Check duplicate
        const duplicate = await Result.checkDuplicate(student_id, course_id);
        if (duplicate) {
            return res.status(400).json({ message: 'Result already exists for this student and course' });
        }
        
        const result = await Result.create({ ...req.body, grade });
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete result (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete results' });
        }
        
        await Result.delete(req.params.id);
        res.json({ message: 'Result deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;