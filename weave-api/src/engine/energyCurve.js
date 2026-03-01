/**
 * Energy Curve model for Weave IO
 * Defines the target energy progression of a set.
 */

const CURVE_MODELS = {
    // gradual energy rise → peak → controlled landing
    DEFAULT: [
        { tier: 'Low', ratio: 0.15 }, // Start low
        { tier: 'Mid', ratio: 0.25 }, // Build up
        { tier: 'High', ratio: 0.40 }, // Peak section
        { tier: 'Mid', ratio: 0.15 }, // Controlled landing
        { tier: 'Low', ratio: 0.05 }  // End smooth
    ]
};

/**
 * Maps a set of tracks to the target energy curve tiers.
 * @param {number} totalTracks 
 * @returns {string[]} Array of tiers ('Low', 'Mid', 'High') for each slot
 */
function getTargetCurve(totalTracks, model = 'DEFAULT') {
    const curve = CURVE_MODELS[model];
    const targetTiers = [];

    curve.forEach(segment => {
        const segmentCount = Math.round(segment.ratio * totalTracks);
        for (let i = 0; i < segmentCount; i++) {
            targetTiers.push(segment.tier);
        }
    });

    // Handle rounding mismatches
    while (targetTiers.length < totalTracks) {
        targetTiers.push(curve[curve.length - 1].tier);
    }
    while (targetTiers.length > totalTracks) {
        targetTiers.pop();
    }

    return targetTiers;
}

/**
 * Classifies a track into an energy tier.
 * @param {number} energy (0-1)
 * @returns {string} 'Low', 'Mid', or 'High'
 */
function getEnergyTier(energy) {
    if (energy < 0.4) return 'Low';
    if (energy < 0.7) return 'Mid';
    return 'High';
}

module.exports = {
    getTargetCurve,
    getEnergyTier
};
