
/**
 * DOM Traversal Utilities
 * Using TreeWalker for performance.
 */

/**
 * Retrieves all valid text nodes under a root element.
 * Skips scripts, styles, forms, and hidden inputs.
 */
export function getTextNodes(root: Node): Node[] {
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;

                const tag = parent.tagName.toLowerCase();

                // Skip technical tags and interactive inputs where highlighting is bad UX
                if (['script', 'style', 'noscript', 'textarea', 'input', 'select', 'option', 'head', 'meta'].includes(tag)) {
                    return NodeFilter.FILTER_REJECT;
                }

                // Optional: Check `contentEditable`? 
                // For now, allow highlighting in editors might be annoying, but Recruiter tools often work on profiles which are read-only.
                if (parent.isContentEditable) {
                    return NodeFilter.FILTER_REJECT;
                }

                // 1. Computed Style Check (Most Robust)
                // If the element (or its ancestors) is hidden via CSS that is currently applied
                const style = window.getComputedStyle(parent);
                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                    return NodeFilter.FILTER_REJECT;
                }

                // 2. Explicit Visibility API (Chrome 105+)
                if (parent.checkVisibility && !parent.checkVisibility()) {
                    return NodeFilter.FILTER_REJECT;
                }

                // 3. Layout Geometry Check (The Gold Standard)
                // If the element takes up no space, it's not visible to the user.
                // This catches 'clip: rect(0 0 0 0)', 'height: 0', and off-screen positioning where sizes collapse.
                const rect = parent.getBoundingClientRect();
                if (rect.width <= 1 || rect.height <= 1) {
                    return NodeFilter.FILTER_REJECT;
                }

                // 3. Fallback for Common "Visually Hidden" Patterns (Screen Reader Text)
                const className = (parent.className && typeof parent.className === 'string') ? parent.className : '';
                // Only filter standard sr-only classes. Remove specific LinkedIn button checks as they might be too aggressive.
                if (/visually-hidden|sr-only|accessibility-text/i.test(className)) {
                    return NodeFilter.FILTER_REJECT;
                }

                // REMOVED: ARIA Hidden check.
                // Reasoning: LinkedIn often uses aria-hidden="true" on the *visual* text and puts the *screen-reader* text elsewhere.
                // We want to highlight the VISUAL text for the user.

                return NodeFilter.FILTER_ACCEPT;

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nodes: Node[] = [];
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }
    return nodes;
}
