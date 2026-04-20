import { useState } from 'react';
import api from '../utils/api';
import { C } from '../utils/colors';
import { GlowCard, Btn } from '../components/UI';

const SET_COLORS = [C.accent, C.teal, C.pink];

export default function Hashtags() {
  const [niche,   setNiche]   = useState('');
  const [output,  setOutput]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [copied,  setCopied]  = useState('');

  const generate = async () => {
    if (!niche.trim()) return;
    setLoading(true); setOutput(null); setError('');
    try {
      const res = await api.post('/ai/hashtags', { niche });
      setOutput(res.data.data);
    } catch(e) {
      setError(e.response?.data?.message || 'Generation failed. Check your API keys in server/.env');
    } finally {
      setLoading(false);
    }
  };

  const copySet = (hashtags, label) => {
    navigator.clipboard.writeText(hashtags.join(' '));
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const copyTag = (tag) => {
    navigator.clipboard.writeText(tag);
    setCopied(tag);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hashtag Generator</h1>
        <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Generate optimized hashtag sets for maximum reach and engagement.</p>
      </div>

      <GlowCard style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>TARGET INDUSTRY OR NICHE</label>
            <input
              value={niche} onChange={e => setNiche(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="e.g., Sustainable Fashion, B2B SaaS, Fitness Coaching, Real Estate"
              style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <Btn onClick={generate} disabled={loading || !niche.trim()} style={{ padding: '12px 24px' }}>
            {loading ? 'Generating...' : '# Generate Sets'}
          </Btn>
        </div>
        {error && <div style={{ marginTop: 14, background: '#ff5c5c18', border: '1px solid #ff5c5c44', color: '#ff5c5c', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>{error}</div>}
      </GlowCard>

      {output?.sets && (
        <>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: C.teal + '18', color: C.teal, border: `1px solid ${C.teal}33`, borderRadius: 5, padding: '2px 8px', fontWeight: 700, fontSize: 11 }}>via {output.provider || 'groq+gemini'}</span>
            Click any hashtag to copy it
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {output.sets.map((set, i) => {
              const color = SET_COLORS[i];
              return (
                <GlowCard key={i} style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color }}>{set.label}</div>
                    <button onClick={() => copySet(set.hashtags, set.label)} style={{ background: color + '18', color, border: `1px solid ${color}33`, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {copied === set.label ? '✓ Copied' : 'Copy All'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {set.hashtags.map(h => (
                      <span key={h} onClick={() => copyTag(h)} title="Click to copy" style={{ background: color + '15', color, border: `1px solid ${color}30`, borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.1s', opacity: copied === h ? 0.6 : 1 }}>
                        {copied === h ? '✓' : h}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
