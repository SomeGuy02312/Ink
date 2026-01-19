
import { useState, useRef, useEffect } from 'react';
import { Folder, Save, ChevronDown, Check, Play, User } from 'lucide-react';
import type { SavedProfile } from '../core/storage';

interface ProfileMenuProps {
    profiles: SavedProfile[];
    onLoad: (profile: SavedProfile) => void;
    onSave: (name: string) => void;
}

export function ProfileMenu({ profiles, onLoad, onSave }: ProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showSaveInput, setShowSaveInput] = useState(false);
    const [newName, setNewName] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Handle Shadow DOM retargeting
            const path = event.composedPath();
            if (menuRef.current && !path.includes(menuRef.current)) {
                setIsOpen(false);
                setShowSaveInput(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSaveSubmit = () => {
        if (newName.trim()) {
            onSave(newName.trim());
            setNewName('');
            setShowSaveInput(false);
            setIsOpen(false);
        }
    };

    return (
        <div style={{ position: 'relative' }} ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-ghost"
                title="Profiles"
                style={{
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: isOpen ? 'var(--color-primary)' : 'var(--color-text-main)'
                }}
            >
                <Folder size={18} />
                <ChevronDown size={12} style={{ opacity: 0.7 }} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: -50, /* Align slightly right to handle overflow */
                    marginTop: 8,
                    width: 240,
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 50,
                    overflow: 'hidden'
                }}>
                    {/* Header: Save Current */}
                    <div style={{
                        padding: '8px',
                        borderBottom: '1px solid var(--color-border)',
                        background: 'var(--color-bg-page)'
                    }}>
                        {!showSaveInput ? (
                            <button
                                onClick={() => setShowSaveInput(true)}
                                className="btn btn-secondary w-full justify-center"
                                style={{ fontSize: '13px' }}
                            >
                                <Save size={14} style={{ marginRight: 6 }} />
                                Save Current
                            </button>
                        ) : (
                            <div className="flex gap-xs">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Profile Name"
                                    style={{
                                        flex: 1,
                                        fontSize: '13px',
                                        padding: '4px 8px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--color-primary)',
                                        minWidth: 0
                                    }}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveSubmit();
                                        if (e.key === 'Escape') setShowSaveInput(false);
                                    }}
                                />
                                <button
                                    onClick={handleSaveSubmit}
                                    className="btn btn-primary"
                                    style={{ padding: '4px 8px' }}
                                    disabled={!newName.trim()}
                                >
                                    <Check size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile List */}
                    <div style={{ maxHeight: 200, overflowY: 'auto', padding: '4px 0' }}>
                        {profiles.length === 0 ? (
                            <div style={{
                                padding: '12px',
                                textAlign: 'center',
                                color: 'var(--color-text-muted)',
                                fontSize: '13px',
                                fontStyle: 'italic'
                            }}>
                                No saved profiles
                            </div>
                        ) : (
                            profiles.map(profile => (
                                <button
                                    key={profile.id}
                                    onClick={() => {
                                        onLoad(profile);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-sm"
                                    style={{
                                        padding: '8px 12px',
                                        textAlign: 'left',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        fontSize: '14px',
                                        color: 'var(--color-text-main)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <User size={14} style={{ color: 'var(--color-text-muted)' }} />
                                    <span style={{
                                        flex: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {profile.name}
                                    </span>
                                    <Play size={12} style={{ opacity: 0.5 }} />
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
