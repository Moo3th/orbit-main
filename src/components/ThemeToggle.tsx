'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
        isDark
          ? 'bg-primary/20 border-2 border-primary/40'
          : 'bg-secondary/50 border-2 border-secondary/60'
      }`}
      aria-label="Toggle theme"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 1 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {isDark ? (
          // Moon Icon
          <svg
            className="w-5 h-5 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          // Sun Icon
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        )}
      </motion.div>

      {/* Glow effect */}
      {isDark && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
}


