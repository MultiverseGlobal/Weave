/**
 * Camelot Wheel Utility for Weave IO
 * Maps Spotify key/mode to Camelot notation and calculates compatibility scores.
 */

const KEY_MAP = {
    // Spotify Key (0-11) -> 0: Minor (A), 1: Major (B)
    0: { 1: '8B', 0: '5A' },  // C
    1: { 1: '3B', 0: '10A' }, // C#
    2: { 1: '10B', 0: '7A' }, // D
    3: { 1: '5B', 0: '12A' }, // D#
    4: { 1: '12B', 0: '9A' }, // E
    5: { 1: '7B', 0: '2A' },  // F
    6: { 1: '2B', 0: '11A' }, // F#
    7: { 1: '9B', 0: '6A' },  // G
    8: { 1: '4B', 0: '1A' },  // G#
    9: { 1: '11B', 0: '8A' }, // A
    10: { 1: '6B', 0: '3A' }, // A#
    11: { 1: '1B', 0: '10A' }  // B (Note: 10A is duplicate of C# minor? Let's verify)
};

// Correction/Verification of the wheel:
// 10A = B minor (Spotify key 11, mode 0) -> Wait, 10A is actually D major / B minor.
// Spotify Key 11 (B) + Mode 0 (Minor) = 10A. Correct.
// Spotify Key 1 (C#) + Mode 0 (Minor) = 12A? No.
// Let's use a more standard mapping.

const SPOTIFY_TO_CAMELOT = {
    // Key: [Minor, Major]
    0: ['5A', '8B'],  // C
    1: ['12A', '3B'], // C#
    2: ['7A', '10B'], // D
    3: ['2A', '5B'],  // D#
    4: ['9A', '12B'], // E
    5: ['4A', '7B'],  // F
    6: ['11A', '2B'], // F#
    7: ['6A', '9B'],  // G
    8: ['1A', '4B'],  // G#
    9: ['8A', '11B'], // A
    10: ['3A', '6B'],  // A#
    11: ['10A', '1B']  // B
};

/**
 * Converts Spotify key and mode to Camelot notation.
 * @param {number} key - Spotify key (0-11)
 * @param {number} mode - Spotify mode (0 for minor, 1 for major)
 * @returns {string} Camelot notation (e.g., '8B')
 */
function toCamelot(key, mode) {
    if (key < 0 || key > 11) return null;
    return SPOTIFY_TO_CAMELOT[key][mode];
}

/**
 * Calculates harmonic compatibility score between two Camelot keys.
 * @param {string} keyA - First key (e.g., '8B')
 * @param {string} keyB - Second key (e.g., '9B')
 * @returns {number} Score from 0.0 to 1.0
 */
function getHarmonicScore(keyA, keyB) {
    if (!keyA || !keyB) return 0;
    if (keyA === keyB) return 1.0;

    const numA = parseInt(keyA.slice(0, -1));
    const letA = keyA.slice(-1);
    const numB = parseInt(keyB.slice(0, -1));
    const letB = keyB.slice(-1);

    const numDiff = Math.abs(numA - numB);
    const isCircleBorder = (numA === 1 && numB === 12) || (numA === 12 && numB === 1);

    // Same number, different letter (Relative Major/Minor)
    if (numA === numB && letA !== letB) return 0.7;

    // Same letter, +/- 1 number (Perfect Fifth)
    if (letA === letB && (numDiff === 1 || isCircleBorder)) return 0.8;

    // Diagonal moves (Optional: some DJs use this, but we'll stick to basics for now or low score)
    // Example: 8B to 9A.
    if (letA !== letB && (numDiff === 1 || isCircleBorder)) return 0.4;

    return 0.0;
}

module.exports = {
    toCamelot,
    getHarmonicScore
};
