
import React, { useRef } from 'react';
import { Download, Upload, RefreshCw, X } from 'lucide-react';
import type { AppSettings } from '../core/storage';
import { DEFAULT_SETTINGS } from '../core/storage';

interface DataModalProps {
    settings: AppSettings;
    updateSettings: (s: AppSettings) => void;
    onClose: () => void;
}

export function DataModal({ settings, updateSettings, onClose }: DataModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                    updateSettings(json);
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
                width: 300,
                background: 'var(--color-bg-card)',
                padding: 'var(--spacing-lg)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    className="btn btn-ghost"
                    style={{ position: 'absolute', top: 12, right: 12, padding: 4 }}
                >
                    <X size={18} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-lg)', marginTop: 0 }}>
                    Data Management
                </h2>

                <div className="flex flex-col gap-sm">
                    <button onClick={handleExport} className="btn btn-secondary w-full justify-center">
                        <Download size={16} style={{ marginRight: 8 }} />
                        Export Settings
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-secondary w-full justify-center"
                    >
                        <Upload size={16} style={{ marginRight: 8 }} />
                        Import Settings
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
            </div>
        </div>
    );
}
