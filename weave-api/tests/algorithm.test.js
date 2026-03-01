const { sequenceTracks } = require('../src/engine/algorithm');

describe('Sequencing Algorithm', () => {
    const mockTracks = [
        { id: 1, name: 'Low 1', energy: 0.2, camelot: '8B', tempo: 120, danceability: 0.5, loudness: -10 },
        { id: 2, name: 'Low 2', energy: 0.25, camelot: '8A', tempo: 122, danceability: 0.5, loudness: -10 },
        { id: 3, name: 'Mid 1', energy: 0.5, camelot: '9B', tempo: 124, danceability: 0.6, loudness: -8 },
        { id: 4, name: 'Mid 2', energy: 0.55, camelot: '9A', tempo: 126, danceability: 0.6, loudness: -8 },
        { id: 5, name: 'High 1', energy: 0.8, camelot: '10B', tempo: 128, danceability: 0.8, loudness: -5 },
        { id: 6, name: 'High 2', energy: 0.85, camelot: '10A', tempo: 130, danceability: 0.8, loudness: -5 },
        { id: 7, name: 'Mid 3', energy: 0.6, camelot: '11B', tempo: 125, danceability: 0.6, loudness: -7 },
        { id: 8, name: 'Low 3', energy: 0.3, camelot: '11A', tempo: 121, danceability: 0.5, loudness: -11 }
    ];

    test('sequenceTracks maintains track count', () => {
        const result = sequenceTracks(mockTracks);
        expect(result.length).toBe(mockTracks.length);
    });

    test('sequenceTracks follows the energy tier guidance', () => {
        const result = sequenceTracks(mockTracks);
        // Check first and last are low energy
        expect(result[0].energy).toBeLessThan(0.4);
        expect(result[result.length - 1].energy).toBeLessThan(0.4);

        // Check peak
        const midIdx = Math.floor(result.length / 2);
        expect(result[midIdx].energy).toBeGreaterThan(0.4);
    });
});
