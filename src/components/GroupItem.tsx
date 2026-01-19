

import { useState } from 'react';
import { Trash2, ChevronDown, ChevronRight, Edit2, Check, X, Type, Code } from 'lucide-react';
import type { HighlightGroup } from '../core/storage';
import { TermList } from './TermList';
import { ColorPicker } from './ColorPicker';

interface GroupItemProps {
    group: HighlightGroup;
    onUpdate: (group: HighlightGroup) => void;
    onDelete: (id: string) => void;
}

export function GroupItem({ group, onUpdate, onDelete }: GroupItemProps) {
    const [expanded, setExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [editName, setEditName] = useState(group.name);

    const handleToggle = () => {
        onUpdate({ ...group, enabled: !group.enabled });
    };

    const handleSaveName = () => {
        if (editName.trim()) {
            onUpdate({ ...group, name: editName.trim() });
            setIsEditing(false);
        }
    };

    return (
        <div className="card" style={{ marginBottom: 'var(--spacing-md)', padding: 0, overflow: 'visible' }}>
            {/* Header / Summary */}
            <div className="group-header flex items-center justify-between" style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'var(--color-bg-card)',
                borderBottom: expanded ? '1px solid var(--color-border)' : 'none'
            }}>
                <div className="flex items-center gap-sm" style={{ flex: 1 }}>
                    <button onClick={() => setExpanded(!expanded)} className="btn btn-ghost" style={{ padding: 4 }}>
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    <input
                        type="checkbox"
                        checked={group.enabled}
                        onChange={handleToggle}
                        className="form-checkbox"
                    />

                    {/* Group Type Icon */}
                    <div style={{ color: 'var(--color-text-muted)', marginLeft: 4 }} title={group.type === 'regex' ? "Regex Group" : "Keyword Group"}>
                        {group.type === 'regex' ? <Code size={14} /> : <Type size={14} />}
                    </div>

                    {isEditing ? (
                        <div className="flex items-center gap-sm">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{
                                    padding: '2px 6px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-accent)'
                                }}
                                autoFocus
                            />
                            <button onClick={handleSaveName} className="btn btn-ghost" style={{ color: 'green' }}><Check size={14} /></button>
                            <button onClick={() => setIsEditing(false)} className="btn btn-ghost" style={{ color: 'red' }}><X size={14} /></button>
                        </div>
                    ) : (
                        <span className="group-label" style={{ color: group.enabled ? 'inherit' : 'var(--color-text-muted)', fontSize: '15px' }}>
                            {group.name}
                        </span>
                    )}

                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn btn-ghost" style={{ padding: 4, opacity: 0.5 }}>
                            <Edit2 size={12} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-sm" style={{ position: 'relative' }}>
                    {/* Color Circle Trigger */}
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        title="Change Color"
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: group.color,
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer'
                        }}
                    />

                    <button onClick={() => onDelete(group.id)} className="btn btn-ghost" style={{ color: '#ef4444' }} title="Delete Group">
                        <Trash2 size={16} />
                    </button>

                    {/* Popover Color Picker */}
                    {showColorPicker && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: 8,
                            padding: 8,
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            zIndex: 20
                        }}>
                            <ColorPicker
                                color={group.color}
                                onChange={(c) => {
                                    onUpdate({ ...group, color: c });
                                    setShowColorPicker(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Content: Terms */}
            {expanded && (
                <div className="group-body" style={{ padding: 'var(--spacing-md)', background: 'var(--color-bg-page)' }}>
                    <TermList
                        terms={group.terms}
                        onChange={(newTerms: string[]) => onUpdate({ ...group, terms: newTerms })}
                    />
                </div>
            )}
        </div>
    );
}
