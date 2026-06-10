'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';
import Link from 'next/link';
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface BudgetOption {
  value: string;
  labelAr: string;
  labelEn: string;
}

const DEFAULT_BUDGETS_RAW = [
  '10k-50k|10,000 - 50,000 ريال|10,000 - 50,000 SAR',
  '50k-100k|50,000 - 100,000 ريال|50,000 - 100,000 SAR',
  '100k-500k|100,000 - 500,000 ريال|100,000 - 500,000 SAR',
  '500k+|500,000+ ريال|500,000+ SAR',
].join('\n');

function parseBudgetOptions(raw: string): BudgetOption[] {
  const items = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [valueRaw = '', arRaw = '', enRaw = ''] = line.split('|');
      const value = valueRaw.trim();
      const labelAr = arRaw.trim() || value;
      const labelEn = enRaw.trim() || labelAr;
      if (!value) return null;
      return { value, labelAr, labelEn };
    })
    .filter((x): x is BudgetOption => Boolean(x));
  return items.length ? items : parseBudgetOptions(DEFAULT_BUDGETS_RAW);
}

function RequestQuoteFormInner({ cmsPage }: { cmsPage: CmsPage | null }) {
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

  // ── CMS-backed content (with safe fallbacks) ──
  const fontFamily = isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif';
  const heroTitle = getCmsField(cmsPage, 'rq-hero', 'title', isRTL, t.clientInquiryPage.title);
  const heroSubtitle = getCmsField(cmsPage, 'rq-hero', 'subtitle', isRTL, t.clientInquiryPage.subtitle);

  const backLabel = source === 'healthcare'
    ? getCmsField(cmsPage, 'rq-back', 'healthcare_label', isRTL, isRTL ? 'العودة لحلول القطاع الصحي' : 'Back to Healthcare Solutions')
    : source === 'enterprise'
      ? getCmsField(cmsPage, 'rq-back', 'enterprise_label', isRTL, isRTL ? 'العودة لحلول المؤسسات' : 'Back to Enterprise Solutions')
      : getCmsField(cmsPage, 'rq-back', 'packages_label', isRTL, isRTL ? 'العودة للباقات' : 'Back to Packages');

  const welcomeTitle = getCmsField(cmsPage, 'rq-banner', 'welcome_title', isRTL, isRTL ? 'مرحباً بك!' : 'Welcome!');
  const contextMessage = source === 'healthcare'
    ? getCmsField(cmsPage, 'rq-banner', 'message_healthcare', isRTL, isRTL ? 'نحن هنا لمساعدتك في تحسين تجربة مرضاك من خلال حلول التواصل الذكية' : "We're here to help you improve your patient experience through smart communication solutions")
    : source === 'enterprise'
      ? getCmsField(cmsPage, 'rq-banner', 'message_enterprise', isRTL, isRTL ? 'دعنا نساعدك في بناء حلول تواصل فعالة لعملك' : 'Let us help you build effective communication solutions for your business')
      : '';

  const packageSelectLabel = getCmsField(cmsPage, 'rq-form', 'package_select_label', isRTL, isRTL ? 'اختر الباقة (اختياري)' : 'Select Package (Optional)');
  const noPackageLabel = getCmsField(cmsPage, 'rq-form', 'no_package_label', isRTL, isRTL ? 'لا يوجد باقة محددة' : 'No package selected');
  const customPackageLabel = getCmsField(cmsPage, 'rq-form', 'custom_package_label', isRTL, isRTL ? 'باقة مخصصة' : 'Custom Package');
  const nameLabel = getCmsField(cmsPage, 'rq-form', 'name_label', isRTL, t.clientInquiryPage.name);
  const emailLabel = getCmsField(cmsPage, 'rq-form', 'email_label', isRTL, t.clientInquiryPage.email);
  const phoneLabel = getCmsField(cmsPage, 'rq-form', 'phone_label', isRTL, t.clientInquiryPage.phone);
  const companyLabel = source === 'healthcare'
    ? getCmsField(cmsPage, 'rq-form', 'company_label_healthcare', isRTL, isRTL ? 'اسم المنشأة الصحية' : 'Healthcare Facility Name')
    : source === 'enterprise'
      ? getCmsField(cmsPage, 'rq-form', 'company_label_enterprise', isRTL, isRTL ? 'اسم الشركة' : 'Company Name')
      : getCmsField(cmsPage, 'rq-form', 'company_label', isRTL, t.clientInquiryPage.company);
  const serviceLabel = getCmsField(cmsPage, 'rq-form', 'service_label', isRTL, isRTL ? 'نوع الحل' : 'Solution Type');
  const servicePlaceholder = getCmsField(cmsPage, 'rq-form', 'service_placeholder', isRTL, isRTL ? 'اختر نوع الحل' : 'Select Solution Type');
  const autoSelectedLabel = getCmsField(cmsPage, 'rq-form', 'auto_selected_label', isRTL, isRTL ? '✓ تم التحديد تلقائياً' : '✓ Auto-selected');
  const serviceSms = getCmsField(cmsPage, 'rq-form', 'service_sms', isRTL, isRTL ? 'منصة الرسائل النصية' : 'SMS Platform');
  const serviceWhatsapp = getCmsField(cmsPage, 'rq-form', 'service_whatsapp', isRTL, isRTL ? 'واتساب أعمال API' : 'WhatsApp Business API');
  const serviceOtime = getCmsField(cmsPage, 'rq-form', 'service_otime', isRTL, isRTL ? 'اوتايم OTime' : 'OTime - Attendance & HR');
  const serviceGovgate = getCmsField(cmsPage, 'rq-form', 'service_govgate', isRTL, isRTL ? 'البوابة الحكومية Gov Gate' : 'Gov Gate - Government Portal');
  const serviceOther = getCmsField(cmsPage, 'rq-form', 'service_other', isRTL, isRTL ? 'أخرى' : 'Other');
  const messageLabel = getCmsField(cmsPage, 'rq-form', 'message_label', isRTL, t.clientInquiryPage.message);
  const tipText = getCmsField(cmsPage, 'rq-form', 'tip_text', isRTL, isRTL ? '💡 نصيحة: كلما زادت التفاصيل، كلما استطعنا تقديم عرض أفضل' : '💡 Tip: The more details you provide, the better we can tailor our solution');
  const budgetLabel = getCmsField(cmsPage, 'rq-form', 'budget_label', isRTL, t.clientInquiryPage.budget);
  const budgetPlaceholder = getCmsField(cmsPage, 'rq-form', 'budget_placeholder', isRTL, isRTL ? 'اختر الميزانية' : 'Select Budget Range');
  const submitText = getCmsField(cmsPage, 'rq-form', 'submit_text', isRTL, t.clientInquiryPage.submit);
  const sendingText = getCmsField(cmsPage, 'rq-form', 'sending_text', isRTL, isRTL ? 'جاري الإرسال...' : 'Submitting...');
  const successText = getCmsField(cmsPage, 'rq-form', 'success_message', isRTL, t.clientInquiryPage.success);
  const errorText = getCmsField(cmsPage, 'rq-form', 'error_message', isRTL, t.clientInquiryPage.error);
  const budgetOptions = parseBudgetOptions(getCmsField(cmsPage, 'rq-form', 'budget_options', true, DEFAULT_BUDGETS_RAW));

  // Get package info from URL params and auto-select service type
  useEffect(() => {
    const packageId = searchParams.get('package');
    const packageName = searchParams.get('name');
    const packageType = searchParams.get('type');
    const packagePrice = searchParams.get('price');
    const sourceParam = searchParams.get('source');
    const serviceTypeParam = searchParams.get('serviceType');

    if (sourceParam) {
      setSource(sourceParam);
    }

    if (serviceTypeParam) {
      setFormData((prev) => ({ ...prev, serviceType: serviceTypeParam }));
    }

    if (packageId) {
      if (packageId.startsWith('sms-')) {
        const messages = packageId.replace('sms-', '');
        setFormData((prev) => ({
          ...prev,
          selectedPackage: packageId,
          packageName: isRTL ? `باقة ${messages} رسالة` : `${messages} Messages Package`,
          packageType: 'sms',
          packagePrice: packagePrice || '',
          packageMessages: messages,
          serviceType: serviceTypeParam || 'sms-platform',
        }));
      } else if (packageId.startsWith('otime-')) {
        setFormData((prev) => ({
          ...prev,
          selectedPackage: packageId,
          packageName: packageName || (isRTL ? 'باقة OTime' : 'OTime Package'),
          packageType: 'otime',
          packagePrice: packagePrice || '',
          serviceType: serviceTypeParam || 'otime',
        }));
      } else {
        setFormData((prev) => ({
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: source || 'general' }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setShowSuccess(true);
      setFormData({
        name: '', email: '', phone: '', company: '', serviceType: '', message: '',
        budget: '', selectedPackage: '', packageName: '', packageType: '', packagePrice: '', packageMessages: '',
      });

      setTimeout(() => { window.location.href = '/'; }, 3000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              style={{ fontFamily }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? 'M14 5l7 7m0 0l-7 7m7-7H3' : 'M10 19l-7-7m0 0l7-7m-7 7h18'} />
              </svg>
              {backLabel}
            </Link>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-heading text-gray-900 dark:text-white mb-4 uppercase tracking-tighter"
              style={{ fontFamily }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {heroTitle}
            </h1>
            <p
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 "
              style={{ fontFamily }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {heroSubtitle}
            </p>
          </motion.div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-500 rounded-lg text-green-700 dark:text-green-300 text-center"
            >
              {successText}
            </motion.div>
          )}

          {/* Error Message */}
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 rounded-lg text-red-700 dark:text-red-300 text-center"
            >
              {errorText}
            </motion.div>
          )}

          {/* Context Banner */}
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
                  <h3 className="text-lg font-heading text-gray-900 dark:text-white mb-2" style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
                    {welcomeTitle}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 " style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
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
            {/* Package Info Display */}
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
                      <h3 className="text-lg font-heading text-gray-900 dark:text-white mb-1" style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
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
                      setFormData((prev) => ({ ...prev, selectedPackage: '', packageName: '', packageType: '', packagePrice: '', packageMessages: '' }));
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

            {/* Package Selection Dropdown */}
            {!hasPackageFromURL && (
              <div>
                <label htmlFor="selectedPackage" className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2" style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
                  {packageSelectLabel}
                </label>
                <select
                  id="selectedPackage"
                  name="selectedPackage"
                  value={formData.selectedPackage}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (!selected) {
                      setFormData((prev) => ({ ...prev, selectedPackage: '', packageName: '', packageType: '', packagePrice: '', packageMessages: '' }));
                      return;
                    }
                    if (selected === 'custom') {
                      setFormData((prev) => ({ ...prev, selectedPackage: 'custom', packageName: customPackageLabel, packageType: 'custom', packagePrice: '' }));
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  style={{ fontFamily }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <option value="">{noPackageLabel}</option>
                  <option value="custom">{customPackageLabel}</option>
                </select>
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}>
                {nameLabel}
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors "
                style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'} />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}>
                {emailLabel}
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors "
                style={{ fontFamily }} dir="ltr" />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}>
                {phoneLabel}
              </label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors "
                style={{ fontFamily }} dir="ltr" />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2" style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
                {companyLabel}
              </label>
              <input type="text" id="company" name="company" value={formData.company} onChange={handleChange}
                placeholder={
                  source === 'healthcare'
                    ? (isRTL ? 'مثال: مستشفى الملك فهد، عيادة النور...' : 'e.g., King Fahd Hospital, Al-Noor Clinic...')
                    : source === 'enterprise'
                      ? (isRTL ? 'مثال: شركة التقنية المتقدمة، مؤسسة الأعمال...' : 'e.g., Advanced Tech Company, Business Corporation...')
                      : (isRTL ? 'اسم الشركة أو المؤسسة' : 'Company or Organization Name')
                }
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors  placeholder:text-gray-400 dark:placeholder:text-gray-500"
                style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'} />
            </div>

            {/* Service Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="serviceType" className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300" style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
                  {serviceLabel}
                </label>
                {(hasPackageFromURL || source) && formData.serviceType && (
                  <span className="text-xs text-primary " style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
                    {autoSelectedLabel}
                  </span>
                )}
              </div>
              <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors "
                style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
                <option value="">{servicePlaceholder}</option>
                <option value="sms-platform">{serviceSms}</option>
                <option value="whatsapp-business-api">{serviceWhatsapp}</option>
                <option value="otime">{serviceOtime}</option>
                <option value="gov-gate">{serviceGovgate}</option>
                <option value="other">{serviceOther}</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2" style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
                {messageLabel}
              </label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5}
                placeholder={
                  source === 'healthcare'
                    ? (isRTL ? 'أخبرنا عن احتياجاتك: عدد المواعيد الشهرية، عدد المرضى، نوع التذكيرات المطلوبة...' : 'Tell us about your needs: monthly appointments, number of patients, types of reminders needed...')
                    : source === 'enterprise'
                      ? (isRTL ? 'أخبرنا عن عملك: حجم الشركة، عدد الموظفين، احتياجات التواصل...' : 'Tell us about your business: company size, number of employees, communication needs...')
                      : (isRTL ? 'أخبرنا عن احتياجاتك ومتطلباتك...' : 'Tell us about your needs and requirements...')
                }
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none  placeholder:text-gray-400 dark:placeholder:text-gray-500"
                style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'} />
              {(source === 'healthcare' || source === 'enterprise') && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 " style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'}>
                  {tipText}
                </p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-heading uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2" style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}>
                {budgetLabel}
              </label>
              <select id="budget" name="budget" value={formData.budget} onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : undefined }}>
                <option value="">{budgetPlaceholder}</option>
                {budgetOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{isRTL ? opt.labelAr : opt.labelEn}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-[#9a2d45] text-white py-4 px-8 rounded-lg font-heading uppercase tracking-wider shadow-lg hover:shadow-xl hover:from-[#9a2d45] hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              style={{ fontFamily }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isSubmitting ? sendingText : submitText}
            </motion.button>
          </motion.form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function RequestQuoteForm({ cmsPage = null }: { cmsPage?: CmsPage | null }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-heading">Loading...</p>
        </div>
      </div>
    }>
      <RequestQuoteFormInner cmsPage={cmsPage} />
    </Suspense>
  );
}
