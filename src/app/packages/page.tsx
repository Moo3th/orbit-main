'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';

export default function PackagesPage() {
  const router = useRouter();
  const { isRTL } = useLanguage();

  const solutions = [
    {
      title: isRTL ? 'باقات الرسائل النصية' : 'SMS Packages',
      titleAr: 'باقات الرسائل النصية',
      description: isRTL ? 'باقات متنوعة من 1,000 إلى 100,000 رسالة' : 'Various packages from 1,000 to 100,000 messages',
      href: '/solutions/sms-platform#packages',
      icon: '📱',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: isRTL ? 'باقات OTime' : 'OTime Packages',
      titleAr: 'باقات OTime',
      description: isRTL ? 'باقات اشتراك نظام الحضور والانصراف' : 'Attendance & HR system subscription packages',
      href: '/solutions/otime#packages',
      icon: '⏰',
      color: 'from-primary to-primary/80'
    },
    {
      title: isRTL ? 'باقات واتساب الأعمال' : 'WhatsApp Business Packages',
      titleAr: 'باقات واتساب الأعمال',
      description: isRTL ? 'باقات API واتساب للأعمال' : 'WhatsApp Business API packages',
      href: '/solutions/whatsapp-business-api',
      icon: '💬',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white overflow-hidden">
        <OrbitSectionBackground alignment="both" density="medium" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 
              className="text-5xl sm:text-6xl font-heading font-bold mb-6 uppercase"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? 'الباقات' : 'Packages'}
            </h1>
            <p 
              className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto  text-white/90"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL 
                ? 'اختر الباقة المناسبة لاحتياجاتك من حلولنا المتنوعة'
                : 'Choose the right package for your needs from our diverse solutions'}
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <OrbitSectionBackground alignment="both" density="low" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? 'اختر الحل المناسب' : 'Choose Your Solution'}
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Link
                key={index}
                href={solution.href}
                className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${solution.color} text-white text-4xl mb-6 group-hover:scale-110 transition-transform`}>
                    {solution.icon}
                  </div>
                  <h3 
                    className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? solution.titleAr : solution.title}
                  </h3>
                  <p 
                    className="text-gray-600 dark:text-gray-400  mb-6"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {solution.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-primary font-heading font-bold group-hover:gap-4 transition-all">
                    {isRTL ? 'عرض الباقات' : 'View Packages'}
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8">
              <p 
                className="text-lg text-blue-900 dark:text-blue-100  mb-4"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {isRTL 
                  ? '💡 كل حل يحتوي على باقات مخصصة تناسب احتياجاتك'
                  : '💡 Each solution contains custom packages tailored to your needs'}
              </p>
              <Link
                href="/request-quote"
                className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-heading font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              >
                {isRTL ? 'اطلب عرض سعر مخصص' : 'Request Custom Quote'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

