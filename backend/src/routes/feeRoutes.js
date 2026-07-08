const express = require('express');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// Get all fees (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const fees = await Fee.getAll();
        res.json(fees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get fees for a student
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const students = await Student.getAll();
        const studentRecord = students.find(s => s.id === parseInt(studentId));
        
        // Student can only see own fees
        if (req.user.role === 'student') {
            const student = students.find(s => s.name === req.user.username);
            if (student && student.id !== parseInt(studentId)) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        
        const fees = await Fee.getByStudent(studentId);
        const total = await Fee.getTotal(studentId);
        
        res.json({ fees, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add fee (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can record fees' });
        }
        
        const fee = await Fee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete fee (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete fee records' });
        }
        
        await Fee.delete(req.params.id);
        res.json({ message: 'Fee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;