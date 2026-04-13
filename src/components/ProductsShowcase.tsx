'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import OrbitSectionBackground from './OrbitSectionBackground';

const solutions = [
  {
    slug: 'sms-platform',
    titleEn: 'SMS Platform',
    titleAr: 'الرسائل النصية',
    descriptionEn: 'An intelligent messaging platform that ensures your messages reach the right time with the highest delivery rate, full campaign control, precise performance tracking, and seamless integration with your internal systems.',
    descriptionAr: 'منصة رسائل ذكية تضمن وصول رسائلك في الوقت المناسب وبأعلى نسبة تسليم، مع تحكم كامل بالحملات، تتبع دقيق للأداء، وإمكانية ربط مباشرة مع أنظمتك الداخلية بكل سهولة',
    features: [
      'Instant alerts and notifications',
      'Targeted marketing campaigns',
      'OTP verification and transaction confirmations',
    ],
    featuresAr: [
      'تنبيهات وإشعارات فورية',
      'حملات تسويقية موجهة',
      'رسائل تحقق وتأكيد العمليات OTP',
    ],
  },
  {
    slug: 'whatsapp-business-api',
    titleEn: 'WhatsApp Business API',
    titleAr: 'واتساب اعمال API',
    descriptionEn: 'An integrated solution for official customer communication via WhatsApp, enabling message automation, professional conversation management, and secure, trusted communication that enhances customer confidence.',
    descriptionAr: 'حل متكامل للتواصل الرسمي مع العملاء عبر واتساب، يتيح أتمتة الرسائل، إدارة المحادثات باحترافية، وتقديم تجربة تواصل آمنة ومعتمدة تعزز ثقة العملاء',
    features: [
      'Automated responses and customer service',
      'Order and service notifications',
      'Official trusted communication campaigns',
    ],
    featuresAr: [
      'ردود تلقائية وخدمة عملاء',
      'إشعارات الطلبات والخدمات',
      'حملات تواصل رسمية معتمدة',
    ],
  },
  {
    slug: 'otime',
    titleEn: 'OTime - Attendance & HR',
    titleAr: 'اوتايم OTime',
    descriptionEn: 'A smart attendance and departure system that helps you manage work hours accurately, monitor employee compliance in real-time, and analyze data to support HR decisions efficiently.',
    descriptionAr: 'نظام حضور وانصراف ذكي يساعدك على إدارة أوقات العمل بدقة، مراقبة الالتزام الوظيفي لحظيًا، وتحليل البيانات لدعم قرارات الموارد البشرية بكفاءة',
    features: [
      'Employee attendance and departure tracking',
      'Compliance and work hours monitoring',
      'Real-time reports',
      'Payroll calculation',
    ],
    featuresAr: [
      'تسجيل حضور وانصراف الموظفين',
      'متابعة الالتزام وساعات العمل',
      'تقارير فورية',
      'حساب الرواتب',
    ],
  },
  {
    slug: 'gov-gate',
    titleEn: 'Gov Gate - Government Portal',
    titleAr: 'البوابة الحكومية Gov Gate',
    descriptionEn: 'An official messaging portal designed for government entities, ensuring the delivery of certified messages with the highest levels of security and reliability, with full internal management and complete compliance with regulatory requirements.',
    descriptionAr: 'بوابة مراسلات رسمية مصممة للجهات الحكومية، تضمن إرسال الرسائل المعتمدة بأعلى مستويات الأمان والموثوقية، مع إدارة داخلية كاملة وتوافق تام مع المتطلبات التنظيمية',
    features: [
      'Sending official certified messages',
      'Government notifications and alerts',
      'Secure and trusted communication with beneficiaries',
    ],
    featuresAr: [
      'إرسال رسائل رسمية معتمدة',
      'إشعارات وتنبيهات حكومية',
      'تواصل آمن وموثوق مع المستفيدين',
    ],
  },
];

export default function ProductsShowcase() {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="solutions" className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      <OrbitSectionBackground alignment="both" density="medium" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          {/* Header */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-heading mb-6 text-gray-900 dark:text-white"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {isRTL ? 'استكشف حلولنا بالتفصيل' : 'Explore Our Solutions in Detail'}
            </motion.h2>
            <motion.p
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {isRTL
                ? 'اكتشف كيف يمكن لحلولنا أن تحول عملك وتدفع به نحو النجاح'
                : 'Discover how our solutions can transform your business and drive success'}
            </motion.p>
          </motion.div>

          {/* Solutions Grid - Back to Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const title = isRTL ? solution.titleAr : solution.titleEn;
              const description = isRTL ? solution.descriptionAr : solution.descriptionEn;

              return (
                <motion.div
                  key={solution.slug}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="group relative"
                >
                  <Link
                    href={`/solutions/${solution.slug}`}
                    className="block h-full"
                    prefetch={true}
                  >
                    <motion.div
                      className="relative h-full bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-primary/60 transition-all overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10"
                      initial={{ opacity: 0, y: 30, rotateX: -10 }}
                      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      whileHover={{
                        scale: 1.03,
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />

                      <div className="relative mb-6 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((dotIndex) => (
                            <motion.div
                              key={dotIndex}
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: ['#7A1E2E', '#E8DCCB', '#A7A9AC'][(index + dotIndex) % 3],
                              }}
                              animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.75, 1, 0.75],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: dotIndex * 0.25,
                                ease: 'easeInOut',
                              }}
                            />
                          ))}
                        </div>
                        <motion.div
                          className={`ml-4 px-3 py-1 rounded-full text-xs font-heading font-bold ${index % 3 === 0 ? 'bg-primary/20 text-primary' : index % 3 === 1 ? 'bg-secondary/40 text-primary' : 'bg-neutral/30 text-gray-700 dark:text-gray-300'}`}
                          style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </motion.div>
                      </div>

                      <h3
                        className="text-2xl font-heading mb-4 text-gray-900 dark:text-white relative z-10"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                      >
                        {title}
                      </h3>

                      <p
                        className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed relative z-10"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                      >
                        {isRTL ? solution.descriptionAr : solution.descriptionEn}
                      </p>

                      {/* Features List */}
                      <div className="mb-6 relative z-10">
                        <ul className="space-y-2">
                          {(isRTL ? solution.featuresAr : solution.features).map((feature, featureIndex) => (
                            <motion.li
                              key={featureIndex}
                              className="flex items-start gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400"
                              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={inView ? { opacity: 1, x: 0 } : {}}
                              transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                            >
                              <motion.span
                                className="text-primary mt-1 flex-shrink-0"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: featureIndex * 0.3,
                                }}
                              >
                                •
                              </motion.span>
                              <span>{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <motion.div
                        className="flex items-center gap-2 text-primary font-heading uppercase tracking-wider text-sm relative z-10"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                        whileHover={{ x: isRTL ? -5 : 5 }}
                      >
                        {isRTL ? 'معرفة المزيد' : 'Learn More'}
                        <motion.svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ x: [0, isRTL ? -5 : 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isRTL ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                          />
                        </motion.svg>
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
