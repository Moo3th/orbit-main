'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Solution {
  slug: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  heroImage?: string;
  features: {
    en: string;
    ar: string;
    icon: string;
  }[];
  benefits?: {
    en: string[];
    ar: string[];
  };
  useCases?: {
    en: string[];
    ar: string[];
  };
  isActive: boolean;
}

export default function SolutionPageClient({ slug }: { slug: string }) {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const res = await fetch(`/api/solutions/slug/${slug}`);
        const data = await res.json();
        
        if (data.success && data.solution) {
          setSolution(data.solution);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch solution:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-heading text-gray-600 dark:text-gray-400">
            {isRTL ? 'جاري التحميل...' : 'Loading...'}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-2xl font-heading text-gray-600 dark:text-gray-400 mb-4">
            {isRTL ? 'الحل غير موجود' : 'Solution not found'}
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg font-heading hover:bg-primary/90 transition-colors"
          >
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const features = solution.features || [];
  const benefits = solution.benefits?.[isRTL ? 'ar' : 'en'] || [];
  const useCases = solution.useCases?.[isRTL ? 'ar' : 'en'] || [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
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
              {isRTL ? solution.title.ar : solution.title.en}
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl mb-8 max-w-3xl text-white/90"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? solution.description.ar : solution.description.en}
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Link
                href="/request-quote"
                className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all duration-300"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              >
                {isRTL ? 'احصل على عرض سعر' : 'Get a Quote'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="text-3xl sm:text-4xl font-heading mb-12 text-gray-900 dark:text-white"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {isRTL ? 'المميزات' : 'Features'}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-2xl border-2 border-primary/20 hover:border-primary transition-all"
                  >
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                      <span className="text-2xl">{feature.icon || '✓'}</span>
                    </div>
                    <p
                      className="text-lg text-gray-900 dark:text-white"
                      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {isRTL ? feature.ar : feature.en}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {benefits.length > 0 && (
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="text-3xl sm:text-4xl font-heading mb-12 text-gray-900 dark:text-white"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {isRTL ? 'الفوائد' : 'Benefits'}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-2xl">✨</span>
                    </div>
                    <p
                      className="text-lg text-gray-900 dark:text-white"
                      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {benefit}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-heading mb-6 uppercase tracking-tight"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL ? 'هل أنت مستعد للبدء؟' : 'Ready to Get Started?'}
          </motion.h2>
          <motion.p
            className="text-xl mb-8 text-white/90"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL ? 'تواصل معنا اليوم للحصول على حل مخصص لاحتياجاتك' : 'Contact us today to get a customized solution for your needs'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/request-quote"
              className="inline-block px-10 py-4 bg-white text-primary rounded-xl font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all duration-300"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {isRTL ? 'احصل على عرض سعر' : 'Get a Quote'}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

