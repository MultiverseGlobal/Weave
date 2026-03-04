const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const { sequenceTracks } = require('../engine/algorithm');
const { toCamelot } = require('../engine/camelot');
const router = express.Router();

const SPOTIFY_API = 'https://api.spotify.com/v1';

/**
 * POST /sequencer/sequence
 * Executes the sequencing algorithm on a playlist.
 */
router.post('/sequence', authMiddleware, async (req, res) => {
    try {
        const { playlistId } = req.body;

        // 1. Fetch tracks with features (Internal reuse of the logic or simple fetch)
        // For MVP, we'll fetch them here to keep it self-contained
        const tracksResponse = await axios.get(`${SPOTIFY_API}/playlists/${playlistId}/tracks?limit=100`, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });

        const tracks = tracksResponse.data.items.map(item => item.track).filter(Boolean);
        const trackIds = tracks.map(t => t.id).join(',');

        const featuresResponse = await axios.get(`${SPOTIFY_API}/audio-features?ids=${trackIds}`, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });

        const featuresMap = featuresResponse.data.audio_features.reduce((acc, f) => {
            if (f) acc[f.id] = f;
            return acc;
        }, {});

        const tracksWithFeatures = tracks.map(track => {
            const features = featuresMap[track.id];
            return {
                ...track,
                ...features,
                camelot: features ? toCamelot(features.key, features.mode) : '—'
            };
        });

        // 2. Run the sequence algorithm
        const orderedTracks = sequenceTracks(tracksWithFeatures);

        res.json({ orderedTracks });

    } catch (error) {
        console.error('Sequencing error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Sequencing failed' });
    }
});

/**
 * POST /sequencer/export
 * Creates a new Spotify playlist with the ordered tracks.
 */
router.post('/export', authMiddleware, async (req, res) => {
    try {
        const { playlistId, tracks } = req.body;

        // 1. Get user ID
        const userResponse = await axios.get(`${SPOTIFY_API}/me`, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });
        const userId = userResponse.data.id;

        // 2. Get original playlist name
        const playlistResponse = await axios.get(`${SPOTIFY_API}/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });
        const originalName = playlistResponse.data.name;

        // 3. Create new playlist
        const createResponse = await axios.post(`${SPOTIFY_API}/users/${userId}/playlists`, {
            name: `${originalName} [Weave IO]`,
            description: 'Optimized set by Weave IO — Precision, craft, intelligent curation.',
            public: false
        }, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });

        const newPlaylistId = createResponse.data.id;

        // 4. Add tracks in order
        const trackUris = tracks.map(t => t.uri);
        await axios.post(`${SPOTIFY_API}/playlists/${newPlaylistId}/tracks`, {
            uris: trackUris
        }, {
            headers: { Authorization: `Bearer ${req.spotifyToken}` }
        });

        res.json({ success: true, playlistUrl: createResponse.data.external_urls.spotify });

    } catch (error) {
        console.error('Export error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Export failed' });
    }
});

module.exports = router;
