
/**
 * Core Matcher Engine
 * Pure functions for finding matches in text.
 */

export interface MatchResult {
    start: number;
    end: number;
    match: string;
}

/**
 * Escapes special regex characters in a string.
 */
function escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Converts a standard wildcard glob (e.g. "teach*") to a Regex pattern string.
 * Strategies:
 * - `*` becomes `[\w]*` (word characters) to avoid over-matching across spaces in text search.
 * - `?` becomes `.`
 */
export function wildcardToRegexPattern(glob: string): string {
    return escapeRegex(glob)
        .replace(/\\\*/g, '[\\w]*') // Un-escape * and convert to word chars
        .replace(/\\\?/g, '.');     // Un-escape ? and convert to .
}

/**
 * Finds all occurrences of terms in a text string.
 * @param text The text to search
 * @param terms List of terms (plain text or regex strings)
 * @param isRegex Whether the terms are raw regex strings
 * @param isCaseSensitive Whether matching is case sensitive
 */
export function findMatches(
    text: string,
    terms: string[],
    type: 'text' | 'regex' | 'wildcard',
    caseSensitive = false
): MatchResult[] {
    const results: MatchResult[] = [];
    if (!text || terms.length === 0) return results;

    for (const term of terms) {
        if (!term) continue;

        let regex: RegExp;

        try {
            if (type === 'regex') {
                regex = new RegExp(term, caseSensitive ? 'g' : 'gi');
            } else if (type === 'wildcard') {
                // Standard Glob logic using word boundaries for safety in text flow
                const pattern = wildcardToRegexPattern(term);
                regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
            } else {
                // Exact text
                const pattern = escapeRegex(term);
                regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
            }
        } catch (e) {
            console.warn(`Invalid regex/pattern: ${term}`, e);
            continue;
        }

        let match;
        // reset lastIndex just in case
        regex.lastIndex = 0;

        while ((match = regex.exec(text)) !== null) {
            // Prevent infinite loops with zero-width matches
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            results.push({
                start: match.index,
                end: match.index + match[0].length,
                match: match[0]
            });
        }
    }

    // Sort by start index
    return results.sort((a, b) => a.start - b.start);
}
