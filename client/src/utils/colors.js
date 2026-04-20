export const C = {
  bg:          '#0a0a0f',
  surface:     '#12121a',
  card:        '#1a1a26',
  border:      '#2a2a3d',
  accent:      '#6c63ff',
  accentGlow:  '#6c63ff33',
  accentLight: '#a89dff',
  pink:        '#ff6b9d',
  teal:        '#00d4aa',
  amber:       '#ffa94d',
  red:         '#ff5c5c',
  text:        '#f0eeff',
  muted:       '#8b85a8',
  dim:         '#4a4568',
};

export const statusStyle = (s) => ({
  Active:      { bg: '#00d4aa18', color: '#00d4aa', border: '#00d4aa44' },
  Lead:        { bg: '#ffa94d18', color: '#ffa94d', border: '#ffa94d44' },
  Paused:      { bg: '#4a456830', color: '#8b85a8', border: '#4a4568' },
  Inactive:    { bg: '#4a456830', color: '#8b85a8', border: '#4a4568' },
  Todo:        { bg: '#2a2a3d',   color: '#8b85a8', border: '#3a3a55' },
  'In Progress':{ bg: '#6c63ff18', color: '#a89dff', border: '#6c63ff44' },
  Done:        { bg: '#00d4aa18', color: '#00d4aa', border: '#00d4aa44' },
  Scheduled:   { bg: '#6c63ff18', color: '#a89dff', border: '#6c63ff44' },
  Published:   { bg: '#00d4aa18', color: '#00d4aa', border: '#00d4aa44' },
  Draft:       { bg: '#2a2a3d',   color: '#8b85a8', border: '#3a3a55' },
  'Not Started':{ bg: '#2a2a3d',  color: '#8b85a8', border: '#3a3a55' },
  Review:      { bg: '#ffa94d18', color: '#ffa94d', border: '#ffa94d44' },
  Completed:   { bg: '#00d4aa18', color: '#00d4aa', border: '#00d4aa44' },
}[s] || { bg: '#2a2a3d', color: '#8b85a8', border: '#3a3a55' });

export const clientColors = [
  '#6c63ff','#00d4aa','#ff6b9d','#ffa94d','#4ecdc4','#a89dff','#ff8c69','#5ee7df',
];

export const initials = (name) =>
  name?.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase() || '??';
