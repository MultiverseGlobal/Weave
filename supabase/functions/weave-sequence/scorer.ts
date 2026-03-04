/**
 * Scoring Engine (Deno/Edge Function Port)
 */
import { getHarmonicScore } from "./camelot.ts";

export const getBpmScore = (bpmA, bpmB) => {
    return Math.max(0, 1 - Math.abs(bpmA - bpmB) / 20);
};

export const getEnergyScore = (energyA, energyB) => {
    return 1 - Math.abs(energyA - energyB);
};

export const calculatePairScore = (trackA, trackB) => {
    const harmonic = getHarmonicScore(trackA.camelot, trackB.camelot);
    const bpm = getBpmScore(trackA.tempo, trackB.tempo);
    const energy = getEnergyScore(trackA.energy, trackB.energy);

    // Vibe score (Danceability + Loudness proximity)
    const vibe = (
        (1 - Math.abs(trackA.danceability - trackB.danceability)) +
        (1 - Math.abs((trackA.loudness + 60) / 60 - (trackB.loudness + 60) / 60))
    ) / 2;

    return (
        harmonic * 0.40 +
        bpm * 0.25 +
        energy * 0.25 +
        vibe * 0.10
    );
};
