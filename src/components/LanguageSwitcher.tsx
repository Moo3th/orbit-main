'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { isDark } = useTheme();

  return (
    <motion.button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden flex-shrink-0 ${
        isDark
          ? 'bg-primary/20 border-2 border-primary/40'
          : 'bg-secondary/50 border-2 border-secondary/60'
      }`}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Animated Flag/Text */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={language}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              direction: language === 'ar' ? 'rtl' : 'ltr',
              unicodeBidi: 'isolate',
            }}
            className={`text-[10px] sm:text-xs font-heading absolute font-semibold ${
              isDark ? 'text-primary' : 'text-gray-700'
            }`}
          >
            {language === 'en' ? 'EN' : 'عربي'}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Globe Icon Background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-10"
        animate={{
          rotate: language === 'ar' ? 360 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-primary' : 'text-gray-600'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
      </motion.div>

      {/* Active indicator */}
      <motion.div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}

