import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleBackground from '@/components/ParticleBackground';
import { Activity } from 'lucide-react';
import type { ReactNode } from 'react';

export default function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center px-6 py-12">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <ParticleBackground density={20} />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="gradient-border relative overflow-hidden rounded-3xl glass p-8 glow-blue">
          <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-glow">
              <Activity className="h-5.5 w-5.5 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-bold">Edge<span className="gradient-text">AI</span></span>
          </Link>
          <h1 className="text-center font-display text-2xl font-bold">{title}</h1>
          <p className="mt-1.5 text-center text-sm text-[var(--text-muted)]">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
