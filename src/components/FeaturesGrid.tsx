import { motion } from 'framer-motion';
import {
  Eye, Phone, BedDouble, Wind, EyeClosed, RotateCw, Cigarette, ShieldCheck,
  Volume2, Cloud, BarChart3, LayoutDashboard, type LucideIcon,
} from 'lucide-react';
import Reveal from './Reveal';

interface Feature { icon: LucideIcon; title: string; desc: string; color: string; }

const features: Feature[] = [
  { icon: Eye, title: 'Real-Time Driver Monitoring', desc: 'Continuous 30 FPS analysis of driver behavior with sub-frame latency.', color: 'from-brand-500 to-cyan-glow' },
  { icon: Phone, title: 'Phone Detection', desc: 'YOLOv8 detects handheld phone usage the moment it appears.', color: 'from-cyan-glow to-brand-400' },
  { icon: BedDouble, title: 'Drowsiness Detection', desc: 'Eye-aspect-ratio tracking flags fatigue before micro-sleeps occur.', color: 'from-violet-glow to-brand-500' },
  { icon: Wind, title: 'Yawning Detection', desc: 'Mouth-landmark analysis catches repeated yawning patterns.', color: 'from-brand-400 to-violet-glow' },
  { icon: EyeClosed, title: 'Eye Blink Detection', desc: 'Per-frame blink rate and PERCLOS scoring for alertness.', color: 'from-cyan-glow to-violet-glow' },
  { icon: RotateCw, title: 'Head Pose Estimation', desc: '3D head direction flags dangerous look-away angles.', color: 'from-brand-500 to-violet-glow' },
  { icon: Cigarette, title: 'Smoking Detection', desc: 'Object + pose model identifies smoking while driving.', color: 'from-violet-glow to-cyan-glow' },
  { icon: ShieldCheck, title: 'Seat Belt Detection', desc: 'Vision check confirms the seat belt is fastened.', color: 'from-brand-400 to-cyan-glow' },
  { icon: Volume2, title: 'Voice Alerts', desc: 'Spoken warnings triggered instantly on distraction events.', color: 'from-cyan-glow to-brand-500' },
  { icon: Cloud, title: 'Cloud Reports', desc: 'Every trip synced to the cloud for long-term analysis.', color: 'from-brand-500 to-brand-400' },
  { icon: BarChart3, title: 'Driver Analytics', desc: 'Trends, heatmaps, and risk scoring across all trips.', color: 'from-violet-glow to-brand-400' },
  { icon: LayoutDashboard, title: 'AI Dashboard', desc: 'Unified command center for live and historical data.', color: 'from-brand-400 to-violet-glow' },
];

export default function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-cyan-glow">Capabilities</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">Everything the system watches, in real time</h2>
        <p className="mt-4 text-[var(--text-muted)]">Twelve detection modules running together on the edge, each tuned for accuracy and speed.</p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 4) * 0.08}>
            <motion.div
              whileHover={{ y: -6 }}
              className="group relative h-full overflow-hidden rounded-2xl glass p-6 transition-shadow hover:shadow-[0_0_40px_-10px_rgba(34,225,255,0.35)]"
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${f.color} p-3`}>
                <motion.span
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.5, delay: i * 0.1, repeat: Infinity }}
                >
                  <f.icon className="h-6 w-6 text-white" strokeWidth={2} />
                </motion.span>
              </div>
              <h3 className="font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{f.desc}</p>
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" style={{ background: `linear-gradient(135deg, #4a98ff, #22e1ff)` }} />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
