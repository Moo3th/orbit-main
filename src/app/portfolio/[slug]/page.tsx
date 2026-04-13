'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';
import GoogleDriveMedia from '@/components/GoogleDriveMedia';
import { convertGoogleDriveVideoUrl, isGoogleDriveVideo } from '@/utils/googleDrive';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';

interface Client {
  _id: string;
  name: string;
  logo?: string;
  category: string;
  description?: string;
  blogText?: string;
  workImages?: string[];
  workVideo?: string | string[];
  services?: string[];
  slug?: string;
}

// Category translations
const categoryTranslations: Record<string, { en: string; ar: string }> = {
  'Automotive': { en: 'Automotive', ar: 'السيارات' },
  'Communication': { en: 'Communication', ar: 'الاتصالات' },
  'Corporate': { en: 'Corporate', ar: 'الشركات' },
  'Food & Beverages': { en: 'Food & Beverages', ar: 'الطعام والمشروبات' },
  'Construction & Real Estate': { en: 'Construction & Real Estate', ar: 'البناء والعقارات' },
  'Health': { en: 'Health', ar: 'الصحة' },
  'Governmental': { en: 'Governmental', ar: 'حكومي' },
  'Fashion & Beauty': { en: 'Fashion & Beauty', ar: 'الموضة والجمال' },
  'Home & Furniture': { en: 'Home & Furniture', ar: 'المنزل والأثاث' },
  'Hospitality & Entertainment': { en: 'Hospitality & Entertainment', ar: 'الضيافة والترفيه' },
  'Sports': { en: 'Sports', ar: 'الرياضة' },
};

export default function PortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isRTL } = useLanguage();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBlogExpanded, setIsBlogExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/clients/slug/${params.slug}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then((data) => {
          if (data.client) {
            setClient(data.client);
          } else {
            toast.error(isRTL ? 'العمل غير موجود' : 'Client not found');
            router.push('/portfolio');
          }
        })
        .catch(() => {
          toast.error(isRTL ? 'خطأ في تحميل العمل' : 'Error loading client');
          router.push('/portfolio');
        })
        .finally(() => setLoading(false));
    }
  }, [params.slug, router, isRTL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!client) {
    return null;
  }

  const workImages = client.workImages && client.workImages.length > 0 ? client.workImages : [];
  const allMedia: Array<{ type: 'image' | 'video'; src: string }> = [];
  
  if (client.workVideo) {
    if (Array.isArray(client.workVideo)) {
      client.workVideo.forEach(video => {
        if (video && typeof video === 'string') {
          allMedia.push({ type: 'video', src: video });
        }
      });
    } else if (typeof client.workVideo === 'string') {
      allMedia.push({ type: 'video', src: client.workVideo });
    }
  }
  
  workImages.forEach(img => {
    if (img && typeof img === 'string') {
      allMedia.push({ type: 'image', src: img });
    }
  });
  
  if (allMedia.length === 0 && client.logo && typeof client.logo === 'string') {
    allMedia.push({ type: 'image', src: client.logo });
  }

  const services = client.services && client.services.length > 0
    ? client.services
    : [];

  const nextMedia = () => {
    if (allMedia.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % allMedia.length);
    }
  };

  const previousMedia = () => {
    if (allMedia.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    }
  };
  
  const currentMedia = allMedia.length > 0 ? (allMedia[currentIndex] || allMedia[0]) : null;

  const getCategoryName = (category: string) => {
    const translation = categoryTranslations[category];
    if (!translation) return category;
    return isRTL ? translation.ar : translation.en;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <section className="relative py-24 lg:py-32 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
        <OrbitSectionBackground alignment="both" density="medium" />

        {/* Animated Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl opacity-10 dark:opacity-5"
              style={{
                width: `${300 + i * 150}px`,
                height: `${300 + i * 150}px`,
                background: i % 3 === 0
                  ? 'radial-gradient(circle, rgba(122, 30, 46, 0.4) 0%, transparent 70%)'
                  : i % 3 === 1
                  ? 'radial-gradient(circle, rgba(232, 220, 203, 0.4) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(167, 169, 172, 0.3) 0%, transparent 70%)',
                left: `${10 + i * 30}%`,
                top: `${20 + i * 20}%`,
              }}
              animate={{
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-heading uppercase tracking-wider text-sm"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: isRTL ? 5 : -5 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
              </motion.svg>
              {isRTL ? 'العودة للمحفظة' : 'Back to Portfolio'}
            </Link>
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
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {/* Hero Section with Logo and Title */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
                {/* Logo */}
                {client.logo && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-32 h-32 object-contain"
                      style={{
                        filter: 'brightness(1.1) contrast(1.2)',
                      }}
                    />
                  </motion.div>
                )}

                {/* Title and Category */}
                <div className="flex-1">
                  <motion.h1
                    className="text-4xl sm:text-5xl lg:text-7xl font-heading text-gray-900 dark:text-white mb-4 uppercase tracking-tighter"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {client.name}
                  </motion.h1>
                  
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.4 }}
                    className="h-1.5 w-24 bg-gradient-to-r from-primary via-secondary to-primary rounded-full mb-6"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="inline-block px-6 py-3 bg-primary/10 border-2 border-primary/30 text-primary rounded-full text-sm font-heading uppercase tracking-wider shadow-lg">
                      {getCategoryName(client.category)}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Description */}
              {client.description && (
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ delay: 0.6 }}
                  className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300  leading-relaxed max-w-4xl"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {client.description}
                </motion.p>
              )}
            </motion.div>

            {/* Media Gallery */}
            {allMedia.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ delay: 0.3 }}
                className="mb-16"
              >
                <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200 dark:border-gray-700">
                  {/* Main Media Display */}
                  <div className="relative aspect-video overflow-hidden group bg-black/5">
                    <AnimatePresence mode="wait">
                      {currentMedia && currentMedia.src && typeof currentMedia.src === 'string' ? (
                        currentMedia.type === 'video' ? (
                          isGoogleDriveVideo(currentMedia.src) ? (
                            <motion.iframe
                              key={`drive-video-${currentIndex}`}
                              src={convertGoogleDriveVideoUrl(currentMedia.src)}
                              className="w-full h-full border-0"
                              allow="autoplay; fullscreen"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          ) : (
                            <motion.video
                              key={`video-${currentIndex}`}
                              ref={videoRef}
                              src={currentMedia.src}
                              className="w-full h-full object-cover"
                              controls
                              autoPlay
                              loop
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )
                        ) : (
                          <motion.div
                            key={`image-${currentIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                          >
                            <GoogleDriveMedia
                              src={currentMedia.src}
                              alt={`${client.name} work ${currentIndex + 1}`}
                              className="w-full h-full"
                              type="image"
                              objectFit="contain"
                            />
                          </motion.div>
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <p className="text-gray-400">{isRTL ? 'لا توجد وسائط متاحة' : 'No media available'}</p>
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {allMedia.length > 1 && (
                      <>
                        <button
                          onClick={previousMedia}
                          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-primary hover:bg-primary hover:text-white p-4 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 z-10"
                          aria-label={isRTL ? 'السابق' : 'Previous'}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
                          </svg>
                        </button>
                        <button
                          onClick={nextMedia}
                          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-primary hover:bg-primary hover:text-white p-4 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 z-10"
                          aria-label={isRTL ? 'التالي' : 'Next'}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Media Counter */}
                    {allMedia.length > 1 && (
                      <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl z-10">
                        <span className="text-gray-900 dark:text-white text-sm font-heading font-bold">
                          {currentIndex + 1} / {allMedia.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {allMedia.length > 1 && (
                    <div className="p-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-800 dark:to-transparent">
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20">
                        {allMedia.map((media, idx) => {
                          if (!media || !media.src || typeof media.src !== 'string') return null;
                          
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.pause();
                                }
                                setCurrentIndex(idx);
                              }}
                              className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                                idx === currentIndex
                                  ? 'border-primary shadow-lg shadow-primary/50 scale-110'
                                  : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                              }`}
                            >
                              {media.type === 'video' ? (
                                <>
                                  {isGoogleDriveVideo(media.src) ? (
                                    <iframe
                                      src={convertGoogleDriveVideoUrl(media.src)}
                                      className="w-full h-full border-0 pointer-events-none"
                                      style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                                    />
                                  ) : (
                                    <video
                                      src={media.src}
                                      className="w-full h-full object-cover"
                                      muted
                                      playsInline
                                    />
                                  )}
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </>
                              ) : (
                                <GoogleDriveMedia
                                  src={media.src}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="w-full h-full"
                                  type="image"
                                  objectFit="cover"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Services Section */}
            {services.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ delay: 0.5 }}
                className="mb-16"
              >
                <h3
                  className="text-3xl sm:text-4xl font-heading text-gray-900 dark:text-white mb-8 uppercase tracking-tight"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {isRTL ? 'الخدمات المقدمة' : 'Services Provided'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group relative p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                        <span
                          className="text-gray-900 dark:text-white  text-lg"
                          style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        >
                          {service}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project Details (Blog Text) */}
            {client.blogText && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ delay: 0.7 }}
                className="mb-16"
              >
                <motion.button
                  onClick={() => setIsBlogExpanded(!isBlogExpanded)}
                  className="w-full flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 border-2 border-primary/20 dark:border-primary/30 hover:border-primary/40 transition-all"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <h3
                    className="text-2xl sm:text-3xl font-heading text-gray-900 dark:text-white uppercase tracking-tight"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? 'تفاصيل المشروع' : 'Project Details'}
                  </h3>
                  <motion.div
                    animate={{ rotate: isBlogExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {isBlogExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                        <div 
                          className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: client.blogText }}
                          style={{
                            fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif',
                            direction: isRTL ? 'rtl' : 'ltr',
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <div className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/20 rounded-3xl p-12 lg:p-16 border-2 border-primary/20 dark:border-primary/30 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <h3
                    className="text-3xl sm:text-4xl lg:text-5xl font-heading text-gray-900 dark:text-white mb-6 uppercase tracking-tighter"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? 'جاهز لبدء مشروعك؟' : 'Ready to Start Your Project?'}
                  </h3>
                  <p
                    className="text-xl text-gray-600 dark:text-gray-300 mb-10  max-w-2xl mx-auto"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL 
                      ? 'دعنا نعمل معاً لتحويل رؤيتك إلى واقع ملموس'
                      : 'Let\'s work together to turn your vision into reality'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/request-quote">
                      <motion.button
                        className="px-10 py-5 bg-primary text-white rounded-xl font-heading uppercase tracking-wider shadow-2xl hover:shadow-primary/30 text-lg transition-all duration-300 relative overflow-hidden group"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          {isRTL ? 'اطلب عرض سعر' : 'Request a Quote'}
                          <motion.svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ x: [0, isRTL ? -5 : 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                          </motion.svg>
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary via-[#9a2d45] to-primary"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.button>
                    </Link>
                    <Link href="/portfolio">
                      <motion.button
                        className="px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl font-heading uppercase tracking-wider shadow-lg hover:shadow-xl text-lg transition-all duration-300"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isRTL ? 'عرض المزيد من الأعمال' : 'View More Work'}
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
