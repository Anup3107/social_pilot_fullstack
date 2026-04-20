import { useState, useEffect } from 'react';
import api from '../utils/api';
import { C } from '../utils/colors';
import { GlowCard, Badge, Btn, Modal, Input, Select, Spinner, EmptyState } from '../components/UI';

const STATUSES   = ['Todo','In Progress','Done'];
const PRIORITIES = ['Low','Medium','High'];
const PLATFORMS  = ['Instagram','TikTok','Facebook','LinkedIn','Twitter','YouTube','Pinterest','General'];

function TaskForm({ clients, initial, onSave, onCancel }) {
  // Normalize initial data: populated client → string ID, ISO date → YYYY-MM-DD
  const normalize = (data) => {
    if (!data) return null;
    return {
      ...data,
      client:  data.client?._id  || data.client  || '',
      dueDate: data.dueDate
        ? new Date(data.dueDate).toISOString().split('T')[0]
        : '',
    };
  };

  const [form, setForm] = useState(
    normalize(initial) || {
      title: '', client: clients[0]?._id || '', platform: 'Instagram',
      status: 'Todo', priority: 'Medium', dueDate: '', description: '',
    }
  );
  const [saving, setSaving] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.title || !form.client) return alert('Title and client are required');
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
      <Input label="Task Title *" value={form.title} onChange={set('title')} placeholder="Create weekly Instagram content grid" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Select label="Client *" value={form.client} onChange={set('client')} options={clients.map(c => ({ value: c._id, label: c.name }))} />
        <Select label="Platform" value={form.platform} onChange={set('platform')} options={PLATFORMS} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Select label="Status" value={form.status} onChange={set('status')} options={STATUSES} />
        <Select label="Priority" value={form.priority} onChange={set('priority')} options={PRIORITIES} />
        <Input label="Due Date" value={form.dueDate} onChange={set('dueDate')} type="date" />
      </div>
      <div>
        <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>DESCRIPTION</label>
        <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Optional notes..." style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Btn onClick={onCancel} variant="ghost">Cancel</Btn>
        <Btn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Task'}</Btn>
      </div>
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [tr, cr] = await Promise.all([api.get('/tasks'), api.get('/clients')]);
      setTasks(tr.data.data);
      setClients(cr.data.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (data) => {
    try {
      if (modal?._id) await api.put(`/tasks/${modal._id}`, data);
      else await api.post('/tasks', data);
      setModal(null);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save task');
    }
  };

  const quickStatus = async (task) => {
    const next = { 'Todo': 'In Progress', 'In Progress': 'Done', 'Done': 'Todo' }[task.status];
    try {
      await api.put(`/tasks/${task._id}`, { status: next });
      // Optimistic local update to avoid full reload flicker
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: next } : t));
    } catch (e) {
      console.error('Status update failed:', e);
      load(); // Re-sync on error
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete task');
    }
  };

  const filtered = tasks.filter(t => filter === 'All' || t.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tasks</h1>
          <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Track what needs to be done across all clients.</p>
        </div>
        <Btn onClick={() => setModal('new')} disabled={clients.length === 0}>+ Add Task</Btn>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {['All','Todo','In Progress','Done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? C.accent : C.card, color: filter === f ? '#fff' : C.muted, border: `1px solid ${filter === f ? C.accent : C.border}`, borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            {f} {f !== 'All' && <span style={{ opacity: 0.7 }}>({tasks.filter(t => t.status === f).length})</span>}
          </button>
        ))}
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}><Spinner size={36} /></div>
       : filtered.length === 0 ? <EmptyState icon="✓" text="No tasks" subtext="Add your first task above" />
       : (
        <GlowCard hover={false} style={{ overflow: 'hidden' }}>
          {filtered.map((t, i) => (
            <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = C.surface}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <button onClick={() => quickStatus(t)} style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${t.status === 'Done' ? C.teal : t.status === 'In Progress' ? C.accent : C.dim}`, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.status === 'Done' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.teal }} />}
                {t.status === 'In Progress' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent }} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.status === 'Done' ? C.dim : C.text, textDecoration: t.status === 'Done' ? 'line-through' : 'none' }}>{t.title}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {t.client?.name} · {t.platform}{t.dueDate && ` · Due ${new Date(t.dueDate).toLocaleDateString()}`}
                </div>
              </div>
              <Badge status={t.status} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setModal(t)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14 }}>✏</button>
                <button onClick={() => del(t._id)} style={{ background: 'none', border: 'none', color: C.dim, cursor: 'pointer', fontSize: 14 }}>✕</button>
              </div>
            </div>
          ))}
        </GlowCard>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?._id ? 'Edit Task' : 'Add New Task'}>
        {clients.length === 0
          ? <div style={{ color: C.muted, textAlign: 'center', padding: 20 }}>Add a client first before creating tasks.</div>
          : <TaskForm clients={clients} initial={modal?._id ? modal : null} onSave={save} onCancel={() => setModal(null)} />
        }
      </Modal>
    </div>
  );
}
