
// Tailwind-inspired 300 scale for readable highlights
export const PALETTE = [
    '#fca5a5', // Red
    '#fdba74', // Orange
    '#fcd34d', // Amber
    '#86efac', // Green
    '#6ee7b7', // Emerald
    '#5eead4', // Teal
    '#67e8f9', // Cyan
    '#93c5fd', // Blue
    '#a5b4fc', // Indigo
    '#c4b5fd', // Violet
    '#f0abfc', // Fuchsia
    '#f9a8d4', // Pink
    '#cbd5e1', // Slate
];

export const DEFAULT_COLOR = '#cbd5e1';

/**
 * Returns the first color from the palette that is not currently used by any group.
 * If all are used, returns a random color from the palette.
 */
export function getNextColor(usedColors: string[]): string {
    const available = PALETTE.find(c => !usedColors.includes(c));
    if (available) return available;
    return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}
