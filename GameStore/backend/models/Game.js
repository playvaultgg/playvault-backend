const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: 'No description provided' },
    price: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'Action' },
    rating: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    platform: { type: String, default: 'PC' },
    countInStock: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('Game', gameSchema);
