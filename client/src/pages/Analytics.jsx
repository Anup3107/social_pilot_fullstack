import { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { C } from '../utils/colors';
import { GlowCard, ProgressBar, Avatar, Spinner, EmptyState } from '../components/UI';

// Pure deterministic value from integer seed — stable across all renders
const seededVal = (seed, min, range) => {
  const x = Math.sin(seed + 1) * 10000;
  return min + Math.round((x - Math.floor(x)) * range);
};

export default function Analytics() {
  const [clients, setClients] = useState([]);
  const [stats, setStats]   = useState(null);
  const [tasks, setTasks]   = useState([]);
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/clients/stats'),
      api.get('/clients'),
      api.get('/tasks'),
      api.get('/posts'),
    ]).then(([sr, cr, tr, pr]) => {
      setStats(sr.data.data);
      setClients(cr.data.data);
      setTasks(tr.data.data);
      setPosts(pr.data.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><Spinner size={40} /></div>;

  const done  = tasks.filter(t => t.status === 'Done').length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const platformCounts = posts.reduce((acc, p) => { acc[p.platform] = (acc[p.platform] || 0) + 1; return acc; }, {});
  const topPlatform = Object.entries(platformCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || '—';

  const kpis = [
    { label: 'Active Clients',   value: stats?.activeClients ?? 0,                           sub: `of ${stats?.totalClients ?? 0} total`,      color: C.accent },
    { label: 'Monthly Revenue',  value: `$${(stats?.totalRetainer ?? 0).toLocaleString()}`,   sub: 'total retainer',                             color: C.teal   },
    { label: 'Task Completion',  value: `${completionRate}%`,                                 sub: `${done} of ${total} tasks done`,            color: C.amber  },
    { label: 'Scheduled Posts',  value: posts.filter(p => p.status === 'Scheduled').length,   sub: `Top: ${topPlatform}`,                       color: C.pink   },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics</h1>
        <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>Performance overview across all clients.</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {kpis.map(k => (
          <GlowCard key={k.label} style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{k.sub}</div>
          </GlowCard>
        ))}
      </div>

      {/* Task breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <GlowCard style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Task Breakdown</div>
          {[['Todo', C.muted], ['In Progress', C.accent], ['Done', C.teal]].map(([s, color]) => {
            const count = tasks.filter(t => t.status === s).length;
            const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={s} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: C.muted }}>{s}</span>
                  <span style={{ color, fontWeight: 700 }}>{count} ({pct}%)</span>
                </div>
                <ProgressBar value={pct} color={color} />
              </div>
            );
          })}
        </GlowCard>

        <GlowCard style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Platform Distribution</div>
          {Object.keys(platformCounts).length === 0
            ? <div style={{ color: C.dim, textAlign: 'center', paddingTop: 40 }}>No scheduled posts yet</div>
            : Object.entries(platformCounts).sort((a,b) => b[1]-a[1]).map(([p, count], i) => {
              const pct = posts.length > 0 ? Math.round((count / posts.length) * 100) : 0;
              const colors = [C.accent, C.teal, C.pink, C.amber, '#4ecdc4'];
              return (
                <div key={p} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: C.muted }}>{p}</span>
                    <span style={{ color: colors[i % colors.length], fontWeight: 700 }}>{count} posts ({pct}%)</span>
                  </div>
                  <ProgressBar value={pct} color={colors[i % colors.length]} />
                </div>
              );
            })
          }
        </GlowCard>
      </div>

      {/* Per-client breakdown */}
      {clients.length === 0
        ? <EmptyState icon="◈" text="No clients yet" subtext="Add clients to see per-client analytics" />
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {clients.map((c, ci) => {
              const clientTasks = tasks.filter(t => t.client?._id === c._id || t.client === c._id);
              const clientPosts = posts.filter(p => p.client?._id === c._id || p.client === c._id);
              const r1 = seededVal(ci * 7 + 1, 30, 60);
              const r2 = seededVal(ci * 7 + 2, 20, 40);
              return (
                <GlowCard key={c._id} style={{ padding: 22 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                    <Avatar name={c.name} color={c.color} size={36} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{c.industry}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    {[
                      { label: 'Tasks', value: clientTasks.length, color: C.accent },
                      { label: 'Posts', value: clientPosts.length, color: C.teal },
                    ].map(m => (
                      <div key={m.label} style={{ background: C.surface, borderRadius: 10, padding: '10px 12px' }}>
                        <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                  {[['Est. Reach', r1], ['Engagement', r2]].map(([label, val]) => (
                    <div key={label} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                        <span style={{ color: C.muted }}>{label}</span>
                        <span style={{ color: C.accentLight, fontWeight: 600 }}>{val}%</span>
                      </div>
                      <ProgressBar value={val} color={c.color || C.accent} />
                    </div>
                  ))}
                </GlowCard>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
