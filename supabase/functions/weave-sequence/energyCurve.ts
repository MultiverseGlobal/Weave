/**
 * Energy Curve (Deno/Edge Function Port)
 */

export const CURVE_MODELS = {
    DEFAULT: [
        { tier: 'Low', ratio: 0.15 },
        { tier: 'Mid', ratio: 0.35 },
        { tier: 'High', ratio: 0.30 },
        { tier: 'Mid', ratio: 0.10 },
        { tier: 'Low', ratio: 0.10 }
    ]
};

export const getEnergyTier = (energy) => {
    if (energy < 0.45) return 'Low';
    if (energy < 0.75) return 'Mid';
    return 'High';
};

export const getTargetCurve = (totalTracks) => {
    const curve = [];
    CURVE_MODELS.DEFAULT.forEach(segment => {
        const count = Math.max(1, Math.round(segment.ratio * totalTracks));
        for (let i = 0; i < count; i++) {
            curve.push(segment.tier);
        }
    });

    while (curve.length < totalTracks) curve.push('Low');
    while (curve.length > totalTracks) curve.pop();

    return curve;
};
