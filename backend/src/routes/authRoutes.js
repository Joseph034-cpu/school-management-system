const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ===== LOGIN =====
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }
        
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                full_name: user.full_name,
                department: user.department
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ===== SIGNUP (Student Only) =====
router.post('/signup', async (req, res) => {
    try {
        const { username, password, full_name, security_question, security_answer } = req.body;
        
        if (!username || !password || !full_name || !security_question || !security_answer) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existing = await User.findByUsername(username);
        if (existing) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            username,
            password: hashedPassword,
            role: 'student', // Force student role
            full_name,
            department: 'Student',
            email: '',
            security_question,
            security_answer
        });

        res.status(201).json({ 
            success: true,
            message: 'Student account created successfully',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ===== GET SECURITY QUESTION =====
router.post('/security-question', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ message: 'Username required' });
        }
        
        const user = await User.getSecurityQuestion(username);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            security_question: user.security_question,
            hasAnswer: !!user.security_answer
        });
    } catch (error) {
        console.error('Security question error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ===== RESET PASSWORD =====
router.post('/reset-password', async (req, res) => {
    try {
        const { username, securityAnswer, newPassword } = req.body;
        
        if (!username || !securityAnswer || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check security answer (case insensitive)
        if (user.security_answer?.toLowerCase() !== securityAnswer.toLowerCase()) {
            return res.status(401).json({ message: 'Incorrect security answer' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(username, hashedPassword);

        res.json({ 
            success: true,
            message: 'Password reset successfully' 
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;