import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function AINetwork() {
  const nodes = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })),
    []
  );

  const lines = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.hypot(dx, dy) < 35) result.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y });
      }
    }
    return result;
  }, [nodes]);

  return (
    <svg className="absolute inset-0 h-full w-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="url(#netGrad)" strokeWidth="0.15"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0.2] }}
          transition={{ duration: 3, delay: i * 0.05, repeat: Infinity, repeatType: 'reverse' }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r="0.6"
          fill="#22e1ff"
          animate={{ opacity: [0.3, 1, 0.3], r: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, delay: i * 0.1, repeat: Infinity }}
        />
      ))}
      <defs>
        <linearGradient id="netGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a98ff" />
          <stop offset="50%" stopColor="#22e1ff" />
          <stop offset="100%" stopColor="#8b5cff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
