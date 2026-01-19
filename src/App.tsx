
import { useEffect, useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { GroupList } from './components/GroupList';
import { DataModal } from './components/DataModal';
import { loadSettings, saveSettings } from './core/storage';
import type { AppSettings, HighlightGroup } from './core/storage';
import { X, Highlighter, Settings } from 'lucide-react';

function App() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);

  // Load initial settings & Sidebar State
  useEffect(() => {
    async function fetch() {
      const data = await loadSettings();
      setSettings(data);

      const storage = await chrome.storage.local.get('sidebarOpen');
      setSidebarOpen(!!storage.sidebarOpen);

      setLoading(false);
    }
    fetch();

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

  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings).catch(console.error);
  }, []);

  const updateGroups = (newGroups: HighlightGroup[]) => {
    if (!settings) return;
    updateSettings({ ...settings, groups: newGroups });
  };

  if (loading || !settings) {
    return null;
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
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{
        padding: 'var(--spacing-md)',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg-card)'
      }}>
        <div className="flex items-center gap-sm">
          <div style={{
            width: 24,
            height: 24,
            background: 'var(--color-primary)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>I</span>
          </div>
          <h1 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Ink</h1>
        </div>

        <div className="flex items-center gap-xs">
          <button
            onClick={() => setShowDataModal(true)}
            className="btn btn-ghost"
            style={{ padding: 6 }}
            title="Settings & Data"
          >
            <Settings size={18} />
          </button>
          <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 4px' }} />
          <button onClick={() => toggleSidebar(false)} className="btn btn-ghost" style={{ padding: 6 }}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Layout>
          <GroupList groups={settings.groups} setGroups={updateGroups} />
        </Layout>
      </div>

      {/* Modals */}
      {showDataModal && (
        <DataModal
          settings={settings}
          updateSettings={updateSettings}
          onClose={() => setShowDataModal(false)}
        />
      )}
    </div>
  );
}

export default App;
