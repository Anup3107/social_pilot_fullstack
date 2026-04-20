import { useState } from 'react';
import api from '../utils/api';
import { C } from '../utils/colors';
import { GlowCard, Btn, Select } from '../components/UI';

const PLATFORMS = ['Instagram','TikTok','LinkedIn','Twitter','Facebook','Pinterest','YouTube'];
const TONES     = ['Professional','Casual','Humorous','Inspirational','Educational','Urgent','Storytelling'];

export default function CaptionWriter() {
  const [topic,    setTopic]    = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone,     setTone]     = useState('Professional');
  const [output,   setOutput]   = useState('');
  const [provider, setProvider] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setOutput(''); setError(''); setProvider('');
    try {
      const res = await api.post('/ai/captions', { topic, platform, tone });
      setOutput(res.data.data.captions);
      setProvider(res.data.data.provider);
    } catch (e) {
      setError(e.response?.data?.message || 'AI generation failed. Check your API keys in server/.env');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Caption Writer</h1>
        <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Generate engaging, platform-specific captions powered by Groq + Gemini.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Input */}
        <GlowCard style={{ padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Input Parameters</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 22 }}>Tell the AI what to write about</div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>WHAT IS THE POST ABOUT?</label>
            <textarea
              value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g., We are launching a new line of eco-friendly coffee cups next Tuesday. The cups are made from recycled ocean plastic..."
              rows={6}
              style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: 14, fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.7 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
            <Select label="Platform" value={platform} onChange={e => setPlatform(e.target.value)} options={PLATFORMS} />
            <Select label="Tone" value={tone} onChange={e => setTone(e.target.value)} options={TONES} />
          </div>

          <Btn onClick={generate} disabled={loading || !topic.trim()} style={{ width: '100%', padding: '14px', fontSize: 15 }}>
            {loading ? '✦ Generating...' : '✦ Generate Captions'}
          </Btn>

          {error && <div style={{ marginTop: 14, background: '#ff5c5c18', border: '1px solid #ff5c5c44', color: '#ff5c5c', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>{error}</div>}
        </GlowCard>

        {/* Output */}
        <GlowCard style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Generated Output</div>
            {output && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {provider && <span style={{ fontSize: 11, color: C.teal, background: C.teal + '18', border: `1px solid ${C.teal}33`, borderRadius: 5, padding: '2px 8px', fontWeight: 700 }}>via {provider}</span>}
                <Btn onClick={copy} variant="ghost" size="sm">Copy All</Btn>
              </div>
            )}
          </div>

          {output ? (
            <div style={{ flex: 1, fontSize: 14, color: C.text, lineHeight: 1.85, whiteSpace: 'pre-wrap', overflowY: 'auto' }}>{output}</div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: C.dim }}>
              <div style={{ fontSize: 42, opacity: 0.2 }}>✦</div>
              <div style={{ fontSize: 14 }}>Your generated captions will appear here</div>
              <div style={{ fontSize: 12, textAlign: 'center', maxWidth: 220 }}>Fill in the details on the left and click Generate</div>
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
