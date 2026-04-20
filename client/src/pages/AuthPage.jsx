import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { C } from '../utils/colors';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields');
    if (mode === 'register' && !form.name) return setError('Name is required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: C.surface, border: `1px solid ${C.border}`, color: C.text,
    borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 20 }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '30%', width: 400, height: 400, background: C.accent + '08', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '25%', width: 300, height: 300, background: C.pink + '08', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ width: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #6c63ff, #a89dff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 auto 16px' }}>S</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>SocialPilot <span style={{ color: C.accentLight }}>AI</span></div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>Your AI-powered social media command center</div>
        </div>

        {/* Card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: C.surface, borderRadius: 10, padding: 4 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: mode === m ? C.accent : 'transparent', color: mode === m ? '#fff' : C.muted, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && (
              <div>
                <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>YOUR NAME</label>
                <input style={inputStyle} placeholder="Username" value={form.name} onChange={set('name')} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>EMAIL</label>
              <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>PASSWORD</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>

            {error && <div style={{ background: '#ff5c5c18', border: '1px solid #ff5c5c44', color: '#ff5c5c', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>{error}</div>}

            <button onClick={submit} disabled={loading} style={{ width: '100%', background: loading ? C.dim : 'linear-gradient(135deg, #6c63ff, #a89dff)', border: 'none', color: '#fff', borderRadius: 12, padding: '14px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontSize: 15, fontFamily: 'inherit', marginTop: 4, letterSpacing: 0.3 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </div>

          {mode === 'login' && (
            <div style={{ marginTop: 20, padding: '14px', background: C.surface, borderRadius: 10, fontSize: 12, color: C.muted }}>
              <strong style={{ color: C.accentLight }}>Demo:</strong> Register a new account to get started. Data is stored in your MongoDB.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
