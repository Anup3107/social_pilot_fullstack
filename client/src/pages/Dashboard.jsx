import { useState, useEffect } from 'react';
import api from '../utils/api';
import { C } from '../utils/colors';
import { GlowCard, ProgressBar, Avatar, Badge, Spinner } from '../components/UI';

export default function Dashboard({ setPage }) {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, tasksRes, delRes, clientsRes] = await Promise.all([
          api.get('/clients/stats'),
          api.get('/tasks', { params: { status: ['Todo', 'In Progress'] },
            paramsSerializer: (params) => {
              return params.status.map(s => `status=${encodeURIComponent(s)}`).join('&');
            }
          }),
          api.get('/deliverables'),
          api.get('/clients'),
        ]);
        setStats(statsRes.data.data);
        setTasks(tasksRes.data.data.slice(0, 4));
        setDeliverables(delRes.data.data.slice(0, 3));
        setClients(clientsRes.data.data.filter(c => c.status === 'Active').slice(0, 4));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <Spinner size={40} />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Command Center</h1>
        <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Overview of your clients and upcoming work.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Clients', value: stats?.totalClients ?? 0, sub: `${stats?.activeClients ?? 0} active, ${stats?.leadClients ?? 0} leads`, icon: '◈' },
          { label: 'Monthly Retainer', value: `$${(stats?.totalRetainer ?? 0).toLocaleString()}`, sub: 'across all clients', icon: '◎', accent: C.teal },
          { label: 'Open Tasks', value: tasks.length, sub: 'need attention', icon: '✓', accent: C.amber },
          { label: 'Deliverables', value: deliverables.length, sub: 'in progress', icon: '◉', accent: C.pink },
        ].map((s, i) => (
          <GlowCard key={i} style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: s.accent || C.accentLight, letterSpacing: -1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{s.sub}</div>
              </div>
              <div style={{ fontSize: 22, color: s.accent || C.accent, opacity: 0.6 }}>{s.icon}</div>
            </div>
          </GlowCard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Priority Tasks */}
        <GlowCard style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Priority Tasks</span>
            <button onClick={() => setPage('tasks')} style={{ background: 'none', border: 'none', color: C.accentLight, cursor: 'pointer', fontSize: 13 }}>View all →</button>
          </div>
          {tasks.length === 0 && <div style={{ color: C.dim, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No open tasks</div>}
          {tasks.map(t => (
            <div key={t._id} style={{ padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, flex: 1, marginRight: 8 }}>{t.title}</span>
                <Badge status={t.status} />
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>{t.client?.name} · {t.platform}</div>
            </div>
          ))}
        </GlowCard>

        {/* Upcoming Deliverables */}
        <GlowCard style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Upcoming Deliverables</span>
            <button onClick={() => setPage('deliverables')} style={{ background: 'none', border: 'none', color: C.accentLight, cursor: 'pointer', fontSize: 13 }}>View all →</button>
          </div>
          {deliverables.length === 0 && <div style={{ color: C.dim, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No deliverables</div>}
          {deliverables.map(d => (
            <div key={d._id} style={{ padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{d.title}</span>
                <span style={{ fontSize: 13, color: C.accentLight, fontWeight: 700 }}>{d.progress}%</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{d.client?.name}</div>
              <ProgressBar value={d.progress} color={d.progress >= 80 ? C.teal : d.progress >= 50 ? C.accent : C.pink} />
            </div>
          ))}
        </GlowCard>

        {/* Top Clients */}
        <GlowCard style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Active Clients</span>
            <button onClick={() => setPage('clients')} style={{ background: 'none', border: 'none', color: C.accentLight, cursor: 'pointer', fontSize: 13 }}>View all →</button>
          </div>
          {clients.length === 0 && <div style={{ color: C.dim, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No clients yet</div>}
          {clients.map(c => (
            <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <Avatar name={c.name} color={c.color} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{c.industry}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.teal }}>${c.retainer.toLocaleString()}</div>
            </div>
          ))}
        </GlowCard>
      </div>
    </div>
  );
}
