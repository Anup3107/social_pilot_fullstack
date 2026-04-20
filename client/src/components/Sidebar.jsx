import { useAuth } from '../context/AuthContext';
import { C, initials } from '../utils/colors';

const NAV = [
  { id: 'dashboard',    icon: '⊞', label: 'Dashboard'        },
  { id: 'clients',      icon: '◈', label: 'Clients'           },
  { id: 'tasks',        icon: '✓', label: 'Tasks'             },
  { id: 'deliverables', icon: '◉', label: 'Deliverables'      },
  { id: 'scheduler',    icon: '▦', label: 'Scheduler'         },
  { id: 'analytics',    icon: '◎', label: 'Analytics'         },
  null, // divider
  { id: 'captions',     icon: '✦', label: 'Caption Writer'    },
  { id: 'hashtags',     icon: '#', label: 'Hashtags'          },
  { id: 'ideas',        icon: '◎', label: 'Content Ideas'     },
  { id: 'insights',     icon: '⬡', label: 'AI Insights'       },
];

export default function Sidebar({ page, setPage }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh' }}>

      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #6c63ff, #a89dff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: '#fff', flexShrink: 0 }}>S</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.3, lineHeight: 1.2 }}>SocialPilot</div>
            <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, letterSpacing: 1.5 }}>AI</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
        {NAV.map((item, i) => {
          if (!item) return (
            <div key={`div-${i}`} style={{ height: 1, background: C.border, margin: '8px 6px' }} />
          );
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: active ? C.accent + '20' : 'transparent',
              color: active ? C.accentLight : C.muted,
              fontWeight: active ? 700 : 500, fontSize: 14, marginBottom: 1,
              textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.12s',
            }}>
              <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {active && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: C.accent }} />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '14px 14px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #ff6b9d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initials(user?.name || 'U')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={logout} style={{ width: '100%', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '6px', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
