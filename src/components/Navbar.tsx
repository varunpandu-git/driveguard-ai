import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, CarFront, Settings, Circle } from 'lucide-react';
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-xl">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="flex min-h-[76px] w-full items-center justify-between gap-5 px-5 sm:px-8 lg:px-10"
      >
        <Link to="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/20">
            <CarFront className="h-7 w-7" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col">
            <span className="font-display text-xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
              DriveGuard <span className="text-blue-600">AI</span>
            </span>
            <span className="mt-1 hidden text-xs font-medium tracking-wide text-slate-500 sm:block">
              Safer Drivers <span className="mx-1 text-blue-500">•</span> Safer Roads
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 sm:flex">
            <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">System Online</span>
          </div>
          <Link to="/technology" aria-label="Settings and AI technology" title="Settings" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
            <Settings className="h-5 w-5" />
          </Link>
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
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
            className="overflow-hidden border-t border-slate-100 bg-white px-5 py-3 shadow-lg lg:hidden"
          >
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-3 text-sm font-semibold ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-700 sm:hidden">
              <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" /> System Online
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
