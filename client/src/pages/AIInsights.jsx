import { useState } from 'react';
import api from '../utils/api';
import { C } from '../utils/colors';
import { GlowCard, Btn } from '../components/UI';

const EXAMPLES = [
  "My client is a B2B accounting firm. We post educational content 3x a week on LinkedIn but engagement is stuck at zero and we aren't getting any leads.",
  "A fitness client is seeing great Instagram reach but zero conversions to their paid program. We have 8K followers but almost no one clicks the link in bio.",
  "My real estate client wants to go viral on TikTok but their content feels too 'corporate'. How do I balance brand guidelines with platform-native content?",
];

export default function AIInsights() {
  const [challenge, setChallenge] = useState('');
  const [output,    setOutput]    = useState('');
  const [provider,  setProvider]  = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const getAdvice = async () => {
    if (!challenge.trim()) return;
    setLoading(true); setOutput(''); setError(''); setProvider('');
    try {
      const res = await api.post('/ai/insights', { challenge });
      setOutput(res.data.data.advice);
      setProvider(res.data.data.provider);
    } catch(e) {
      setError(e.response?.data?.message || 'AI request failed. Check your API keys in server/.env');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Strategy Consultant</h1>
        <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Stuck on a client problem? Get actionable strategic advice powered by Gemini.</p>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        {/* Example prompts */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 0.5, marginBottom: 10 }}>TRY AN EXAMPLE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setChallenge(ex)} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 13, textAlign: 'left', fontFamily: 'inherit', lineHeight: 1.5, transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent + '55'}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <span style={{ color: C.accent + '88' }}>→ </span>{ex.slice(0, 90)}...
              </button>
            ))}
          </div>
        </div>

        <GlowCard style={{ padding: 32, marginBottom: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: C.accent + '18', border: `1.5px solid ${C.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px', color: C.accentLight }}>⬡</div>
            <div style={{ fontSize: 13, color: C.muted }}>Describe your challenge in detail for the best advice</div>
          </div>

          <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 10, letterSpacing: 0.5 }}>WHAT'S THE CURRENT CHALLENGE?</label>
          <textarea
            value={challenge} onChange={e => setChallenge(e.target.value)}
            rows={6}
            placeholder="Describe the client, the problem, what you've already tried, and the goal you're working toward..."
            style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: 16, fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.7 }}
          />

          {error && <div style={{ marginTop: 14, background: '#ff5c5c18', border: '1px solid #ff5c5c44', color: '#ff5c5c', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>{error}</div>}

          <button onClick={getAdvice} disabled={loading || !challenge.trim()} style={{ width: '100%', marginTop: 18, background: loading || !challenge.trim() ? C.dim : 'linear-gradient(135deg, #6c63ff, #a89dff)', border: 'none', color: '#fff', borderRadius: 12, padding: '15px', fontWeight: 700, cursor: loading || !challenge.trim() ? 'default' : 'pointer', fontSize: 16, fontFamily: 'inherit', letterSpacing: 0.3 }}>
            {loading ? '⬡ Analyzing your challenge...' : 'Get Strategic Advice →'}
          </button>
        </GlowCard>

        {output && (
          <GlowCard style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.teal }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.teal, letterSpacing: 0.8 }}>STRATEGIC ADVICE</span>
              {provider && <span style={{ fontSize: 11, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5, padding: '2px 8px' }}>via {provider}</span>}
              <button onClick={() => navigator.clipboard.writeText(output)} style={{ marginLeft: 'auto', background: 'none', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>Copy</button>
            </div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 2, whiteSpace: 'pre-wrap' }}>{output}</div>
          </GlowCard>
        )}
      </div>
    </div>
  );
}
