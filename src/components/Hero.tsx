'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { shouldReduceAnimations, getPerformanceLevel } from '@/utils/deviceDetection';
import Orb from './Orb';
import OrbitSectionBackground from './OrbitSectionBackground';
import Partners from './Partners';

export default function Hero() {
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<NodeJS.Timeout | null>(null);
  const [reduceAnimations, setReduceAnimations] = useState<boolean>(false);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');

  // Fetch solutions from database - START IMMEDIATELY
  const [solutions, setSolutions] = useState<any[]>([]);
  const [solutionsLoading, setSolutionsLoading] = useState(true);

  // Detect device capabilities for optimization
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // CRITICAL: Force reduce animations on iOS to prevent crashes
    setReduceAnimations(isIOSDevice || shouldReduceAnimations());
    setPerformanceLevel(isIOSDevice ? 'low' : getPerformanceLevel());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active solutions
        try {
          const solutionsRes = await fetch('/api/solutions');
          const solutionsData = await solutionsRes.json();
          if (solutionsData.success && solutionsData.solutions && solutionsData.solutions.length > 0) {
            // Map database solutions to the format used by carousel
            const mappedSolutions = solutionsData.solutions.map((sol: any) => ({
              slug: sol.slug,
              titleEn: sol.title.en,
              titleAr: sol.title.ar,
              descriptionEn: sol.description.en,
              descriptionAr: sol.description.ar,
              icon: sol.features?.[0]?.icon || '🚀',
              image: sol.heroImage,
            }));
            setSolutions(mappedSolutions);
          } else {
            // Fallback to ALL default solutions if no solutions in database
            setSolutions([
              {
                slug: 'sms-platform',
                titleEn: 'SMS Platform',
                titleAr: 'الرسائل النصية',
                descriptionEn: 'An intelligent messaging platform that ensures your messages reach the right time with the highest delivery rate.',
                descriptionAr: 'منصة رسائل ذكية تضمن وصول رسائلك في الوقت المناسب وبأعلى نسبة تسليم',
                icon: '📱',
              },
              {
                slug: 'whatsapp-business-api',
                titleEn: 'WhatsApp Business API',
                titleAr: 'واتساب اعمال API',
                descriptionEn: 'An integrated solution for official customer communication via WhatsApp with message automation.',
                descriptionAr: 'حل متكامل للتواصل الرسمي مع العملاء عبر واتساب مع أتمتة الرسائل',
                icon: '💬',
              },
              {
                slug: 'otime',
                titleEn: 'OTime - Attendance & HR',
                titleAr: 'اوتايم OTime',
                descriptionEn: 'A smart attendance and departure system that helps you manage work hours accurately.',
                descriptionAr: 'نظام حضور وانصراف ذكي يساعدك على إدارة أوقات العمل بدقة',
                icon: '⏰',
              },
              {
                slug: 'gov-gate',
                titleEn: 'Gov Gate - Government Portal',
                titleAr: 'البوابة الحكومية Gov Gate',
                descriptionEn: 'An official messaging portal designed for government entities with highest security levels.',
                descriptionAr: 'بوابة مراسلات رسمية مصممة للجهات الحكومية بأعلى مستويات الأمان',
                icon: '🏛️',
              },
            ]);
          }
        } catch (error) {
          console.error('Failed to fetch solutions:', error);
          // Fallback to ALL default solutions if fetch fails
          setSolutions([
            {
              slug: 'sms-platform',
              titleEn: 'SMS Platform',
              titleAr: 'الرسائل النصية',
              descriptionEn: 'An intelligent messaging platform that ensures your messages reach the right time with the highest delivery rate.',
              descriptionAr: 'منصة رسائل ذكية تضمن وصول رسائلك في الوقت المناسب وبأعلى نسبة تسليم',
              icon: '📱',
            },
            {
              slug: 'whatsapp-business-api',
              titleEn: 'WhatsApp Business API',
              titleAr: 'واتساب اعمال API',
              descriptionEn: 'An integrated solution for official customer communication via WhatsApp with message automation.',
              descriptionAr: 'حل متكامل للتواصل الرسمي مع العملاء عبر واتساب مع أتمتة الرسائل',
              icon: '💬',
            },
            {
              slug: 'otime',
              titleEn: 'OTime - Attendance & HR',
              titleAr: 'اوتايم OTime',
              descriptionEn: 'A smart attendance and departure system that helps you manage work hours accurately.',
              descriptionAr: 'نظام حضور وانصراف ذكي يساعدك على إدارة أوقات العمل بدقة',
              icon: '⏰',
            },
            {
              slug: 'gov-gate',
              titleEn: 'Gov Gate - Government Portal',
              titleAr: 'البوابة الحكومية Gov Gate',
              descriptionEn: 'An official messaging portal designed for government entities with highest security levels.',
              descriptionAr: 'بوابة مراسلات رسمية مصممة للجهات الحكومية بأعلى مستويات الأمان',
              icon: '🏛️',
            },
          ]);
        }

      } finally {
        setSolutionsLoading(false);
        setMounted(true); // Set mounted after data is ready
      }
    };

    fetchData();
  }, []); // Fetch immediately on mount, no dependencies


  // Auto-play carousel
  useEffect(() => {
    if (mounted && isAutoPlaying && solutions.length > 0) {
      carouselRef.current = setInterval(() => {
        setCurrentSolutionIndex((prev) => (prev + 1) % solutions.length);
      }, 5000);

      return () => {
        if (carouselRef.current) {
          clearInterval(carouselRef.current);
        }
      };
    }
  }, [mounted, isAutoPlaying, solutions.length]);

  const goToSolution = (index: number) => {
    setCurrentSolutionIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Swipe gesture support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToSolution((currentSolutionIndex + 1) % solutions.length);
    }
    if (isRightSwipe) {
      goToSolution((currentSolutionIndex - 1 + solutions.length) % solutions.length);
    }
  };

  // Show loading state while fetching - with spinner
  if (solutionsLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
          />
          <div className="text-xl font-heading text-gray-600 dark:text-gray-400">
            {isRTL ? 'جاري التحميل...' : 'Loading Solutions...'}
          </div>
        </div>
      </section>
    );
  }

  // If no solutions, show message
  if (solutions.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-heading text-gray-900 dark:text-white mb-4">
            {isRTL ? 'لا توجد حلول متاحة' : 'No Solutions Available'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isRTL 
              ? 'يرجى إضافة حلول من لوحة التحكم' 
              : 'Please add solutions from the admin panel'}
          </p>
          <Link
            href="/admin/pages"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-heading hover:bg-primary/90 transition-colors"
          >
            {isRTL ? 'إضافة حلول' : 'Add Solutions'}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pb-32 md:pb-40"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at center, #0a0a0f 0%, #000000 100%)'
          : 'radial-gradient(ellipse at center, #f8f9fa 0%, #e8dccb 100%)',
      }}
    >
      {/* Living Logo Background */}
      {/* Living Logo Background - Removed as per request */}
      {/* {mounted && <OrbitSectionBackground alignment="both" density="high" />} */}

      {/* Animated Background Orbs - Always show on desktop, only hide on iOS/mobile */}
      {mounted && !reduceAnimations && (
        <>
          {/* Primary Orb - Always show on desktop */}
          <div
            className="hidden sm:block absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: 1,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '1400px',
                maxHeight: '1400px',
                minHeight: '700px',
              }}
            >
              <Orb
                hoverIntensity={0.7}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
              />
            </div>
          </div>

          {/* Floating Particles - Full on desktop, reduced on iOS */}
          {[...Array(reduceAnimations ? 2 : 4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none gpu-accelerated"
              style={{
                width: `${20 + i * 12}px`,
                height: `${20 + i * 12}px`,
                background: `radial-gradient(circle, ${isDark ? 'rgba(122, 30, 46, 0.15)' : 'rgba(122, 30, 46, 0.1)'} 0%, transparent 70%)`,
                left: `${15 + i * 25}%`,
                top: `${15 + i * 20}%`,
                zIndex: 0,
                willChange: reduceAnimations ? 'auto' : 'transform, opacity',
                transform: 'translateZ(0)',
              }}
              animate={reduceAnimations ? {} : {
                y: [0, -30, 0],
                x: [0, 15, 0],
                opacity: [0.25, 0.6, 0.25],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 12 + i * 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.8,
              }}
            />
          ))}

          {/* Gradient Rings - Always on desktop, disabled on iOS */}
          {!reduceAnimations && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {[1, 2].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border gpu-accelerated"
                  style={{
                    width: `${500 + ring * 300}px`,
                    height: `${500 + ring * 300}px`,
                    borderColor: isDark ? 'rgba(122, 30, 46, 0.08)' : 'rgba(122, 30, 46, 0.05)',
                    borderWidth: '1px',
                    willChange: 'transform, opacity',
                    transform: 'translateZ(0)',
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.25, 0.45, 0.25],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 10 + ring * 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: ring * 1.5,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Ambient Light Glows - Always on desktop, disabled on iOS */}
          {!reduceAnimations && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 0 }}
            >
              {[
                { x: '20%', y: '30%', size: '400px' },
                { x: '80%', y: '70%', size: '500px' },
              ].map((glow, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-full ${reduceAnimations ? 'blur-xl' : 'blur-2xl'} gpu-accelerated`}
                  style={{
                    width: glow.size,
                    height: glow.size,
                    left: glow.x,
                    top: glow.y,
                    background: `radial-gradient(circle, ${isDark ? 'rgba(122, 30, 46, 0.18)' : 'rgba(122, 30, 46, 0.1)'} 0%, transparent 70%)`,
                    transform: 'translate(-50%, -50%) translateZ(0)',
                    willChange: reduceAnimations ? 'auto' : 'transform, opacity',
                  }}
                  animate={reduceAnimations ? {} : {
                    scale: [1, 1.25, 1],
                    opacity: [0.35, 0.65, 0.35],
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 2.5,
                  }}
                />
              ))}
            </motion.div>
          )}
        </>
      )}

      {/* Gradient Overlay for Better Text Readability - GPU accelerated */}
      <motion.div
        className="absolute inset-0 pointer-events-none gpu-accelerated"
        style={{
          zIndex: 2,
          background: isDark
            ? 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)'
            : 'radial-gradient(ellipse at center, transparent 0%, rgba(248,249,250,0.3) 60%, rgba(248,249,250,0.6) 100%)',
        }}
      />

      {/* Main Content - Carousel Only */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 gpu-accelerated mb-16 md:mb-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Solutions Carousel - Full Space */}
          <motion.div
            className="w-full max-w-7xl mx-auto relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Navigation Arrows - Inside content on mobile, outside on desktop */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-20 px-2 sm:px-0">
              <motion.button
                className={`pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full ${reduceAnimations ? 'bg-white dark:bg-gray-800' : 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm'} border border-neutral/20 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary active:bg-primary active:text-white transition-all shadow-lg sm:-translate-x-4 lg:-translate-x-6`}
                onClick={() =>
                  goToSolution(
                    (currentSolutionIndex - 1 + solutions.length) % solutions.length
                  )
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isRTL ? 'السابق' : 'Previous'}
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isRTL ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                  />
                </svg>
              </motion.button>
              <motion.button
                className={`pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full ${reduceAnimations ? 'bg-white dark:bg-gray-800' : 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm'} border border-neutral/20 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary active:bg-primary active:text-white transition-all shadow-lg sm:translate-x-4 lg:translate-x-6`}
                onClick={() => goToSolution((currentSolutionIndex + 1) % solutions.length)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isRTL ? 'التالي' : 'Next'}
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isRTL ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                  />
                </svg>
              </motion.button>
            </div>

            <div 
              className={`relative ${reduceAnimations ? 'bg-white/90 dark:bg-black/90' : 'bg-white/10 dark:bg-black/20 backdrop-blur-xl'} rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-white/20 dark:border-white/10 overflow-hidden`}
              style={{
                WebkitBackdropFilter: reduceAnimations ? 'none' : undefined, // Disable ONLY on iOS
              }}
            >
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSolutionIndex}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
                  >
                    {/* Icon/Image Side */}
                    <div className="relative flex items-center justify-center order-2 md:order-1">
                      <motion.div
                        className="relative w-full h-40 sm:h-56 md:h-72 lg:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-transparent flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        {solutions[currentSolutionIndex].image ? (
                          // Image support for future
                          <img
                            src={solutions[currentSolutionIndex].image}
                            alt={isRTL ? solutions[currentSolutionIndex].titleAr : solutions[currentSolutionIndex].titleEn}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          // Icon fallback - Optimized for mobile
                          <motion.div
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
                            animate={{
                              rotate: [0, 5, -5, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            {solutions[currentSolutionIndex].icon}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-3 sm:space-y-4 md:space-y-6 flex flex-col justify-center order-1 md:order-2">
                      <motion.h3
                        className={`font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                        style={{
                          color: isDark ? '#E8DCCB' : '#161616',
                          textShadow: isDark
                            ? '0 2px 10px rgba(0,0,0,0.3)'
                            : '0 1px 5px rgba(0,0,0,0.1)',
                        }}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        {isRTL
                          ? solutions[currentSolutionIndex].titleAr
                          : solutions[currentSolutionIndex].titleEn}
                      </motion.h3>
                      <motion.p
                        className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                        style={{
                          color: isDark ? '#E8DCCB' : '#161616',
                        }}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        {isRTL
                          ? solutions[currentSolutionIndex].descriptionAr
                          : solutions[currentSolutionIndex].descriptionEn}
                      </motion.p>
                      <Link href={`/solutions/${solutions[currentSolutionIndex].slug}`}>
                        <motion.div
                          whileHover={{ x: isRTL ? -5 : 5 }}
                          className="flex items-center gap-2 text-primary font-heading font-medium cursor-pointer text-sm sm:text-base md:text-lg lg:text-xl mt-2 sm:mt-4"
                        >
                          <span className={isRTL ? 'font-ibm-plex-arabic' : ''}>
                            {isRTL ? 'اكتشف المزيد' : 'Discover More'}
                          </span>
                          <motion.svg
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ x: [0, isRTL ? -5 : 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={isRTL ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                            />
                          </motion.svg>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Dots - Larger on mobile for better touch targets */}
                <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-4 sm:mt-6 md:mt-8">
                  {solutions.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`relative w-3.5 h-3.5 sm:w-3 sm:h-3 rounded-full transition-all touch-manipulation ${
                        index === currentSolutionIndex
                          ? 'bg-primary'
                          : 'bg-white/40 dark:bg-white/20 active:bg-white/60'
                      }`}
                      onClick={() => goToSolution(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Go to solution ${index + 1}`}
                    >
                      {index === currentSolutionIndex && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary"
                          layoutId="activeDot"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Trusted By Section - Partners Component */}
      <Partners />

    </section>
  );
}
