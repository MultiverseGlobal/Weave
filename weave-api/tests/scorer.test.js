const {
    calculatePairScore,
    getBpmScore,
    getEnergyScore
} = require('../src/engine/scorer');

describe('Scoring Engine', () => {
    test('getBpmScore provides correct linear decay', () => {
        expect(getBpmScore(120, 120)).toBe(1.0);
        expect(getBpmScore(120, 130)).toBe(0.5);
        expect(getBpmScore(120, 140)).toBe(0.0);
        expect(getBpmScore(120, 150)).toBe(0.0);
    });

    test('getEnergyScore provides correct linear decay', () => {
        expect(getEnergyScore(0.5, 0.5)).toBe(1.0);
        expect(getEnergyScore(0.5, 0.7)).toBeCloseTo(0.8);
        expect(getEnergyScore(0.2, 0.8)).toBeCloseTo(0.4);
    });

    test('calculatePairScore uses correct weights', () => {
        const track = { camelot: '8B', tempo: 120, energy: 0.5, danceability: 0.5, loudness: -10 };
        expect(calculatePairScore(track, track)).toBeCloseTo(1.0);

        const trackB = { ...track, tempo: 130 };
        expect(calculatePairScore(track, trackB)).toBeCloseTo(0.875);
    });
});
