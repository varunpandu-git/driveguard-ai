import { motion } from 'framer-motion';
import { FileText, Download, History, TrendingUp, Shield, Calendar, MapPin, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import Reveal from '@/components/Reveal';

const trips = [
  { date: '2026-08-04', route: 'Highway N4 → City Center', duration: '42 min', score: 92, status: 'safe', alerts: 1 },
  { date: '2026-08-03', route: 'Office → Home', duration: '28 min', score: 68, status: 'warning', alerts: 4 },
  { date: '2026-08-02', route: 'City Center → Mall', duration: '18 min', score: 55, status: 'danger', alerts: 7 },
  { date: '2026-08-01', route: 'Home → Airport', duration: '54 min', score: 88, status: 'safe', alerts: 2 },
  { date: '2026-07-31', route: 'Suburb → University', duration: '36 min', score: 76, status: 'warning', alerts: 3 },
];

const timeline = [
  { time: '08:02', event: 'Trip started', level: 'safe' },
  { time: '08:09', event: 'Phone use detected — alert raised', level: 'danger' },
  { time: '08:14', event: 'Driver attentive', level: 'safe' },
  { time: '08:21', event: 'Yawning detected — fatigue warning', level: 'warning' },
  { time: '08:28', event: 'Hard braking event', level: 'warning' },
  { time: '08:34', event: 'Seat belt confirmed', level: 'safe' },
  { time: '08:42', event: 'Trip ended — report generated', level: 'safe' },
];

const statusStyle: Record<string, string> = {
  safe: 'text-success bg-success/15 ring-success/30',
  warning: 'text-warning bg-warning/15 ring-warning/30',
  danger: 'text-danger bg-danger/15 ring-danger/30',
};

export default function Reports() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Reveal className="mb-8">
        <h1 className="font-display text-3xl font-bold">Reports</h1>
        <p className="mt-2 text-[var(--text-muted)]">Trip history, distraction timelines, and downloadable safety reports.</p>
      </Reveal>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: History, label: 'Total Trips', value: '927' },
          { icon: AlertTriangle, label: 'Flagged Trips', value: '134' },
          { icon: Shield, label: 'Avg Safety Score', value: '84.2' },
          { icon: TrendingUp, label: 'Improvement', value: '+12%' },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className="rounded-2xl glass p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-glow">
                <s.icon className="h-5 w-5 text-white" />
              </span>
              <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trip reports */}
        <div className="lg:col-span-2">
          <Reveal>
            <div className="rounded-2xl glass p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Trip Reports</h2>
                <button className="btn-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow px-4 py-2 text-sm font-semibold text-white">
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>
              <div className="space-y-3">
                {trips.map((t, i) => (
                  <motion.div
                    key={t.date}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    className="flex flex-wrap items-center gap-4 rounded-xl bg-[var(--bg-elev)]/40 p-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-glow">
                      <FileText className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold">{t.route}</p>
                      <p className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.duration}</span>
                        <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {t.alerts} alerts</span>
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyle[t.status]}`}>{t.score}/100</span>
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg glass text-[var(--text-muted)] transition-colors hover:text-cyan-glow" aria-label="Download">
                      <Download className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Distraction timeline */}
        <div className="space-y-6">
          <Reveal delay={0.1}>
            <div className="rounded-2xl glass p-6">
              <h2 className="mb-5 font-display text-lg font-semibold">Distraction Timeline</h2>
              <div className="relative">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-glow via-brand-400 to-violet-glow" />
                <div className="space-y-4">
                  {timeline.map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="relative flex gap-4 pl-1"
                    >
                      <span className={`relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-[var(--bg)] ${e.level === 'safe' ? 'bg-success' : e.level === 'warning' ? 'bg-warning' : 'bg-danger'}`} />
                      <div>
                        <p className="text-xs font-medium text-[var(--text-muted)]">{e.time}</p>
                        <p className="text-sm">{e.event}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-2xl glass p-6 text-center">
              <Shield className="mx-auto h-10 w-10 text-cyan-glow" />
              <p className="mt-3 font-display text-4xl font-bold gradient-text">84.2</p>
              <p className="text-sm text-[var(--text-muted)]">Overall Safety Score</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--border)]">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-success to-cyan-glow" initial={{ width: 0 }} whileInView={{ width: '84%' }} viewport={{ once: true }} transition={{ duration: 1 }} />
              </div>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-success">
                <CheckCircle2 className="h-3.5 w-3.5" /> Safer than 78% of drivers
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
