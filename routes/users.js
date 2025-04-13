const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.model'); 
const authMiddleware = require('../middlewares/authMiddleware'); 
const router = express.Router();
const adminMiddleware = require('../middlewares/adminMiddleware');

//Check valid MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  next();
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
router.get('/:userId', authMiddleware, validateObjectId, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update user by ID
router.put('/:userId', authMiddleware, validateObjectId, async (req, res) => {
    if (req.user.userId !== req.params.userId && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

//Promote user to admin
router.put('/:userId/promote', authMiddleware, adminMiddleware, validateObjectId, async (req, res) => {
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

module.exports = router;