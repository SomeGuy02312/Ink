
import { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { Layout } from './components/Layout';
import { GroupList } from './components/GroupList';
import { SummaryCard } from './components/SummaryCard';
import { DataModal } from './components/DataModal';
import { loadSettings, saveSettings } from './core/storage';
import type { AppSettings, HighlightGroup, SavedProfile } from './core/storage';
import { X, Highlighter, Settings, Eye, EyeOff } from 'lucide-react';
import { ProfileMenu } from './components/ProfileMenu';

function App() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Force scroll to top when sidebar opens
  useLayoutEffect(() => {
    if (sidebarOpen) {
      // Reset scroll on inner content
      if (contentRef.current) contentRef.current.scrollTop = 0;

      // Reset scroll on outer container just in case
      if (sidebarRef.current) sidebarRef.current.scrollTop = 0;

      // Double tap for reliability
      requestAnimationFrame(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0;
        if (sidebarRef.current) sidebarRef.current.scrollTop = 0;
      });
    }
  }, [sidebarOpen]);

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
      // Listen for settings changes (e.g., from background context menu toggle)
      if (area === 'local' && changes.recruiter_highlighter_settings) {
        loadSettings().then(setSettings);
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

  const handleSaveProfile = (name: string) => {
    if (!settings) return;
    const newProfile: SavedProfile = {
      id: crypto.randomUUID(),
      name,
      groups: settings.groups,
      createdAt: Date.now()
    };
    const updatedProfiles = [...(settings.savedProfiles || []), newProfile];
    updateSettings({ ...settings, savedProfiles: updatedProfiles });
  };

  const handleLoadProfile = (profile: SavedProfile) => {
    if (!settings) return;
    if (confirm(`Load "${profile.name}"?`)) {
      updateSettings({ ...settings, groups: profile.groups });
    }
  };

  const toggleGlobalEnabled = () => {
    if (!settings) return;
    updateSettings({ ...settings, globalEnabled: !settings.globalEnabled });
  };

  if (loading || !settings) {
    return null;
  }

  return (
    <>
      {/* Floating Launcher Icon - only show if globally enabled */}
      {settings.globalEnabled && <div
        onClick={() => toggleSidebar(true)}
        style={{
          display: sidebarOpen ? 'none' : 'flex',
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
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
      </div>}

      {/* Sidebar UI */}
      <div
        ref={sidebarRef}
        style={{
          display: sidebarOpen ? 'flex' : 'none',
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 350,
          background: 'var(--color-bg-page, #f8fafc)',
          borderLeft: '1px solid var(--color-border)',
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
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Ink</h1>
          </div>

          <div className="flex items-center gap-xs">
            <button
              onClick={toggleGlobalEnabled}
              className="btn btn-ghost"
              style={{ padding: 6 }}
              title={settings.globalEnabled ? 'Disable Highlighting' : 'Enable Highlighting'}
            >
              {settings.globalEnabled ? <Eye size={18} /> : <EyeOff size={18} style={{ opacity: 0.5 }} />}
            </button>
            <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 4px' }} />
            <ProfileMenu
              profiles={settings.savedProfiles || []}
              onLoad={handleLoadProfile}
              onSave={handleSaveProfile}
            />
            <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 4px' }} />
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
        <div
          ref={contentRef}
          style={{ flex: 1, overflowY: 'auto' }}
        >
          <Layout>
            <SummaryCard groups={settings.groups} />
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
    </>
  );
}

export default App;
