const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create lecturer (Admin only)
router.post('/lecturer', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can create lecturers' });
        }
        
        const { username, password, full_name, department, email } = req.body;
        
        const existing = await User.findByUsername(username);
        if (existing) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            username,
            password: hashedPassword,
            role: 'lecturer',
            full_name,
            department,
            email,
            security_question: 'What is your favorite color?',
            security_answer: 'blue'
        });

        res.status(201).json({
            message: 'Lecturer created successfully',
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                full_name: user.full_name
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset user password (Admin only)
router.post('/reset-password', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can reset passwords' });
        }
        
        const { username, newPassword } = req.body;
        
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(username, hashedPassword);
        
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user (Admin only)
router.delete('/:username', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete users' });
        }
        
        const { username } = req.params;
        
        if (username === req.user.username) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }
        
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin accounts' });
        }
        
        await User.deleteByUsername(username);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;