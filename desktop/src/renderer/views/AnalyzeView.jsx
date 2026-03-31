import { useState, useEffect } from 'react';

const TYPES = [
  { id: 'CODE', label: 'Code', icon: '💻' },
  { id: 'DATABASE', label: 'Database', icon: '🗄️' },
  { id: 'API', label: 'API', icon: '🔗' },
  { id: 'INFRASTRUCTURE', label: 'Infra', icon: '☁️' },
  { id: 'DASHBOARD', label: 'Dashboard', icon: '📊' },
  { id: 'GENERAL', label: 'General', icon: '📝' },
];

export function AnalyzeView({ apiKey, apiUrl, openedFile, isElectron }) {
  const [type, setType] = useState('CODE');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  // Load file opened from menu
  useEffect(() => {
    if (openedFile) {
      setCode(openedFile.content);
      setFileName(openedFile.path.split('/').pop() || openedFile.path.split('\\').pop());
      setTitle(openedFile.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || '');
    }
  }, [openedFile]);

  const handleBrowseFile = async () => {
    if (!isElectron) return;
    const file = await window.rapidAPI.openFileDialog();
    if (file) {
      setCode(file.content);
      const name = file.path.split('/').pop() || file.path.split('\\').pop();
      setFileName(name);
      setTitle(name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim() || !title.trim()) {
      setError('Please provide a title and code to analyze.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    const interval = setInterval(() => setProgress((p) => Math.min(p + 12, 88)), 600);

    try {
      const res = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ title, content: code, type, fileName }),
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Analysis failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      clearInterval(interval);
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const handleExport = async () => {
    if (!result || !isElectron) return;
    const md = generateReport(result, title);
    await window.rapidAPI.saveFile(`rapid-${title}.md`, md);
  };

  const priorityColors = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#22c55e' };
  const totalSavings = result?.suggestions?.reduce((a, s) => a + (s.estimatedSaving || 0), 0) || 0;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Analyze</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
        Open a file or paste code to analyze for cost savings and reliability improvements.
      </p>

      {/* Type selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TYPES.map((t) => (
          <button key={t.id} onClick={() => setType(t.id)} style={{
            padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13,
            border: `1px solid ${type === t.id ? '#6172f4' : '#1e1e3a'}`,
            backgroundColor: type === t.id ? '#6172f420' : '#13131f',
            color: type === t.id ? '#8196fa' : '#9ca3af',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Title + file */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <input
          placeholder="Analysis title (e.g. payment-service)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 10,
            backgroundColor: '#13131f', border: '1px solid #1e1e3a',
            color: 'white', fontSize: 14, outline: 'none',
          }}
        />
        {isElectron && (
          <button onClick={handleBrowseFile} style={{
            padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
            border: '1px solid #1e1e3a', backgroundColor: '#13131f',
            color: '#9ca3af', fontSize: 13, whiteSpace: 'nowrap',
          }}>
            📂 Browse File
          </button>
        )}
      </div>

      {fileName && (
        <div style={{ fontSize: 12, color: '#6172f4', marginBottom: 12 }}>
          📄 {fileName}
        </div>
      )}

      {/* Code textarea */}
      <textarea
        placeholder={`Paste your code here...\n\n// Example:\nfunction getUser(id) {\n  return db.query('SELECT * FROM users WHERE id = ' + id);\n}`}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: '100%', minHeight: 240, padding: 14, borderRadius: 12,
          backgroundColor: '#13131f', border: '1px solid #1e1e3a',
          color: '#d1fae5', fontSize: 13, fontFamily: 'JetBrains Mono, Fira Code, monospace',
          outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          lineHeight: 1.6,
        }}
      />

      {/* Progress bar */}
      {loading && (
        <div style={{ marginTop: 12, height: 4, backgroundColor: '#1e1e3a', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, #6172f4, #a855f7)',
            transition: 'width 0.4s ease', borderRadius: 2,
          }} />
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 10,
          backgroundColor: '#3f1212', border: '1px solid #7f1d1d', color: '#f87171', fontSize: 13,
        }}>
          ✖ {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          marginTop: 14, width: '100%', padding: 15, borderRadius: 12, border: 'none',
          background: 'linear-gradient(135deg, #6172f4, #a855f7)',
          color: 'white', fontSize: 15, fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? '⚡ Analyzing...' : '⚡ Run Analysis'}
      </button>

      {/* Results */}
      {result && (
        <div style={{ marginTop: 28 }}>
          {/* Scores */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Cost Savings/mo', value: `$${totalSavings}`, color: '#22c55e', bg: '#052e16', icon: '📉' },
              { label: 'Reliability', value: `${result.analysis.reliabilityScore}/100`, color: '#60a5fa', bg: '#0c1a3d', icon: '🛡️' },
              { label: 'Performance', value: `${result.analysis.performanceScore}/100`, color: '#a78bfa', bg: '#2d1b69', icon: '⚡' },
            ].map((s) => (
              <div key={s.label} style={{
                flex: 1, backgroundColor: s.bg, borderRadius: 12, padding: 16,
                border: `1px solid ${s.color}40`, textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{result.suggestions.length} Suggestions</h3>
            {isElectron && (
              <button onClick={handleExport} style={{
                padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                border: '1px solid #1e1e3a', backgroundColor: '#13131f',
                color: '#9ca3af', fontSize: 12,
              }}>
                ⬇️ Export Report
              </button>
            )}
          </div>

          {/* Suggestions */}
          {result.suggestions.map((s, i) => (
            <div key={i} style={{
              backgroundColor: '#13131f', borderRadius: 12, padding: 16,
              border: '1px solid #1e1e3a', marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                  backgroundColor: (priorityColors[s.priority] || '#6b7280') + '20',
                  color: priorityColors[s.priority] || '#6b7280',
                  border: `1px solid ${(priorityColors[s.priority] || '#6b7280')}40`,
                }}>{s.priority}</span>
                <span style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 6,
                  backgroundColor: '#1e1e3a', color: '#9ca3af',
                }}>{s.category?.replace('_', ' ')}</span>
                {s.estimatedSaving > 0 && (
                  <span style={{ marginLeft: 'auto', color: '#22c55e', fontSize: 13, fontWeight: 700 }}>
                    +${s.estimatedSaving}/mo
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{s.title}</div>
              <div style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6 }}>{s.description}</div>
              {s.codeSnippet && (
                <pre style={{
                  marginTop: 10, backgroundColor: '#0a0a1a', borderRadius: 8, padding: 12,
                  fontSize: 12, fontFamily: 'monospace', overflowX: 'auto', color: '#f87171',
                  border: '1px solid #3f1212',
                }}>{s.codeSnippet}</pre>
              )}
              {s.improvedCode && (
                <pre style={{
                  marginTop: 8, backgroundColor: '#0a0a1a', borderRadius: 8, padding: 12,
                  fontSize: 12, fontFamily: 'monospace', overflowX: 'auto', color: '#4ade80',
                  border: '1px solid #166534',
                }}>{s.improvedCode}</pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function generateReport(result, title) {
  const date = new Date().toLocaleDateString();
  const totalSavings = result.suggestions.reduce((a, s) => a + (s.estimatedSaving || 0), 0);
  return `# RAPID Analysis: ${title}\n_${date}_\n\n## Scores\n| Metric | Value |\n|--------|-------|\n| Language | ${result.analysis.language} |\n| Reliability | ${result.analysis.reliabilityScore}/100 |\n| Performance | ${result.analysis.performanceScore}/100 |\n| Savings | $${totalSavings}/month |\n\n## Suggestions\n\n${result.suggestions.map((s, i) => `### ${i + 1}. ${s.title}\n- **Priority**: ${s.priority}\n- **Category**: ${s.category}\n${s.estimatedSaving > 0 ? `- **Savings**: $${s.estimatedSaving}/month\n` : ''}\n${s.description}\n`).join('\n')}`;
}
