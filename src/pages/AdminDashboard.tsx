import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCircle, FileText, BarChart3, Settings, LogOut,
  Activity, Menu, X, Car, AlertTriangle, ShieldCheck, AlertOctagon, Target, Camera, Search, Bell,
} from 'lucide-react';
import CameraScan from '@/components/CameraScan';
import { useAuth } from '@/context/AuthContext';
import { supabase, type ContactMessage } from '@/lib/supabase';

const nav = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Car, label: 'Drivers', id: 'drivers' },
  { icon: Users, label: 'Users', id: 'users' },
  { icon: FileText, label: 'Reports', id: 'reports' },
  { icon: BarChart3, label: 'Analytics', id: 'analytics' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

const cards = [
  { icon: Car, label: 'Total Drivers', value: '1,248', color: 'from-brand-500 to-cyan-glow', trend: '+5.2%' },
  { icon: AlertTriangle, label: "Today's Alerts", value: '342', color: 'from-warning to-danger', trend: '+12' },
  { icon: ShieldCheck, label: 'Safe Trips', value: '1,089', color: 'from-success to-cyan-glow', trend: '+38' },
  { icon: AlertOctagon, label: 'Danger Trips', value: '67', color: 'from-danger to-violet-glow', trend: '-9' },
  { icon: Target, label: 'Accuracy', value: '98.7%', color: 'from-cyan-glow to-violet-glow', trend: '+0.3%' },
  { icon: Activity, label: 'Active Now', value: '24', color: 'from-brand-400 to-cyan-glow', trend: 'live' },
];

const drivers = [
  { name: 'Rahul Verma', id: 'DRV-014', status: 'safe', score: 92, trips: 128 },
  { name: 'Priya Nair', id: 'DRV-027', status: 'warning', score: 71, trips: 84 },
  { name: 'Arjun Mehta', id: 'DRV-031', status: 'danger', score: 48, trips: 56 },
  { name: 'Sneha Rao', id: 'DRV-042', status: 'safe', score: 88, trips: 203 },
  { name: 'Vikram Singh', id: 'DRV-058', status: 'warning', score: 64, trips: 39 },
];

const statusStyle: Record<string, string> = {
  safe: 'text-success bg-success/15 ring-success/30',
  warning: 'text-warning bg-warning/15 ring-warning/30',
  danger: 'text-danger bg-danger/15 ring-danger/30',
};

export default function AdminDashboard() {
  const [section, setSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      setMessages(data ?? []);
    })();
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:flex lg:gap-6 lg:px-6">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform rounded-r-3xl bg-[var(--bg-elev)] p-4 transition-transform lg:static lg:translate-x-0 lg:rounded-3xl lg:bg-transparent lg:p-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <span className="font-display text-lg font-bold">Edge<span className="gradient-text">AI</span></span>
          <button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        <div className="mb-6 hidden items-center gap-2.5 lg:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-glow">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold">Edge<span className="gradient-text">AI</span></span>
        </div>

        <nav className="space-y-1">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => { setSection(n.id); setSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${section === n.id ? 'bg-gradient-to-r from-brand-500/20 to-cyan-glow/10 text-cyan-glow ring-1 ring-brand-400/30' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
            >
              <n.icon className="h-4.5 w-4.5" /> {n.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="mt-6 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
        >
          <LogOut className="h-4.5 w-4.5" /> Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:pl-2">
        {/* Topbar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl glass lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold capitalize">{section}</h1>
              <p className="text-sm text-[var(--text-muted)]">Admin control center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input placeholder="Search…" className="w-44 rounded-xl border border-[var(--border)] bg-transparent py-2.5 pl-9 pr-3 text-sm outline-none focus:border-cyan-glow" />
            </div>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl glass">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-glow font-display text-sm font-bold text-white">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'A'}
            </span>
          </div>
        </div>

        {section === 'dashboard' && (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {cards.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl glass p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color}`}>
                      <c.icon className="h-5 w-5 text-white" />
                    </span>
                    <span className="text-xs font-medium text-[var(--text-muted)]">{c.trend}</span>
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold">{c.value}</p>
                  <p className="text-xs text-[var(--text-muted)]">{c.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Live camera + recent alerts */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-3 flex items-center gap-2">
                  <Camera className="h-4.5 w-4.5 text-cyan-glow" />
                  <h2 className="font-display text-lg font-semibold">Live Camera</h2>
                </div>
                <CameraScan />
              </div>
              <div className="rounded-2xl glass p-6">
                <h2 className="mb-4 font-display text-lg font-semibold">Recent Alerts</h2>
                <div className="space-y-3">
                  {[
                    { e: 'Phone use · DRV-014', level: 'danger', t: '2m' },
                    { e: 'Drowsy · DRV-031', level: 'warning', t: '6m' },
                    { e: 'No belt · DRV-058', level: 'danger', t: '11m' },
                    { e: 'Attentive · DRV-042', level: 'safe', t: '14m' },
                    { e: 'Yawning · DRV-027', level: 'warning', t: '22m' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-[var(--bg-elev)]/40 px-3 py-2.5">
                      <AlertTriangle className={`h-4 w-4 ${a.level === 'danger' ? 'text-danger' : a.level === 'warning' ? 'text-warning' : 'text-success'}`} />
                      <span className="flex-1 text-sm">{a.e}</span>
                      <span className="text-xs text-[var(--text-muted)]">{a.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drivers table */}
            <div className="rounded-2xl glass p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Drivers Overview</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-[var(--text-muted)]">
                      <th className="pb-3">Driver</th><th className="pb-3">ID</th><th className="pb-3">Score</th><th className="pb-3">Trips</th><th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((d) => (
                      <tr key={d.id} className="border-t border-[var(--border)]">
                        <td className="py-3 font-medium">{d.name}</td>
                        <td className="py-3 text-[var(--text-muted)]">{d.id}</td>
                        <td className="py-3 font-display font-semibold">{d.score}</td>
                        <td className="py-3 text-[var(--text-muted)]">{d.trips}</td>
                        <td className="py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${statusStyle[d.status]}`}>{d.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {section === 'reports' && (
          <div className="rounded-2xl glass p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Contact Messages</h2>
            {messages.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--text-muted)]">No messages yet.</p>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="rounded-xl bg-[var(--bg-elev)]/40 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-sm font-semibold">{m.name}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${m.handled ? 'text-success bg-success/15 ring-success/30' : 'text-warning bg-warning/15 ring-warning/30'}`}>
                        {m.handled ? 'Handled' : 'Pending'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{m.email} · {m.phone || 'no phone'}</p>
                    {m.subject && <p className="mt-1 text-sm font-medium">{m.subject}</p>}
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section !== 'dashboard' && section !== 'reports' && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl glass p-10 text-center">
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-glow">
              {nav.find((n) => n.id === section)?.icon && (() => { const Icon = nav.find((n) => n.id === section)!.icon; return <Icon className="h-8 w-8 text-white" />; })()}
            </span>
            <h2 className="font-display text-xl font-bold capitalize">{section}</h2>
            <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">This panel is part of the admin suite. Explore the live dashboard for real-time detection, or analytics for trends.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/dashboard" className="rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow px-5 py-2.5 text-sm font-semibold text-white">Live Dashboard</Link>
              <Link to="/analytics" className="rounded-xl glass px-5 py-2.5 text-sm font-semibold">Analytics</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
