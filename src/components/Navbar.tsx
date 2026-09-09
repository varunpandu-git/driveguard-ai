import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, Activity } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Live Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/reports', label: 'Reports' },
  { to: '/technology', label: 'AI Tech' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-3 flex max-w-7xl items-center justify-between gap-4 rounded-2xl glass px-4 py-3 md:px-6"
      >
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-glow glow-blue">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Edge<span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-cyan-glow' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-brand-500/10 ring-1 ring-brand-400/30"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] sm:block"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="btn-glow hidden rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow px-4 py-2 text-sm font-semibold text-white sm:block"
          >
            Get Started
          </Link>
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl glass lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl glass px-4 py-2 lg:hidden"
          >
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'text-cyan-glow bg-brand-500/10' : 'text-[var(--text-muted)]'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="my-2 h-px bg-[var(--border)]" />
            <Link to="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-[var(--text-muted)]">Sign in</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-cyan-glow">Get Started</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
