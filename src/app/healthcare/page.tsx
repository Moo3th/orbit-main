'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';

export default function HealthcarePage() {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const content = {
    title: {
      en: 'Healthcare Solutions',
      ar: 'تحسين تجربة المرضى عبر تواصل ذكي وفعّال',
    },
    description: {
      en: 'Our solutions help healthcare facilities reduce missed appointments, improve patient communication, and enhance service quality through smart messages and notifications.',
      ar: 'حلولنا تساعد المنشآت الصحية على تقليل المواعيد الفائتة، تحسين التواصل مع المرضى، ورفع جودة الخدمة من خلال رسائل وتنبيهات ذكية.',
    },
    challenges: {
      title: {
        en: 'Challenges',
        ar: 'التحديات',
      },
      items: [
        {
          en: 'Missed appointments',
          ar: 'نسيان المواعيد',
        },
        {
          en: 'Pressure on reception teams',
          ar: 'ضغط على فرق الاستقبال',
        },
        {
          en: 'Weak communication with patients',
          ar: 'ضعف التواصل مع المرضى',
        },
      ],
    },
    solutions: {
      title: {
        en: 'Our Solutions for Healthcare',
        ar: 'حلولنا للقطاع الصحي',
      },
      items: [
        {
          en: 'Appointment reminder messages (SMS)',
          ar: 'رسائل تذكير بالمواعيد (SMS)',
        },
        {
          en: 'WhatsApp Business for patient communication',
          ar: 'واتساب أعمال للتواصل مع المرضى',
        },
        {
          en: 'Real-time delivery status reports',
          ar: 'تقارير فورية عن حالة الإرسال',
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
          en: 'Reduced missed appointments',
          ar: 'تقليل الغياب عن المواعيد',
        },
        {
          en: 'Better patient experience',
          ar: 'تجربة أفضل للمريض',
        },
        {
          en: 'Faster and clearer communication',
          ar: 'تواصل أسرع وأوضح',
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white overflow-hidden">
        <OrbitSectionBackground alignment="both" density="medium" />
        
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
              className="text-xl sm:text-2xl mb-8 max-w-3xl  text-white/90"
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
                href="/request-quote?source=healthcare&serviceType=sms-platform"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-xl font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 overflow-hidden"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: -5, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </motion.svg>
                  {isRTL ? 'احصل على عرض سعر' : 'Get a Quote'}
                  <motion.svg
                    className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    whileHover={{ x: isRTL ? -5 : 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
                  </motion.svg>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
              <Link
                href="/request-quote?source=healthcare&serviceType=whatsapp-business-api"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white/80 text-white rounded-xl font-heading uppercase tracking-wider hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              >
                <span className="flex items-center gap-3">
                  {isRTL ? 'تواصل معنا' : 'Contact Us'}
                  <motion.svg
                    className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    whileHover={{ x: isRTL ? -5 : 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
                  </motion.svg>
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
                      className="text-lg sm:text-xl  text-gray-900 dark:text-white"
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
            className="text-3xl sm:text-4xl lg:text-5xl font-heading mb-6 uppercase tracking-tight"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL ? 'احصل على عرض سعر مخصص' : 'Get a Custom Quote'}
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl mb-8  text-white/90 max-w-2xl mx-auto"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL 
              ? 'تواصل معنا اليوم واحصل على حل مخصص لتحسين تجربة مرضاك' 
              : 'Contact us today and get a custom solution to improve your patient experience'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/request-quote?source=healthcare&serviceType=sms-platform"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-primary rounded-xl font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 overflow-hidden"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </motion.svg>
                {isRTL ? 'احصل على عرض سعر' : 'Get a Quote'}
                <motion.svg
                  className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: isRTL ? -5 : 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
                </motion.svg>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </Link>
            <Link
              href="/request-quote?source=healthcare&serviceType=whatsapp-business-api"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-white/80 text-white rounded-xl font-heading uppercase tracking-wider hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              <span className="flex items-center gap-3">
                {isRTL ? 'تواصل مع المبيعات' : 'Contact Sales'}
                <motion.svg
                  className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: isRTL ? -5 : 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
                </motion.svg>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
