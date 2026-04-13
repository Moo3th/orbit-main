'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';
import Link from 'next/link';

interface Offer {
  _id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  packageId?: string;
  discountPercentage?: number;
  originalPrice?: number;
  discountedPrice?: number;
  theme?: 'national-day' | 'founding-day' | 'black-friday' | 'custom';
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  slug: string;
}

interface Package {
  _id: string;
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
}

export default function OffersPage() {
  const { isRTL } = useLanguage();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersRes, packagesRes] = await Promise.all([
          fetch('/api/offers'),
          fetch('/api/packages')
        ]);
        
        const offersData = await offersRes.json();
        const packagesData = await packagesRes.json();
        
        setOffers(offersData.offers || []);
        setPackages(packagesData.packages || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const activeOffers = offers.filter(offer => offer.isActive);
  const hasActiveOffers = activeOffers.length > 0;

  const getThemeStyles = (theme?: string) => {
    switch (theme) {
      case 'national-day':
        return {
          gradient: 'from-green-600 via-white to-green-600',
          accent: 'bg-green-600',
          border: 'border-green-500',
          text: 'text-green-700',
          bgPattern: 'bg-gradient-to-br from-green-50 via-white to-green-50',
          icon: '🇸🇦',
          badge: isRTL ? 'عرض اليوم الوطني' : 'National Day Offer'
        };
      case 'founding-day':
        return {
          gradient: 'from-[#4A5D23] via-[#8B7355] to-[#4A5D23]',
          accent: 'bg-[#4A5D23]',
          border: 'border-[#8B7355]',
          text: 'text-[#4A5D23]',
          bgPattern: 'bg-gradient-to-br from-[#F5E6D3] via-white to-[#E8DCC8]',
          icon: '🏛️',
          badge: isRTL ? 'عرض يوم التأسيس' : 'Founding Day Offer'
        };
      case 'black-friday':
        return {
          gradient: 'from-gray-900 via-gray-700 to-gray-900',
          accent: 'bg-gray-900',
          border: 'border-gray-800',
          text: 'text-gray-900',
          bgPattern: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
          icon: '🔥',
          badge: isRTL ? 'الجمعة البيضاء' : 'Black Friday'
        };
      default:
        return {
          gradient: 'from-primary via-secondary to-primary',
          accent: 'bg-primary',
          border: 'border-primary',
          text: 'text-primary',
          bgPattern: 'bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5',
          icon: '🎁',
          badge: isRTL ? 'عرض خاص' : 'Special Offer'
        };
    }
  };

  const getPackageById = (packageId?: string) => {
    if (!packageId) return null;
    return packages.find(pkg => pkg.id === packageId || pkg._id === packageId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <section className="relative py-24 lg:py-32 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
        <OrbitSectionBackground alignment="both" density="medium" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
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
                },
              },
            }}
            className="text-center mb-20"
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-5xl sm:text-6xl lg:text-8xl font-heading text-gray-900 dark:text-white mb-6 uppercase tracking-tighter"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? 'عروضنا الخاصة' : 'SPECIAL OFFERS'}
            </motion.h1>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                visible: { opacity: 1, scaleX: 1 },
              }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1.5 w-32 bg-gradient-to-r from-primary via-secondary to-primary rounded-full mx-auto mb-8"
            />

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400  max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL 
                ? 'احصل على أفضل العروض والخصومات على باقاتنا المميزة'
                : 'Get the best deals and discounts on our premium packages'
              }
            </motion.p>
          </motion.div>

          {/* Offers Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
              />
            </div>
          ) : hasActiveOffers ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeOffers.map((offer, index) => {
                const theme = getThemeStyles(offer.theme);
                const pkg = getPackageById(offer.packageId);
                const isBlackFriday = offer.theme === 'black-friday';

                return (
                  <motion.div
                    key={offer._id}
                    variants={{
                      hidden: { opacity: 0, y: 50, scale: 0.9 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: {
                          duration: 0.6,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      },
                    }}
                    className="group relative"
                  >
                    <motion.div
                      className={`relative rounded-3xl overflow-hidden border-4 ${theme.border} shadow-2xl ${theme.bgPattern} ${isBlackFriday ? 'text-white' : ''}`}
                      whileHover={{ y: -12, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Decorative Top Banner */}
                      <div className={`h-3 bg-gradient-to-r ${theme.gradient}`} />

                      {/* Discount Badge */}
                      {offer.discountPercentage && (
                        <div className="absolute top-8 -right-12 z-20">
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`${theme.accent} text-white px-16 py-3 transform rotate-45 shadow-2xl`}
                          >
                            <span className="font-heading text-2xl font-bold">
                              {offer.discountPercentage}% {isRTL ? 'خصم' : 'OFF'}
                            </span>
                          </motion.div>
                        </div>
                      )}

                      {/* Theme Icon */}
                      <div className="absolute top-8 left-8 z-10">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-6xl filter drop-shadow-2xl"
                        >
                          {theme.icon}
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="p-8 pt-24">
                        {/* Theme Badge */}
                        <div className="mb-6">
                          <span className={`inline-block px-4 py-2 ${theme.accent} text-white rounded-full text-sm font-heading uppercase tracking-wider shadow-lg`}>
                            {theme.badge}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className={`text-3xl font-heading font-bold mb-4 uppercase tracking-tight ${isBlackFriday ? 'text-white' : 'text-gray-900 dark:text-white'}`}
                          style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        >
                          {isRTL ? offer.titleAr || offer.title : offer.title}
                        </h3>

                        {/* Description */}
                        <p
                          className={`text-lg mb-6 leading-relaxed ${isBlackFriday ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}
                          style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        >
                          {isRTL ? offer.descriptionAr || offer.description : offer.description}
                        </p>

                        {/* Package Info */}
                        {pkg && (
                          <div className={`mb-6 p-6 rounded-2xl ${isBlackFriday ? 'bg-gray-800/50' : 'bg-white/80 dark:bg-gray-800/80'} backdrop-blur-sm border-2 ${theme.border}`}>
                            <h4 className={`font-heading text-xl mb-3 uppercase ${isBlackFriday ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                              {isRTL ? pkg.nameAr : pkg.name}
                            </h4>
                            <ul className="space-y-2">
                              {(isRTL ? pkg.featuresAr : pkg.features).slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className={`${theme.accent} text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    ✓
                                  </span>
                                  <span className={`text-sm ${isBlackFriday ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Pricing */}
                        {offer.originalPrice && (
                          <div className="mb-8">
                            {/* Original Price (Crossed Out) */}
                            <div className="text-center mb-4">
                              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border-2 ${isBlackFriday ? 'border-gray-600 bg-gray-800/50' : 'border-red-200 bg-red-50'}`}>
                                <span className={`text-2xl font-heading font-bold line-through ${isBlackFriday ? 'text-gray-400' : 'text-red-500'}`}>
                                  {offer.originalPrice.toLocaleString()}
                                </span>
                                <img 
                                  src="/trustedby/Saudi_Riyal_Symbol.svg.png" 
                                  alt="SAR" 
                                  className={`w-6 h-6 ${isBlackFriday ? 'opacity-50' : 'opacity-60'}`}
                                />
                              </div>
                            </div>

                            {/* Discounted Price (Main) */}
                            <div className="flex items-center justify-center gap-3 mb-3">
                              <div className={`text-6xl font-heading font-bold ${isBlackFriday ? 'text-white' : theme.text}`}>
                                {offer.discountedPrice?.toLocaleString()}
                              </div>
                              <div className="flex flex-col items-center">
                                <img 
                                  src="/trustedby/Saudi_Riyal_Symbol.svg.png" 
                                  alt="SAR" 
                                  className={`w-10 h-10 ${isBlackFriday ? '' : 'opacity-80'}`}
                                />
                                <span className={`text-sm font-heading font-semibold ${isBlackFriday ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {isRTL ? 'ر.س' : 'SAR'}
                                </span>
                              </div>
                            </div>

                            {/* Savings Banner */}
                            {offer.discountPercentage && (
                              <div className={`text-center p-3 rounded-xl ${isBlackFriday ? 'bg-green-600' : 'bg-green-500'} text-white mb-3`}>
                                <p className="font-heading text-lg font-bold">
                                  💰 {isRTL ? 'وفر' : 'Save'} {(offer.originalPrice - (offer.discountedPrice || 0)).toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
                                </p>
                              </div>
                            )}

                            {/* End Date */}
                            {offer.endDate && (
                              <p className={`text-center text-sm font-heading ${isBlackFriday ? 'text-gray-400' : 'text-gray-500'}`}>
                                ⏰ {isRTL ? 'ينتهي في: ' : 'Ends: '}
                                <strong>{new Date(offer.endDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</strong>
                              </p>
                            )}
                          </div>
                        )}

                        {/* CTA Button */}
                        <Link href={`/request-quote?offer=${offer.slug}`}>
                          <motion.button
                            className={`w-full py-4 ${theme.accent} text-white rounded-xl font-heading uppercase tracking-wider text-lg shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {isRTL ? 'احصل على العرض' : 'Get This Offer'}
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
                              className="absolute inset-0 bg-white/20"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '100%' }}
                              transition={{ duration: 0.5 }}
                            />
                          </motion.button>
                        </Link>
                      </div>

                      {/* Decorative Bottom Banner */}
                      <div className={`h-3 bg-gradient-to-r ${theme.gradient}`} />
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/20 rounded-3xl p-16 border-2 border-primary/20 dark:border-primary/30 overflow-hidden max-w-3xl mx-auto">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="text-8xl mb-6">📞</div>
                  <h3
                    className="text-4xl sm:text-5xl font-heading text-gray-900 dark:text-white mb-6 uppercase tracking-tight"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? 'تواصل مع فريق المبيعات' : 'Contact Our Sales Team'}
                  </h3>
                  <p
                    className="text-xl text-gray-600 dark:text-gray-300 mb-10  max-w-2xl mx-auto leading-relaxed"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL 
                      ? 'لا توجد عروض نشطة حالياً. تواصل معنا للحصول على أفضل الأسعار والعروض الخاصة'
                      : 'No active offers at the moment. Contact us for the best prices and special deals'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <motion.button
                        className="px-10 py-5 bg-primary text-white rounded-xl font-heading uppercase tracking-wider shadow-2xl hover:shadow-primary/30 text-lg transition-all relative overflow-hidden group"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10">
                          {isRTL ? 'تواصل معنا' : 'Contact Us'}
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary via-[#9a2d45] to-primary"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.button>
                    </Link>
                    <Link href="/packages">
                      <motion.button
                        className="px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary rounded-xl font-heading uppercase tracking-wider shadow-lg hover:shadow-xl text-lg transition-all"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isRTL ? 'عرض الباقات' : 'View Packages'}
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
