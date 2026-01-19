

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
            {/* Header / Summary */}
            <div className="group-header flex items-center" style={{
                padding: '8px 16px',
                background: 'var(--color-bg-card)',
                borderBottom: expanded ? '1px solid var(--color-border)' : 'none',
                gap: '8px',
                height: '44px' // Enforce consistent height
            }}>
                {/* Left Controls: Chevron, Checkbox, Type */}
                <div className="flex items-center gap-sm" style={{ flexShrink: 0 }}>
                    <button onClick={() => setExpanded(!expanded)} className="btn btn-ghost" style={{ padding: 4 }}>
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    <input
                        type="checkbox"
                        checked={group.enabled}
                        onChange={handleToggle}
                        className="form-checkbox"
                    />

                    <div style={{ color: 'var(--color-text-muted)', display: 'flex' }} title={group.type === 'regex' ? "Regex Group" : "Keyword Group"}>
                        {group.type === 'regex' ? <Code size={14} /> : <Type size={14} />}
                    </div>
                </div>

                {/* Middle: Title (Truncates) */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
                    {isEditing ? (
                        <div className="flex items-center gap-sm" style={{ width: '100%' }}>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{
                                    padding: '2px 6px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-accent)',
                                    width: '100%'
                                }}
                                autoFocus
                            />
                            <button onClick={handleSaveName} className="btn btn-ghost" style={{ color: 'green', padding: 4 }}><Check size={14} /></button>
                            <button onClick={() => setIsEditing(false)} className="btn btn-ghost" style={{ color: 'red', padding: 4 }}><X size={14} /></button>
                        </div>
                    ) : (
                        <span
                            className="group-label"
                            style={{
                                color: group.enabled ? 'inherit' : 'var(--color-text-muted)',
                                fontSize: '15px',
                                cursor: 'default'
                            }}
                            title={group.name}
                        >
                            {group.name}
                        </span>
                    )}
                </div>

                {/* Right: Actions (Fixed) */}
                <div className="flex items-center gap-sm" style={{ flexShrink: 0 }}>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn btn-ghost" style={{ padding: 4, opacity: 0.5 }} title="Rename">
                            <Edit2 size={12} />
                        </button>
                    )}

                    {/* Color Circle Trigger */}
                    <div style={{ position: 'relative', display: 'flex' }}>
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            title="Change Color"
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                backgroundColor: group.color,
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer'
                            }}
                        />
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

                    <button onClick={() => onDelete(group.id)} className="btn btn-ghost" style={{ color: '#ef4444', padding: 4 }} title="Delete Group">
                        <Trash2 size={16} />
                    </button>
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
