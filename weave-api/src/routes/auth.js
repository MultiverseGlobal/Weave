const express = require('express');
const router = express.Router();

// GET /auth/login
router.get('/login', (req, res) => {
    res.json({ message: 'Login route placeholder' });
});

// GET /auth/callback
router.get('/callback', (req, res) => {
    res.json({ message: 'Callback route placeholder' });
});

// GET /auth/refresh
router.get('/refresh', (req, res) => {
    res.json({ message: 'Refresh token route placeholder' });
});

module.exports = router;
