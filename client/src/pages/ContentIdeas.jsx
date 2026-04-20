import { useState } from 'react';
import api from '../utils/api';
import { C } from '../utils/colors';
import { GlowCard, Btn, Select } from '../components/UI';

const GOALS = ['Increase Engagement','Educate Audience','Drive Sales / Conversion','Brand Awareness','Build Community','Generate Leads'];
const TYPE_COLORS = { Reel: C.pink, Carousel: C.accent, Story: C.teal, Post: C.amber, Video: '#a78bfa', Thread: '#60a5fa' };

export default function ContentIdeas() {
  const [industry, setIndustry] = useState('');
  const [goal,     setGoal]     = useState('Increase Engagement');
  const [output,   setOutput]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const generate = async () => {
    if (!industry.trim()) return;
    setLoading(true); setOutput(null); setError('');
    try {
      const res = await api.post('/ai/ideas', { industry, goal });
      setOutput(res.data.data);
    } catch(e) {
      setError(e.response?.data?.message || 'Generation failed. Check your API keys in server/.env');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Content Ideas Generator</h1>
        <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Break through creative block with AI-powered content concepts.</p>
      </div>

      <GlowCard style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>CLIENT INDUSTRY</label>
            <input
              value={industry} onChange={e => setIndustry(e.target.value)}
              placeholder="e.g., Specialty Coffee, Real Estate, Fitness, B2B SaaS"
              style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <Select label="Primary Goal" value={goal} onChange={e => setGoal(e.target.value)} options={GOALS} />
          <Btn onClick={generate} disabled={loading || !industry.trim()} style={{ padding: '10px 24px' }}>
            {loading ? '...' : '◎ Generate Ideas'}
          </Btn>
        </div>
        {error && <div style={{ marginTop: 14, background: '#ff5c5c18', border: '1px solid #ff5c5c44', color: '#ff5c5c', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>{error}</div>}
      </GlowCard>

      {output?.ideas && (
        <>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: C.accent + '18', color: C.accentLight, border: `1px solid ${C.accent}33`, borderRadius: 5, padding: '2px 8px', fontWeight: 700, fontSize: 11 }}>via groq + gemini</span>
            {output.ideas.length} ideas for {industry}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {output.ideas.map((idea, i) => {
              const tc = TYPE_COLORS[idea.type] || C.accent;
              return (
                <GlowCard key={i} style={{ padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ background: tc + '20', color: tc, border: `1px solid ${tc}33`, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{idea.type}</span>
                    <span style={{ fontSize: 18, opacity: 0.12, color: tc }}>◎</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, lineHeight: 1.3 }}>{idea.title}</div>
                  <div style={{ fontSize: 13, color: C.accentLight, fontStyle: 'italic', marginBottom: 10, lineHeight: 1.6, borderLeft: `2px solid ${C.accent}44`, paddingLeft: 10 }}>"{idea.hook}"</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{idea.description}</div>
                </GlowCard>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
