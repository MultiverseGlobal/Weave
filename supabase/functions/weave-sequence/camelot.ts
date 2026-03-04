/**
 * Camelot Engine (Deno/Edge Function Port)
 */

export const toCamelot = (key, mode) => {
    const map = {
        '0,1': '8B', '0,0': '5A',
        '1,1': '3B', '1,0': '10A',
        '2,1': '10B', '2,0': '7A',
        '3,1': '5B', '3,0': '12A',
        '4,1': '12B', '4,0': '9A',
        '5,1': '7B', '5,0': '2A',
        '6,1': '2B', '6,0': '11A',
        '7,1': '9B', '7,0': '6A',
        '8,1': '4B', '8,0': '1A',
        '9,1': '11B', '9,0': '8A',
        '10,1': '6B', '10,0': '3A',
        '11,1': '1B', '11,0': '10A',
    };
    return map[`${key},${mode}`] || '—';
};

export const getHarmonicScore = (keyA, keyB) => {
    if (keyA === keyB) return 1.0;
    if (keyA === '—' || keyB === '—') return 0.0;

    const numA = parseInt(keyA);
    const typeA = keyA.slice(-1);
    const numB = parseInt(keyB);
    const typeB = keyB.slice(-1);

    const diff = Math.abs(numA - numB);
    const isAdjacent = diff === 1 || diff === 11;

    if (typeA === typeB && isAdjacent) return 0.8;
    if (numA === numB && typeA !== typeB) return 0.7;
    if (isAdjacent && typeA !== typeB) return 0.4;

    return 0.0;
};
