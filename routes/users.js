const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.model'); 
const authMiddleware = require('../middlewares/authMiddleware'); 
const router = express.Router();
const adminMiddleware = require('../middlewares/adminMiddleware');
const bcrypt = require('bcrypt');

//Check valid MongoDB ObjectId
const validateObjectId = (paramName) => {
    return (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
            return res.status(400).json({ error: `Invalid ${paramName}` });
        }
        next();
    };
};

// Get all users
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get specific user by ID
router.get('/:userId', authMiddleware, validateObjectId('userId'), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update user by ID
router.put('/:userId', authMiddleware, validateObjectId('userId'), async (req, res) => {
    if (req.user.userId !== req.params.userId && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
    }
    if (!req.body.username && !req.body.password) {
        return res.status(400).json({ error: 'Username or password required' });
    }

    const updatedData = {};
    if (req.body.username) {
        updatedData.username = req.body.username;
    }
    if (req.body.password) {
        const saltRounds = 10;
        updatedData.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.userId, updatedData, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

//Promote user to admin
router.put('/:userId/promote', authMiddleware, adminMiddleware, validateObjectId('userId'), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
    
        user.isAdmin = true;
        await user.save();
    
        res.json({ message: 'User promoted to admin successfully', user });
        } catch (err) {
        res.status(500).json({ error: 'Failed to promote user to admin' });
    }
});

module.exports = {router, validateObjectId};