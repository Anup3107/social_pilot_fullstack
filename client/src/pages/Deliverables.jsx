import { useState, useEffect } from 'react';
import api from '../utils/api';
import { C } from '../utils/colors';
import { GlowCard, ProgressBar, Badge, Btn, Modal, Input, Select, Spinner, EmptyState } from '../components/UI';

const TYPES = ['content calendar','report','audit','strategy','design','video','other'];

function DelForm({ clients, initial, onSave, onCancel }) {
  // Normalize: populated client → string ID, ISO date → YYYY-MM-DD
  const normalize = (data) => {
    if (!data) return null;
    return {
      ...data,
      client:   data.client?._id || data.client || '',
      deadline: data.deadline
        ? new Date(data.deadline).toISOString().split('T')[0]
        : '',
    };
  };

  const [form, setForm] = useState(
    normalize(initial) || {
      title: '', client: clients[0]?._id || '', type: 'content calendar',
      progress: 0, deadline: '', status: 'Not Started', notes: '',
    }
  );
  const [saving, setSaving] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.title || !form.client || !form.deadline) return alert('Title, client and deadline are required');
    setSaving(true);
    try {
      await onSave({ ...form, progress: Number(form.progress) });
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="Deliverable Title *" value={form.title} onChange={set('title')} placeholder="April Content Calendar" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Select label="Client *" value={form.client} onChange={set('client')} options={clients.map(c => ({ value: c._id, label: c.name }))} />
        <Select label="Type" value={form.type} onChange={set('type')} options={TYPES} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Input label="Progress (%)" value={form.progress} onChange={set('progress')} type="number" />
        <Input label="Deadline *" value={form.deadline} onChange={set('deadline')} type="date" />
        <Select label="Status" value={form.status} onChange={set('status')} options={['Not Started','In Progress','Review','Completed']} />
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Btn onClick={onCancel} variant="ghost">Cancel</Btn>
        <Btn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Btn>
      </div>
    </div>
  );
}

export default function Deliverables() {
  const [deliverables, setDeliverables] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [dr, cr] = await Promise.all([api.get('/deliverables'), api.get('/clients')]);
      setDeliverables(dr.data.data);
      setClients(cr.data.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (data) => {
    try {
      if (modal?._id) await api.put(`/deliverables/${modal._id}`, data);
      else await api.post('/deliverables', data);
      setModal(null);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save deliverable');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this deliverable?')) return;
    try {
      await api.delete(`/deliverables/${id}`);
      setDeliverables(prev => prev.filter(d => d._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete deliverable');
    }
  };

  const updateProgress = async (d, delta) => {
    const np = Math.min(100, Math.max(0, d.progress + delta));
    try {
      await api.put(`/deliverables/${d._id}`, { progress: np });
      // Optimistic update
      setDeliverables(prev => prev.map(x => x._id === d._id ? { ...x, progress: np } : x));
    } catch (e) {
      console.error('Progress update failed:', e);
      load();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Deliverables</h1>
          <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Track high-level project progress and deadlines.</p>
        </div>
        <Btn onClick={() => setModal('new')} disabled={clients.length === 0}>+ Add Deliverable</Btn>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}><Spinner size={36} /></div>
       : deliverables.length === 0 ? <EmptyState icon="◉" text="No deliverables yet" subtext="Add a client first, then track your deliverables" />
       : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {deliverables.map(d => {
            const pc = d.progress >= 80 ? C.teal : d.progress >= 50 ? C.accent : C.pink;
            return (
              <GlowCard key={d._id} style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{d.title}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{d.client?.name} · {d.type}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <button onClick={() => setModal(d)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14 }}>✏</button>
                    <button onClick={() => del(d._id)} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontSize: 14 }}>✕</button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => updateProgress(d, -10)} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, width: 24, height: 24, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                    <span style={{ fontSize: 13, color: C.muted }}>Progress</span>
                    <button onClick={() => updateProgress(d, 10)} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, width: 24, height: 24, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <span style={{ fontWeight: 700, color: pc }}>{d.progress}%</span>
                </div>
                <ProgressBar value={d.progress} color={pc} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
                  <Badge status={d.status} />
                  <span style={{ fontSize: 12, color: C.muted }}>Due {new Date(d.deadline).toLocaleDateString()}</span>
                </div>
              </GlowCard>
            );
          })}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?._id ? 'Edit Deliverable' : 'Add Deliverable'}>
        {clients.length === 0
          ? <div style={{ color: C.muted, textAlign: 'center', padding: 20 }}>Add a client first.</div>
          : <DelForm clients={clients} initial={modal?._id ? modal : null} onSave={save} onCancel={() => setModal(null)} />
        }
      </Modal>
    </div>
  );
}
