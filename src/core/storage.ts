
/**
 * Storage Layer
 * Manages persistence of settings and highlight groups using chrome.storage.local.
 */

export interface HighlightGroup {
    id: string;       // UUID
    name: string;     // Display name
    color: string;    // Hex code, e.g., "#FF0000"
    enabled: boolean; // Toggle state
    type: 'text' | 'regex'; // Interpretation of terms
    terms: string[];  // List of keywords or regex string patterns
}

export interface AppSettings {
    groups: HighlightGroup[];
    caseSensitive: boolean;      // Global default (can be overridden by future group settings)
    processDynamicContent: boolean; // For infinite scroll
}

const STORAGE_KEY = 'recruiter_highlighter_settings';

export const DEFAULT_SETTINGS: AppSettings = {
    groups: [
        {
            id: 'default-tech',
            name: 'Tech Keywords',
            color: '#A7F3D0', // Light green
            enabled: true,
            type: 'text',
            terms: ['Java', 'Python', 'React', 'TypeScript', 'Node.js']
        },
        {
            id: 'default-email',
            name: 'Emails',
            color: '#FDE68A', // Light yellow
            enabled: true,
            type: 'regex',
            terms: ['[\\w.]+@[\\w.]+\\.\\w+']
        }
    ],
    caseSensitive: false,
    processDynamicContent: true
};

/**
 * Loads settings from local storage. Returns defaults if empty.
 */
export async function loadSettings(): Promise<AppSettings> {
    // If running in a test environment or outside extension, return defaults or mock
    if (typeof chrome === 'undefined' || !chrome.storage) {
        console.warn('Chrome storage not available, returning defaults.');
        return DEFAULT_SETTINGS;
    }

    try {
        const result = await chrome.storage.local.get(STORAGE_KEY);
        return (result[STORAGE_KEY] as AppSettings) || DEFAULT_SETTINGS;
    } catch (err) {
        console.error('Failed to load settings:', err);
        return DEFAULT_SETTINGS;
    }
}

/**
 * Saves settings to local storage.
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
        console.warn('Chrome storage not available, skipping save.');
        return;
    }

    try {
        await chrome.storage.local.set({ [STORAGE_KEY]: settings });
    } catch (err) {
        console.error('Failed to save settings:', err);
        throw err;
    }
}
