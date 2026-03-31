import { useState, useEffect } from 'react';

export function SuggestionsView({ apiKey, apiUrl }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo suggestions since /api/suggestions list endpoint needs auth
    setLoading(false);
    setSuggestions([
      { id: '1', title: 'Replace SELECT * with specific columns', category: 'COST_SAVING', priority: 'HIGH', estimatedSaving: 300, status: 'PENDING', description: 'Reduces data transfer by 60-80%.' },
      { id: '2', title: 'Add connection pooling', category: 'PERFORMANCE', priority: 'HIGH', estimatedSaving: 200, status: 'PENDING', description: 'Reduces connection overhead by 80%.' },
      { id: '3', title: 'Implement Redis caching', category: 'COST_SAVING', priority: 'MEDIUM', estimatedSaving: 400, status: 'APPROVED', description: 'Cache frequent queries to reduce DB load by 70%.' },
    ]);
  }, []);

  const totalSavings = suggestions.filter(s => s.status === 'PENDING').reduce((a, s) => a + (s.estimatedSaving || 0), 0);
  const priorityColors = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#22c55e' };

  const handleApprove = (id) => {
    setSuggestions((prev) => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
    fetch(`${apiUrl}/api/suggestions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ action: 'approve' }),
    }).catch(() => {});
  };

  const handleDismiss = (id) => {
    setSuggestions((prev) => prev.filter(s => s.id !== id));
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Suggestions</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Review and approve AI-generated improvements.</p>
        </div>
        {totalSavings > 0 && (
          <div style={{ backgroundColor: '#052e16', borderRadius: 12, padding: '10px 16px', border: '1px solid #166534' }}>
            <div style={{ fontSize: 11, color: '#4ade80' }}>Pending Savings</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>${totalSavings}/mo</div>
          </div>
        )}
      </div>

      {loading && <div style={{ color: '#6b7280', textAlign: 'center', paddingTop: 60 }}>Loading...</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {suggestions.map((s) => (
          <div key={s.id} style={{
            backgroundColor: '#13131f', borderRadius: 12, padding: 16,
            border: '1px solid #1e1e3a',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                backgroundColor: (priorityColors[s.priority] || '#6b7280') + '20',
                color: priorityColors[s.priority] || '#6b7280',
              }}>{s.priority}</span>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, backgroundColor: '#1e1e3a', color: '#9ca3af' }}>
                {s.category?.replace('_', ' ')}
              </span>
              {s.estimatedSaving > 0 && (
                <span style={{ marginLeft: 'auto', color: '#22c55e', fontSize: 13, fontWeight: 600 }}>
                  +${s.estimatedSaving}/mo
                </span>
              )}
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
            <div style={{ color: '#9ca3af', fontSize: 13, marginBottom: 12 }}>{s.description}</div>

            {s.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleDismiss(s.id)} style={{
                  flex: 1, padding: 10, borderRadius: 8, cursor: 'pointer',
                  border: '1px solid #7f1d1d', backgroundColor: '#3f1212',
                  color: '#f87171', fontSize: 13, fontWeight: 600,
                }}>Dismiss</button>
                <button onClick={() => handleApprove(s.id)} style={{
                  flex: 2, padding: 10, borderRadius: 8, cursor: 'pointer',
                  border: 'none', background: 'linear-gradient(135deg, #6172f4, #a855f7)',
                  color: 'white', fontSize: 13, fontWeight: 700,
                }}>✓ Approve</button>
              </div>
            )}

            {s.status === 'APPROVED' && (
              <div style={{ padding: 10, borderRadius: 8, backgroundColor: '#0c1a3d', border: '1px solid #1e40af' }}>
                <span style={{ color: '#60a5fa', fontSize: 13 }}>✓ Approved — ready to implement</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && suggestions.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💡</div>
          <div style={{ color: '#9ca3af' }}>No suggestions yet. Run an analysis first.</div>
        </div>
      )}
    </div>
  );
}
