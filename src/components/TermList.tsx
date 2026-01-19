
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface TermListProps {
    terms: string[];
    onChange: (terms: string[]) => void;
}

export function TermList({ terms, onChange }: TermListProps) {
    const [newTerm, setNewTerm] = useState('');

    const handleAdd = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (newTerm.trim()) {
            if (!terms.includes(newTerm.trim())) {
                onChange([...terms, newTerm.trim()]);
            }
            setNewTerm('');
        }
    };

    const handleRemove = (termToRemove: string) => {
        onChange(terms.filter(t => t !== termToRemove));
    };

    return (
        <div>
            <div className="term-list flex flex-wrap gap-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
                {terms.map((term, idx) => (
                    <span key={idx} className="term-tag flex items-center gap-xs" style={{
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13.5px'
                    }}>
                        {term}
                        <button
                            onClick={() => handleRemove(term)}
                            style={{ marginLeft: 4, display: 'flex', color: 'var(--color-text-muted)' }}
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                {terms.length === 0 && (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '14px', fontStyle: 'italic' }}>
                        No terms added yet.
                    </span>
                )}
            </div>

            <form onSubmit={handleAdd} className="flex gap-sm">
                <input
                    type="text"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="Add term..."
                    style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '14px'
                    }}
                />
                <button type="submit" className="btn btn-primary" disabled={!newTerm.trim()}>
                    <Plus size={16} />
                </button>
            </form>
        </div>
    );
}
