
import { describe, it, expect } from 'vitest';
import { findMatches } from '../matcher';

describe('Matcher Engine', () => {

    describe('Exact Text Matching', () => {
        it('should find exact matches case-insensitive by default', () => {
            const text = "Java and java and JAVA";
            const results = findMatches(text, ["Java"], 'text', false);
            expect(results.length).toBe(3);
            expect(results[0].match).toBe("Java");
            expect(results[1].match).toBe("java");
        });

        it('should respect case sensitivity', () => {
            const text = "Java and java";
            const results = findMatches(text, ["Java"], 'text', true);
            expect(results.length).toBe(1);
            expect(results[0].match).toBe("Java");
        });

        it('should handle multiple terms', () => {
            const text = "The cat and the dog";
            const results = findMatches(text, ["cat", "dog"], 'text');
            expect(results.length).toBe(2);
            expect(results.find(r => r.match === "cat")).toBeTruthy();
            expect(results.find(r => r.match === "dog")).toBeTruthy();
        });
    });

    describe('Wildcard Matching', () => {
        it('should support * for multiple chars', () => {
            const text = "teacher teaching teaches";
            // teach* should match all 3
            const results = findMatches(text, ["teach*"], 'wildcard');
            expect(results.length).toBe(3);
            expect(results.map(r => r.match)).toEqual(["teacher", "teaching", "teaches"]);
        });

        it('should match inline wildcards', () => {
            const text = "color colour";
            const results = findMatches(text, ["col*r"], 'wildcard');
            expect(results.length).toBe(2);
        });

        it('should not cross word boundaries implies by spaces if we stick to \\w*', () => {
            const text = "superman super man";
            const results = findMatches(text, ["super*"], 'wildcard');
            // "superman" matches. "super" matches. "super man" (super + space + man) -> matches "super"
            expect(results.length).toBe(2);
            expect(results.map(r => r.match)).toContain("superman");
            expect(results.map(r => r.match)).toContain("super");
        });
    });

    describe('Regex Matching', () => {
        it('should support raw regex', () => {
            const text = "my email is test@test.com and foo@bar.org";
            const emailRegex = "[\\w.]+@[\\w.]+\\.\\w+";
            const results = findMatches(text, [emailRegex], 'regex');
            expect(results.length).toBe(2);
            expect(results[0].match).toBe("test@test.com");
        });

        it('should catch invalid regex safely', () => {
            const text = "nothing";
            const results = findMatches(text, ["["], 'regex'); // Invalid Regex
            expect(results.length).toBe(0);
            // Should not throw
        });
    });
});
