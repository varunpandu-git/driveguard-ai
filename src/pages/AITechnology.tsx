import { motion } from 'framer-motion';
import {
  Boxes, BrainCircuit, Code2, Grid3x3, Zap, Atom, Smartphone, Database, type LucideIcon,
} from 'lucide-react';
import Reveal from '@/components/Reveal';

interface Tech { icon: LucideIcon; name: string; tag: string; desc: string; color: string; }

const tech: Tech[] = [
  { icon: Boxes, name: 'YOLOv8', tag: 'Object Detection', desc: 'Real-time detection of phones, cigarettes, and seat belts at 30 FPS with state-of-the-art accuracy.', color: 'from-brand-500 to-cyan-glow' },
  { icon: BrainCircuit, name: 'TensorFlow', tag: 'Deep Learning', desc: 'Training and inference backbone for the multimodal distraction classification model.', color: 'from-violet-glow to-brand-500' },
  { icon: Code2, name: 'OpenCV', tag: 'Computer Vision', desc: 'Frame capture, preprocessing, and image transformations powering the vision pipeline.', color: 'from-cyan-glow to-brand-400' },
  { icon: Grid3x3, name: 'MediaPipe', tag: 'Face Mesh', desc: '468 facial landmarks for eye, mouth, and head-pose tracking at low latency.', color: 'from-brand-400 to-violet-glow' },
  { icon: Zap, name: 'FastAPI', tag: 'Backend API', desc: 'High-performance Python API serving the model and streaming predictions to clients.', color: 'from-brand-500 to-violet-glow' },
  { icon: Atom, name: 'React', tag: 'Web Frontend', desc: 'Component-based dashboard and analytics UI with real-time updates and animations.', color: 'from-cyan-glow to-violet-glow' },
  { icon: Smartphone, name: 'Flutter', tag: 'Mobile App', desc: 'Cross-platform mobile companion for in-vehicle alerts and driver history.', color: 'from-brand-400 to-cyan-glow' },
  { icon: Database, name: 'MySQL', tag: 'Database', desc: 'Relational storage for trips, events, drivers, and historical analytics data.', color: 'from-violet-glow to-cyan-glow' },
];

export default function AITechnology() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-cyan-glow">Stack</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">AI Technology</h1>
        <p className="mt-4 text-[var(--text-muted)]">The tools and frameworks powering the edge-AI distraction detection pipeline.</p>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tech.map((t, i) => (
          <Reveal key={t.name} delay={(i % 4) * 0.08}>
            <motion.div
              whileHover={{ y: -6 }}
              className="group relative h-full overflow-hidden rounded-2xl glass p-6"
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${t.color} p-3 glow-blue`}>
                <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, delay: i * 0.1, repeat: Infinity }}>
                  <t.icon className="h-7 w-7 text-white" strokeWidth={2} />
                </motion.span>
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-cyan-glow">{t.tag}</span>
              <h3 className="mt-1 font-display text-lg font-bold">{t.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{t.desc}</p>
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500/30 to-cyan-glow/30 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
