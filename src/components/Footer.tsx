'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Github, Globe, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import useSWR from 'swr';
import { encodeImagePath } from '@/utils/imagePath';
import { resolveLegalLink, type LegalLinkLike } from '@/lib/cms/legalLink';

interface FooterNavItem {
  id: string;
  labelAr: string;
  labelEn: string;
  href: string;
}

interface FooterCmsData {
  logoDefault?: string;
  logoDark?: string;
  logoWhatsApp?: string;
  licensedByAr?: string;
  licensedByEn?: string;
  madeInSaudiAr?: string;
  madeInSaudiEn?: string;
  quickLinks?: FooterNavItem[];
  solutions?: FooterNavItem[];
  phoneLabelAr?: string;
  phoneLabelEn?: string;
  phoneNumber?: string;
  emailLabelAr?: string;
  emailLabelEn?: string;
  emailAddress?: string;
  addressLabelAr?: string;
  addressLabelEn?: string;
  addressDetailAr?: string;
  addressDetailEn?: string;
  socialItems?: Array<{
    id: string;
    platform: string;
    icon: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'youtube' | 'github' | 'globe';
    url: string;
    active: boolean;
    openInNewTab: boolean;
  }>;
  paymentMethods?: Array<{
    id: string;
    name: string;
    logo: string;
    active: boolean;
  }>;
  copyrightAr?: string;
  copyrightEn?: string;
  countryAr?: string;
  countryEn?: string;
  commercialRegistryAr?: string;
  commercialRegistryEn?: string;
  licenseAr?: string;
  licenseEn?: string;
}

const cmsFooterDefaults: Required<FooterCmsData> = {
  logoDefault: "/logo/شعار المدار-04.svg",
  logoDark: "/logo/شعار المدار-04.svg",
  logoWhatsApp: "/logo/شعار المدار-04.svg",
  licensedByAr: "مرخصة من هيئة الاتصالات والفضاء والتقنية",
  licensedByEn: "Licensed by CST",
  madeInSaudiAr: "صنع في السعودية",
  madeInSaudiEn: "Made in Saudi",
  quickLinks: [
    { id: "ql-home", labelAr: "الرئيسية", labelEn: "Home", href: "/" },
    { id: "ql-about", labelAr: "من نحن", labelEn: "About", href: "/about-us" },
    { id: "ql-products", labelAr: "المنتجات", labelEn: "Products", href: "#footer-products" },
    { id: "ql-blog", labelAr: "المدونة", labelEn: "Blog", href: "/blog" },
    { id: "ql-contact", labelAr: "تواصل", labelEn: "Contact", href: "/contact" },
  ],
  solutions: [
    { id: "sl-sms", labelAr: "خدمة الرسائل النصية SMS", labelEn: "SMS Service", href: "/products/sms" },
    { id: "sl-whatsapp", labelAr: "واتساب للأعمال", labelEn: "WhatsApp Business", href: "/products/whatsapp" },
    { id: "sl-otime", labelAr: "O-Time", labelEn: "O-Time", href: "/products/o-time" },
    { id: "sl-govgate", labelAr: "Gov Gate", labelEn: "Gov Gate", href: "/products/gov-gate" },
  ],
  phoneLabelAr: "الهاتف",
  phoneLabelEn: "Phone",
  phoneNumber: "920006900",
  emailLabelAr: "البريد الإلكتروني",
  emailLabelEn: "Email",
  emailAddress: "info@corbit.sa",
  addressLabelAr: "العنوان",
  addressLabelEn: "Address",
  addressDetailAr: "المدينة المنورة، حي الراية، طريق الملك عبدالله بن عبدالعزيز، مبنى 8443، الرمز البريدي 42312",
  addressDetailEn: "Madinah, Ar Rayah Dist., King Abdullah Bin Abdulaziz Rd., Bldg 8443, P.O. 42312",
  socialItems: [
    { id: "social-instagram", platform: "Instagram", icon: "instagram", url: "https://www.instagram.com/orbittec_sa?igsh=MXFqZmluMWhrbXk0dg==", active: true, openInNewTab: true },
    { id: "social-x", platform: "X", icon: "twitter", url: "https://x.com/orbittec_sa", active: true, openInNewTab: true },
  ],
  paymentMethods: [
    { id: "pay-mada", name: "Mada", logo: "/payment/mada.svg", active: true },
    { id: "pay-visa", name: "Visa", logo: "/payment/visa.svg", active: true },
    { id: "pay-mastercard", name: "Mastercard", logo: "/payment/mastercard.svg", active: true },
  ],
  copyrightAr: "جميع الحقوق محفوظة لشركة المدار",
  copyrightEn: "All rights reserved to CORBIT",
  countryAr: "المملكة العربية السعودية",
  countryEn: "Saudi Arabia",
  commercialRegistryAr: "السجل التجاري: 7012398264",
  commercialRegistryEn: "CR: 7012398264",
  licenseAr: "رقم الترخيص: LGP0921-22",
  licenseEn: "License: LGP0921-22",
};

export default function Footer() {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const pathname = usePathname();
  const isWhatsAppPage = pathname === '/products/whatsapp';
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [visiblePageIds, setVisiblePageIds] = React.useState<Set<string>>(new Set(['sms', 'whatsapp', 'otime', 'govgate']));

  const fetchFooterData = React.useCallback(async (): Promise<FooterCmsData | null> => {
    try {
      const res = await fetch('/api/cms/site', { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.site?.pages) {
        const visible = new Set<string>(
          data.site.pages
            .filter((p: any) => p.visible !== false)
            .map((p: any) => String(p.id))
        );
        setVisiblePageIds(visible);
      }
      return (data?.site?.footerData as FooterCmsData) || null;
    } catch (error) {
      console.error('Failed to load footer CMS:', error);
      return null;
    }
  }, []);

  const { data: footerData, mutate } = useSWR<FooterCmsData | null>(
    'site-footer-data',
    fetchFooterData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  // الصفحات القانونية النشطة (ديناميكية — الأسماء والروابط وسلوك الضغط من اللوحة)
  const { data: legalPages = [] } = useSWR<Array<{ slug: string; title: { ar: string; en: string }; link?: LegalLinkLike }>>(
    'footer-legal-pages',
    async () => {
      try {
        const r = await fetch('/api/legal');
        if (!r.ok) return [];
        const d = await r.json();
        return Array.isArray(d.pages) ? d.pages : [];
      } catch {
        return [];
      }
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 60000 }
  );

  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'orbit_cms_site_updated_at') {
        void mutate();
      }
    };
    const onCmsUpdated = () => {
      void mutate();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('orbit-cms-updated', onCmsUpdated as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('orbit-cms-updated', onCmsUpdated as EventListener);
    };
  }, [mutate]);

  const normalizeQuickLinkHref = (id: string, href: string) => {
    const normalizedHref = href.trim();
    if (id === 'ql-about' && normalizedHref === '#about') return '/about-us';
    if (normalizedHref === '#solutions' || normalizedHref === '#products' || normalizedHref === '/#solutions') return '#footer-products';
    if (normalizedHref === '#news' || normalizedHref === '#blog') return '/blog';
    if (normalizedHref === '/news') return '/blog';
    return normalizedHref;
  };

  const mergeNavItems = (items: FooterNavItem[], defaults: FooterNavItem[]) => {
    const valid = items.filter((item) => item && item.id && item.href);
    const byId = new Map(valid.map((item) => [item.id, item]));
    for (const def of defaults) {
      if (!byId.has(def.id)) {
        byId.set(def.id, def);
      }
    }
    return Array.from(byId.values());
  };

  const resolvedFooterData = {
    ...cmsFooterDefaults,
    ...(footerData || {}),
    quickLinks: Array.isArray(footerData?.quickLinks)
      ? mergeNavItems(footerData.quickLinks, cmsFooterDefaults.quickLinks)
      : cmsFooterDefaults.quickLinks,
    solutions: Array.isArray(footerData?.solutions)
      ? mergeNavItems(footerData.solutions, cmsFooterDefaults.solutions)
      : cmsFooterDefaults.solutions,
    socialItems: Array.isArray(footerData?.socialItems) && footerData.socialItems.length ? footerData.socialItems : cmsFooterDefaults.socialItems,
    paymentMethods: Array.isArray(footerData?.paymentMethods) ? footerData.paymentMethods : cmsFooterDefaults.paymentMethods,
  } as Required<FooterCmsData>;

  const activePaymentMethods = (resolvedFooterData.paymentMethods || []).filter((p) => p.active && p.logo);

  const solutionMapping: Record<string, string> = {
    '/products/sms': 'sms',
    '/products/whatsapp': 'whatsapp',
    '/products/o-time': 'otime',
    '/products/gov-gate': 'govgate',
  };

  const footerLinks = resolvedFooterData.quickLinks.map((link) => ({
      id: link.id === 'ql-solutions' ? 'ql-products' : link.id,
      name: isRTL
        ? (link.id === 'ql-solutions' ? 'المنتجات' : link.labelAr)
        : (link.id === 'ql-solutions' ? 'Products' : link.labelEn),
      href: (link.id === 'ql-solutions' || link.id === 'ql-products')
        ? '#footer-products'
        : normalizeQuickLinkHref(link.id === 'ql-solutions' ? 'ql-products' : link.id, link.href || '/'),
    }));

  const solutions = resolvedFooterData.solutions
    .filter(link => {
      const pageId = solutionMapping[link.href];
      return pageId ? visiblePageIds.has(pageId) : true;
    })
    .map((link) => ({ name: isRTL ? link.labelAr : link.labelEn, href: link.href }));

  const resolveFooterLogo = (value?: string) => {
    if (!value?.trim()) return '';
    return value.trim();
  };
  const logoSrc = isWhatsAppPage
    ? resolveFooterLogo(resolvedFooterData.logoWhatsApp)
    : isDark
      ? resolveFooterLogo(resolvedFooterData.logoDark)
      : resolveFooterLogo(resolvedFooterData.logoDefault);
  const licensedByText = isRTL ? resolvedFooterData.licensedByAr : resolvedFooterData.licensedByEn;
  const madeInSaudiText = isRTL ? resolvedFooterData.madeInSaudiAr : resolvedFooterData.madeInSaudiEn;
  const phoneLabel = isRTL ? resolvedFooterData.phoneLabelAr : resolvedFooterData.phoneLabelEn;
  const phoneNumber = resolvedFooterData.phoneNumber;
  const emailLabel = isRTL ? resolvedFooterData.emailLabelAr : resolvedFooterData.emailLabelEn;
  const emailAddress = resolvedFooterData.emailAddress;
  const addressLabel = isRTL ? resolvedFooterData.addressLabelAr : resolvedFooterData.addressLabelEn;
  const addressDetail = isRTL ? resolvedFooterData.addressDetailAr : resolvedFooterData.addressDetailEn;
  const socialItems = resolvedFooterData.socialItems;
  const iconMap = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    youtube: Youtube,
    github: Github,
    globe: Globe,
  } as const;
  // كل رابط سياسة يُحلّ حسب سلوكه: صفحة، أو سطر داخل سياسة أخرى، أو تحميل ملف.
  const legalLinks = legalPages
    .map((page) => {
      const resolved = resolveLegalLink(page);
      return {
        slug: page.slug,
        label: isRTL ? (page.title?.ar || page.slug) : (page.title?.en || page.slug),
        ...resolved,
      };
    })
    .filter((item) => item.href);

  const copyrightText = isRTL ? resolvedFooterData.copyrightAr : resolvedFooterData.copyrightEn;
  const countryText = isRTL ? resolvedFooterData.countryAr : resolvedFooterData.countryEn;
  const commercialRegistry = isRTL ? resolvedFooterData.commercialRegistryAr : resolvedFooterData.commercialRegistryEn;
  const licenseText = isRTL ? resolvedFooterData.licenseAr : resolvedFooterData.licenseEn;

  return (
    <footer
      id="footer"
      ref={ref}
      className={`${isWhatsAppPage
        ? 'bg-gradient-to-br from-[#128C7E] via-[#0d6b5f] to-[#0a5a50]'
        : 'bg-[#161616]'
        } text-white py-16`}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
        >
          {/* Logo & Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              className={`relative ${isWhatsAppPage ? 'h-44' : 'h-36'} w-full mb-4 overflow-hidden`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {logoSrc ? (
                <Image
                  src={encodeImagePath(logoSrc)}
                  alt="CORBIT Logo"
                  fill
                  className="object-cover object-left scale-[1.25]"
                  priority
                  quality={95}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 450px"
                />
              ) : null}
            </motion.div>
            <p
              className="text-gray-400 mb-4"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {licensedByText}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span dir={isRTL ? 'rtl' : 'ltr'}>
                {madeInSaudiText}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-lg font-heading mb-4 text-white"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={link.id}>
                  <motion.a
                    href={link.href}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    onClick={(e) => {
                      if (!link.href.startsWith('/')) {
                        e.preventDefault();
                        const id = link.href.replace('#', '');
                        const el = document.getElementById(id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="text-gray-400 hover:text-primary transition-colors"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div id="footer-products">
            <h4
              className="text-lg font-heading mb-4 text-white"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {t.nav.products}
            </h4>
            <ul className="space-y-3">
              {solutions.map((solution, index) => (
                <li key={solution.href}>
                  <motion.div
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      href={solution.href}
                      className="text-gray-400 hover:text-primary transition-colors"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {solution.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className="text-lg font-heading mb-6 text-white"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {t.footer.contactInfo}
            </h4>
            <ul className="space-y-4">

              {/* Phone */}
              <li className="flex items-start gap-3">
                <motion.div
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-start gap-3 w-full"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1" dir={isRTL ? 'rtl' : 'ltr'}>
                      {phoneLabel}
                    </p>
                    {phoneNumber ? (
                      <a href={`tel:${phoneNumber}`} className="text-white hover:text-primary transition-colors" dir="ltr">
                        {phoneNumber}
                      </a>
                    ) : null}
                  </div>
                </motion.div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3">
                <motion.div
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-start gap-3 w-full"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1" dir={isRTL ? 'rtl' : 'ltr'}>
                      {emailLabel}
                    </p>
                    {emailAddress ? (
                      <a href={`mailto:${emailAddress}`} className="text-white hover:text-primary transition-colors" dir="ltr">
                        {emailAddress}
                      </a>
                    ) : null}
                  </div>
                </motion.div>
              </li>

              {/* Address */}
              <li className="flex items-start gap-3">
                <motion.div
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-start gap-3 w-full"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1" dir={isRTL ? 'rtl' : 'ltr'}>
                      {addressLabel}
                    </p>
                    <p className="text-white" dir={isRTL ? 'rtl' : 'ltr'}>
                      {addressDetail}
                    </p>
                  </div>
                </motion.div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex items-center gap-4 mt-8">
              {socialItems.filter((item) => item.active && item.url).map((item, index) => {
                const Icon = iconMap[item.icon] || Globe;
                return (
                  <motion.a
                    key={item.id}
                    href={item.url}
                    target={item.openInNewTab ? "_blank" : "_self"}
                    rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                    aria-label={item.platform}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.9 + (index * 0.08) }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        {activePaymentMethods.length > 0 && (
          <motion.div
            className="flex flex-col items-center gap-3 mt-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <span className="text-xs text-white/50">{isRTL ? 'وسائل الدفع' : 'Payment Methods'}</span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {activePaymentMethods.map((pm) => (
                <span
                  key={pm.id}
                  className="inline-flex items-center justify-center h-9 px-1 bg-white rounded-md shadow-sm"
                  title={pm.name}
                >
                  <img
                    src={pm.logo}
                    alt={pm.name || 'payment method'}
                    className="h-7 w-auto object-contain"
                    loading="lazy"
                  />
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Copyright */}
        <motion.div
          className="text-center text-white/60  text-sm border-t border-white/10 pt-8 mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <p>{copyrightText}</p>
          <p className="mt-2">{countryText}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-white/40">
            <span>{commercialRegistry}</span>
            <span>{licenseText}</span>
            {legalLinks.map((item) => (
              item.isDownload ? (
                // تحميل ملف: رابط <a> عادي بسمة download — لا يمرّ عبر توجيه Next.
                <a
                  key={item.slug}
                  href={item.href}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center min-h-[44px] hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.slug}
                  href={item.href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center min-h-[44px] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
