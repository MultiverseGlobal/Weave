require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Weave IO API is running' });
});

// Auth routes (placeholders)
app.use('/auth', require('./routes/auth'));

// Playlist routes (placeholders)
app.use('/playlists', require('./routes/playlists'));

// Sequencer routes (placeholders)
app.use('/sequencer', require('./routes/sequencer'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
