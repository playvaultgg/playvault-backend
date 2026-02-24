const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/contact
// @desc    Submit a message from the Contact Form
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const newMessage = new Message({ name, email, subject, message });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/contact/admin/contacts
// @desc    Get all contact messages (Admin only)
router.get('/admin/contacts', protect, admin, async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/contact/admin/contacts/:id/read
// @desc    Mark a message as read (Admin only)
router.put('/admin/contacts/:id/read', protect, admin, async (req, res) => {
    try {
        const msg = await Message.findById(req.params.id);
        if (msg) {
            msg.isRead = true;
            await msg.save();
            res.json(msg);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/contact/admin/contacts/:id
// @desc    Delete a message (Admin only)
router.delete('/admin/contacts/:id', protect, admin, async (req, res) => {
    try {
        const msg = await Message.findById(req.params.id);
        if (msg) {
            await msg.deleteOne();
            res.json({ success: true, message: 'Message Deleted' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
