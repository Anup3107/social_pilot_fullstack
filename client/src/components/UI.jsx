import { useState } from 'react';
import { C, statusStyle, initials } from '../utils/colors';

export const Badge = ({ status }) => {
  const s = statusStyle(status);
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 600, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
};

export const Avatar = ({ name, color, size = 44 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: (color || C.accent) + '22', border: `1.5px solid ${(color || C.accent)}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.3, fontWeight: 700, color: color || C.accent, flexShrink: 0, letterSpacing: -0.5 }}>
    {initials(name)}
  </div>
);

export const GlowCard = ({ children, style = {}, hover = true, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: C.card, border: `1px solid ${hovered ? C.accent + '55' : C.border}`, borderRadius: 16, transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: hovered ? `0 0 24px ${C.accentGlow}` : 'none', cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {children}
    </div>
  );
};

export const ProgressBar = ({ value, color = C.accent }) => (
  <div style={{ background: C.border, borderRadius: 99, height: 6, overflow: 'hidden' }}>
    <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color, height: '100%', borderRadius: 99, transition: 'width 0.6s ease' }} />
  </div>
);

export const Btn = ({ children, onClick, variant = 'primary', disabled, style = {}, size = 'md' }) => {
  const pad = size === 'sm' ? '5px 12px' : size === 'lg' ? '14px 28px' : '8px 18px';
  const fs  = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
  const variants = {
    primary:  { background: disabled ? C.dim : 'linear-gradient(135deg, #6c63ff, #a89dff)', color: '#fff', border: 'none' },
    ghost:    { background: 'transparent', color: C.muted, border: `1px solid ${C.border}` },
    danger:   { background: disabled ? C.dim : '#ff5c5c22', color: C.red, border: `1px solid ${C.red}44` },
    success:  { background: '#00d4aa22', color: C.teal, border: `1px solid ${C.teal}44` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...variants[variant], padding: pad, fontSize: fs, fontWeight: 700, borderRadius: 10, cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s', opacity: disabled ? 0.6 : 1, whiteSpace: 'nowrap', ...style }}>
      {children}
    </button>
  );
};

export const Input = ({ label, value, onChange, placeholder, type = 'text', style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {label && <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', width: '100%', ...style }}
    />
  </div>
);

export const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {label && <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</label>}
    <select value={value} onChange={onChange}
      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', ...style }}
    >
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f0eeff, #a89dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title}</h1>
      {subtitle && <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 15 }}>{subtitle}</p>}
    </div>
    {action && <Btn onClick={action.onClick} size="md">{action.label}</Btn>}
  </div>
);

export const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000088', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, width, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const Spinner = ({ size = 24 }) => (
  <div style={{ width: size, height: size, border: `2px solid ${C.border}`, borderTopColor: C.accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const EmptyState = ({ icon, text, subtext }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted }}>
    <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{text}</div>
    {subtext && <div style={{ fontSize: 13 }}>{subtext}</div>}
  </div>
);
