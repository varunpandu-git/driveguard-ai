import { motion } from 'framer-motion';
import { Scan } from 'lucide-react';

export default function CameraScan() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl glass">
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Car silhouette */}
      <svg viewBox="0 0 200 120" className="absolute inset-0 m-auto h-3/4 w-3/4 opacity-70">
        <motion.path
          d="M30 75 Q40 50 70 48 L90 38 Q120 34 145 44 L160 55 Q180 58 185 72 L185 85 Q185 90 178 90 L168 90 Q165 100 152 100 Q140 100 138 90 L70 90 Q67 100 55 100 Q43 100 41 90 L32 90 Q25 90 25 85 L25 80 Q25 75 30 75 Z"
          fill="url(#carGrad)"
          stroke="#22e1ff" strokeWidth="0.5"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <defs>
          <linearGradient id="carGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1d75ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cff" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Face mesh hint */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-16 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-glow/40"
        animate={{ scale: [1, 1.05, 1], borderColor: ['rgba(34,225,255,0.4)', 'rgba(34,225,255,0.9)', 'rgba(34,225,255,0.4)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan-glow"
            style={{ top: `${25 + i * 25}%` }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </motion.div>

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-glow to-transparent"
        style={{ boxShadow: '0 0 18px #22e1ff' }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Corner brackets */}
      {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2', 'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((c, i) => (
        <div key={i} className={`absolute h-6 w-6 rounded-sm border-cyan-glow/70 ${c}`} />
      ))}

      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> REC
      </div>
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-cyan-glow">
        <Scan className="h-3.5 w-3.5" /> AI LIVE
      </div>
    </div>
  );
}
