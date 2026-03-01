const express = require('express');
const router = express.Router();

// GET /playlists
router.get('/', (req, res) => {
    res.json({ message: 'Fetch playlists placeholder' });
});

// GET /playlists/:id/tracks
router.get('/:id/tracks', (req, res) => {
    res.json({ message: `Fetch tracks for playlist ${req.params.id} placeholder` });
});

module.exports = router;
