import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Cpu, Brain, ScanFace, Zap } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import AINetwork from '@/components/AINetwork';
import CameraScan from '@/components/CameraScan';
import AnimatedStat from '@/components/AnimatedStat';
import FeaturesGrid from '@/components/FeaturesGrid';
import HowItWorks from '@/components/HowItWorks';
import Reveal from '@/components/Reveal';

const tech = [
  { icon: Brain, label: 'Artificial Intelligence' },
  { icon: Cpu, label: 'Deep Learning' },
  { icon: ScanFace, label: 'Computer Vision' },
  { icon: Zap, label: 'Edge AI' },
];

const stack = ['YOLOv8', 'MediaPipe', 'OpenCV', 'TensorFlow', 'Edge AI'];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden pt-10 pb-24">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <ParticleBackground density={28} />
        <AINetwork />
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-glow/20 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-cyan-glow"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-glow" />
              Final-Year Engineering Project · Multimodal Deep Learning
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
            >
              Edge-AI <span className="gradient-text">Driver Distraction</span> Detection System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg"
            >
              An intelligent real-time driver monitoring platform that uses Artificial Intelligence, Computer Vision, Deep Learning, and Edge Computing to improve road safety by detecting driver distractions before accidents occur.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/register" className="btn-glow group flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow px-6 py-3.5 font-semibold text-white glow-blue">
                Get Started <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 rounded-xl glass px-6 py-3.5 font-semibold transition-colors hover:text-cyan-glow">
                <Play className="h-4.5 w-4.5" /> Live Demo
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2"
            >
              {stack.map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
                  <span className="h-1 w-1 rounded-full bg-cyan-glow" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/20 via-cyan-glow/10 to-violet-glow/20 blur-2xl" />
            <div className="relative">
              <CameraScan />
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
                className="absolute -right-4 -top-4 rounded-xl glass px-3 py-2 text-xs font-semibold text-success"
              >
                ● Attentive
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 rounded-xl glass px-3 py-2 text-xs font-semibold text-cyan-glow"
              >
                30 FPS · Edge
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <AnimatedStat value={98.7} suffix="%" decimals={1} label="Detection Accuracy" />
          <AnimatedStat value={30} suffix=" FPS" label="Real-Time Processing" delay={0.1} />
          <AnimatedStat value={10} suffix="+" label="Driver Activities" delay={0.2} />
          <AnimatedStat value={24} suffix="/7" label="Monitoring" delay={0.3} />
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-cyan-glow">About the project</p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Road accidents are rising — distracted driving is the cause</h2>
            <p className="mt-5 leading-relaxed text-[var(--text-muted)]">
              Every year, millions of road accidents are caused by drivers distracted by phones, fatigue, or other activities. This project tackles that problem head-on by monitoring the driver in real time and raising an alert the moment attention slips.
            </p>
            <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
              It combines Artificial Intelligence, Deep Learning, Computer Vision, and Edge Computing into a single pipeline that runs locally inside the vehicle — no cloud round-trip, no privacy leak, and no latency.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {tech.map((t, i) => (
                <Reveal key={t.label} delay={i * 0.08}>
                  <div className="flex items-center gap-3 rounded-xl glass p-3.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-cyan-glow">
                      <t.icon className="h-4.5 w-4.5 text-white" />
                    </span>
                    <span className="text-sm font-medium">{t.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-violet-glow/20 to-cyan-glow/20 blur-2xl" />
              <div className="relative rounded-3xl glass p-8">
                <h3 className="font-display text-lg font-semibold">Powered by a modern AI stack</h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Eight technologies working together on the edge.</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {stack.concat(['OpenCV', 'TensorFlow']).map((s, i) => (
                    <motion.div
                      key={s}
                      whileHover={{ scale: 1.04 }}
                      className="gradient-border flex items-center justify-center rounded-xl bg-[var(--bg-elev)]/40 py-4 text-sm font-semibold"
                    >
                      {s}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FeaturesGrid />
      <HowItWorks />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl glass p-10 text-center md:p-16">
            <ParticleBackground density={16} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-violet-glow/10" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold md:text-4xl">See it in action</h2>
              <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">Open the live dashboard to watch the detection pipeline run in real time.</p>
              <Link to="/dashboard" className="btn-glow mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-glow px-7 py-3.5 font-semibold text-white glow-blue">
                Open Live Dashboard <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
