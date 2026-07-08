const express = require('express');
const Course = require('../models/Course');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// Get all courses
router.get('/', auth, async (req, res) => {
    try {
        const courses = await Course.getAll();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add course (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can add courses' });
        }
        
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete course (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete courses' });
        }
        
        await Course.delete(req.params.id);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;