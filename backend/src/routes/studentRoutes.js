const express = require('express');
const Student = require('../models/Student');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// Get all students (Admin & Lecturer)
router.get('/', auth, async (req, res) => {
    try {
        const students = await Student.getAll();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add student (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can add students' });
        }
        
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete student (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete students' });
        }
        
        await Student.delete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Search students
router.get('/search', auth, async (req, res) => {
    try {
        const { q } = req.query;
        const students = await Student.search(q);
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;