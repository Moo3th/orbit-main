'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import OrbitSectionBackground from './OrbitSectionBackground';
import OrbitAnimatedBackground from './OrbitAnimatedBackground';
import { useState } from 'react';
import { createMainPageSettingsDefaults, type WhyOrbitSectionData } from '@/lib/mainPageSettings';

interface WhyOrbitProps {
  data?: WhyOrbitSectionData;
}

export default function WhyOrbit({ data }: WhyOrbitProps) {
  const { t, isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const whyOrbit = data ?? createMainPageSettingsDefaults().whyOrbit;

  const stats = whyOrbit.stats.map((stat) => ({
    number: stat.number,
    label: isRTL ? stat.labelAr : stat.labelEn
  }));

  const features = whyOrbit.features.map((feature) => ({
    text: isRTL ? feature.textAr : feature.textEn,
    textAr: feature.textAr,
    description: isRTL ? feature.descriptionAr : feature.descriptionEn,
  }));

  return (
    <section id="why-orbit" className="py-24 lg:py-32 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white relative overflow-hidden">
      {/* Rich Background Layers - Matching About.tsx */}
      <OrbitSectionBackground alignment="both" density="medium" />

      {/* Live Orbit Animated Background - Visible on burgundy */}
      <div className="absolute inset-0 z-0">
        <OrbitAnimatedBackground 
          opacity={0.3} 
          speed={1.2} 
          size="large"
          color="rgba(255, 255, 255, 0.4)" // White/beige colors visible on burgundy
        />
      </div>

      {/* Animated Gradient Orbs - Rich like About.tsx */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl opacity-20"
            style={{
              width: `${250 + i * 200}px`,
              height: `${250 + i * 200}px`,
              background: i % 2 === 0
                ? 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(232, 220, 203, 0.2) 0%, transparent 70%)',
              left: `${15 + i * 35}%`,
              top: `${25 + i * 25}%`,
            }}
            animate={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : {
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.3, 0.15],
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

      {/* Additional Rich Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`extra-${i}`}
            className="absolute rounded-full blur-3xl opacity-15"
            style={{
              width: `${400 + i * 300}px`,
              height: `${400 + i * 300}px`,
              background: i % 3 === 0
                ? 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(232, 220, 203, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(167, 169, 172, 0.1) 0%, transparent 70%)',
              left: `${20 + i * 25}%`,
              top: `${15 + i * 20}%`,
            }}
            animate={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : {
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 3,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay - Subtle */}
      <div className="absolute inset-0 opacity-[0.08] z-0">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? false : { opacity: 0 }}
          animate={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : (inView ? 'visible' : 'hidden')}
          variants={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {/* Title Section */}
          <motion.div
            variants={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : {
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-16 lg:mb-20"
          >
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading mb-6 uppercase tracking-tight leading-tight"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {t.about.stats?.title || (isRTL ? 'لماذا المدار التقني؟' : 'Why ORBIT Technical?')}
            </motion.h2>
            <motion.div
              className="h-1 bg-white/80 mx-auto rounded-full"
              initial={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? false : { width: 0 }}
              animate={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : (inView ? { width: 120 } : {})}
              transition={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : { duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </motion.div>

          {/* Features Grid - Modern Card Design */}
          <motion.div
            variants={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : {
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? {} : { duration: 0.8, delay: 0.4 }}
            className="mb-20 lg:mb-28"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.6 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative"
                >
                  <motion.div
                    className="relative h-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 lg:p-8 overflow-hidden cursor-pointer"
                    whileHover={{
                      scale: 1.03,
                      y: -8,
                      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    style={{
                      background: hoveredIndex === index
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
                        : 'rgba(255, 255, 255, 0.1)',
                      borderColor: hoveredIndex === index ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {/* Animated Background Gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                      animate={{
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                    />

                    {/* Corner Accent */}
                    <motion.div
                      className={`absolute ${isRTL ? 'top-0 left-0' : 'top-0 right-0'} w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-3xl ${isRTL ? 'rounded-bl-none rounded-br-3xl' : ''} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    {/* Number Badge */}
                    <motion.div
                      className={`absolute ${isRTL ? '-top-2 -right-2' : '-top-2 -left-2'} w-12 h-12 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center shadow-lg`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={inView ? { scale: 1, rotate: 0 } : {}}
                      transition={{
                        duration: 0.6,
                        delay: 0.8 + index * 0.1,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-white font-heading font-bold text-lg" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}>
                        {index + 1}
                      </span>
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10">
                      <motion.h4
                        className="text-xl lg:text-2xl font-heading text-white mb-3 uppercase tracking-wide leading-tight"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        animate={{
                          color: hoveredIndex === index ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)',
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {isRTL ? feature.textAr : feature.text}
                      </motion.h4>

                      <motion.p
                        className="text-white/70 text-sm lg:text-base  leading-relaxed"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: hoveredIndex === index ? 1 : 0,
                          height: hoveredIndex === index ? 'auto' : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>

                    {/* Bottom Accent Line */}
                    <motion.div
                      className={`absolute bottom-0 ${isRTL ? 'right-0' : 'left-0'} h-1 bg-gradient-to-r ${isRTL ? 'from-transparent via-secondary to-primary' : 'from-primary via-secondary to-transparent'} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{
                        width: hoveredIndex === index ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section - Enhanced Design */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.8 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{
                  duration: 0.8,
                  delay: 1.4 + index * 0.12,
                  type: 'spring',
                  stiffness: 150,
                }}
                className="group relative"
              >
                <motion.div
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 lg:p-8 text-center hover:bg-white/10 transition-all duration-300"
                  style={{
                    minWidth: 0,
                    width: '100%',
                    boxSizing: 'border-box',
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {/* Glow Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  {/* Stat Number */}
                  <motion.div
                    className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading text-white mb-4"
                    style={{ 
                      fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif',
                      lineHeight: '1.1',
                      padding: '0 8px',
                      boxSizing: 'border-box',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '3.5rem',
                      overflow: 'visible',
                      wordBreak: 'normal',
                    }}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 1,
                      delay: 1.6 + index * 0.12,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    <span className="inline-block text-center whitespace-nowrap">
                      {stat.number}
                    </span>
                  </motion.div>

                  {/* Stat Label */}
                  <motion.p
                    className="relative z-10 text-sm lg:text-base font-heading text-white/90 uppercase tracking-wider leading-tight"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 1.8 + index * 0.12 }}
                  >
                    {stat.label}
                  </motion.p>

                  {/* Decorative Line */}
                  <motion.div
                    className="h-0.5 w-12 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-4 rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    animate={inView ? { width: 48, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 2 + index * 0.12 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
