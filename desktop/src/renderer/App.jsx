import { useState, useEffect, useCallback } from 'react';
import { AnalyzeView } from './views/AnalyzeView';
import { HistoryView } from './views/HistoryView';
import { SuggestionsView } from './views/SuggestionsView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';

const NAV = [
  { id: 'analyze', label: 'Analyze', icon: '⚡' },
  { id: 'history', label: 'History', icon: '📋' },
  { id: 'suggestions', label: 'Suggestions', icon: '💡' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  const [route, setRoute] = useState('analyze');
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('https://app.rapid.dev');
  const [isElectron] = useState(() => typeof window.rapidAPI !== 'undefined');
  const [openedFile, setOpenedFile] = useState(null);
  const [version, setVersion] = useState('1.0.0');

  useEffect(() => {
    if (!isElectron) return;
    window.rapidAPI.getConfig().then((cfg) => {
      setApiKey(cfg.apiKey || '');
      setApiUrl(cfg.apiUrl || 'https://app.rapid.dev');
    });
    window.rapidAPI.getVersion().then(setVersion);

    // Listen for menu events
    window.rapidAPI.onNavigate((r) => setRoute(r.replace('/', '') || 'analyze'));
    window.rapidAPI.onOpenFile((data) => {
      setOpenedFile(data);
      setRoute('analyze');
    });
  }, [isElectron]);

  const handleSaveApiKey = useCallback(async (key) => {
    setApiKey(key);
    if (isElectron) await window.rapidAPI.setConfig('apiKey', key);
  }, [isElectron]);

  if (!apiKey) {
    return <LoginView onLogin={handleSaveApiKey} apiUrl={apiUrl} version={version} />;
  }

  const views = {
    analyze: <AnalyzeView apiKey={apiKey} apiUrl={apiUrl} openedFile={openedFile} isElectron={isElectron} />,
    history: <HistoryView apiKey={apiKey} apiUrl={apiUrl} onOpenAnalysis={(id) => setRoute('analyze')} />,
    suggestions: <SuggestionsView apiKey={apiKey} apiUrl={apiUrl} />,
    settings: <SettingsView apiKey={apiKey} apiUrl={apiUrl} onSave={handleSaveApiKey} version={version} isElectron={isElectron} />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a1a', color: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: 220,
        backgroundColor: '#13131f',
        borderRight: '1px solid #1e1e3a',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: process.platform === 'darwin' ? 32 : 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1e1e3a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #6172f4, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}>⚡</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#8196fa' }}>RAPID</div>
              <div style={{ fontSize: 10, color: '#4b5563', marginTop: 1 }}>v{version}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                fontSize: 14, fontWeight: 500,
                backgroundColor: route === item.id ? '#6172f420' : 'transparent',
                color: route === item.id ? '#8196fa' : '#9ca3af',
                outline: route === item.id ? '1px solid #6172f440' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom: open in browser */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #1e1e3a' }}>
          <button
            onClick={() => isElectron && window.rapidAPI.openExternal(apiUrl + '/dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 8, width: '100%',
              border: '1px solid #1e1e3a', cursor: 'pointer',
              backgroundColor: 'transparent', color: '#6b7280',
              fontSize: 12,
            }}
          >
            <span>🌐</span> Open in Browser
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {views[route] || views.analyze}
      </div>
    </div>
  );
}
