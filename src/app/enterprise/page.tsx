'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import OrbitAnimatedBackground from '@/components/OrbitAnimatedBackground';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';

export default function EnterprisePage() {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const content = {
    title: {
      en: 'Business & Enterprise Solutions',
      ar: 'حلول اتصالات وموارد بشرية تدعم نمو أعمالك',
    },
    description: {
      en: 'We help companies and organizations improve internal and external communication, efficiently manage employees, and enhance customer experience from a single platform.',
      ar: 'نساعد الشركات والمؤسسات على تحسين التواصل الداخلي والخارجي، إدارة الموظفين بكفاءة، وتعزيز تجربة العملاء من منصة واحدة.',
    },
    challenges: {
      title: {
        en: 'Challenges',
        ar: 'التحديات',
      },
      items: [
        {
          en: 'Weak internal communication',
          ar: 'ضعف التواصل الداخلي',
        },
        {
          en: 'Multiple systems',
          ar: 'تعدد الأنظمة',
        },
        {
          en: 'Difficulty in tracking and reporting',
          ar: 'صعوبة المتابعة والتقارير',
        },
      ],
    },
    solutions: {
      title: {
        en: 'Our Solutions for Businesses',
        ar: 'حلولنا للشركات',
      },
      items: [
        {
          en: 'SMS Messaging Platform',
          ar: 'منصة الرسائل النصية',
        },
        {
          en: 'WhatsApp Business API',
          ar: 'واتساب أعمال API',
        },
        {
          en: 'OTime HR Management System',
          ar: 'نظام OTime لإدارة الموارد البشرية',
        },
      ],
    },
    benefits: {
      title: {
        en: 'Benefits',
        ar: 'الفوائد',
      },
      items: [
        {
          en: 'Higher operational efficiency',
          ar: 'كفاءة تشغيلية أعلى',
        },
        {
          en: 'Clear reports and analytics',
          ar: 'تقارير وتحليلات واضحة',
        },
        {
          en: 'Scalable solutions',
          ar: 'حلول قابلة للتوسع',
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white overflow-hidden">
        <OrbitAnimatedBackground opacity={0.25} speed={0.6} size="large" color="rgba(255, 255, 255, 0.25)" />
        
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
              animate={{
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-heading mb-6 uppercase tracking-tight"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? content.title.ar : content.title.en}
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl mb-8 max-w-3xl  text-white/90 leading-relaxed"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? content.description.ar : content.description.en}
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/request-quote?source=enterprise&serviceType=sms-platform"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-xl font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 overflow-hidden"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {isRTL ? 'ابدأ الآن' : 'Get Started Now'}
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/request-quote?source=enterprise&serviceType=whatsapp-business-api"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-heading uppercase tracking-wider hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              >
                <span className="flex items-center gap-3">
                  {isRTL ? 'تواصل مع المبيعات' : 'Contact Sales'}
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="relative py-24 bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <OrbitSectionBackground alignment="both" density="low" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-heading mb-16 text-gray-900 dark:text-white text-center uppercase tracking-tight"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? content.challenges.title.ar : content.challenges.title.en}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.challenges.items.map((challenge, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-8 lg:p-10 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-primary dark:hover:border-primary transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/20 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-8 h-8 bg-primary rounded-lg" />
                    </div>
                    
                    <h3
                      className="text-xl sm:text-2xl font-heading mb-4 text-gray-900 dark:text-white"
                      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {isRTL ? challenge.ar : challenge.en}
                    </h3>
                    
                    <motion.div
                      className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: 64 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    />
                  </div>
                  
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="relative py-24 bg-white dark:bg-gray-900 overflow-hidden">
        <OrbitSectionBackground alignment="center" density="medium" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-heading mb-16 text-gray-900 dark:text-white text-center uppercase tracking-tight"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? content.solutions.title.ar : content.solutions.title.en}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.solutions.items.map((solution, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 dark:from-primary/20 dark:via-secondary/10 dark:to-primary/20 backdrop-blur-xl border-2 border-primary/20 dark:border-primary/30 hover:border-primary dark:hover:border-primary transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/20 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <div className="w-8 h-8 bg-white rounded-lg" />
                    </div>
                    
                    <h3
                      className="text-xl sm:text-2xl font-heading mb-4 text-gray-900 dark:text-white"
                      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {isRTL ? solution.ar : solution.en}
                    </h3>
                    
                    <motion.div
                      className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: 64 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    />
                  </div>
                  
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <OrbitSectionBackground alignment="both" density="low" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-heading mb-16 text-gray-900 dark:text-white text-center uppercase tracking-tight"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? content.benefits.title.ar : content.benefits.title.en}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.benefits.items.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-8 lg:p-10 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-primary dark:hover:border-primary transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/20 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <motion.svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </div>
                    
                    <p
                      className="text-lg sm:text-xl  text-gray-900 dark:text-white leading-relaxed"
                      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {isRTL ? benefit.ar : benefit.en}
                    </p>
                    
                    <motion.div
                      className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full mt-6"
                      initial={{ width: 0 }}
                      whileInView={{ width: 64 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    />
                  </div>
                  
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white overflow-hidden">
        <OrbitSectionBackground alignment="center" density="low" />
        
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-2xl opacity-20"
              style={{
                width: `${250 + i * 200}px`,
                height: `${250 + i * 200}px`,
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.15, 0.3, 0.15],
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
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading mb-8 uppercase tracking-tight"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL ? 'ابدأ الآن' : 'Get Started Now'}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/request-quote?source=enterprise&serviceType=sms-platform"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-primary rounded-xl font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 overflow-hidden"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {isRTL ? 'ابدأ الآن' : 'Get Started Now'}
                <svg
                  className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/request-quote?source=enterprise&serviceType=whatsapp-business-api"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-heading uppercase tracking-wider hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              <span className="flex items-center gap-3">
                {isRTL ? 'تواصل مع المبيعات' : 'Contact Sales'}
                <svg
                  className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
