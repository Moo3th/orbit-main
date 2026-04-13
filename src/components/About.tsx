'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import OrbitSectionBackground from './OrbitSectionBackground';
import { createMainPageSettingsDefaults, type AboutSectionData } from '@/lib/mainPageSettings';

interface AboutProps {
  data?: AboutSectionData;
}

export default function About({ data }: AboutProps) {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const about = data ?? createMainPageSettingsDefaults().about;

  const vision = {
    title: isRTL ? about.visionTitleAr : about.visionTitleEn,
    titleAr: about.visionTitleAr,
    text: isRTL ? about.visionTextAr : about.visionTextEn,
    textAr: about.visionTextAr,
  };

  const mission = {
    title: isRTL ? about.missionTitleAr : about.missionTitleEn,
    titleAr: about.missionTitleAr,
    text: isRTL ? about.missionTextAr : about.missionTextEn,
    textAr: about.missionTextAr,
  };

  const promises = {
    title: isRTL ? about.promisesTitleAr : about.promisesTitleEn,
    titleAr: about.promisesTitleAr,
    items: about.promises.map((item) => ({
      text: isRTL ? item.textAr : item.textEn,
      textAr: item.textAr,
    })),
  };

  // Font sizes - hierarchy: 0 (largest), 2 (medium-large), 1 (medium), 3 (smallest)
  const getFontSize = (index: number) => {
    if (index === 0) return 'text-xl sm:text-2xl lg:text-3xl xl:text-3xl'; // Largest - reduced size
    if (index === 2) return 'text-xl sm:text-2xl lg:text-3xl xl:text-3xl'; // Medium-large (bigger than index 1)
    if (index === 1) return 'text-lg sm:text-xl lg:text-2xl xl:text-2xl'; // Medium
    return 'text-sm sm:text-base lg:text-lg xl:text-lg'; // Smallest (index 3) - noticeably smaller
  };

  // Padding sizes - hierarchy: 0 (largest), 2 (medium-large), 1 (medium), 3 (smallest)
  const getPadding = (index: number) => {
    if (index === 0) return 'pt-7 pb-6 px-5 sm:px-6 lg:px-7'; // Largest - reduced padding
    if (index === 2) return 'pt-7 pb-5 px-5 sm:px-6 lg:px-7'; // Medium-large (bigger than index 1)
    if (index === 1) return 'pt-6 pb-5 px-4 sm:px-5 lg:px-6'; // Medium
    return 'pt-5 pb-4 px-4 sm:px-5 lg:px-5'; // Smallest (index 3)
  };

  return (
    <section id="about" className="relative py-32 lg:py-40 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
      <OrbitSectionBackground alignment="both" density="medium" />

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl opacity-20 dark:opacity-10"
            style={{
              width: `${250 + i * 200}px`,
              height: `${250 + i * 200}px`,
              background: i % 2 === 0
                ? 'radial-gradient(circle, rgba(122, 30, 46, 0.35) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(232, 220, 203, 0.35) 0%, transparent 70%)',
              left: `${15 + i * 35}%`,
              top: `${25 + i * 25}%`,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.12, 0.25, 0.12],
              x: [0, 20, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 10 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16 lg:mb-20 relative"
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${100 + i * 80}px`,
                  height: `${100 + i * 80}px`,
                  background: `radial-gradient(circle, rgba(122, 30, 46, ${0.1 - i * 0.02}) 0%, transparent 70%)`,
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                  x: [0, 20, 0],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative bg-gradient-to-br from-white/90 dark:from-gray-800/90 via-secondary/10 dark:via-secondary/5 to-white/80 dark:to-gray-800/80 backdrop-blur-md rounded-2xl p-8 sm:p-10 lg:p-12 border-2 border-primary/30 dark:border-primary/40 shadow-2xl max-w-5xl mx-auto group overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={inView ? { scale: 1, opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ 
              scale: 1.02,
              borderColor: 'rgba(122, 30, 46, 0.5)',
              transition: { duration: 0.3 }
            }}
          >
            {/* Animated Gradient Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 2,
              }}
            />

            {/* Animated Corner Elements */}
            <motion.div
              className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl"
              animate={{
                borderColor: ['rgba(122, 30, 46, 0.4)', 'rgba(122, 30, 46, 0.7)', 'rgba(122, 30, 46, 0.4)'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl"
              animate={{
                borderColor: ['rgba(122, 30, 46, 0.4)', 'rgba(122, 30, 46, 0.7)', 'rgba(122, 30, 46, 0.4)'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl"
              animate={{
                borderColor: ['rgba(122, 30, 46, 0.4)', 'rgba(122, 30, 46, 0.7)', 'rgba(122, 30, 46, 0.4)'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/40 rounded-br-2xl"
              animate={{
                borderColor: ['rgba(122, 30, 46, 0.4)', 'rgba(122, 30, 46, 0.7)', 'rgba(122, 30, 46, 0.4)'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5,
              }}
            />

            {/* Content with Staggered Animation */}
            <motion.div
              className="relative z-10"
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.5,
                  },
                },
              }}
            >
              <motion.p
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed font-medium ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                style={{
                  fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif',
                  color: '#161616',
                }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <motion.span
                  className="text-primary font-bold inline-block relative"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 20 },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      transition: {
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                >
                  {isRTL ? 'المدار' : 'ORBIT'}
                  {/* Glow effect on hover */}
                  <motion.span
                    className="absolute inset-0 blur-xl bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ zIndex: -1 }}
                  />
                </motion.span>
                {' '}
                <motion.span
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        duration: 0.6,
                        ease: 'easeOut',
                      },
                    },
                  }}
                >
                  {isRTL
                    ? 'شركة سعودية رائدة في تقديم الحلول التقنية الذكية، نعمل على تمكين المؤسسات من التطور عبر تقنيات حديثة تضمن كفاءة أعلى، تواصل أسرع، وتجربة رقمية متكاملة'
                    : 'is a leading Saudi company providing smart technical solutions. We work to enable organizations to evolve through modern technologies that ensure higher efficiency, faster communication, and an integrated digital experience'}
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Animated Bottom Decorative Line */}
            <motion.div
              className="mt-8 relative h-1 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ x: '-100%' }}
                animate={inView ? { x: '100%' } : {}}
                transition={{
                  duration: 2,
                  delay: 1,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="h-full bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20"
                initial={{ width: 0 }}
                animate={inView ? { width: '100%' } : {}}
                transition={{
                  duration: 1.5,
                  delay: 1.2,
                  ease: 'easeOut',
                }}
              />
            </motion.div>

            {/* Floating Particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${4 + i * 2}px`,
                  height: `${4 + i * 2}px`,
                  background: `radial-gradient(circle, rgba(122, 30, 46, ${0.6 - i * 0.1}) 0%, transparent 70%)`,
                  left: `${10 + i * 20}%`,
                  top: `${15 + i * 15}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.4,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {/* Vision & Mission Row - Back to Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20 lg:mb-24">
            {/* Vision Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-10 lg:p-12 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-primary/20 dark:border-primary/30 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative z-10">
                <motion.h3
                  className="text-3xl sm:text-4xl font-heading text-primary dark:text-primary mb-6 uppercase tracking-tight"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {isRTL ? vision.titleAr : vision.title}
                </motion.h3>

                <motion.div
                  className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mb-8"
                  initial={{ width: 0 }}
                  animate={inView ? { width: 80 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />

                <motion.p
                  className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed "
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  {isRTL ? vision.textAr : vision.text}
                </motion.p>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
            </motion.div>

            {/* Mission Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-10 lg:p-12 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-secondary/20 dark:border-secondary/30 shadow-xl hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative z-10">
                <motion.h3
                  className="text-3xl sm:text-4xl font-heading text-secondary dark:text-secondary mb-6 uppercase tracking-tight"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {isRTL ? mission.titleAr : mission.title}
                </motion.h3>

                <motion.div
                  className="h-1 w-20 bg-gradient-to-r from-secondary to-primary rounded-full mb-8"
                  initial={{ width: 0 }}
                  animate={inView ? { width: 80 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />

                <motion.p
                  className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed "
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  {isRTL ? mission.textAr : mission.text}
                </motion.p>
              </div>

              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-secondary/5 to-transparent rounded-br-full" />
            </motion.div>
          </div>

          {/* Promises - Creative Design with Proper Responsive Sizing */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <motion.h3
              className="text-4xl sm:text-5xl lg:text-7xl font-heading text-gray-900 dark:text-white mb-20 uppercase tracking-tighter text-center"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {isRTL ? promises.titleAr : promises.title}
            </motion.h3>

            {/* Responsive Grid - First one larger, others smaller */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {promises.items.map((promise, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.8 + index * 0.12,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className={`group relative ${
                    index === 0 
                      ? 'sm:col-span-2 lg:col-span-1' // First one spans 2 columns on sm, normal on lg
                      : ''
                  }`}
                >
                  {/* Decorative Circle Badge - Without Number */}
                  <div 
                    className={`absolute ${isRTL ? '-top-3 -right-3' : '-top-3 -left-3'} rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300 ${
                      index === 0 ? 'w-14 h-14' : 'w-12 h-12'
                    }`}
                    style={index === 2 ? { width: '3.25rem', height: '3.25rem' } : {}}
                  />

                  {/* Content Card */}
                  <div className={`relative rounded-2xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 group-hover:border-primary dark:group-hover:border-primary transition-all duration-500 shadow-md group-hover:shadow-xl group-hover:shadow-primary/20 overflow-hidden ${getPadding(index)}`}>
                    {/* Animated Background Gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Decorative Corner */}
                    {isRTL ? (
                      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    ) : (
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    )}

                    <div className="relative z-10">
                      <motion.h4
                        className={`font-heading text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300 ${getFontSize(index)} ${isRTL ? 'font-ibm-plex-arabic' : 'font-heading'} leading-tight`}
                        style={{ 
                          fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif',
                        }}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 1.2 + index * 0.12 }}
                      >
                        {isRTL ? promise.textAr : promise.text}
                      </motion.h4>

                      {/* Elegant Underline */}
                      <motion.div
                        className={`h-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-full ${
                          index === 0 ? 'mt-4' : index === 2 ? 'mt-4' : index === 1 ? 'mt-3' : 'mt-3'
                        }`}
                        initial={{ width: 0 }}
                        animate={inView ? { width: '100%' } : {}}
                        transition={{ duration: 0.8, delay: 1.4 + index * 0.12 }}
                      />
                    </div>

                    {/* Bottom Accent Line */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
