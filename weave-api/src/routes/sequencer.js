const express = require('express');
const router = express.Router();

// POST /sequencer/sequence
router.post('/sequence', (req, res) => {
    res.json({ message: 'Sequencing algorithm placeholder' });
});

// POST /sequencer/export
router.post('/export', (req, res) => {
    res.json({ message: 'Export to Spotify placeholder' });
});

module.exports = router;
