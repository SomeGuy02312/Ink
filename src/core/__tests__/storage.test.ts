
import { describe, it, expect } from 'vitest';
import { loadSettings, DEFAULT_SETTINGS } from '../storage';

describe('Storage Layer', () => {
    it('should return default settings when chrome is undefined', async () => {
        // Enforce chrome being undefined
        const result = await loadSettings();
        expect(result).toEqual(DEFAULT_SETTINGS);
    });
});
