
import React, { useEffect, useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { GroupList } from './components/GroupList';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from './core/storage';
import type { AppSettings, HighlightGroup } from './core/storage';
import { Download, Upload, RefreshCw, X, Highlighter } from 'lucide-react';

function App() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed until loaded

  // Load initial settings & Sidebar State
  useEffect(() => {
    async function fetch() {
      const data = await loadSettings();
      setSettings(data);

      // Load sidebar state (separate key from settings to avoid clutter)
      const storage = await chrome.storage.local.get('sidebarOpen');
      setSidebarOpen(!!storage.sidebarOpen);

      setLoading(false);
    }
    fetch();

    // Listen to background script toggles or other tabs
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
      if (area === 'local' && changes.sidebarOpen) {
        setSidebarOpen(Boolean(changes.sidebarOpen.newValue));
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const toggleSidebar = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
    chrome.storage.local.set({ sidebarOpen: isOpen });
  };

  // Save whenever settings change
  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings).catch(console.error);
  }, []);

  const updateGroups = (newGroups: HighlightGroup[]) => {
    if (!settings) return;
    updateSettings({ ...settings, groups: newGroups });
  };

  const handleExport = () => {
    if (!settings) return;
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

  const handleReset = async () => {
    if (confirm('Reset all settings to default?')) {
      updateSettings(DEFAULT_SETTINGS);
    }
  };

  if (loading || !settings) {
    return null; // Don't render anything until ready
  }

  // Floating Launcher Icon (When Closed)
  if (!sidebarOpen) {
    return (
      <div
        onClick={() => toggleSidebar(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 999999,
          transition: 'transform 0.2s',
        }}
        title="Open Ink Highlighter"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Highlighter size={24} />
      </div>
    );
  }

  // Sidebar UI (When Open)
  return (
    <div style={{
      width: 350,
      height: '100vh',
      background: 'var(--color-bg-page, #f8fafc)',
      borderLeft: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 15px rgba(0,0,0,0.05)',
      fontFamily: 'Inter, sans-serif' // Enforce font in shadow DOM
    }}>
      {/* Header with Close Button */}
      <div className="flex items-center justify-between" style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
        <div className="flex items-center gap-sm">
          <div style={{ width: 24, height: 24, background: 'var(--color-primary)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>I</span>
          </div>
          <h1 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Ink</h1>
        </div>

        <button onClick={() => toggleSidebar(false)} className="btn btn-ghost" style={{ padding: 4 }}>
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Layout>
          <GroupList groups={settings.groups} setGroups={updateGroups} />

          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)' }}>Data Management</h3>
            <div className="flex gap-sm">
              <button onClick={handleExport} className="btn btn-ghost" style={{ border: '1px solid var(--color-border)' }}>
                <Download size={14} style={{ marginRight: 6 }} />
                Export
              </button>

              <label className="btn btn-ghost" style={{ border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                <Upload size={14} style={{ marginRight: 6 }} />
                Import
                <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
              </label>

              <button onClick={handleReset} className="btn btn-ghost" style={{ marginLeft: 'auto' }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
}

export default App;
