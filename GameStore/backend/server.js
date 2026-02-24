require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));

// Routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// Production: serve frontend build from backend (single deploy on Railway)
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// Connect to MongoDB conditionally (Jest handles memory DB in tests)
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;

    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gamevault')
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err.message));

    // Bind to 0.0.0.0 so Railway/external hosts can reach the app
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
