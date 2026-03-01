/**
 * Scoring engine for Weave IO
 * Calculates various continuity scores between two tracks.
 */

const { getHarmonicScore } = require('./camelot');

/**
 * Calculates a BPM proximity score.
 * Formula: max(0, 1 - |bpmA - bpmB| / 20)
 * This gives a perfect score (1.0) for same BPM and 0.0 for 20+ BPM difference.
 * @param {number} bpmA 
 * @param {number} bpmB 
 * @returns {number} Score 0-1
 */
function getBpmScore(bpmA, bpmB) {
    if (!bpmA || !bpmB) return 0;
    const diff = Math.abs(bpmA - bpmB);
    return Math.max(0, 1 - (diff / 20));
}

/**
 * Calculates an energy continuity score.
 * Formula: 1 - |energyA - energyB|
 * @param {number} energyA (0-1)
 * @param {number} energyB (0-1)
 * @returns {number} Score 0-1
 */
function getEnergyScore(energyA, energyB) {
    if (energyA === undefined || energyB === undefined) return 0;
    return 1 - Math.abs(energyA - energyB);
}

/**
 * Calculates a "vibe" score based on danceability and loudness.
 * @param {Object} trackA 
 * @param {Object} trackB 
 * @returns {number} Score 0-1
 */
function getVibeScore(trackA, trackB) {
    const dScore = 1 - Math.abs((trackA.danceability || 0) - (trackB.danceability || 0));

    // Normalize loudness (typical Spotify range -60 to 0)
    const lA = (trackA.loudness || -30) / -60;
    const lB = (trackB.loudness || -30) / -60;
    const lScore = 1 - Math.abs(lA - lB);

    return (dScore + lScore) / 2;
}

/**
 * Main scoring function that weights all factors.
 * Weights: Harmonic (40%), BPM (25%), Energy (25%), Vibe (10%)
 * @param {Object} trackA 
 * @param {Object} trackB 
 * @returns {number} Final composite score 0-1
 */
function calculatePairScore(trackA, trackB) {
    const harmonic = getHarmonicScore(trackA.camelot, trackB.camelot);
    const bpm = getBpmScore(trackA.tempo, trackB.tempo);
    const energy = getEnergyScore(trackA.energy, trackB.energy);
    const vibe = getVibeScore(trackA, trackB);

    return (
        harmonic * 0.40 +
        bpm * 0.25 +
        energy * 0.25 +
        vibe * 0.10
    );
}

module.exports = {
    calculatePairScore,
    getHarmonicScore,
    getBpmScore,
    getEnergyScore,
    getVibeScore
};
