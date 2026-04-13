'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';
import Link from 'next/link';

function RequestQuoteForm() {
  const { t, isRTL } = useLanguage();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    message: '',
    budget: '',
    selectedPackage: '',
    packageName: '',
    packageType: '',
    packagePrice: '',
    packageMessages: '',
  });

  const [source, setSource] = useState<string>('');
  const [contextMessage, setContextMessage] = useState<string>('');

  // Get package info from URL params and auto-select service type
  useEffect(() => {
    const packageId = searchParams.get('package');
    const packageName = searchParams.get('name');
    const packageType = searchParams.get('type');
    const packagePrice = searchParams.get('price');
    const sourceParam = searchParams.get('source');
    const serviceTypeParam = searchParams.get('serviceType');

    // Set source and context
    if (sourceParam) {
      setSource(sourceParam);
      // Set context-specific messages
      if (sourceParam === 'healthcare') {
        setContextMessage(isRTL 
          ? 'نحن هنا لمساعدتك في تحسين تجربة مرضاك من خلال حلول التواصل الذكية'
          : 'We\'re here to help you improve your patient experience through smart communication solutions'
        );
      } else if (sourceParam === 'enterprise') {
        setContextMessage(isRTL
          ? 'دعنا نساعدك في بناء حلول تواصل فعالة لعملك'
          : 'Let us help you build effective communication solutions for your business'
        );
      }
    }

    // Auto-select service type from URL if provided
    if (serviceTypeParam) {
      setFormData(prev => ({
        ...prev,
        serviceType: serviceTypeParam,
      }));
    }

    if (packageId) {
      // Parse SMS package (e.g., sms-3000)
      if (packageId.startsWith('sms-')) {
        const messages = packageId.replace('sms-', '');
        setFormData(prev => ({
          ...prev,
          selectedPackage: packageId,
          packageName: isRTL 
            ? `باقة ${messages} رسالة` 
            : `${messages} Messages Package`,
          packageType: 'sms',
          packagePrice: packagePrice || '',
          packageMessages: messages,
          serviceType: serviceTypeParam || 'sms-platform', // Auto-select SMS Platform
        }));
      }
      // Parse OTime package (e.g., otime-1, otime-2, otime-3)
      else if (packageId.startsWith('otime-')) {
        setFormData(prev => ({
          ...prev,
          selectedPackage: packageId,
          packageName: packageName || (isRTL ? 'باقة OTime' : 'OTime Package'),
          packageType: 'otime',
          packagePrice: packagePrice || '',
          serviceType: serviceTypeParam || 'otime', // Auto-select OTime
        }));
      }
      // Other packages
      else {
        setFormData(prev => ({
          ...prev,
          selectedPackage: packageId,
          packageName: packageName || '',
          packageType: packageType || 'regular',
          packagePrice: packagePrice || '',
        }));
      }
    }
  }, [searchParams, isRTL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    try {
      const response = await fetch('/api/client-inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: source || 'general', // Include source in submission
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceType: '',
        message: '',
        budget: '',
        selectedPackage: '',
        packageName: '',
        packageType: '',
        packagePrice: '',
        packageMessages: '',
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const hasPackageFromURL = !!formData.selectedPackage;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <OrbitSectionBackground alignment="both" density="medium" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Link
              href={source === 'healthcare' ? '/healthcare' : source === 'enterprise' ? '/enterprise' : '/packages'}
              className="inline-flex items-center gap-2 mb-6 text-primary hover:text-primary/80 transition-colors "
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <svg
                className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isRTL ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M10 19l-7-7m0 0l7-7m-7 7h18"}
                />
              </svg>
              {source === 'healthcare' 
                ? (isRTL ? 'العودة لحلول القطاع الصحي' : 'Back to Healthcare Solutions')
                : source === 'enterprise'
                ? (isRTL ? 'العودة لحلول المؤسسات' : 'Back to Enterprise Solutions')
                : (isRTL ? 'العودة للباقات' : 'Back to Packages')
              }
            </Link>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-heading text-gray-900 dark:text-white mb-4 uppercase tracking-tighter"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {t.clientInquiryPage.title}
            </h1>
            <p
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 "
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {t.clientInquiryPage.subtitle}
            </p>
          </motion.div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-500 rounded-lg text-green-700 dark:text-green-300 text-center"
            >
              {t.clientInquiryPage.success}
            </motion.div>
          )}

          {/* Error Message */}
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 rounded-lg text-red-700 dark:text-red-300 text-center"
            >
              {t.clientInquiryPage.error}
            </motion.div>
          )}

          {/* Context Banner - Shows when user comes from specific source */}
          {source && contextMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 rounded-xl border-2 border-primary/30 dark:border-primary/40 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 dark:bg-primary/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-lg font-heading text-gray-900 dark:text-white mb-2"
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? 'مرحباً بك!' : 'Welcome!'}
                  </h3>
                  <p 
                    className="text-gray-700 dark:text-gray-300 "
                    style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {contextMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-12 space-y-6"
          >
            {/* Package Info Display - Only show if package selected from URL */}
            {hasPackageFromURL && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 rounded-xl p-6 border-2 border-primary/30 dark:border-primary/40 shadow-lg"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-heading text-gray-900 dark:text-white mb-1"
                        style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        {formData.packageName}
                      </h3>
                      {formData.packagePrice && (
                        <p className="text-lg text-primary font-heading font-bold">
                          {formData.packagePrice} {isRTL ? 'ريال' : 'SAR'}
                        </p>
                      )}
                      {formData.packageMessages && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 ">
                          {isRTL ? `${formData.packageMessages} رسالة` : `${formData.packageMessages} Messages`}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        selectedPackage: '', 
                        packageName: '', 
                        packageType: '', 
                        packagePrice: '',
                        packageMessages: ''
                      }));
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    aria-label={isRTL ? 'إزالة الباقة' : 'Remove package'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Package Selection Dropdown - Only show if NO package from URL */}
            {!hasPackageFromURL && (
              <div>
                <label
                  htmlFor="selectedPackage"
                  className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {isRTL ? 'اختر الباقة (اختياري)' : 'Select Package (Optional)'}
                </label>
                <select
                  id="selectedPackage"
                  name="selectedPackage"
                  value={formData.selectedPackage}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (!selected) {
                      setFormData(prev => ({
                        ...prev,
                        selectedPackage: '',
                        packageName: '',
                        packageType: '',
                        packagePrice: '',
                        packageMessages: '',
                      }));
                      return;
                    }
                    // Only allow custom package selection
                    if (selected === 'custom') {
                      setFormData(prev => ({
                        ...prev,
                        selectedPackage: 'custom',
                        packageName: isRTL ? 'باقة مخصصة' : 'Custom Package',
                        packageType: 'custom',
                        packagePrice: '',
                      }));
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <option value="">{isRTL ? 'لا يوجد باقة محددة' : 'No package selected'}</option>
                  <option value="custom">{isRTL ? 'باقة مخصصة' : 'Custom Package'}</option>
                </select>
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}
              >
                {t.clientInquiryPage.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors "
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}
              >
                {t.clientInquiryPage.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors "
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir="ltr"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}
              >
                {t.clientInquiryPage.phone}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors "
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir="ltr"
              />
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {source === 'healthcare' 
                  ? (isRTL ? 'اسم المنشأة الصحية' : 'Healthcare Facility Name')
                  : source === 'enterprise'
                  ? (isRTL ? 'اسم الشركة' : 'Company Name')
                  : t.clientInquiryPage.company
                }
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder={
                  source === 'healthcare'
                    ? (isRTL ? 'مثال: مستشفى الملك فهد، عيادة النور...' : 'e.g., King Fahd Hospital, Al-Noor Clinic...')
                    : source === 'enterprise'
                    ? (isRTL ? 'مثال: شركة التقنية المتقدمة، مؤسسة الأعمال...' : 'e.g., Advanced Tech Company, Business Corporation...')
                    : (isRTL ? 'اسم الشركة أو المؤسسة' : 'Company or Organization Name')
                }
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors  placeholder:text-gray-400 dark:placeholder:text-gray-500"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Service Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="serviceType"
                  className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300"
                  style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {isRTL ? 'نوع الحل' : 'Solution Type'}
                </label>
                {(hasPackageFromURL || source) && formData.serviceType && (
                  <span className="text-xs text-primary " style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
                    {isRTL ? '✓ تم التحديد تلقائياً' : '✓ Auto-selected'}
                  </span>
                )}
              </div>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors "
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <option value="">
                  {isRTL ? 'اختر نوع الحل' : 'Select Solution Type'}
                </option>
                <option value="sms-platform">
                  {isRTL ? 'منصة الرسائل النصية' : 'SMS Platform'}
                </option>
                <option value="whatsapp-business-api">
                  {isRTL ? 'واتساب أعمال API' : 'WhatsApp Business API'}
                </option>
                <option value="otime">
                  {isRTL ? 'اوتايم OTime' : 'OTime - Attendance & HR'}
                </option>
                <option value="gov-gate">
                  {isRTL ? 'البوابة الحكومية Gov Gate' : 'Gov Gate - Government Portal'}
                </option>
                <option value="other">{isRTL ? 'أخرى' : 'Other'}</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {t.clientInquiryPage.message}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder={
                  source === 'healthcare'
                    ? (isRTL 
                        ? 'أخبرنا عن احتياجاتك: عدد المواعيد الشهرية، عدد المرضى، نوع التذكيرات المطلوبة...'
                        : 'Tell us about your needs: monthly appointments, number of patients, types of reminders needed...')
                    : source === 'enterprise'
                    ? (isRTL
                        ? 'أخبرنا عن عملك: حجم الشركة، عدد الموظفين، احتياجات التواصل...'
                        : 'Tell us about your business: company size, number of employees, communication needs...')
                    : (isRTL
                        ? 'أخبرنا عن احتياجاتك ومتطلباتك...'
                        : 'Tell us about your needs and requirements...')
                }
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none  placeholder:text-gray-400 dark:placeholder:text-gray-500"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              {(source === 'healthcare' || source === 'enterprise') && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 " style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
                  {isRTL 
                    ? '💡 نصيحة: كلما زادت التفاصيل، كلما استطعنا تقديم عرض أفضل'
                    : '💡 Tip: The more details you provide, the better we can tailor our solution'}
                </p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}
              >
                {t.clientInquiryPage.budget}
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}
              >
                <option value="">
                  {isRTL ? 'اختر الميزانية' : 'Select Budget Range'}
                </option>
                <option value="10k-50k">
                  {isRTL ? '10,000 - 50,000 ريال' : '10,000 - 50,000 SAR'}
                </option>
                <option value="50k-100k">
                  {isRTL ? '50,000 - 100,000 ريال' : '50,000 - 100,000 SAR'}
                </option>
                <option value="100k-500k">
                  {isRTL ? '100,000 - 500,000 ريال' : '100,000 - 500,000 SAR'}
                </option>
                <option value="500k+">
                  {isRTL ? '500,000+ ريال' : '500,000+ SAR'}
                </option>
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-[#9a2d45] text-white py-4 px-8 rounded-lg font-heading uppercase tracking-wider shadow-lg hover:shadow-xl hover:from-[#9a2d45] hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isSubmitting
                ? isRTL
                  ? 'جاري الإرسال...'
                  : 'Submitting...'
                : t.clientInquiryPage.submit}
            </motion.button>
          </motion.form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-heading">Loading...</p>
        </div>
      </div>
    }>
      <RequestQuoteForm />
    </Suspense>
  );
}
