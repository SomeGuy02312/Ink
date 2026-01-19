
import { useState } from 'react';
import { Plus, Type, Code } from 'lucide-react';
import type { HighlightGroup } from '../core/storage';
import { GroupItem } from './GroupItem';



import { getNextColor } from '../core/palette';

interface GroupListProps {
    groups: HighlightGroup[];
    setGroups: (groups: HighlightGroup[]) => void;
}

export function GroupList({ groups, setGroups }: GroupListProps) {
    const [showNewGroupMenu, setShowNewGroupMenu] = useState(false);
    const keywordGroups = groups.filter(g => g.type === 'text' || !g.type); // Default to text if missing
    const regexGroups = groups.filter(g => g.type === 'regex');

    const handleUpdateGroup = (updatedGroup: HighlightGroup) => {
        const newGroups = groups.map(g => g.id === updatedGroup.id ? updatedGroup : g);
        setGroups(newGroups);
    };

    const handleDeleteGroup = (id: string) => {
        if (confirm('Are you sure you want to delete this group?')) {
            setGroups(groups.filter(g => g.id !== id));
        }
    };

    const handleAddGroup = (type: 'text' | 'regex') => {
        const usedColors = groups.map(g => g.color);
        const nextColor = getNextColor(usedColors);

        const newGroup: HighlightGroup = {
            id: crypto.randomUUID(),
            name: type === 'regex' ? 'New Regex Group' : 'New Keyword Group',
            color: nextColor,
            enabled: true,
            type: type,
            terms: []
        };
        setGroups([...groups, newGroup]);
        setShowNewGroupMenu(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-md)' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Highlight Groups</h2>

                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowNewGroupMenu(!showNewGroupMenu)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
                    >
                        <Plus size={16} style={{ marginRight: 6 }} />
                        New Group
                    </button>

                    {showNewGroupMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: 8,
                            width: 160,
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            zIndex: 50,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => handleAddGroup('text')}
                                className="btn btn-ghost"
                                style={{
                                    padding: '8px 12px',
                                    justifyContent: 'flex-start',
                                    borderRadius: 0,
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Type size={16} style={{ marginRight: 8, color: 'var(--color-text-muted)' }} />
                                Keyword Group
                            </button>
                            <div style={{ height: 1, background: 'var(--color-border)' }} />
                            <button
                                onClick={() => handleAddGroup('regex')}
                                className="btn btn-ghost"
                                style={{
                                    padding: '8px 12px',
                                    justifyContent: 'flex-start',
                                    borderRadius: 0,
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Code size={16} style={{ marginRight: 8, color: 'var(--color-text-muted)' }} />
                                Regex Group
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Keywords Section */}
            <div className="section-title">
                Keywords
            </div>

            <div className="groups-container">
                {keywordGroups.length === 0 && (
                    <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--color-text-muted)', opacity: 0.7 }}>None</div>
                )}
                {keywordGroups.map(group => (
                    <GroupItem
                        key={group.id}
                        group={group}
                        onUpdate={handleUpdateGroup}
                        onDelete={handleDeleteGroup}
                    />
                ))}
            </div>

            {/* Regex Section */}
            <div className="section-title">
                Regex Patterns
            </div>

            <div className="groups-container">
                {regexGroups.length === 0 && (
                    <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--color-text-muted)', opacity: 0.7 }}>None</div>
                )}
                {regexGroups.map(group => (
                    <GroupItem
                        key={group.id}
                        group={group}
                        onUpdate={handleUpdateGroup}
                        onDelete={handleDeleteGroup}
                    />
                ))}
            </div>
        </div>
    );
}
