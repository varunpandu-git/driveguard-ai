import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl glass transition-transform hover:scale-105 active:scale-95"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        {theme === 'dark' ? (
          <Moon className="h-5 w-5 text-cyan-glow" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500" />
        )}
      </motion.span>
    </button>
  );
}
