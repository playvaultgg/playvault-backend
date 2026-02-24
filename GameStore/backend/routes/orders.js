const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Create new order
router.post('/', protect, async (req, res) => {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    try {
        const order = new Order({
            user: req.user.id,
            orderItems,
            totalPrice,
            isPaid: true, // Simulating payment success
            paidAt: Date.now()
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('paymentId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
