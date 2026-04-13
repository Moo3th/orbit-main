'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { shouldReduceAnimations, isIOS } from '@/utils/deviceDetection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';
import GoogleDriveMedia from '@/components/GoogleDriveMedia';
import { convertGoogleDriveVideoUrl, isGoogleDriveVideo } from '@/utils/googleDrive';

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

const serviceCategories = [
  'Brand Architecture', 'Rebranding', 'Brand Guidelines', 'Social Media Guidelines',
  'Company Profile', 'Pre-qualification Document', 'Web Development', 'Social Media Management',
  'Community Management', 'Landscape Videography', 'Landscape Photography', 'Cinematic Videos',
  'Short Videos', 'Photography', 'Videography', 'Product Profile', 'Menu Design',
  'Event Production', 'Event Management', 'Branding', 'Operations Manual', 'Service Profile',
  'Templates & Documents', 'Campaign Management', 'UI/UX Design', 'Print Media Design',
  'Digital Media Design', 'WhatsApp API', 'Tutorial Videos', 'Catalog Design',
  'Organizational Structuring', 'Employee Handbook', 'Orientation Videos',
];

const industryCategories = [
  'Construction & Contracting', 'FMCG', 'Holding Company', 'F&B', 'Human Resources & Staffing',
  'Beauty & Lifestyle', 'Home & Furniture', 'Healthcare & Medical', 'Beauty & Wellness',
  'Construction', 'Real Estate', 'Hospitality', 'Information Technology',
  'Fragrance & Personal Care', 'Automotive', 'Health & Fitness', 'Packaging & Containers',
  'Events & Exhibitions', 'Petrochemicals', 'Entertainment', 'Education', 'Logistics',
  'Legal Services', 'Gold & Jewelry', 'Building Material', 'Business Services',
  'Home & Lifestyle', 'Tourism',
];

export default function PortfolioPage() {
  const { isRTL } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const isIOSCheck = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // CRITICAL: Force optimization on iOS to prevent crashes
    setReduceAnimations(isIOSCheck || shouldReduceAnimations());
    setIsIOSDevice(isIOSCheck);
  }, []);

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => {
        // Add AMMARI work entry with files from public/work folder
        const ammariWork: Client = {
          _id: 'ammari-work-' + Date.now(),
          name: 'AMMARI',
          logo: '/work/AMMARI-LOGO.jpg',
          category: 'Corporate',
          description: 'Complete branding and visual identity solution for AMMARI.',
          workImages: [
            '/work/AMMARI-work1.jpg',
            '/work/AMMARI-work2.jpg',
          ],
          workVideo: '/work/vdieo.mp4',
          services: ['Branding & Identity', 'Logo Design', 'Visual Identity', 'Brand Guidelines'],
        };
        
        // Add AMMARI work at the beginning of clients array
        const allClients = [ammariWork, ...(data.clients || [])];
        setClients(allClients);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching clients:', err);
        setLoading(false);
      });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Skip mouse tracking on iOS for performance
    if (isIOSDevice || reduceAnimations || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // Multiply clients for seamless infinite loop - shuffle to make each card unique
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Multiply clients for seamless infinite loop - create many copies for continuous scrolling illusion
  // Use at least 10-15 copies to ensure the page never looks empty
  const multipliedClients = clients.length > 0 
    ? [
        ...clients,
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
        ...shuffleArray(clients),
      ] 
    : [];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden" dir="ltr" style={{ width: '100%', maxWidth: '100vw' }}>
      <Navbar />

      {/* Header */}
      <div className="relative pt-24 pb-4 sm:pb-8 px-4 z-20" style={{ direction: 'ltr' }}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-white mb-4 sm:mb-6 uppercase tracking-tight"
            style={{ 
              fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined,
              direction: isRTL ? 'rtl' : 'ltr',
            }}
          >
            {isRTL ? 'محفظة الأعمال' : 'Work Portfolio'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg hidden sm:block"
            style={{ 
              fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined,
              direction: isRTL ? 'rtl' : 'ltr',
            }}
          >
            {isRTL ? 'حرك الماوس للتحكم في السرعة • انقر لعرض التفاصيل' : 'Move mouse to control speed • Click to view details'}
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowFilters(!showFilters)}
            className="relative group z-20"
          >
            <div className="px-6 sm:px-8 py-2 sm:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-all">
              <span 
                className="text-white font-heading uppercase tracking-wider text-xs sm:text-sm"
                style={{ 
                  fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined,
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              >
                {showFilters ? (isRTL ? 'إغلاق' : 'Close') : (isRTL ? 'فلتر' : 'Filter')}
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto"
          >
            <div className="min-h-screen px-4 py-24">
              <div className="max-w-6xl mx-auto">
                <button
                  onClick={() => setShowFilters(false)}
                  className="absolute top-6 sm:top-8 right-6 sm:right-8 text-white hover:text-primary transition-colors"
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-heading text-white mb-4 sm:mb-6 uppercase">Services</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {serviceCategories.map((service) => (
                      <button
                        key={service}
                        className="text-left px-3 sm:px-4 py-2 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-lg text-white/80 hover:text-white transition-all text-xs sm:text-sm"
                      >
                        • {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-heading text-white mb-4 sm:mb-6 uppercase">Industry</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {industryCategories.map((industry) => (
                      <button
                        key={industry}
                        className="text-left px-3 sm:px-4 py-2 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-lg text-white/80 hover:text-white transition-all text-xs sm:text-sm"
                      >
                        • {industry}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Detail Modal with Gallery */}
      <AnimatePresence>
        {selectedClient && <ClientGalleryModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
      </AnimatePresence>

      {/* Infinite Scrolling Portfolio */}
      {loading ? (
        <div className="flex items-center justify-center h-[50vh] sm:h-[70vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative py-8 sm:py-12"
          style={{ 
            minHeight: 'calc(100vh - 150px)',
            paddingBottom: '300px',
            width: '100%',
            maxWidth: '100vw',
          }}
        >
          {/* 6 Rows of Infinite Scrolling Cards */}
          {[0, 1, 2, 3, 4, 5].map((rowIndex) => (
            <InfiniteScrollRow
              key={rowIndex}
              clients={multipliedClients}
              rowIndex={rowIndex}
              totalRows={6}
              mouseX={mouseX}
              mouseY={mouseY}
              onClientClick={setSelectedClient}
              reduceAnimations={reduceAnimations}
            />
          ))}

          {/* Edge Gradients - Sides only, no bottom shadow - Fixed positions regardless of RTL */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none z-20" style={{ direction: 'ltr' }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none z-20" style={{ direction: 'ltr' }} />
        </div>
      )}

      {/* Bottom CTA - Separated section below portfolio, no overlap */}
      <div className="relative px-4 py-16 sm:py-24 bg-black" style={{ direction: 'ltr' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8"
          >
            <h3 
              className="text-2xl sm:text-3xl font-heading text-white mb-3 sm:mb-4 uppercase"
              style={{ 
                fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined,
                direction: isRTL ? 'rtl' : 'ltr',
              }}
            >
              {isRTL ? 'انضم إلى فريقنا' : 'Join Our Team'}
            </h3>
            <p 
              className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base"
              style={{ 
                fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined,
                direction: isRTL ? 'rtl' : 'ltr',
              }}
            >
              {isRTL ? 'كن جزءًا من قصة نجاحنا' : 'Be part of our success story'}
            </p>
            <Link href="/join-team">
              <motion.button
                className="px-8 sm:px-10 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-white font-heading uppercase tracking-wider rounded-lg shadow-xl transition-all text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined,
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              >
                {isRTL ? 'انضم الآن' : 'Join Now'} →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Client Gallery Modal Component
function ClientGalleryModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const { isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBlogExpanded, setIsBlogExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Combine images and video into a single media array
  const workImages = client.workImages && client.workImages.length > 0 
    ? client.workImages 
    : [];
  
  const allMedia: Array<{ type: 'image' | 'video'; src: string }> = [];
  
  // Add videos first if they exist (support both array and single string for backward compatibility)
  if (client.workVideo) {
    if (Array.isArray(client.workVideo)) {
      client.workVideo.forEach(video => {
        if (video) allMedia.push({ type: 'video', src: video });
      });
    } else {
      allMedia.push({ type: 'video', src: client.workVideo });
    }
  }
  
  // Add images
  workImages.forEach(img => {
    allMedia.push({ type: 'image', src: img });
  });
  
  // Fallback to sample images if no media
  if (allMedia.length === 0) {
    allMedia.push(
      { type: 'image', src: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=600&fit=crop' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=800&h=600&fit=crop' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1635776063043-ab23b4c226ea?w=800&h=600&fit=crop' },
    );
  }

  const services = client.services && client.services.length > 0
    ? client.services
    : ['Branding & Identity', 'Marketing Strategy', 'Content Production', 'Digital Marketing'];

  const nextMedia = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setCurrentIndex((prev) => (prev + 1) % allMedia.length);
  };

  const previousMedia = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };
  
  const currentMedia = allMedia[currentIndex];
  
  // Convert Google Drive video URLs to playable format
  const getVideoUrl = (src: string) => {
    if (isGoogleDriveVideo(src)) {
      return convertGoogleDriveVideoUrl(src);
    }
    return src;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl sm:rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white/60 hover:text-white transition-colors z-50 bg-black/50 backdrop-blur-sm rounded-full p-2"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Media Gallery */}
        <div className="relative bg-black/40 rounded-t-2xl sm:rounded-t-3xl overflow-hidden">
          {/* Main Media Display */}
          <div className="relative aspect-video sm:aspect-[16/9] overflow-hidden group">
            <AnimatePresence mode="wait">
              {currentMedia && currentMedia.type === 'video' ? (
                isGoogleDriveVideo(currentMedia.src) ? (
                  <motion.iframe
                    key={`drive-video-${currentIndex}`}
                    src={getVideoUrl(currentMedia.src)}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
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
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  />
                )
              ) : (
                <motion.div
                  key={`image-${currentIndex}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
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
              )}
            </AnimatePresence>

            {/* Navigation Arrows */}
            {allMedia.length > 1 && (
              <>
                <button
                  onClick={previousMedia}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Media Counter */}
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/70 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full z-10">
              <span className="text-white text-xs sm:text-sm font-bold">
                {currentIndex + 1} / {allMedia.length}
                {currentMedia?.type === 'video' && (
                  <span className="ml-2 text-primary">● VIDEO</span>
                )}
              </span>
            </div>

            {/* Client Logo Overlay */}
            {client.logo && (
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/98 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-2xl border border-white/50 z-20">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain drop-shadow-lg"
                  style={{
                    filter: 'brightness(1.05) contrast(1.15)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allMedia.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 sm:p-4 z-10">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                {allMedia.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.pause();
                      }
                      setCurrentIndex(idx);
                    }}
                    className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentIndex
                        ? 'border-primary shadow-lg shadow-primary/50 scale-110'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <>
                        {isGoogleDriveVideo(media.src) ? (
                          <iframe
                            src={getVideoUrl(media.src)}
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
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Client Details */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-white uppercase tracking-tight mb-2 sm:mb-3">
              {client.name}
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-primary/20 border border-primary/40 rounded-full text-primary font-bold text-xs sm:text-sm uppercase">
                {client.category}
              </span>
            </div>
          </div>

          {/* Description */}
          {client.description && (
            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                {client.description}
              </p>
            </div>
          )}

          {/* Services */}
          <div className="pt-3 sm:pt-4 border-t border-white/10">
            <h3 className="text-base sm:text-lg font-heading text-white mb-3 sm:mb-4 uppercase">
              {isRTL ? 'الخدمات المقدمة' : 'Services Provided'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 text-xs sm:text-sm transition-all flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Blog Text Section */}
          {client.blogText && (
            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <motion.button
                onClick={() => setIsBlogExpanded(!isBlogExpanded)}
                className="w-full flex items-center justify-between text-left"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <h3 className="text-base sm:text-lg font-heading text-white uppercase">
                  {isRTL ? 'تفاصيل المشروع' : 'Project Details'}
                </h3>
                <motion.div
                  animate={{ rotate: isBlogExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/60"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="pt-4 pb-2 max-h-[60vh] overflow-y-auto">
                      <div 
                        className="prose prose-invert prose-sm sm:prose-base max-w-none text-white/80"
                        dangerouslySetInnerHTML={{ __html: client.blogText }}
                        style={{
                          '--tw-prose-body': '#e5e7eb',
                          '--tw-prose-headings': '#ffffff',
                          '--tw-prose-links': '#3b82f6',
                          '--tw-prose-bold': '#ffffff',
                          '--tw-prose-code': '#e5e7eb',
                          '--tw-prose-pre-code': '#e5e7eb',
                          '--tw-prose-pre-bg': '#1f2937',
                          '--tw-prose-th-borders': '#374151',
                          '--tw-prose-td-borders': '#374151',
                        } as React.CSSProperties}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Share Button */}
          {(client.slug || client._id) && (
            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <div className="space-y-2">
                <motion.button
                  onClick={async () => {
                    try {
                      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                      const shareUrl = client.slug 
                        ? `${baseUrl}/portfolio/${client.slug}`
                        : `${baseUrl}/portfolio?client=${client._id}`;
                      
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(shareUrl);
                        toast.success(isRTL ? 'تم نسخ الرابط' : 'Link copied to clipboard!');
                      } else {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = shareUrl;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        toast.success(isRTL ? 'تم نسخ الرابط' : 'Link copied!');
                      }
                    } catch (error) {
                      toast.error(isRTL ? 'خطأ في النسخ' : 'Failed to copy link');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-sm font-semibold">{isRTL ? 'مشاركة الرابط' : 'Copy Share Link'}</span>
                </motion.button>
                <div className="text-center">
                  <p className="text-xs text-white/50 break-all px-2">
                    {typeof window !== 'undefined' 
                      ? (client.slug 
                          ? `${window.location.origin}/portfolio/${client.slug}`
                          : `${window.location.origin}/portfolio?client=${client._id}`)
                      : (client.slug ? `/portfolio/${client.slug}` : `/portfolio?client=${client._id}`)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <Link href="/request-quote" className="flex-1">
              <motion.button
                className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-white font-heading uppercase tracking-wider rounded-lg shadow-xl transition-all text-xs sm:text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRTL ? 'ابدأ مشروعك' : 'Start Your Project'} →
              </motion.button>
            </Link>
            <motion.button
              onClick={onClose}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-heading uppercase tracking-wider rounded-lg transition-all text-xs sm:text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRTL ? 'إغلاق' : 'Close'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Infinite Scrolling Row Component
function InfiniteScrollRow({
  clients,
  rowIndex,
  totalRows,
  mouseX,
  mouseY,
  onClientClick,
  reduceAnimations = false,
}: {
  clients: Client[];
  rowIndex: number;
  totalRows: number;
  mouseX: any;
  mouseY: any;
  onClientClick: (client: Client) => void;
  reduceAnimations?: boolean;
}) {
  const [offset, setOffset] = useState<number>(0);
  const rafRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    if (clients.length === 0) return;
    
    // CRITICAL: Reduce FPS more aggressively on iOS to prevent crashes
    const isIOSDevice = typeof navigator !== 'undefined' && 
                        (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
                        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    
    let lastTime = performance.now();
    
    // Calculate card width and gap for seamless looping
    const cardWidth = 256; // w-64 = 256px (lg breakpoint)
    const cardGap = 32; // gap-8 = 32px (lg breakpoint)
    const singleCardWidth = cardWidth + cardGap;
    const totalCardsWidth = clients.length * singleCardWidth;
    
    // Reduce speed and complexity on iOS - even more aggressive
    const minBaseSpeed = isIOSDevice ? 10 : (reduceAnimations ? 15 : 20);
    const targetFPS = isIOSDevice ? 20 : (reduceAnimations ? 30 : 60);
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      // Throttle frame rate on mobile
      if (reduceAnimations && currentTime - lastFrameTimeRef.current < frameInterval) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime;

      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Simplified speed calculation for reduced animations
      if (reduceAnimations) {
        // No mouse interaction, just constant speed
        const baseSpeed = minBaseSpeed + rowIndex * 5;
        const direction = rowIndex % 2 === 0 ? 1 : -1;
        const finalSpeed = baseSpeed * direction;

        setOffset((prev) => {
          let newOffset = prev + finalSpeed * deltaTime;
          
          const multiplierFactor = 15;
          const segmentWidth = totalCardsWidth / multiplierFactor;
          const resetPoint = segmentWidth > 0 ? segmentWidth : totalCardsWidth;
          
          if (direction > 0 && newOffset >= resetPoint) {
            newOffset = newOffset - resetPoint;
          } else if (direction < 0 && newOffset <= -resetPoint) {
            newOffset = newOffset + resetPoint;
          }
          
          return newOffset;
        });
      } else {
        // Full animation with mouse interaction
        const mx = mouseX.get();
        const my = mouseY.get();

        const baseSpeed = Math.max(minBaseSpeed, 30 + rowIndex * 10);
        const direction = rowIndex % 2 === 0 ? 1 : -1;
        const mouseSpeedInfluence = (mx - 0.5) * 100;
        const rowYPosition = rowIndex / totalRows;
        const distanceFromMouse = Math.abs(my - rowYPosition);
        const proximityBoost = (1 - Math.min(distanceFromMouse * 2, 1)) * 50;
        const finalSpeed = Math.max(10, (baseSpeed + mouseSpeedInfluence + proximityBoost)) * direction;

        setOffset((prev) => {
          let newOffset = prev + finalSpeed * deltaTime;
          
          const multiplierFactor = 15;
          const segmentWidth = totalCardsWidth / multiplierFactor;
          const resetPoint = segmentWidth > 0 ? segmentWidth : totalCardsWidth;
          
          if (direction > 0 && newOffset >= resetPoint) {
            newOffset = newOffset - resetPoint;
          } else if (direction < 0 && newOffset <= -resetPoint) {
            newOffset = newOffset + resetPoint;
          }
          
          return newOffset;
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [rowIndex, totalRows, mouseX, mouseY, clients.length, reduceAnimations]);

  // Calculate top position ensuring all 6 rows are fully visible
  // Distribute rows evenly within 70% of container height, leaving 30% room at bottom
  // Cards are lg:h-40 (160px), so we need extra space to prevent clipping
  // Row 0 at 0%, Row 5 at 70% ensures last row with card height stays fully visible
  const topPosition = rowIndex === 0 ? 0 : (rowIndex / (totalRows - 1)) * 70;

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 whitespace-nowrap"
      style={{
        top: `${topPosition}%`,
        transform: `translateX(${offset}px)`,
        willChange: reduceAnimations ? 'auto' : 'transform',
        overflow: 'visible',
        contain: 'layout style paint',
        minWidth: 'max-content',
      }}
    >
      <div className="inline-flex gap-4 sm:gap-6 lg:gap-8 items-center">
        {/* Render cards multiple times for seamless looping - use the multiplied clients array */}
        {clients.map((client, idx) => (
          <motion.div
            key={`${client._id}-${rowIndex}-${idx}`}
            className="inline-block group cursor-pointer"
            whileHover={{ scale: 1.1, zIndex: 50 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => onClientClick(client)}
          >
            <div className="w-48 h-32 sm:w-56 sm:h-36 lg:w-64 lg:h-40 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-300 group-hover:border-primary/60 group-hover:bg-white/15 group-hover:shadow-2xl group-hover:shadow-primary/30">
              {/* Client Logo with Enhanced Visibility */}
              {client.logo ? (
                <div className="relative flex-1 flex items-center justify-center w-full p-2">
                  {/* Logo Background for Better Contrast */}
                  <div className="absolute inset-0 bg-black/20 rounded-lg blur-sm group-hover:bg-black/30 transition-all duration-300" />
                  <div className="relative z-10 flex items-center justify-center w-full h-full">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-w-[85%] max-h-[85%] object-contain transition-all duration-300 drop-shadow-2xl"
                      draggable={false}
                      style={{
                        filter: 'brightness(1.3) contrast(1.4) saturate(1.2)',
                        opacity: 1,
                        WebkitFilter: 'brightness(1.3) contrast(1.4) saturate(1.2)',
                      }}
                    />
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                  <h3 className="text-sm sm:text-base lg:text-lg font-heading text-white/80 group-hover:text-white uppercase transition-colors leading-tight">
                    {client.name}
                  </h3>
                </div>
              )}

              {/* Service Tags (Like Al-Graphy) */}
              <div className="mt-2 sm:mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide">
                  Business Services / Marketing
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/80 backdrop-blur-sm border border-primary/30 rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-primary uppercase">
                  {client.category}
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl sm:rounded-2xl" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
