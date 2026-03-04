const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const SPOTIFY_API = 'https://api.spotify.com/v1';

/**
 * GET /playlists
 * List all of the user's playlists.
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const response = await axios.get(`${SPOTIFY_API}/me/playlists`, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching playlists:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: 'Failed to fetch playlists' });
    }
});

/**
 * GET /playlists/:id/tracks
 * Fetch tracks + audio features for a specific playlist.
 */
router.get('/:id/tracks', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Get playlist info
        const infoResponse = await axios.get(`${SPOTIFY_API}/playlists/${id}`, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });

        // 2. Get tracks (simplified for MVP - handle first 100)
        const tracksResponse = await axios.get(`${SPOTIFY_API}/playlists/${id}/tracks?limit=100`, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });

        const tracks = tracksResponse.data.items.map(item => item.track).filter(Boolean);
        const trackIds = tracks.map(t => t.id).join(',');

        // 3. Get audio features for these tracks
        const featuresResponse = await axios.get(`${SPOTIFY_API}/audio-features?ids=${trackIds}`, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });

        const featuresMap = featuresResponse.data.audio_features.reduce((acc, f) => {
            if (f) acc[f.id] = f;
            return acc;
        }, {});

        // 4. Merge features into track objects
        const tracksWithFeatures = tracks.map(track => ({
            ...track,
            ...featuresMap[track.id]
        }));

        res.json({
            info: infoResponse.data,
            tracks: tracksWithFeatures
        });

    } catch (error) {
        console.error('Error fetching tracks:', error.response?.data || error.message);
        res.status(error.status || 500).json({ error: 'Failed to fetch tracks' });
    }
});

module.exports = router;
