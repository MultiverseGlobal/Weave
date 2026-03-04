/**
 * Sequencing Algorithm (Deno/Edge Function Port)
 */
import { calculatePairScore } from "./scorer.ts";
import { getTargetCurve, getEnergyTier } from "./energyCurve.ts";

export const sequenceTracks = (tracks) => {
    if (!tracks.length) return [];

    const unvisited = [...tracks];
    const ordered = [];
    const targetCurve = getTargetCurve(tracks.length);

    // 1. Initial Selection: Find best 'Low' energy opener
    const firstTier = targetCurve[0];
    let currentIdx = unvisited.findIndex(t => getEnergyTier(t.energy) === firstTier);
    if (currentIdx === -1) currentIdx = 0;

    let current = unvisited.splice(currentIdx, 1)[0];
    ordered.push(current);

    // 2. Greedy Loop
    for (let i = 1; i < targetCurve.length; i++) {
        const targetTier = targetCurve[i];

        let bestScore = -1;
        let bestIdx = -1;

        for (let j = 0; j < unvisited.length; j++) {
            const candidate = unvisited[j];
            const tierMatchBonus = getEnergyTier(candidate.energy) === targetTier ? 0.2 : 0;

            const score = calculatePairScore(current, candidate) + tierMatchBonus;

            if (score > bestScore) {
                bestScore = score;
                bestIdx = j;
            }
        }

        if (bestIdx !== -1) {
            current = unvisited.splice(bestIdx, 1)[0];
            ordered.push(current);
        }
    }

    return ordered;
};
