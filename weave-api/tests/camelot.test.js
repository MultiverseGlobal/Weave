const { toCamelot, getHarmonicScore } = require('../src/engine/camelot');

describe('Camelot Engine', () => {
    test('toCamelot converts Spotify keys correctly', () => {
        expect(toCamelot(0, 1)).toBe('8B');  // C Major
        expect(toCamelot(0, 0)).toBe('5A');  // C Minor
        expect(toCamelot(9, 1)).toBe('11B'); // A Major
        expect(toCamelot(9, 0)).toBe('8A');  // A Minor
        expect(toCamelot(11, 1)).toBe('1B'); // B Major
        expect(toCamelot(11, 0)).toBe('10A'); // B Minor
    });

    test('getHarmonicScore returns 1.0 for same keys', () => {
        expect(getHarmonicScore('8B', '8B')).toBe(1.0);
    });

    test('getHarmonicScore returns 0.8 for adjacent keys on circle', () => {
        expect(getHarmonicScore('8B', '9B')).toBe(0.8);
        expect(getHarmonicScore('8B', '7B')).toBe(0.8);
        expect(getHarmonicScore('1B', '12B')).toBe(0.8);
        expect(getHarmonicScore('12B', '1B')).toBe(0.8);
    });

    test('getHarmonicScore returns 0.7 for relative major/minor', () => {
        expect(getHarmonicScore('8B', '8A')).toBe(0.7);
        expect(getHarmonicScore('5A', '5B')).toBe(0.7);
    });

    test('getHarmonicScore returns 0.4 for diagonal moves', () => {
        expect(getHarmonicScore('8B', '9A')).toBe(0.4);
        expect(getHarmonicScore('8B', '7A')).toBe(0.4);
    });

    test('getHarmonicScore returns 0.0 for incompatible keys', () => {
        expect(getHarmonicScore('8B', '3B')).toBe(0.0);
        expect(getHarmonicScore('5A', '10B')).toBe(0.0);
    });
});
