'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher({ dark }: { dark?: boolean } = {}) {
  const { language, setLanguage } = useLanguage();
  const { isDark } = useTheme();
  // يُسمح للأب (مثل الهيدر الداكن على صفحة واتساب) بفرض الوضع الداكن بغضّ النظر عن ثيم الموقع.
  const useDark = dark ?? isDark;

  return (
    <motion.button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300
        ${useDark
          ? 'bg-white/5 hover:bg-white/10 text-white/90'
          : 'bg-black/5 hover:bg-black/10 text-gray-800'}
        backdrop-blur-md border border-transparent hover:border-current/10
      `}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <motion.div
          animate={{ rotate: language === 'ar' ? 360 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <svg
            className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -5, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-[11px] font-bold tracking-tight uppercase"
        >
          {language === 'en' ? 'AR' : 'EN'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

