import { useState, useEffect } from 'react';
import api from '../utils/api';
import { C, clientColors } from '../utils/colors';
import { GlowCard, Avatar, Badge, Btn, Modal, Input, Select, Spinner, EmptyState } from '../components/UI';

const PLATFORMS = ['Instagram','TikTok','Facebook','LinkedIn','Twitter','YouTube','Pinterest','Snapchat'];
const STATUSES   = ['Active','Lead','Paused','Inactive'];

function ClientForm({ initial, onSave, onCancel }) {
  const normalize = (data) => {
    if (!data) return null;
    return {
      name:         data.name         || '',
      industry:     data.industry     || '',
      contactEmail: data.contactEmail || '',
      retainer:     data.retainer     ?? 0,
      status:       data.status       || 'Active',
      platforms:    Array.isArray(data.platforms) ? data.platforms : [],
      color:        data.color        || clientColors[0],
      notes:        data.notes        || '',
    };
  };

  const [form, setForm] = useState(
    normalize(initial) || {
      name: '', industry: '', contactEmail: '', retainer: 0,
      status: 'Active', platforms: [], color: clientColors[0], notes: '',
    }
  );
  const [saving, setSaving] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const togglePlatform = p => setForm(f => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p] }));

  const save = async () => {
    if (!form.name || !form.industry) return alert('Name and industry are required');
    setSaving(true);
    try {
      await onSave({ ...form, retainer: Number(form.retainer) });
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="Client Name *" value={form.name} onChange={e => set('name')(e.target.value)} placeholder="Sunrise Coffee Co." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Industry *" value={form.industry} onChange={e => set('industry')(e.target.value)} placeholder="Food & Beverage" />
        <Select label="Status" value={form.status} onChange={e => set('status')(e.target.value)} options={STATUSES} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Contact Email" value={form.contactEmail} onChange={e => set('contactEmail')(e.target.value)} placeholder="client@email.com" type="email" />
        <Input label="Monthly Retainer ($)" value={form.retainer} onChange={e => set('retainer')(e.target.value)} placeholder="2500" type="number" />
      </div>
      <div>
        <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 10, letterSpacing: 0.5 }}>PLATFORMS</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => togglePlatform(p)} style={{ background: form.platforms.includes(p) ? C.accent + '30' : C.surface, color: form.platforms.includes(p) ? C.accentLight : C.muted, border: `1px solid ${form.platforms.includes(p) ? C.accent + '55' : C.border}`, borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 10, letterSpacing: 0.5 }}>ACCENT COLOR</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {clientColors.map(col => (
            <div key={col} onClick={() => set('color')(col)} style={{ width: 28, height: 28, borderRadius: '50%', background: col, cursor: 'pointer', border: form.color === col ? `2px solid #fff` : '2px solid transparent', boxSizing: 'border-box' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <Btn onClick={onCancel} variant="ghost">Cancel</Btn>
        <Btn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Client'}</Btn>
      </div>
    </div>
  );
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | client object

  const load = async () => {
    setLoading(true);
    try { const r = await api.get('/clients'); setClients(r.data.data); }
    catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (data) => {
    try {
      if (modal?._id) await api.put(`/clients/${modal._id}`, data);
      else await api.post('/clients', data);
      setModal(null);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save client');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this client? This will not delete associated tasks or deliverables.')) return;
    try {
      await api.delete(`/clients/${id}`);
      setClients(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete client');
    }
  };

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Clients</h1>
          <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Manage your agency's client roster.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: '8px 16px', fontSize: 14, outline: 'none', width: 220, fontFamily: 'inherit' }} />
          <Btn onClick={() => setModal('add')}>+ Add Client</Btn>
        </div>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}><Spinner size={36} /></div> : filtered.length === 0 ? (
        <EmptyState icon="◈" text="No clients yet" subtext="Add your first client to get started" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map(c => (
            <GlowCard key={c._id} style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar name={c.name} color={c.color} size={44} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{c.industry}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setModal(c)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 16, padding: '2px 6px' }}>✏</button>
                  <button onClick={() => del(c._id)} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontSize: 16, padding: '2px 6px' }}>✕</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: C.muted }}>Status</span>
                  <Badge status={c.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: C.muted }}>Retainer</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.teal }}>${c.retainer.toLocaleString()}/mo</span>
                </div>
                {c.platforms?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>Platforms</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {c.platforms.map(p => <span key={p} style={{ background: C.accent + '18', color: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </GlowCard>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?._id ? 'Edit Client' : 'Add New Client'} width={560}>
        <ClientForm initial={modal?._id ? modal : null} onSave={save} onCancel={() => setModal(null)} />
      </Modal>
    </div>
  );
}
