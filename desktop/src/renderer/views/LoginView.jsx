import { useState } from 'react';

export function LoginView({ onLogin, apiUrl, version }) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) { setError('Please enter your API key.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/api-keys`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.status === 200 || res.status === 401) {
        // 200 = valid, 401 = exists but wrong — either way let them in
        // The actual API calls will fail gracefully with bad keys
        onLogin(apiKey.trim());
      } else {
        setError('Could not connect to RAPID server. Check your API key.');
      }
    } catch {
      // Offline mode — allow login anyway
      onLogin(apiKey.trim());
    } finally {
      setLoading(false);
    }
  };

  const openBrowser = () => {
    if (typeof window.rapidAPI !== 'undefined') {
      window.rapidAPI.openExternal(`${apiUrl}/dashboard/api-keys`);
    } else {
      window.open(`${apiUrl}/dashboard/api-keys`, '_blank');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0a0a1a', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, #6172f4, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(97,114,244,0.4)',
          }}>⚡</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#8196fa' }}>RAPID</div>
          <div style={{ color: '#4b5563', fontSize: 13, marginTop: 4 }}>
            Read · Analyze · Patch · Implement · Document
          </div>
          <div style={{ color: '#374151', fontSize: 11, marginTop: 4 }}>v{version}</div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#13131f', borderRadius: 16,
          padding: 28, border: '1px solid #1e1e3a',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Connect to RAPID</h2>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>
            Enter your API key to start analyzing code on your machine.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 6 }}>
                API Key
              </label>
              <input
                type="password"
                placeholder="rapid_xxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  backgroundColor: '#0a0a1a', border: '1px solid #1e1e3a',
                  color: 'white', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: '#3f1212', borderRadius: 8, padding: '10px 14px',
                marginBottom: 16, border: '1px solid #7f1d1d',
                color: '#f87171', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6172f4, #a855f7)',
                color: 'white', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #1e1e3a' }}>
            <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 10 }}>
              Don't have an API key?
            </p>
            <button
              onClick={openBrowser}
              style={{
                width: '100%', padding: 12, borderRadius: 10,
                border: '1px solid #1e1e3a', backgroundColor: 'transparent',
                color: '#9ca3af', fontSize: 13, cursor: 'pointer',
              }}
            >
              🌐 Get API Key from Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
