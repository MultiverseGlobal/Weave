/**
 * Sequencing Algorithm for Weave IO
 * Uses a greedy nearest-neighbor approach guided by an energy curve.
 */

const { calculatePairScore } = require('./scorer');
const { getTargetCurve, getEnergyTier } = require('./energyCurve');

/**
 * Generates an optimized sequence of tracks.
 * @param {Object[]} tracks - Array of track objects with audio features
 * @returns {Object[]} Ordered array of tracks
 */
function sequenceTracks(tracks) {
    if (tracks.length === 0) return [];
    if (tracks.length === 1) return tracks;

    const total = tracks.length;
    const targetTiers = getTargetCurve(total);
    const unvisited = [...tracks];
    const ordered = [];

    // 1. Pick the best opener
    const openingTier = targetTiers[0];
    let currentTrackIndex = unvisited.findIndex(t => getEnergyTier(t.energy) === openingTier);

    if (currentTrackIndex === -1) currentTrackIndex = 0;

    let currentTrack = unvisited.splice(currentTrackIndex, 1)[0];
    ordered.push(currentTrack);

    // 2. Greedily pick the next best track based on the target tier
    for (let i = 1; i < total; i++) {
        const targetTier = targetTiers[i];

        let bestScore = -1;
        let bestIndex = -1;

        let candidates = unvisited.map((t, idx) => ({ track: t, originalIndex: idx }))
            .filter(c => getEnergyTier(c.track.energy) === targetTier);

        if (candidates.length === 0) {
            candidates = unvisited.map((t, idx) => ({ track: t, originalIndex: idx }));
        }

        candidates.forEach(c => {
            const score = calculatePairScore(currentTrack, c.track);
            if (score > bestScore) {
                bestScore = score;
                bestIndex = c.originalIndex;
            }
        });

        currentTrack = unvisited.splice(bestIndex, 1)[0];
        ordered.push(currentTrack);
    }

    return ordered;
}

module.exports = {
    sequenceTracks
};
