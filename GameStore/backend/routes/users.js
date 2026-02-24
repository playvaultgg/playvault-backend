const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
