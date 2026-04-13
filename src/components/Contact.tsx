'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import OrbitSectionBackground from './OrbitSectionBackground';
import { getCmsField } from '@/lib/cms/helpers';
import type { CmsFooterData, CmsPage } from '@/lib/cms/types';

interface ContactProps {
  cmsPage?: CmsPage | null;
  footerData?: CmsFooterData;
}

interface ServiceOption {
  value: string;
  labelAr: string;
  labelEn: string;
}

const DEFAULT_SERVICE_OPTIONS_AR = [
  'sms|الرسائل النصية SMS|SMS Messaging',
  'whatsapp|واتساب أعمال API|WhatsApp Business API',
  'o-time|O-Time نظام الموارد البشرية|O-Time HR System',
  'gov-gate|Gov Gate بوابة حكومية|Gov Gate',
  'other|استفسار عام|General Inquiry',
].join('\n');

const DEFAULT_SERVICE_OPTIONS_EN = [
  'sms|SMS Messaging|SMS Messaging',
  'whatsapp|WhatsApp Business API|WhatsApp Business API',
  'o-time|O-Time HR System|O-Time HR System',
  'gov-gate|Gov Gate|Gov Gate',
  'other|General Inquiry|General Inquiry',
].join('\n');

const parseServiceOptions = (raw: string, fallback: ServiceOption[]): ServiceOption[] => {
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
    .filter((item): item is ServiceOption => Boolean(item));

  return items.length ? items : fallback;
};

const mergeServiceOptions = (arOptions: ServiceOption[], enOptions: ServiceOption[]): ServiceOption[] => {
  const enMap = new Map(enOptions.map((option) => [option.value, option]));
  const merged = arOptions.map((option) => {
    const enOption = enMap.get(option.value);
    return {
      value: option.value,
      labelAr: option.labelAr,
      labelEn: enOption?.labelEn || enOption?.labelAr || option.labelEn,
    };
  });

  enOptions.forEach((option) => {
    if (!merged.some((item) => item.value === option.value)) {
      merged.push(option);
    }
  });

  return merged;
};

const normalizePhoneForWhatsapp = (rawPhone: string): string => {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '966920006900';
  if (digits.startsWith('966')) return digits;
  if (digits.startsWith('0')) return `966${digits.slice(1)}`;
  return digits;
};

export default function Contact({ cmsPage = null, footerData }: ContactProps) {
  const { isRTL } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const heroTitle = getCmsField(cmsPage, 'contact-hero', 'title', isRTL, isRTL ? 'تواصل معنا' : 'Contact Us');
  const heroDescription = getCmsField(
    cmsPage,
    'contact-hero',
    'description',
    isRTL,
    isRTL
      ? 'نحن هنا للإجابة على استفساراتك ومساعدتك في العثور على الحل المناسب لاحتياجاتك'
      : "We're here to answer your inquiries and help you find the right solution for your needs"
  );

  const footerPhone = footerData?.phoneNumber?.trim() || '';
  const footerEmail = footerData?.emailAddress?.trim() || '';
  const footerAddress = (isRTL ? footerData?.addressDetailAr : footerData?.addressDetailEn)?.trim() || '';

  const phoneNumber = footerPhone || getCmsField(cmsPage, 'contact-info', 'phone', isRTL, '920006900');
  const phoneNote = getCmsField(
    cmsPage,
    'contact-info',
    'phone_note',
    isRTL,
    isRTL ? 'من الأحد للخميس، 8ص - 6م' : 'Sunday to Thursday, 8 AM - 6 PM'
  );
  const emailAddress = footerEmail || getCmsField(cmsPage, 'contact-info', 'email', isRTL, 'sales@orbit.sa');
  const emailNote = getCmsField(
    cmsPage,
    'contact-info',
    'email_note',
    isRTL,
    isRTL ? 'نرد خلال 24 ساعة كحد أقصى' : 'We reply within 24 hours'
  );
  const address = footerAddress || getCmsField(
    cmsPage,
    'contact-info',
    'address',
    isRTL,
    isRTL ? 'المملكة العربية السعودية، الرياض' : 'Riyadh, Saudi Arabia'
  );
  const addressNote = getCmsField(
    cmsPage,
    'contact-info',
    'address_note',
    isRTL,
    isRTL ? 'طريق الملك فهد' : 'King Fahd Road'
  );
  const whatsappTitle = getCmsField(
    cmsPage,
    'contact-info',
    'whatsapp_title',
    isRTL,
    isRTL ? 'تحدث معنا عبر واتساب' : 'Chat with us on WhatsApp'
  );
  const whatsappUrlFromFooter = `https://wa.me/${normalizePhoneForWhatsapp(phoneNumber)}`;
  const whatsappUrl = whatsappUrlFromFooter || getCmsField(cmsPage, 'contact-info', 'whatsapp_url', isRTL, 'https://wa.me/966920006900');

  const serviceLabel = getCmsField(
    cmsPage,
    'contact-form',
    'service_label',
    isRTL,
    isRTL ? 'الخدمة المطلوبة' : 'Requested Service'
  );
  const servicePlaceholder = getCmsField(
    cmsPage,
    'contact-form',
    'service_placeholder',
    isRTL,
    isRTL ? 'اختر الخدمة...' : 'Select a service...'
  );
  const submitText = getCmsField(cmsPage, 'contact-form', 'submit_text', isRTL, isRTL ? 'إرسال الرسالة' : 'Send Message');
  const privacyNote = getCmsField(
    cmsPage,
    'contact-form',
    'privacy_note',
    isRTL,
    isRTL ? 'بإرسال النموذج، أنت توافق على سياسة الخصوصية.' : 'By sending this form, you agree to the privacy policy.'
  );

  const serviceOptions = useMemo(() => {
    const fallback = parseServiceOptions(DEFAULT_SERVICE_OPTIONS_AR, []);
    const arRaw = getCmsField(cmsPage, 'contact-form', 'service_options', true, DEFAULT_SERVICE_OPTIONS_AR);
    const enRaw = getCmsField(cmsPage, 'contact-form', 'service_options', false, DEFAULT_SERVICE_OPTIONS_EN);
    const arOptions = parseServiceOptions(arRaw, fallback);
    const enOptions = parseServiceOptions(enRaw, arOptions);
    return mergeServiceOptions(arOptions, enOptions);
  }, [cmsPage]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceType: formData.product || 'general-inquiry',
          source: 'contact-page',
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        product: '',
        subject: '',
        message: '',
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const dialPhone = phoneNumber.replace(/[^\d+]/g, '');
  const emailHref = `mailto:${emailAddress}`;

  return (
    <section className="relative py-32 lg:py-40 bg-white dark:bg-gray-900 overflow-hidden">
      <OrbitSectionBackground alignment="both" density="medium" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {heroTitle}
            </h2>
            <p
              className={`text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {heroDescription}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h3
                  className={`text-2xl font-heading font-semibold mb-6 text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm text-gray-500 dark:text-gray-400 mb-1 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {isRTL ? 'هاتف' : 'Phone'}
                      </p>
                      <a href={`tel:${dialPhone || phoneNumber}`} className={`text-lg font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir="ltr">
                        {phoneNumber}
                      </a>
                      <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {phoneNote}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm text-gray-500 dark:text-gray-400 mb-1 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                      </p>
                      <a href={emailHref} className={`text-lg font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir="ltr">
                        {emailAddress}
                      </a>
                      <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {emailNote}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm text-gray-500 dark:text-gray-400 mb-1 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {isRTL ? 'العنوان' : 'Address'}
                      </p>
                      <p className={`text-lg font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {address}
                      </p>
                      <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                        {addressNote}
                      </p>
                    </div>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-2xl border border-[#E8DCCB]/70 bg-[linear-gradient(120deg,#7A1E2E_0%,#662130_42%,#1A6D56_100%)] px-5 py-4 text-white shadow-[0_18px_34px_-20px_rgba(122,30,46,0.95)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_40px_-18px_rgba(86,27,41,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                    aria-label={isRTL ? 'تحدث معنا عبر واتساب' : 'Chat with us on WhatsApp'}
                  >
                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(255,255,255,0.22),transparent_42%)] opacity-90" />
                    <div className="relative flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/16 ring-1 ring-white/30 transition-all duration-300 group-hover:bg-white/24">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm sm:text-base font-semibold leading-tight text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            {whatsappTitle}
                          </p>
                          <p className={`text-[11px] sm:text-xs text-white/80 mt-1 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                            {isRTL ? 'رد سريع خلال ساعات العمل' : 'Fast response during business hours'}
                          </p>
                        </div>
                      </div>
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/16 transition-colors duration-300 group-hover:bg-white/26">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.form
                onSubmit={handleSubmit}
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-12 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <p className={`text-green-800 dark:text-green-300 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL
                        ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
                        : "Your message has been sent successfully! We'll get back to you soon."}
                    </p>
                  </motion.div>
                )}

                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <p className={`text-red-800 dark:text-red-300 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.' : 'Failed to send message. Please try again.'}
                    </p>
                  </motion.div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-semibold mb-2 text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'الاسم الكامل' : 'Full Name'} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-semibold mb-2 text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'البريد الإلكتروني' : 'Email'} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                      dir="ltr"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className={`block text-sm font-semibold mb-2 text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'رقم الهاتف' : 'Phone Number'} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                      dir="ltr"
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className={`block text-sm font-semibold mb-2 text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {isRTL ? 'اسم الشركة/الجهة' : 'Company / Organization'}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      placeholder={isRTL ? 'مثال: شركة المدار' : 'e.g. Orbit Co.'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="product" className={`block text-sm font-semibold mb-2 text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    {serviceLabel}
                  </label>
                  <select
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <option value="">{servicePlaceholder}</option>
                    {serviceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {isRTL ? option.labelAr : option.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-semibold mb-2 text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    {isRTL ? 'الموضوع' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={isRTL ? 'موضوع الاستفسار' : 'Inquiry subject'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-semibold mb-2 text-gray-900 dark:text-white ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    {isRTL ? 'الرسالة' : 'Message'} <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-4 bg-gradient-to-r from-primary to-[#9a2d45] text-white rounded-xl font-heading uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (isRTL ? 'جاري الإرسال...' : 'Sending...') : submitText}
                </motion.button>

                <p className={`text-xs text-center text-gray-500 dark:text-gray-400 ${isRTL ? 'font-ibm-plex-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {privacyNote}
                </p>
              </motion.form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
