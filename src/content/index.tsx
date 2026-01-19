import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import { loadSettings } from '../core/storage';
import { scanAndHighlight } from './scanner';
import { startObserver } from './observer';
import styles from '../index.css?inline'; // Import CSS as string

console.log('[Ink] Content script loaded (React/ShadowDOM)');

// 1. Highlighter Logic (Runs in main page context)
async function initHighlighter() {
    const settings = await loadSettings();
    if (document.body) {
        // Delay initial scan to allow client-side hydration/styles to settle
        // This helps avoid highlighting "hidden" text that hasn't been hidden yet by the SPA
        setTimeout(() => {
            console.log('[Ink] Starting initial scan...');
            scanAndHighlight(document.body, settings);
            startObserver(settings);
        }, 2000);
    }

    // Listen for settings changes to re-scan
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.recruiter_highlighter_settings) {
            loadSettings().then(async newSettings => {
                // 1. Stop observer temporarily to avoid loop with our own DOM changes
                // (though observer filters for text/element, removing nodes triggers it too)

                // 2. Remove all existing highlights
                const { removeHighlights } = await import('./highlighter');
                if (document.body) {
                    removeHighlights(document.body);
                }

                // 3. Restart observer with new settings
                startObserver(newSettings);

                // 4. Re-scan entirely
                if (document.body) {
                    scanAndHighlight(document.body, newSettings);
                }
            });
        }
    });
}

// 2. UI Logic (Runs in Shadow DOM)
function initUI() {
    const hostId = 'ink-shadow-host';
    let host = document.getElementById(hostId);

    if (!host) {
        host = document.createElement('div');
        host.id = hostId;
        host.style.position = 'fixed';
        host.style.top = '0';
        host.style.right = '0';
        host.style.zIndex = '999999';
        host.style.pointerEvents = 'none'; // Let clicks pass through container
        document.body.appendChild(host);
    }

    const shadow = host.attachShadow({ mode: 'open' });

    // Inject Styles
    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    console.log('[Ink] Injecting styles, length:', styles?.length); // Debug (checking if styles are empty)
    shadow.appendChild(styleTag);

    // Root for React
    const rootDiv = document.createElement('div');
    rootDiv.id = 'ink-root';
    rootDiv.style.pointerEvents = 'auto'; // Re-enable clicks for UI
    shadow.appendChild(rootDiv);

    const root = createRoot(rootDiv);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

// Start both systems
initHighlighter();
initUI();
