
import type { MatchResult } from '../core/matcher';

/**
 * Wraps a specific match range in a text node with a <mark> tag.
 * 
 * Note: usage requires care because wrapping splits the text node.
 * If you have multiple matches in one text node, you must process them 
 * from BACK to FRONT (highest index to lowest) to preserve indices.
 */
export function highlightMatch(
    textNode: Text,
    match: MatchResult,
    color: string,
    groupName: string
): void {
    const parent = textNode.parentNode;
    if (!parent) return;

    // Create the range for the match
    const range = document.createRange();

    // Safety check indices
    if (match.start >= textNode.length || match.end > textNode.length) {
        console.warn('Match indices out of bounds', match, textNode);
        return;
    }

    range.setStart(textNode, match.start);
    range.setEnd(textNode, match.end);

    // Create the mark element
    const mark = document.createElement('mark');
    mark.className = 'ink-highlight';
    mark.style.backgroundColor = color;
    mark.dataset.group = groupName;
    mark.dataset.match = match.match;
    mark.title = `${groupName}: ${match.match}`;

    // Extract the content and wrap it
    try {
        range.surroundContents(mark);
    } catch (e) {
        console.error('Failed to surround contents', e);
    }
}

export interface StyledMatch extends MatchResult {
    color: string;
    groupName: string;
}

/**
 * Applies highlights to a single text node for multiple matches.
 * IMPORTANT: Matches must be for this specific text node.
 */
export function applyHighlightsToNode(
    textNode: Node,
    matches: StyledMatch[]
): void {
    if (textNode.nodeType !== Node.TEXT_NODE) return;

    // Sort matches in descending order so we can split from the end
    // without invalidating indices of earlier matches.
    const sorted = [...matches].sort((a, b) => b.start - a.start);

    sorted.forEach(match => {
        highlightMatch(textNode as Text, match, match.color, match.groupName);
    });
}

/**
 * Removes all existing highlights from the document.
 * This is efficient because it targets only the highlight elements.
 */
export function removeHighlights(root: Node = document.body) {
    if (!root) return;
    const highlights = (root as Element).querySelectorAll('mark.ink-highlight');
    highlights.forEach(mark => {
        try {
            const parent = mark.parentNode;
            if (parent) {
                // Replace mark with its children (text)
                // This effectively unwraps the text.
                while (mark.firstChild) {
                    parent.insertBefore(mark.firstChild, mark);
                }
                parent.removeChild(mark);
                // Note: This might fragment text nodes. Modern browsers handle this well enough,
                // but for perfect text node merging, we could call parent.normalize().
                parent.normalize();
            }
        } catch (e) {
            // Suppress errors if nodes were detached during processing
            console.debug('[Ink] Failed to remove highlight', e);
        }
    });
}
