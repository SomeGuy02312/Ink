
import { loadSettings, saveSettings } from '../core/storage';

console.log('[Ink] Background Service Worker Loaded');

const ROOT_MENU_ID = 'ink-root';

// 1. Initialize Menus
chrome.runtime.onInstalled.addListener(() => {
    updateContextMenus();
});

// 2. Listen for settings changes to update menus
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.recruiter_highlighter_settings) {
        updateContextMenus();
    }
});

// 3. Handle Menu Clicks
chrome.contextMenus.onClicked.addListener(async (info) => {
    // Handle global toggle
    if (info.menuItemId === 'ink-toggle-global') {
        const settings = await loadSettings();
        await saveSettings({ ...settings, globalEnabled: !settings.globalEnabled });
        console.log(`[Ink] Global highlighting ${!settings.globalEnabled ? 'disabled' : 'enabled'}`);
        return;
    }

    if (info.menuItemId === ROOT_MENU_ID) {
        // Did they click the root? Usually disabled if it has children, or mapped to default.
        return;
    }

    if (info.selectionText) {
        const groupId = String(info.menuItemId).replace('ink-group-', '');
        await addTermToGroup(groupId, info.selectionText.trim());
    }
});

// 4. Handle Action Click (Toggle Sidebar)
chrome.action.onClicked.addListener(async () => {
    // Toggle the 'sidebarOpen' state in local storage
    const data = await chrome.storage.local.get('sidebarOpen');
    const newState = !data.sidebarOpen;
    await chrome.storage.local.set({ sidebarOpen: newState });
    console.log(`[Ink] Toggled sidebar to ${newState}`);
});

async function updateContextMenus() {
    // Clear existing to avoid duplicates
    chrome.contextMenus.removeAll(async () => {
        const settings = await loadSettings();

        // Add global toggle menu item (accessible from icon right-click)
        chrome.contextMenus.create({
            id: 'ink-toggle-global',
            title: settings.globalEnabled ? 'Disable Highlighting' : 'Enable Highlighting',
            contexts: ['action']
        });

        if (!settings.groups || settings.groups.length === 0) {
            // Fallback if no groups
            return;
        }

        // Create Root for selection context
        chrome.contextMenus.create({
            id: ROOT_MENU_ID,
            title: 'Ink Highlighter',
            contexts: ['selection']
        });

        // Create Sub-items for each group
        settings.groups.forEach(group => {
            if (!group.enabled) return; // Optional: Only show enabled groups?

            chrome.contextMenus.create({
                id: `ink-group-${group.id}`,
                parentId: ROOT_MENU_ID,
                title: `Add to "${group.name}"`,
                contexts: ['selection']
            });
        });
    });
}

async function addTermToGroup(groupId: string, term: string) {
    if (!term) return;

    const settings = await loadSettings();
    let updated = false;

    const newGroups = settings.groups.map(g => {
        if (g.id === groupId) {
            // Avoid duplicates
            if (!g.terms.includes(term)) {
                updated = true;
                return { ...g, terms: [...g.terms, term] };
            }
        }
        return g;
    });

    if (updated) {
        await saveSettings({ ...settings, groups: newGroups });
        console.log(`[Ink] Added "${term}" to group ${groupId}`);
    }
}
