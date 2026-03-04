/**
 * Middleware to extract the Spotify access token from cookies.
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated with Spotify' });
    }

    // Attach token to request object for downstream routes
    req.spotifyToken = token;
    next();
};

module.exports = authMiddleware;
