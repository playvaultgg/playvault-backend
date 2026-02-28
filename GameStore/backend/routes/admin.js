const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Game = require('../models/Game');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');


const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @route   POST /api/admin/login
// @desc    Admin login & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        // Only allow if user is an admin
        if (user && user.role === 'admin' && (await user.matchPassword(password))) {
            user.lastLoginAt = new Date();
            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid Admin Credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/admin/me
// @desc    Get admin profile
router.get('/me', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalGames = await Game.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const orders = await Order.find({ isPaid: true });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        const recentGames = await Game.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            totalGames,
            totalUsers,
            totalOrders,
            totalRevenue: Number(totalRevenue.toFixed(2)),
            recentGames
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/admin/upload-image
// @desc    Upload game image to cloud storage
router.post('/upload-image', protect, admin, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('MULTER_UPLOAD_ERROR:', err);
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image file' });
        }
        res.json({ imageUrl: req.file.path });
    } catch (err) {
        console.error('CLOUDINARY_UPLOAD_ERROR:', err);
        res.status(500).json({ message: 'Cloudinary Upload Failed: ' + err.message });
    }
});


// @route   POST /api/admin/games

// @desc    Add new game
router.post('/games', protect, admin, async (req, res) => {
    try {
        const game = new Game({ ...req.body });
        const createdGame = await game.save();
        res.status(201).json(createdGame);
    } catch (err) {
        console.error('SAVE_GAME_ERROR:', err);
        res.status(500).json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    }
});


// @route   PUT /api/admin/games/:id
// @desc    Update a game
router.put('/games/:id', protect, admin, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (game) {
            game.title = req.body.title || game.title;
            game.price = req.body.price || game.price;
            game.description = req.body.description || game.description;
            game.category = req.body.category || game.category;
            game.platform = req.body.platform || game.platform;
            game.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : game.countInStock;
            game.imageUrl = req.body.imageUrl || game.imageUrl;
            game.isActive = req.body.isActive !== undefined ? req.body.isActive : game.isActive;

            const updatedGame = await game.save();
            res.json(updatedGame);
        } else {
            res.status(404).json({ message: 'Game not found' });
        }
    } catch (err) {
        console.error('UPDATE_GAME_ERROR:', err);
        res.status(500).json({ message: err.message });
    }
});


// @route   DELETE /api/admin/games/:id
// @desc    Delete a game
router.delete('/games/:id', protect, admin, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (game) {
            await Game.deleteOne({ _id: game._id });
            res.json({ message: 'Game removed' });
        } else {
            res.status(404).json({ message: 'Game not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/admin/games
// @desc    Fetch all games for admin table (includes inactive)
router.get('/games', protect, admin, async (req, res) => {
    try {
        const games = await Game.find({});
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/admin/categories
// @desc    Create a new category
router.post('/categories', protect, admin, async (req, res) => {
    try {
        const { name } = req.body;
        const catExists = await Category.findOne({ name });
        if (catExists) return res.status(400).json({ message: 'Category already exists' });

        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/admin/categories
// @desc    Get all categories
router.get('/categories', protect, admin, async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/admin/payments/pending
// @desc    Get all UNDER_REVIEW payments
router.get('/payments/pending', protect, admin, async (req, res) => {
    try {
        const Payment = require('../models/Payment');
        const payments = await Payment.find({ paymentStatus: 'UNDER_REVIEW' })
            .populate('user', 'name email')
            .populate('order', 'totalPrice');
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/admin/payments/config
// @desc    Get global UPI / QR payment configuration
router.get('/payments/config', protect, admin, async (req, res) => {
    try {
        const PaymentConfig = require('../models/PaymentConfig');

        let config = await PaymentConfig.findOne();
        if (!config) {
            // Seed with current hardcoded defaults
            config = await PaymentConfig.create({
                upiId: 'gundelwar@fam',
                payeeName: 'Shriniwas Santosh Gundelwar'
            });
        }

        res.json(config);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/admin/payments/config
// @desc    Update global UPI / QR payment configuration
router.put('/payments/config', protect, admin, async (req, res) => {
    try {
        const { upiId, payeeName } = req.body;
        if (!upiId || !payeeName) {
            return res.status(400).json({ message: 'upiId and payeeName are required' });
        }

        const PaymentConfig = require('../models/PaymentConfig');

        let config = await PaymentConfig.findOne();
        if (!config) {
            config = new PaymentConfig({ upiId, payeeName });
        } else {
            config.upiId = upiId;
            config.payeeName = payeeName;
        }

        await config.save();
        res.json(config);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/admin/payments/:id/confirm
// @desc    Confirm a static QR payment
router.post('/payments/:id/confirm', protect, admin, async (req, res) => {
    try {
        const Payment = require('../models/Payment');
        const payment = await Payment.findById(req.params.id);

        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        if (payment.paymentStatus === 'success') return res.status(400).json({ message: 'Already approved' });

        const order = await Order.findById(payment.order);

        payment.paymentStatus = 'success';
        payment.receiptUrl = `http://localhost:5000/api/payments/receipt/${order._id}`;
        await payment.save();

        order.isPaid = true;
        order.paidAt = Date.now();
        await order.save();

        // Deduct stock
        for (const item of order.orderItems) {
            const gameDoc = await Game.findById(item.game);
            if (gameDoc) {
                gameDoc.countInStock = Math.max(0, gameDoc.countInStock - 1);
                await gameDoc.save();
            }
        }

        res.json({ message: 'Payment approved successfully', payment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/admin/payments/:id/reject
// @desc    Reject a static QR payment
router.post('/payments/:id/reject', protect, admin, async (req, res) => {
    try {
        const Payment = require('../models/Payment');
        const payment = await Payment.findById(req.params.id);

        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        payment.paymentStatus = 'failed';
        await payment.save();

        res.json({ message: 'Payment rejected' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
router.get('/orders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .populate('orderItems.game', 'title price')
            .sort({ createdAt: -1 });

        // Also fetch the payment status for each order to have a robust list
        const Payment = require('../models/Payment');
        const payments = await Payment.find({});

        // Merge payments cleanly into orders map for admin table
        const orderData = orders.map(order => {
            const relatedPayment = payments.find(p => p.order.toString() === order._id.toString());
            return {
                ...order.toObject(),
                paymentStatus: relatedPayment ? relatedPayment.paymentStatus : 'Unknown',
                paymentMethod: relatedPayment ? relatedPayment.paymentMethod : order.paymentMethod,
                transactionId: relatedPayment ? relatedPayment.transactionId : null
            };
        });

        res.json(orderData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/admin/orders/:id
// @desc    Delete an order (e.g. after complete); also remove related payment record
router.delete('/orders/:id', protect, admin, async (req, res) => {
    try {
        const Payment = require('../models/Payment');
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        await Payment.deleteMany({ order: order._id });
        await Order.deleteOne({ _id: order._id });
        res.json({ message: 'Order removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
