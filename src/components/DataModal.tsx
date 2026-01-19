
import React, { useRef, useState } from 'react';
import { Download, Upload, RefreshCw, X, Save, Trash2, Play, Disc } from 'lucide-react';
import type { AppSettings, SavedProfile } from '../core/storage';
import { DEFAULT_SETTINGS } from '../core/storage';

interface DataModalProps {
    settings: AppSettings;
    updateSettings: (s: AppSettings) => void;
    onClose: () => void;
}

export function DataModal({ settings, updateSettings, onClose }: DataModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'data' | 'profiles'>('profiles');
    const [newProfileName, setNewProfileName] = useState('');

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ink-settings-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (json && Array.isArray(json.groups)) {
                    // Ensure savedProfiles exists if importing old format
                    const newSettings = { ...json, savedProfiles: json.savedProfiles || [] };
                    updateSettings(newSettings);
                    alert('Settings imported successfully!');
                    onClose();
                } else {
                    alert('Invalid JSON file.');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to parse JSON.');
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if (confirm('Reset ALL settings (groups & colors) to default? This cannot be undone.')) {
            updateSettings(DEFAULT_SETTINGS);
            onClose();
        }
    };

    // --- Profile Logic ---
    const handleSaveProfile = () => {
        if (!newProfileName.trim()) return;

        const newProfile: SavedProfile = {
            id: crypto.randomUUID(),
            name: newProfileName.trim(),
            groups: settings.groups,
            createdAt: Date.now()
        };

        const updatedProfiles = [...(settings.savedProfiles || []), newProfile];
        updateSettings({ ...settings, savedProfiles: updatedProfiles });
        setNewProfileName('');
    };

    const handleLoadProfile = (profile: SavedProfile) => {
        if (confirm(`Load "${profile.name}"? This will replace your current active groups.`)) {
            updateSettings({ ...settings, groups: profile.groups });
            onClose(); // Optional: close after loading?
        }
    };

    const handleDeleteProfile = (id: string) => {
        if (confirm('Delete this profile?')) {
            const updated = settings.savedProfiles.filter(p => p.id !== id);
            updateSettings({ ...settings, savedProfiles: updated });
        }
    };

    const handleOverwriteProfile = (profile: SavedProfile) => {
        if (confirm(`Overwrite "${profile.name}" with current active groups?`)) {
            const updated = settings.savedProfiles.map(p =>
                p.id === profile.id ? { ...p, groups: settings.groups, createdAt: Date.now() } : p
            );
            updateSettings({ ...settings, savedProfiles: updated });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000000,
            animation: 'fadeIn 0.2s'
        }}>
            <div className="card" style={{
                width: 400,
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--color-bg-card)',
                padding: 0,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Header with Tabs */}
                <div className="flex items-center justify-between" style={{ padding: '16px 16px 0 16px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Settings</h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                <div className="flex" style={{ borderBottom: '1px solid var(--color-border)', padding: '0 16px', marginTop: 16 }}>
                    <button
                        onClick={() => setActiveTab('profiles')}
                        className="btn btn-ghost"
                        style={{
                            borderRadius: '6px 6px 0 0',
                            borderBottom: activeTab === 'profiles' ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeTab === 'profiles' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontWeight: 600
                        }}
                    >
                        Profiles
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        className="btn btn-ghost"
                        style={{
                            borderRadius: '6px 6px 0 0',
                            borderBottom: activeTab === 'data' ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeTab === 'data' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontWeight: 600
                        }}
                    >
                        Data
                    </button>
                </div>

                <div style={{ padding: 16, overflowY: 'auto' }}>
                    {activeTab === 'profiles' ? (
                        <div className="flex flex-col gap-md">
                            {/* Save Current */}
                            <div className="card" style={{ background: 'var(--color-bg-page)', padding: 12 }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 8 }}>Save Current Loadout</div>
                                <div className="flex gap-sm">
                                    <input
                                        type="text"
                                        value={newProfileName}
                                        onChange={(e) => setNewProfileName(e.target.value)}
                                        placeholder="Profile Name (e.g. Java Search)"
                                        style={{ flex: 1, fontSize: '14px' }}
                                    />
                                    <button onClick={handleSaveProfile} className="btn btn-primary" disabled={!newProfileName.trim()} style={{ fontSize: '14px' }}>
                                        <Save size={14} style={{ marginRight: 6 }} />
                                        Save
                                    </button>
                                </div>
                            </div>

                            {/* List */}
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                                    Saved Profiles
                                </div>
                                {(!settings.savedProfiles || settings.savedProfiles.length === 0) && (
                                    <div style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                                        No profiles saved yet.
                                    </div>
                                )}
                                <div className="flex flex-col gap-sm">
                                    {settings.savedProfiles?.map(profile => (
                                        <div key={profile.id} className="card flex items-center justify-between" style={{ padding: '8px 12px' }}>
                                            <span style={{ fontWeight: 500, fontSize: '14px' }}>{profile.name}</span>
                                            <div className="flex items-center gap-xs">
                                                <button
                                                    onClick={() => handleLoadProfile(profile)}
                                                    className="btn btn-ghost"
                                                    title="Load Profile"
                                                    style={{ color: 'var(--color-primary)' }}
                                                >
                                                    <Play size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleOverwriteProfile(profile)}
                                                    className="btn btn-ghost"
                                                    title="Overwrite with Current"
                                                    style={{ color: 'var(--color-text-muted)' }}
                                                >
                                                    <Disc size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProfile(profile.id)}
                                                    className="btn btn-ghost"
                                                    title="Delete"
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Data Tab (Existing)
                        <div className="flex flex-col gap-sm">
                            <button onClick={handleExport} className="btn btn-secondary w-full justify-center">
                                <Download size={16} style={{ marginRight: 8 }} />
                                Export Settings (JSON)
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn btn-secondary w-full justify-center"
                            >
                                <Upload size={16} style={{ marginRight: 8 }} />
                                Import Settings (JSON)
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />

                            <div style={{ height: 1, background: 'var(--color-border)', margin: '8px 0' }} />

                            <button onClick={handleReset} className="btn btn-ghost w-full justify-center text-red">
                                <RefreshCw size={16} style={{ marginRight: 8 }} />
                                Reset to Defaults
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
