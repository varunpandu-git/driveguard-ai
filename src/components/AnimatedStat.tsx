import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Props {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  delay?: number;
}

export default function AnimatedStat({ value, suffix = '', decimals = 0, label, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1600, bounce: 0 });
  const display = useTransform(spring, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="gradient-border relative overflow-hidden rounded-2xl glass p-5 text-center"
    >
      <div className="font-display text-3xl font-bold md:text-4xl">
        <motion.span className="gradient-text">{display}</motion.span>
        <span className="gradient-text">{suffix}</span>
      </div>
      <p className="mt-1.5 text-sm text-[var(--text-muted)]">{label}</p>
    </motion.div>
  );
}
