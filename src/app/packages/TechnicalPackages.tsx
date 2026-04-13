'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';

export default function TechnicalPackages() {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const smsPackages = [
    {
      messages: '1000',
      price: '110',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '3000',
      price: '311',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '5000',
      price: '489',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '10000',
      price: '863',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '20000',
      price: '1610',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '50000',
      price: '3738',
      features: [
        isRTL ? 'دعم فني' : 'Technical Support',
        isRTL ? 'ربط' : 'Integration',
        isRTL ? 'API' : 'API',
        isRTL ? 'شحن رصيد فوري' : 'Instant Balance Recharge',
      ],
    },
    {
      messages: '100000',
      price: '6900',
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

  const otimePackages = [
    {
      name: isRTL ? 'الباقة الأساسية' : 'Basic Package',
      nameAr: 'الباقة الأساسية',
      price: null,
      period: isRTL ? 'اشتراك شهري' : 'Monthly Subscription',
      periodAr: 'اشتراك شهري',
      users: '6',
      employees: '300',
      suppliers: '∞',
      storage: '30000 MB',
      ai: '—',
      features: [
        isRTL ? 'إشعارات عبر البريد الإلكتروني' : 'Email Notifications',
        isRTL ? 'إشعارات SMS' : 'SMS Notifications',
        isRTL ? 'إشعارات أساسية' : 'Basic Notifications',
        isRTL ? 'دعم 7/24' : '24/7 Support',
        isRTL ? 'مدير حساب' : 'Account Manager',
      ],
    },
    {
      name: isRTL ? 'الباقة المتقدمة بلس - الاشتراك الشهري' : 'Advanced Plus - Monthly',
      nameAr: 'الباقة المتقدمة بلس - الاشتراك الشهري',
      price: '1650',
      period: isRTL ? 'اشتراك شهري' : 'Monthly Subscription',
      periodAr: 'اشتراك شهري',
      users: '8',
      employees: '1000',
      suppliers: '∞',
      storage: '3072 MB',
      ai: '—',
      features: [
        isRTL ? '8 مستخدمين اداريين للحساب' : '8 Administrative Users',
        isRTL ? '1,000 حساب موظف (بصمة)' : '1,000 Employee Accounts (Fingerprint)',
        isRTL ? 'مساحة تخزين تصل الى 3 قيقا' : 'Storage up to 3 GB',
        isRTL ? 'اشعارات بريد الكتروني' : 'Email Notifications',
        isRTL ? 'اشعارات sms (قريبا)' : 'SMS Notifications (Coming Soon)',
        isRTL ? 'دعم فني (7/24)' : 'Technical Support (24/7)',
        isRTL ? 'مدير حساب للمساعدة في تأسيس الحساب' : 'Account Manager for Account Setup',
      ],
      highlighted: true,
    },
    {
      name: isRTL ? 'الباقة المتقدمة بلس - الاشتراك السنوي' : 'Advanced Plus - Annual',
      nameAr: 'الباقة المتقدمة بلس - الاشتراك السنوي',
      price: '16824',
      period: isRTL ? 'اشتراك سنوي' : 'Annual Subscription',
      periodAr: 'اشتراك سنوي',
      users: '8',
      employees: '1000',
      suppliers: '∞',
      storage: '3072 MB',
      ai: '—',
      features: [
        isRTL ? '8 مستخدمين اداريين للحساب' : '8 Administrative Users',
        isRTL ? '1,000 حساب موظف (بصمة)' : '1,000 Employee Accounts (Fingerprint)',
        isRTL ? 'مساحة تخزين تصل الى 3 قيقا' : 'Storage up to 3 GB',
        isRTL ? 'اشعارات بريد الكتروني' : 'Email Notifications',
        isRTL ? 'اشعارات sms (قريبا)' : 'SMS Notifications (Coming Soon)',
        isRTL ? 'دعم فني (7/24)' : 'Technical Support (24/7)',
        isRTL ? 'مدير حساب للمساعدة في تأسيس الحساب' : 'Account Manager for Account Setup',
      ],
    },
  ];

  return (
    <div className="space-y-24">
      {/* SMS Packages Section */}
      <section className="py-16 relative">
        <OrbitSectionBackground alignment="both" density="low" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="relative z-10"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl sm:text-4xl font-heading mb-4 text-gray-900 dark:text-white uppercase tracking-tight"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? 'باقات الرسائل النصية وسعرها' : 'SMS Packages and Pricing'}
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {smsPackages.map((pkg, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all hover:shadow-xl ${
                  pkg.highlighted
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                }`}
              >
                <div className="text-center mb-6">
                  <div className="text-4xl font-heading text-primary mb-2">
                    {pkg.messages}
                  </div>
                  <div
                    className="text-sm text-gray-600 dark:text-gray-400 "
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? 'رسالة' : 'Messages'}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-heading text-gray-900 dark:text-white mb-1">
                    {pkg.price} {isRTL ? 'ريال' : 'SAR'}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm  text-gray-700 dark:text-gray-300">
                      <span className="text-primary">✓</span>
                      <span style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/request-quote?package=sms-${pkg.messages}&price=${pkg.price}&name=${encodeURIComponent(isRTL ? `باقة ${pkg.messages} رسالة` : `${pkg.messages} Messages Package`)}`}
                  className="block w-full text-center px-6 py-3 bg-primary text-white rounded-lg font-heading uppercase tracking-wider hover:bg-primary/90 transition-all text-sm"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                >
                  {isRTL ? 'اطلب الباقة' : 'Request Package'}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-center mt-8 text-gray-600 dark:text-gray-400 "
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL
              ? 'للباقات الأكبر أو المخصصة، يرجى التواصل مع فريق المبيعات'
              : 'For larger or custom packages, please contact our sales team'}
          </motion.p>
        </motion.div>
      </section>

      {/* OTime Packages Section */}
      <section className="py-16 relative">
        <OrbitSectionBackground alignment="both" density="low" />
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
          className="relative z-10"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl sm:text-4xl font-heading mb-4 text-gray-900 dark:text-white uppercase tracking-tight"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? 'باقات اشتراك OTime' : 'OTime Subscription Packages'}
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {otimePackages.map((pkg, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${
                  pkg.highlighted
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                }`}
              >
                {pkg.highlighted && (
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-heading uppercase z-10">
                    {isRTL ? '⭐ الأكثر طلبًا' : '⭐ Popular'}
                  </div>
                )}

                <h3
                  className="text-2xl font-heading mb-4 text-gray-900 dark:text-white"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {isRTL ? pkg.nameAr : pkg.name}
                </h3>

                {pkg.price && (
                  <div className="mb-6">
                    <div className="text-4xl font-heading text-primary mb-1">
                      {pkg.price} {isRTL ? 'ريال' : 'SAR'}
                    </div>
                    <div
                      className="text-sm text-gray-600 dark:text-gray-400 "
                      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {isRTL ? pkg.periodAr : pkg.period}
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className=" text-gray-700 dark:text-gray-300" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'المستخدمون' : 'Users'}
                    </span>
                    <span className="font-heading text-gray-900 dark:text-white">{pkg.users}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className=" text-gray-700 dark:text-gray-300" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'الموظفون' : 'Employees'}
                    </span>
                    <span className="font-heading text-gray-900 dark:text-white">{pkg.employees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className=" text-gray-700 dark:text-gray-300" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'المورّدون' : 'Suppliers'}
                    </span>
                    <span className="font-heading text-gray-900 dark:text-white">{pkg.suppliers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className=" text-gray-700 dark:text-gray-300" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'التخزين' : 'Storage'}
                    </span>
                    <span className="font-heading text-gray-900 dark:text-white">{pkg.storage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className=" text-gray-700 dark:text-gray-300" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'ذكاء اصطناعي' : 'AI'}
                    </span>
                    <span className="font-heading text-gray-900 dark:text-white">{pkg.ai}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm  text-gray-700 dark:text-gray-300">
                      <span className="text-primary mt-1">✓</span>
                      <span style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/request-quote?package=otime-${index + 1}&name=${encodeURIComponent(isRTL ? pkg.nameAr : pkg.name)}${pkg.price ? `&price=${pkg.price}` : ''}`}
                  className="block w-full text-center px-6 py-3 bg-primary text-white rounded-lg font-heading uppercase tracking-wider hover:bg-primary/90 transition-all"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                >
                  {isRTL ? 'اطلب الباقة' : 'Request Package'}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

