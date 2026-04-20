import { useState, useEffect } from 'react';
import api from '../utils/api';
import { C } from '../utils/colors';
import { GlowCard, Btn, Modal, Input, Select, Spinner, EmptyState, Badge } from '../components/UI';

const PLATFORMS = ['Instagram','TikTok','Facebook','LinkedIn','Twitter','YouTube','Pinterest'];

function PostForm({ clients, initial, onSave, onCancel }) {
  // Normalize: populated client → string ID, ISO datetime → "YYYY-MM-DDTHH:MM" for datetime-local
  const normalize = (data) => {
    if (!data) return null;
    return {
      ...data,
      client:      data.client?._id || data.client || '',
      scheduledAt: data.scheduledAt
        ? new Date(data.scheduledAt).toISOString().slice(0, 16)
        : '',
    };
  };

  const [form, setForm] = useState(
    normalize(initial) || {
      title: '', client: clients[0]?._id || '', platform: 'Instagram',
      scheduledAt: '', caption: '', status: 'Scheduled',
    }
  );
  const [saving, setSaving] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.title || !form.client || !form.scheduledAt) return alert('Title, client and schedule time are required');
    setSaving(true);
    try {
      await onSave(form);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="Post Title *" value={form.title} onChange={set('title')} placeholder="Morning Coffee Ritual" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Select label="Client *" value={form.client} onChange={set('client')} options={clients.map(c => ({ value: c._id, label: c.name }))} />
        <Select label="Platform *" value={form.platform} onChange={set('platform')} options={PLATFORMS} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Schedule Date & Time *" value={form.scheduledAt} onChange={set('scheduledAt')} type="datetime-local" />
        <Select label="Status" value={form.status} onChange={set('status')} options={['Scheduled','Draft','Published']} />
      </div>
      <div>
        <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>CAPTION</label>
        <textarea value={form.caption} onChange={set('caption')} rows={4} placeholder="Write your caption here..." style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Btn onClick={onCancel} variant="ghost">Cancel</Btn>
        <Btn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Schedule Post'}</Btn>
      </div>
    </div>
  );
}

const platformColor = { Instagram: C.pink, TikTok: C.teal, Facebook: '#4267B2', LinkedIn: '#0077b5', Twitter: '#1DA1F2', YouTube: '#FF0000', Pinterest: '#E60023' };

export default function Scheduler() {
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [view, setView] = useState('week'); // week | list

  // Week navigation
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0,0,0,0);
    return d;
  });

  const load = async () => {
    setLoading(true);
    try {
      const [pr, cr] = await Promise.all([api.get('/posts'), api.get('/clients')]);
      setPosts(pr.data.data);
      setClients(cr.data.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (data) => {
    try {
      if (modal?._id) await api.put(`/posts/${modal._id}`, data);
      else await api.post('/posts', data);
      setModal(null);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save post');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this scheduled post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete post');
    }
  };

  // Build week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const postsForDay = (day) => posts.filter(p => {
    const pd = new Date(p.scheduledAt);
    return pd.toDateString() === day.toDateString();
  });

  const navWeek = (delta) => setWeekStart(d => { const nd = new Date(d); nd.setDate(nd.getDate() + delta * 7); return nd; });

  const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Content Scheduler</h1>
          <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Manage content pipeline across all clients.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', gap: 4, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4 }}>
            {['week','list'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ background: view === v ? C.accent : 'transparent', color: view === v ? '#fff' : C.muted, border: 'none', borderRadius: 7, padding: '5px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>{v === 'week' ? '▦ Week' : '☰ List'}</button>
            ))}
          </div>
          <Btn onClick={() => setModal('new')} disabled={clients.length === 0}>+ Schedule Post</Btn>
        </div>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}><Spinner size={36} /></div> : (
        <>
          {view === 'week' && (
            <GlowCard hover={false} style={{ overflow: 'hidden' }}>
              {/* Calendar header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn onClick={() => { const d = new Date(); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); setWeekStart(d); }} variant="ghost" size="sm">Today</Btn>
                  <Btn onClick={() => navWeek(-1)} variant="ghost" size="sm">← Back</Btn>
                  <Btn onClick={() => navWeek(1)} variant="ghost" size="sm">Next →</Btn>
                </div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <div style={{ width: 160 }} />
              </div>

              {/* Day columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {weekDays.map((day, i) => {
                  const isToday = day.toDateString() === today.toDateString();
                  const dayPosts = postsForDay(day);
                  return (
                    <div key={i} style={{ borderRight: i < 6 ? `1px solid ${C.border}` : 'none', minHeight: 180 }}>
                      <div style={{ padding: '12px 10px 10px', borderBottom: `1px solid ${C.border}`, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 0.5 }}>{DAY_LABELS[day.getDay()]}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2, color: isToday ? C.accent : C.text, background: isToday ? C.accent + '18' : 'transparent', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px auto 0' }}>
                          {day.getDate()}
                        </div>
                      </div>
                      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {dayPosts.map(p => {
                          const pc = platformColor[p.platform] || C.accent;
                          return (
                            <div key={p._id} onClick={() => setModal(p)} style={{ background: pc + '18', border: `1px solid ${pc}44`, borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>
                              <div style={{ fontSize: 11, color: pc, fontWeight: 700, marginBottom: 2 }}>{p.platform}</div>
                              <div style={{ fontSize: 11, color: C.text, fontWeight: 600, lineHeight: 1.3 }}>{p.title}</div>
                              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
                                {new Date(p.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlowCard>
          )}

          {view === 'list' && (
            posts.length === 0
              ? <EmptyState icon="▦" text="No scheduled posts" subtext="Schedule your first post above" />
              : <GlowCard hover={false} style={{ overflow: 'hidden' }}>
                {posts.sort((a,b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)).map((p, i) => {
                  const pc = platformColor[p.platform] || C.accent;
                  return (
                    <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: i < posts.length - 1 ? `1px solid ${C.border}` : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = C.surface}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: pc, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                          {p.client?.name} · {p.platform} · {new Date(p.scheduledAt).toLocaleString()}
                        </div>
                      </div>
                      <Badge status={p.status} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setModal(p)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14 }}>✏</button>
                        <button onClick={() => del(p._id)} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontSize: 14 }}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </GlowCard>
          )}
        </>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?._id ? 'Edit Post' : 'Schedule New Post'} width={540}>
        {clients.length === 0
          ? <div style={{ color: C.muted, textAlign: 'center', padding: 20 }}>Add a client first before scheduling posts.</div>
          : <PostForm clients={clients} initial={modal?._id ? modal : null} onSave={save} onCancel={() => setModal(null)} />
        }
      </Modal>
    </div>
  );
}
