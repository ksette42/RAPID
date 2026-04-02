import { useState } from 'react';

export function SettingsView({ apiKey, apiUrl, onSave, version, isElectron }) {
  const [key, setKey] = useState(apiKey);
  const [url, setUrl] = useState(apiUrl);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    onSave(key);
    if (isElectron) {
      await window.rapidAPI.setConfig('apiKey', key);
      await window.rapidAPI.setConfig('apiUrl', url);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openDashboard = () => {
    if (isElectron) window.rapidAPI.openExternal(`${url}/dashboard`);
    else window.open(`${url}/dashboard`, '_blank');
  };

  const openApiKeys = () => {
    if (isElectron) window.rapidAPI.openExternal(`${url}/dashboard/api-keys`);
    else window.open(`${url}/dashboard/api-keys`, '_blank');
  };

  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>Configure your RAPID desktop app.</p>

      <div style={{ backgroundColor: '#13131f', borderRadius: 14, padding: 20, border: '1px solid #1e1e3a', marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#9ca3af' }}>CONNECTION</h3>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 6 }}>RAPID Server URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10, boxSizing: 'border-box',
              backgroundColor: '#0a0a1a', border: '1px solid #1e1e3a', color: 'white', fontSize: 14, outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 12, color: '#9ca3af' }}>API Key</label>
            <button onClick={openApiKeys} style={{
              fontSize: 11, color: '#6172f4', background: 'none', border: 'none', cursor: 'pointer',
            }}>Get API Key →</button>
          </div>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="rapid_xxxxxxxxxxxx"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10, boxSizing: 'border-box',
              backgroundColor: '#0a0a1a', border: '1px solid #1e1e3a', color: 'white', fontSize: 14, outline: 'none',
            }}
          />
        </div>

        <button onClick={handleSave} style={{
          width: '100%', padding: 12, borderRadius: 10, border: 'none',
          background: saved ? '#166534' : 'linear-gradient(135deg, #6172f4, #a855f7)',
          color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>

      <div style={{ backgroundColor: '#13131f', borderRadius: 14, padding: 20, border: '1px solid #1e1e3a', marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#9ca3af' }}>QUICK LINKS</h3>
        {[
          { label: '🌐 Open Dashboard', action: openDashboard },
          { label: '🔑 Manage API Keys', action: openApiKeys },
          { label: '💳 Billing & Plans', action: () => { if (isElectron) window.rapidAPI.openExternal(`${url}/dashboard/billing`); } },
        ].map((item) => (
          <button key={item.label} onClick={item.action} style={{
            display: 'block', width: '100%', padding: '11px 14px', marginBottom: 8,
            borderRadius: 10, border: '1px solid #1e1e3a', backgroundColor: 'transparent',
            color: '#9ca3af', fontSize: 13, textAlign: 'left', cursor: 'pointer',
          }}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ color: '#374151', fontSize: 12, textAlign: 'center' }}>
        RAPID Desktop v{version}
      </div>
    </div>
  );
}
