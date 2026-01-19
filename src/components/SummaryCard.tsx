
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BarChart2 } from 'lucide-react';
import type { HighlightGroup } from '../core/storage';

interface SummaryCardProps {
    groups: HighlightGroup[];
}

export function SummaryCard({ groups }: SummaryCardProps) {
    // Persist expanded state
    const [expanded, setExpanded] = useState(() => {
        const stored = localStorage.getItem('ink_summary_expanded');
        return stored ? JSON.parse(stored) : true;
    });

    const [counts, setCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        localStorage.setItem('ink_summary_expanded', JSON.stringify(expanded));
    }, [expanded]);

    // Calculate counts
    useEffect(() => {
        const calculateCounts = () => {
            const newCounts: Record<string, number> = {};

            // Query the main document for highlights (since we are in Shadow DOM)
            // But wait... we are in Shadow DOM, but the highlights are in the main document.
            // So we query `document.body`.
            const highlights = document.querySelectorAll('mark.ink-highlight');

            highlights.forEach(mark => {
                const groupId = (mark as HTMLElement).dataset.groupId;
                if (groupId) {
                    newCounts[groupId] = (newCounts[groupId] || 0) + 1;
                }
            });

            setCounts(newCounts);
        };

        // Initial count
        calculateCounts();

        // Setup observer to update counts when DOM changes
        const observer = new MutationObserver(() => {
            calculateCounts();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false // Don't care about attr changes
        });

        // Let's add a small polling fallback for strictly dynamic apps
        const interval = setInterval(calculateCounts, 2000);

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, [groups]); // Re-run if groups config changes

    if (!groups || groups.length === 0) return null;

    const activeGroups = groups.filter(g => g.enabled);
    const totalMatches = Object.values(counts).reduce((a, b) => a + b, 0);

    if (activeGroups.length === 0) return null;

    const activeBadges = activeGroups.filter(g => (counts[g.id] || 0) > 0);

    return (
        <div className="card" style={{ marginBottom: '16px', padding: 0, overflow: 'hidden' }}>
            <div
                className="flex items-center justify-between"
                style={{
                    padding: '8px 16px',
                    background: 'var(--color-bg-card)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    height: '44px' // Enforce consistent height
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-sm" style={{ flex: 1, overflow: 'hidden' }}>
                    <BarChart2 size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>Summary</span>

                    {totalMatches > 0 && (
                        <div className="flex items-center gap-xs" style={{ marginLeft: 8, overflow: 'hidden' }}>
                            {activeBadges.slice(0, 3).map(g => (
                                <div key={g.id} title={`${g.name}: ${counts[g.id]}`} style={{
                                    backgroundColor: g.color,
                                    width: 18, height: 18, borderRadius: '50%',
                                    fontSize: '11px', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(0,0,0,0.7)',
                                    flexShrink: 0,
                                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                                }}>
                                    {counts[g.id]}
                                </div>
                            ))}

                            {activeBadges.length > 3 && (
                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 1px' }}>•</span>
                            )}

                            {/* Total Badge */}
                            <div title={`Total: ${totalMatches}`} style={{
                                backgroundColor: '#fff',
                                border: '1px solid var(--color-border)',
                                width: 18, height: 18, borderRadius: '50%',
                                fontSize: '11px', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-text-main)',
                                flexShrink: 0,
                                marginLeft: 2
                            }}>
                                {totalMatches}
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginLeft: 8 }}>
                    {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
            </div>

            {expanded && (
                <div style={{ padding: '8px 16px 16px 16px', background: 'var(--color-bg-page)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {activeGroups.map(group => {
                            const count = counts[group.id] || 0;
                            if (count === 0) return null; // Optional: Hide zero counts?

                            return (
                                <div key={group.id} className="flex items-center justify-between" style={{ fontSize: '13px' }}>
                                    <div className="flex items-center gap-sm" style={{ overflow: 'hidden' }}>
                                        <div style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: group.color,
                                            flexShrink: 0
                                        }} />
                                        <span style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {group.name}
                                        </span>
                                    </div>
                                    <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                        {totalMatches === 0 && (
                            <div style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                No matches found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
