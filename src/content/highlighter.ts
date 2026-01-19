
import { MatchResult } from '../core/matcher';

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

/**
 * Applies highlights to a single text node for multiple matches.
 * IMPORTANT: Matches must be for this specific text node.
 */
export function applyHighlightsToNode(
    textNode: Node,
    matches: MatchResult[],
    color: string,
    groupName: string
): void {
    if (textNode.nodeType !== Node.TEXT_NODE) return;

    // Sort matches in descending order so we can split from the end
    // without invalidating indices of earlier matches.
    const sorted = [...matches].sort((a, b) => b.start - a.start);

    sorted.forEach(match => {
        highlightMatch(textNode as Text, match, color, groupName);
    });
}
