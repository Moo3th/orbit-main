'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';

export default function PackagesHero() {
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      {/* Orbit Brand Background */}
      <OrbitSectionBackground alignment="both" density="medium" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Title */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading mb-6 uppercase tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL ? 'الباقات' : 'Our Packages'}
          </motion.h1>

          {/* Decorative Line */}
          <motion.div
            className="h-1.5 w-32 bg-gradient-to-r from-primary via-blue-400 to-primary mx-auto mb-8 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Description */}
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto  leading-relaxed"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL 
              ? 'باقات تقنية مصممة خصيصاً لتلبية احتياجاتك'
              : 'Technical packages designed specifically to meet your needs'
            }
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

