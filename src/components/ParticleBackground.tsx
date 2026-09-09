import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Props {
  density?: number;
  className?: string;
}

export default function ParticleBackground({ density = 36, className = '' }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: density }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 6 + 6,
        delay: Math.random() * 4,
        hue: Math.random() > 0.5 ? '#22e1ff' : '#4a98ff',
      })),
    [density]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.hue,
            boxShadow: `0 0 8px ${p.hue}`,
          }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
