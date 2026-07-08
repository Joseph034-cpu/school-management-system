const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const pool = require('../config/database');

// Get all timetable entries
router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, c.name as course_name 
            FROM timetable t 
            JOIN courses c ON t.course_id = c.id 
            ORDER BY t.day, t.time_slot
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Get timetable error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add timetable entry (Admin & Lecturer)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            return res.status(403).json({ message: 'Students cannot add timetable entries' });
        }
        const { day, course_id, time_slot } = req.body;
        const result = await pool.query(
            'INSERT INTO timetable (day, course_id, time_slot) VALUES ($1, $2, $3) RETURNING *',
            [day, course_id, time_slot]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Add timetable error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete timetable entry (Admin & Lecturer)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            return res.status(403).json({ message: 'Students cannot delete timetable entries' });
        }
        await pool.query('DELETE FROM timetable WHERE id = $1', [req.params.id]);
        res.json({ message: 'Timetable entry deleted successfully' });
    } catch (error) {
        console.error('Delete timetable error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;