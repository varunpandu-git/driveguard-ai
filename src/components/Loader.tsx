import { motion } from 'framer-motion';

interface Props {
  label?: string;
  size?: number;
}
export default function Loader({ label = 'Loading', size = 56 }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <motion.div
        style={{ width: size, height: size }}
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-glow border-r-brand-400" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-violet-glow border-l-brand-500" />
      </motion.div>
      <motion.p
        className="text-sm text-[var(--text-muted)] font-display tracking-widest"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {label}…
      </motion.p>
    </div>
  );
}
