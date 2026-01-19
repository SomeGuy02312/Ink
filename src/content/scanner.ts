
import type { AppSettings } from '../core/storage';
import { findMatches } from '../core/matcher';
import { applyHighlightsToNode } from './highlighter';
import type { StyledMatch } from './highlighter';
import { getTextNodes } from './dom';

/**
 * Scans a root node (and its children) and applies highlights based on settings.
 */
export function scanAndHighlight(root: Node, settings: AppSettings) {
    if (!settings.groups || settings.groups.length === 0) return;

    // 1. Get all text nodes
    const textNodes = getTextNodes(root);

    // 2. Process each node
    textNodes.forEach(node => {
        processNode(node, settings);
    });
}

/**
 * Processes a single text node: finds matches for all groups, merges them, and highlights.
 */
function processNode(node: Node, settings: AppSettings) {
    let allMatches: StyledMatch[] = [];

    // 3. Find matches for each enabled group
    for (const group of settings.groups) {
        if (!group.enabled) continue;

        const groupMatches = findMatches(
            node.textContent || '',
            group.terms,
            group.type === 'regex' ? 'regex' : 'text',
            settings.caseSensitive
        );

        // Add group info to matches
        groupMatches.forEach(m => {
            allMatches.push({
                ...m,
                color: group.color,
                groupName: group.name,
                groupId: group.id
            });
        });
    }

    if (allMatches.length === 0) return;

    // 4. Resolve Overlaps
    // Strategy: Sort by Start Index ASC, then Length DESC (Longest match wins).
    allMatches.sort((a, b) => {
        if (a.start !== b.start) return a.start - b.start;
        return (b.end - b.start) - (a.end - a.start); // Longest first
    });

    const acceptedMatches: StyledMatch[] = [];
    let lastEnd = 0;

    for (const m of allMatches) {
        if (m.start >= lastEnd) {
            acceptedMatches.push(m);
            lastEnd = m.end;
        }
    }

    // 5. Apply highlights
    applyHighlightsToNode(node, acceptedMatches);
}
