const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    platform: { type: String, required: true, default: 'PC' },
    countInStock: { type: Number, required: true, default: 100 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
