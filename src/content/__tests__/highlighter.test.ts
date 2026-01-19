
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { applyHighlightsToNode, highlightMatch } from '../highlighter';

// Simple JSDOM-like mock setup if running without jsdom
// But ideally we rely on vitest environment. 
// If this fails due to missing DOM, we will know.

describe('Highlighter', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('should highlights a single match', () => {
        const textNode = document.createTextNode('Hello world');
        container.appendChild(textNode);

        const match: any = {
            start: 6,
            end: 11,
            match: 'world',
            color: 'yellow',
            groupName: 'test-group'
        };

        highlightMatch(textNode, match, 'yellow', 'test-group');

        expect(container.innerHTML).toBe('Hello <mark class="ink-highlight" style="background-color: yellow;" data-group="test-group" data-match="world" title="test-group: world">world</mark>');
    });

    it('should apply multiple matches in a single node', () => {
        const textNode = document.createTextNode('Hello world test');
        container.appendChild(textNode);

        const matchesForCall: any[] = [
            { start: 0, end: 5, match: 'Hello', color: 'yellow', groupName: 'test-group' },
            { start: 12, end: 16, match: 'test', color: 'yellow', groupName: 'test-group' }
        ];

        applyHighlightsToNode(textNode, matchesForCall);

        const marks = container.querySelectorAll('mark');
        expect(marks.length).toBe(2);
        expect(marks[0].textContent).toBe('Hello');
        expect(marks[1].textContent).toBe('test');
        expect(container.textContent).toBe('Hello world test');
    });

    it('should handle adjacent matches', () => {
        const textNode = document.createTextNode('foobar');
        container.appendChild(textNode);

        const matches: any[] = [
            { start: 0, end: 3, match: 'foo', color: 'yellow', groupName: 'test-group' },
            { start: 3, end: 6, match: 'bar', color: 'yellow', groupName: 'test-group' }
        ];

        applyHighlightsToNode(textNode, matches);

        const marks = container.querySelectorAll('mark');
        expect(marks.length).toBe(2);
        expect(marks[0].textContent).toBe('foo');
        expect(marks[1].textContent).toBe('bar');
    });

    it('should handle match at the very end', () => {
        const textNode = document.createTextNode('end');
        container.appendChild(textNode);

        const matches: any[] = [
            { start: 0, end: 3, match: 'end', color: 'yellow', groupName: 'G1' }
        ];

        applyHighlightsToNode(textNode, matches);
        expect(container.innerHTML).toContain('<mark');
        expect(container.textContent).toBe('end');
    });
});
