
import type { AppSettings } from '../core/storage';
import { scanAndHighlight } from './scanner';

let observer: MutationObserver | null = null;
let timeoutId: any = null;
const PENDING_NODES = new Set<Node>();

/**
 * Starts observing the DOM for changes and highlights new content.
 */
export function startObserver(settings: AppSettings) {
    if (observer) disconnectObserver();

    // Do NOT observe if dynamic content is disabled
    if (!settings.processDynamicContent) return;

    observer = new MutationObserver((mutations) => {
        let hasRelevantMutations = false;

        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                // Ignore our own UI and Highlights logic to prevent infinite loops
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node as Element;
                    // Skip the Sidebar Host and Highlight Markers
                    if (el.id === 'ink-shadow-host' || el.classList.contains('ink-highlight')) {
                        return;
                    }
                    // Skip if inside our host (just in case)
                    if (el.closest('#ink-shadow-host')) {
                        return;
                    }
                }

                // Only care about Elements and Text
                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                    // Double check parent isn't a highlight (for text nodes inside marks)
                    if (node.parentElement && node.parentElement.classList.contains('ink-highlight')) {
                        return;
                    }

                    PENDING_NODES.add(node);
                    hasRelevantMutations = true;
                }
            });
        });

        if (hasRelevantMutations) {
            scheduleScan(settings);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function scheduleScan(settings: AppSettings) {
    if (timeoutId) clearTimeout(timeoutId);

    // Debounce to avoid freezing on rapid scrolling
    timeoutId = setTimeout(() => {
        processPendingNodes(settings);
    }, 300);
}

function processPendingNodes(settings: AppSettings) {
    // Process unique roots. 
    const nodes = Array.from(PENDING_NODES);
    PENDING_NODES.clear();
    timeoutId = null;

    // Filter: Only keep nodes that are still in document
    const attachedNodes = nodes.filter(n => document.body.contains(n));
    if (attachedNodes.length === 0) return;

    // Optimization: If a node contains another, skip the inner one?
    const rootsToScan = attachedNodes.filter(node => {
        // check if this node is a descendant of any other node in the list
        return !attachedNodes.some(other => other !== node && other.contains(node));
    });

    console.log(`[Ink] Processing ${rootsToScan.length} mutation roots`);

    rootsToScan.forEach(node => {
        scanAndHighlight(node, settings);
    });
}

export function disconnectObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    PENDING_NODES.clear();
}
