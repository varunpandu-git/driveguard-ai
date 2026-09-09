import { Link } from 'react-router-dom';
import { Activity, GitFork, FileText, Shield, Mail, Lock } from 'lucide-react';

const quick = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Live Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/reports', label: 'Reports' },
];
const resources = [
  { to: '/technology', label: 'AI Technology' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
  { to: '/login', label: 'Sign in' },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--border)] bg-[var(--bg-elev)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-glow">
              <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold">Edge<span className="gradient-text">AI</span></span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
            Edge-AI driven real-time driver distraction detection using multimodal deep learning and computer vision.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-lg glass transition-colors hover:text-cyan-glow"><GitFork className="h-4.5 w-4.5" /></a>
            <a href="#" aria-label="Documentation" className="flex h-9 w-9 items-center justify-center rounded-lg glass transition-colors hover:text-cyan-glow"><FileText className="h-4.5 w-4.5" /></a>
            <a href="#" aria-label="Email" className="flex h-9 w-9 items-center justify-center rounded-lg glass transition-colors hover:text-cyan-glow"><Mail className="h-4.5 w-4.5" /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Quick Links</h4>
          <ul className="space-y-2.5">
            {quick.map((l) => (
              <li key={l.to}><Link to={l.to} className="text-sm text-[var(--text-muted)] transition-colors hover:text-cyan-glow">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Resources</h4>
          <ul className="space-y-2.5">
            {resources.map((l) => (
              <li key={l.to}><Link to={l.to} className="text-sm text-[var(--text-muted)] transition-colors hover:text-cyan-glow">{l.label}</Link></li>
            ))}
            <li><a href="#" className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-cyan-glow"><Shield className="h-3.5 w-3.5" /> Privacy Policy</a></li>
            <li><a href="#" className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-cyan-glow"><Lock className="h-3.5 w-3.5" /> Terms</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Stay Updated</h4>
          <p className="mb-3 text-sm text-[var(--text-muted)]">Get project updates and research notes.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow/40"
            />
            <button className="btn-glow shrink-0 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow px-4 py-2.5 text-sm font-semibold text-white">Join</button>
          </form>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-[var(--text-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} Edge-AI Driver Distraction Detection. Final-Year Engineering Project.</p>
          <p>Built with React, TypeScript, Tailwind CSS & Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
