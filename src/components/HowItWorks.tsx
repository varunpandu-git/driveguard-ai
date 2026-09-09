import { motion } from 'framer-motion';
import {
  Camera, Code2, ScanFace, Grid3x3, Boxes, BrainCircuit,
  Target, Volume2, LayoutDashboard, ChevronDown,
} from 'lucide-react';
import Reveal from './Reveal';

const steps = [
  { icon: Camera, label: 'Camera', color: 'from-brand-500 to-cyan-glow' },
  { icon: Code2, label: 'OpenCV', color: 'from-cyan-glow to-brand-400' },
  { icon: ScanFace, label: 'Face Detection', color: 'from-brand-400 to-violet-glow' },
  { icon: Grid3x3, label: 'MediaPipe Face Mesh', color: 'from-violet-glow to-brand-500' },
  { icon: Boxes, label: 'YOLOv8', color: 'from-brand-500 to-cyan-glow' },
  { icon: BrainCircuit, label: 'Deep Learning Model', color: 'from-cyan-glow to-violet-glow' },
  { icon: Target, label: 'Prediction', color: 'from-violet-glow to-brand-400' },
  { icon: Volume2, label: 'Voice Alert', color: 'from-brand-400 to-cyan-glow' },
  { icon: LayoutDashboard, label: 'Dashboard', color: 'from-brand-500 to-violet-glow' },
];

export default function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-cyan-glow">Pipeline</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">How it works</h2>
        <p className="mt-4 text-[var(--text-muted)]">From raw camera frames to a spoken alert and a dashboard update — in under 40ms.</p>
      </Reveal>

      <div className="mt-14 flex flex-col items-center">
        {steps.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className="w-full max-w-md">
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="flex w-full items-center gap-4 rounded-2xl glass p-4"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}>
                  <s.icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm font-semibold md:text-base">{s.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">Step {i + 1}</p>
                </div>
                <span className="font-display text-lg font-bold text-[var(--text-muted)]">0{i + 1}</span>
              </motion.div>

              {i < steps.length - 1 && (
                <motion.div
                  animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
                  className="my-2 flex flex-col items-center"
                >
                  <ChevronDown className="h-5 w-5 text-cyan-glow" />
                  <ChevronDown className="-mt-3 h-5 w-5 text-brand-400" />
                </motion.div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
