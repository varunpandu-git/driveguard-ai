import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, User, BrainCircuit, Palette, Link2, GitFork, Mail, type LucideIcon } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { supabase, type TeamMember } from '@/lib/supabase';
import Loader from '@/components/Loader';

const roleIcon: Record<string, LucideIcon> = {
  'Project Guide': GraduationCap,
  'Student': User,
  'AI Developer': BrainCircuit,
  'UI Designer': Palette,
};
const roleColor: Record<string, string> = {
  'Project Guide': 'from-brand-500 to-cyan-glow',
  'Student': 'from-cyan-glow to-violet-glow',
  'AI Developer': 'from-violet-glow to-brand-500',
  'UI Designer': 'from-brand-400 to-cyan-glow',
};

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) setError(error.message);
      else setMembers(data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader label="Loading team" />;
  if (error || members.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold">Team</h1>
          <p className="mt-4 text-[var(--text-muted)]">{error ? `Unable to load: ${error}` : 'No team members yet.'}</p>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-cyan-glow">The people</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Team</h1>
        <p className="mt-4 text-[var(--text-muted)]">The minds behind the Edge-AI driver distraction detection system.</p>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m, i) => {
          const Icon = roleIcon[m.role] ?? User;
          const color = roleColor[m.role] ?? 'from-brand-500 to-cyan-glow';
          return (
            <Reveal key={m.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative h-full overflow-hidden rounded-2xl glass p-6 text-center"
              >
                <div className="relative mx-auto mb-4 h-24 w-24">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} opacity-80 blur-md transition-opacity group-hover:opacity-100`} />
                  <div className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${color}`}>
                    <span className="font-display text-2xl font-bold text-white">{initials(m.name)}</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full glass">
                    <Icon className="h-4 w-4 text-cyan-glow" />
                  </span>
                </div>
                <h3 className="font-display text-base font-bold">{m.name}</h3>
                <p className="text-sm font-medium text-cyan-glow">{m.role}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{m.bio}</p>

                <div className="mt-4 flex justify-center gap-2">
                  {[Link2, GitFork, Mail].map((Icon, j) => (
                    <a
                      key={j}
                      href="#"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-brand-500/20 hover:text-cyan-glow"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
