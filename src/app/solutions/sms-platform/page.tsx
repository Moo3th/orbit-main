'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';

export default function SMSPlatformPage() {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const content = {
    title: {
      en: 'SMS Platform',
      ar: 'الرسائل النصية',
    },
    description: {
      en: 'An intelligent messaging platform that ensures your messages reach the right time with the highest delivery rate, full campaign control, precise performance tracking, and seamless integration with your internal systems.',
      ar: 'منصة رسائل ذكية تضمن وصول رسائلك في الوقت المناسب وبأعلى نسبة تسليم، مع تحكم كامل بالحملات، تتبع دقيق للأداء، وإمكانية ربط مباشرة مع أنظمتك الداخلية بكل سهولة',
    },
    features: [
      {
        en: 'Instant alerts and notifications',
        ar: 'تنبيهات وإشعارات فورية',
        icon: '⚡',
      },
      {
        en: 'Targeted marketing campaigns',
        ar: 'حملات تسويقية موجهة',
        icon: '🎯',
      },
      {
        en: 'OTP verification and transaction confirmations',
        ar: 'رسائل تحقق وتأكيد العمليات OTP',
        icon: '🔐',
      },
    ],
    benefits: [
      {
        en: 'High delivery rate',
        ar: 'نسبة تسليم عالية',
      },
      {
        en: 'Full campaign control',
        ar: 'تحكم كامل بالحملات',
      },
      {
        en: 'Precise performance tracking',
        ar: 'تتبع دقيق للأداء',
      },
      {
        en: 'Seamless system integration',
        ar: 'تكامل سلس مع الأنظمة',
      },
    ],
  };

  // Format number with commas
  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString('en-US');
  };

  const smsPackages = [
    {
      messages: '1,000',
      price: '110',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '3,000',
      price: '311',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '5,000',
      price: '489',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '10,000',
      price: '863',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '20,000',
      price: '1,610',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '50,000',
      price: '3,738',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '100,000',
      price: '6,900',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
        isRTL ? 'مستشار فني' : 'Technical Consultant',
      ],
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white overflow-hidden">
        <OrbitSectionBackground alignment="both" density="medium" />
        <div className="absolute inset-0 opacity-10">
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
            >
              <Link
                href="/packages"
                className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all duration-300"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              >
                {isRTL ? 'عرض الباقات' : 'View Packages'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <OrbitSectionBackground alignment="left" density="low" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              className="text-3xl sm:text-4xl font-heading mb-12 text-gray-900 dark:text-white text-center"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? 'المميزات' : 'Features'}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 rounded-2xl border-2 border-primary/20 hover:border-primary transition-all"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3
                    className="text-xl font-heading mb-4 text-gray-900 dark:text-white"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? feature.ar : feature.en}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        <OrbitSectionBackground alignment="right" density="low" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              className="text-3xl sm:text-4xl font-heading mb-12 text-gray-900 dark:text-white text-center"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? 'الفوائد' : 'Benefits'}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <p
                    className="text-lg  text-gray-900 dark:text-white"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? benefit.ar : benefit.en}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <OrbitSectionBackground alignment="both" density="low" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl sm:text-5xl font-heading mb-4 text-gray-900 dark:text-white uppercase tracking-tight"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {isRTL ? 'باقات الرسائل النصية' : 'SMS Packages'}
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-4" />
              <p
                className="text-lg text-gray-600 dark:text-gray-400  max-w-2xl mx-auto"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {isRTL ? 'اختر الباقة المناسبة لاحتياجاتك' : 'Choose the package that fits your needs'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {smsPackages.map((pkg, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className={`relative group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    pkg.highlighted
                      ? 'border-primary shadow-xl scale-105 ring-4 ring-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                  }`}
                >
                  {/* Popular Badge */}
                  {pkg.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-heading font-bold uppercase rounded-full shadow-lg">
                        <span className="text-lg">⭐</span>
                        {isRTL ? 'الأكثر طلبًا' : 'Most Popular'}
                      </span>
                    </div>
                  )}
                  
                  {/* Messages Count */}
                  <div className="text-center mb-6 pt-4">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full"></div>
                      <div className="relative text-6xl font-heading font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent mb-3">
                        {pkg.messages}
                      </div>
                    </div>
                    <div
                      className="text-base text-gray-600 dark:text-gray-400  font-semibold uppercase tracking-wider"
                      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {isRTL ? 'رسالة' : 'Messages'}
                    </div>
                  </div>

                  {/* Price with Riyal Symbol */}
                  <div className="text-center mb-8 pb-8 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="text-5xl font-heading font-bold text-gray-900 dark:text-white">
                        {pkg.price}
                      </div>
                      <div className="flex flex-col items-start">
                        <img 
                          src="/trustedby/Saudi_Riyal_Symbol.svg.png" 
                          alt="SAR" 
                          className="w-8 h-8 opacity-70"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400  font-semibold">
                          {isRTL ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs  font-semibold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {isRTL ? 'شامل الضريبة' : 'VAT Included'}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm  text-gray-700 dark:text-gray-300 group/item">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold group-hover/item:bg-primary group-hover/item:text-white transition-all">
                          ✓
                        </span>
                        <span style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'} className="flex-1">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href={`/request-quote?package=sms-${pkg.messages}&price=${pkg.price}&name=${encodeURIComponent(isRTL ? `باقة ${pkg.messages} رسالة` : `${pkg.messages} Messages Package`)}`}
                    className="block w-full text-center px-6 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-heading font-bold uppercase tracking-wider hover:from-primary/90 hover:to-primary transition-all text-sm shadow-lg hover:shadow-2xl transform hover:scale-105"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  >
                    {isRTL ? 'اطلب الآن 🚀' : 'Order Now 🚀'}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-center mt-12 text-gray-600 dark:text-gray-400  text-lg"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL
                ? 'للباقات الأكبر أو المخصصة، يرجى التواصل مع فريق المبيعات 📞'
                : 'For larger or custom packages, please contact our sales team 📞'}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white overflow-hidden">
        <OrbitSectionBackground alignment="both" density="medium" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            className="text-3xl sm:text-4xl font-heading mb-6 uppercase tracking-tight"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL ? 'ابدأ الآن' : 'Get Started Now'}
          </motion.h2>
          <motion.p
            className="text-xl mb-8 text-white/90 "
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL ? 'تواصل معنا للحصول على استشارة مجانية' : 'Contact us for a free consultation'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/request-quote"
              className="inline-block px-10 py-4 bg-white text-primary rounded-xl font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl hover:bg-gray-100 transition-all duration-300"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {isRTL ? 'اطلب عرض سعر' : 'Request a Quote'}
            </Link>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-heading uppercase tracking-wider hover:bg-white hover:text-primary transition-all duration-300"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

