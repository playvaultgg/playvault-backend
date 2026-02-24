const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// @route   GET /api/games
// @desc    Get all active games
router.get('/', async (req, res) => {
    try {
        const games = await Game.find({ isActive: true });
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/games/:id
// @desc    Get single game
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (game) res.json(game);
        else res.status(404).json({ message: 'Game not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
