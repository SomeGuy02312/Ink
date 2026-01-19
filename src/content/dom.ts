
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
