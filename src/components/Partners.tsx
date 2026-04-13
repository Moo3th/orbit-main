'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Partners() {
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const marqueeControls = useAnimationControls();
  const marqueeRef = useRef<HTMLDivElement>(null);

  // All logos from TrustedLogos folder - shuffled to avoid similar ones together
  const logoFiles = useMemo(() => {
    const logos = [
      'images-removebg-preview.png',
      'images.png',
      'magrabi-health.png',
      'logo_004-removebg-preview.png',
      'logo_006-removebg-preview.png',
      'logo_007-removebg-preview.png',
      'logo_008-removebg-preview.png',
      'logo_009-removebg-preview.png',
      'logo_010-removebg-preview.png',
      'logo_011-removebg-preview.png',
      'logo_012-removebg-preview.png',
      'logo_014-removebg-preview.png',
      'logo_015-removebg-preview.png',
      'logo_016-removebg-preview.png',
      'logo_017-removebg-preview.png',
      'logo_018-removebg-preview.png',
      'logo_020-removebg-preview.png',
      'logo_021-removebg-preview.png',
      'logo_022-removebg-preview.png',
      'logo_023-removebg-preview.png',
      'logo_024-removebg-preview.png',
      'logo_025-removebg-preview.png',
      'logo_026-removebg-preview.png',
      'logo_027-removebg-preview.png',
      'logo_028-removebg-preview.png',
      'logo_029-removebg-preview.png',
      'logo_030-removebg-preview.png',
      'logo_031-removebg-preview.png',
      'logo_032-removebg-preview.png',
      'logo_033-removebg-preview.png',
      'logo_034-removebg-preview.png',
      'logo_035-removebg-preview.png',
      'logo_036-removebg-preview.png',
      'logo_037-removebg-preview.png',
      'logo_038-removebg-preview.png',
      'logo_039-removebg-preview.png',
      'logo_040-removebg-preview.png',
      'logo_041-removebg-preview.png',
      'logo_042-removebg-preview.png',
      'logo_043-removebg-preview.png',
      'logo_044-removebg-preview.png',
      'logo_045-removebg-preview.png',
      'logo_046-removebg-preview.png',
      'logo_047-removebg-preview.png',
      'logo_048-removebg-preview.png',
      'logo_049-removebg-preview.png',
      'logo_050-removebg-preview.png',
      'logo_051-removebg-preview.png',
      'logo_052-removebg-preview.png',
      'logo_053-removebg-preview.png',
      'logo_054-removebg-preview.png',
      'logo_055-removebg-preview.png',
      'logo_056-removebg-preview.png',
      'logo_057-removebg-preview.png',
      'حرس الحدود.png',
      'إمارة منطقة الرياض.png',
      'مستشفى الملك فهد بجدة.png',
      'جامعة الملك سعود.png',
      'وزارة التعليم.png',
      'الموارد البشرية.png',
      'شعار-هدف.png',
    ];
    
    // Shuffle to avoid similar logos being together
    const shuffled = [...logos];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const partners = useMemo(() => {
    return logoFiles.map((logoFile, index) => ({
      name: `Partner ${index + 1}`,
      logo: `/TrustedLogos/${logoFile}`,
      website: '#',
    }));
  }, [logoFiles]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Start marquee animation after mounted - Smart RTL/LTR support with seamless infinite loop from edge
  useEffect(() => {
    // Disable marquee animation on mobile for better performance
    const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;
    
    if (mounted && !isMarqueePaused && partners.length > 0) {
      const startAnimation = () => {
        if (marqueeRef.current) {
          const firstSet = marqueeRef.current.querySelector('.marquee-set') as HTMLElement;
          if (firstSet && firstSet.offsetWidth > 0) {
            const setWidth = firstSet.offsetWidth;
            // For RTL: start from right edge (0), move right (positive), logos appear from left
            // For LTR: start from left edge (0), move left (negative), logos appear from right
            const direction = isRTL ? 1 : -1;
            marqueeControls.start({
              x: [0, direction * setWidth],
              transition: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: Math.max(20, partners.length * 4),
                ease: 'linear',
              },
            });
            return;
          }
        }
        // Fallback: use percentage-based animation
        const direction = isRTL ? 1 : -1;
        marqueeControls.start({
          x: ['0%', `${direction * 33.333}%`],
          transition: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: Math.max(20, partners.length * 4),
            ease: 'linear',
          },
        });
      };

      startAnimation();
      const timeout = setTimeout(startAnimation, 100);
      
      return () => clearTimeout(timeout);
    } else if (isMarqueePaused) {
      marqueeControls.stop();
    }
  }, [isMarqueePaused, marqueeControls, mounted, partners.length, isRTL]);

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1.2,
        delay: 2.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ width: '100%' }}
    >
      {/* Backdrop Blur/Shadow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: isDark
            ? 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(248,249,250,0.5) 0%, rgba(248,249,250,0.3) 50%, transparent 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      />

      {/* Trusted By Heading */}
      <motion.div
        className="text-center mb-4 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.8 }}
      >
        <motion.p
          className={`font-heading text-sm sm:text-base md:text-lg font-medium tracking-wider ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
          style={{
            color: isDark ? '#E8DCCB' : '#161616',
            textShadow: isDark
              ? '0 2px 8px rgba(0,0,0,0.4)'
              : '0 1px 4px rgba(0,0,0,0.08)',
          }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {isRTL ? 'شركاء النجاح' : 'Success Partners'}
        </motion.p>
      </motion.div>

      {/* Horizontal Looping Marquee - Smart RTL/LTR & Full Width Infinite Loop from Edge */}
      <div className="relative w-full overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Gradient Fade Edges - RTL/LTR aware */}
        <div
          className={`absolute top-0 bottom-0 z-20 pointer-events-none ${
            isRTL ? 'right-0' : 'left-0'
          } w-16 sm:w-24 md:w-32`}
          style={{
            background: isDark
              ? `linear-gradient(to ${isRTL ? 'left' : 'right'}, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)`
              : `linear-gradient(to ${isRTL ? 'left' : 'right'}, rgba(248,249,250,0.95) 0%, rgba(248,249,250,0.8) 50%, transparent 100%)`,
          }}
        />
        <div
          className={`absolute top-0 bottom-0 z-20 pointer-events-none ${
            isRTL ? 'left-0' : 'right-0'
          } w-16 sm:w-24 md:w-32`}
          style={{
            background: isDark
              ? `linear-gradient(to ${isRTL ? 'right' : 'left'}, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)`
              : `linear-gradient(to ${isRTL ? 'right' : 'left'}, rgba(248,249,250,0.95) 0%, rgba(248,249,250,0.8) 50%, transparent 100%)`,
          }}
        />

        {/* Marquee Container - Infinite seamless loop using full width from edge */}
        {partners.length > 0 && (
          <div className="relative w-full overflow-hidden" style={{ margin: 0, padding: 0 }}>
            <motion.div
              ref={marqueeRef}
              className="flex items-center"
              animate={marqueeControls}
              initial={{ x: isRTL ? 0 : 0 }}
              style={{
                display: 'flex',
                width: 'max-content',
                willChange: 'transform',
                position: 'relative',
                margin: 0,
                padding: 0,
              }}
            >
              {/* Create 3 sets for seamless infinite loop - logos appear from opposite side, starting at edge */}
              {[...Array(3)].map((_, setIndex) => (
                <div
                  key={setIndex}
                  className="marquee-set flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 flex-shrink-0"
                  style={{ 
                    display: 'flex',
                    marginLeft: setIndex === 0 && !isRTL ? 0 : undefined,
                    marginRight: setIndex === 0 && isRTL ? 0 : undefined,
                  }}
                >
                  {partners.map((partner, index) => (
                    <motion.div
                      key={`${setIndex}-${index}`}
                      className="flex items-center justify-center flex-shrink-0 group cursor-pointer"
                      style={{
                        marginLeft: setIndex === 0 && index === 0 && !isRTL ? 0 : undefined,
                        marginRight: setIndex === 0 && index === 0 && isRTL ? 0 : undefined,
                      }}
                      whileHover={{
                        scale: 1.15,
                        transition: { duration: 0.3, ease: 'easeOut' },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="relative px-2 sm:px-3 md:px-4 py-1 sm:py-2 transition-all duration-300"
                        style={{
                          paddingLeft: setIndex === 0 && index === 0 && !isRTL ? '0.5rem' : undefined,
                          paddingRight: setIndex === 0 && index === 0 && isRTL ? '0.5rem' : undefined,
                        }}
                        initial={{
                          filter: isDark
                            ? 'brightness(0) invert(1) opacity(0.6)'
                            : 'brightness(0) opacity(0.5)',
                        }}
                        whileHover={{
                          filter: 'none',
                          opacity: 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={partner.logo}
                          alt={partner.name || `Trusted partner ${index + 1}`}
                          className="h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto object-contain gpu-accelerated select-none"
                          style={{
                            maxWidth: 'clamp(80px, 15vw, 180px)',
                            height: 'auto',
                          }}
                          loading="lazy"
                          draggable={false}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

