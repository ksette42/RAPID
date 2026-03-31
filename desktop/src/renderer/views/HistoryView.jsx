import { useState, useEffect } from 'react';

export function HistoryView({ apiKey, apiUrl }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${apiUrl}/api/analyze`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then((r) => r.json())
      .then((data) => { setAnalyses(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError('Failed to load. Check your connection.'); setLoading(false); });
  }, [apiKey, apiUrl]);

  const statusColors = { COMPLETED: '#22c55e', PROCESSING: '#6172f4', PENDING: '#f59e0b', FAILED: '#ef4444' };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>History</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Your recent analyses.</p>

      {loading && <div style={{ color: '#6b7280', textAlign: 'center', paddingTop: 60 }}>Loading...</div>}
      {error && (
        <div style={{ color: '#f87171', padding: 14, backgroundColor: '#3f1212', borderRadius: 10 }}>
          {error}
        </div>
      )}

      {!loading && analyses.length === 0 && !error && (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ color: '#9ca3af' }}>No analyses yet. Run your first analysis!</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {analyses.map((a) => (
          <div key={a.id} style={{
            backgroundColor: '#13131f', borderRadius: 12, padding: 16,
            border: '1px solid #1e1e3a', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, backgroundColor: '#6172f420',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>⚡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
              <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
                {a.language || a.type} · {new Date(a.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {a.costSavings > 0 && (
                <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 600 }}>
                  -${a.costSavings}/mo
                </span>
              )}
              <span style={{
                fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
                backgroundColor: ((statusColors[a.status]) || '#6b7280') + '20',
                color: statusColors[a.status] || '#6b7280',
              }}>
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
