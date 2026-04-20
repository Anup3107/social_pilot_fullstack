import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import Deliverables from './pages/Deliverables';
import Scheduler from './pages/Scheduler';
import Analytics from './pages/Analytics';
import CaptionWriter from './pages/CaptionWriter';
import Hashtags from './pages/Hashtags';
import ContentIdeas from './pages/ContentIdeas';
import AIInsights from './pages/AIInsights';
import { C } from './utils/colors';
import { Spinner } from './components/UI';

const PAGES = {
  dashboard:    Dashboard,
  clients:      Clients,
  tasks:        Tasks,
  deliverables: Deliverables,
  scheduler:    Scheduler,
  analytics:    Analytics,
  captions:     CaptionWriter,
  hashtags:     Hashtags,
  ideas:        ContentIdeas,
  insights:     AIInsights,
};

function AppShell() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #6c63ff, #a89dff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 auto 20px' }}>S</div>
        <Spinner size={28} />
      </div>
    </div>
  );

  if (!user) return <AuthPage />;

  const PageComp = PAGES[page] || Dashboard;

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
      <Sidebar page={page} setPage={setPage} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>
        <PageComp setPage={setPage} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
