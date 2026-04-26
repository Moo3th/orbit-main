"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
// import Image from 'next/image'; // Removing unused import
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { encodeImagePath } from '@/utils/imagePath';

// Nav items visibility - set true to re-enable
const SHOW_NAV_ABOUT = true;
const SHOW_NAV_OFFERS = false;

// Solutions from ProductsShowcase - Current solutions on landing page
const DEFAULT_SOLUTIONS = [
  { slug: 'sms-platform', nameEn: 'SMS Messaging', nameAr: 'الرسائل النصية SMS', href: '/products/sms', id: 'sms' },
  { slug: 'whatsapp-business-api', nameEn: 'WhatsApp Business API', nameAr: 'واتساب أعمال API', href: '/products/whatsapp', id: 'whatsapp' },
  { slug: 'otime', nameEn: 'O-Time HR Software', nameAr: 'O-Time برنامج الموارد البشرية', href: '/products/o-time', id: 'otime' },
  { slug: 'gov-gate', nameEn: 'Gov Gate', nameAr: 'Gov Gate', href: '/products/gov-gate', id: 'govgate' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [isInDarkSection, setIsInDarkSection] = useState(false);
  const [solutionsList, setSolutionsList] = useState(DEFAULT_SOLUTIONS);
  const pathname = usePathname();
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const solutionsRef = useRef<HTMLDivElement>(null);

  // Fetch visibility from CMS
  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const res = await fetch('/api/cms/site');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.site?.pages) {
            const pages = data.site.pages;
            const filtered = DEFAULT_SOLUTIONS.filter(sol => {
              const page = pages.find((p: any) => p.id === sol.id);
              return page ? page.visible !== false : true;
            });
            setSolutionsList(filtered);
          }
        }
      } catch (e) {
        console.error('Failed to fetch navbar visibility:', e);
      }
    };
    fetchVisibility();
  }, []);

  // Detect if we're in a dark section (WhyOrbit) using Intersection Observer
  useEffect(() => {
    const whyOrbitSection = document.getElementById('why-orbit');
    if (!whyOrbitSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If section is intersecting (visible in viewport)
          setIsInDarkSection(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: '-80px 0px 0px 0px', // Account for navbar height
      }
    );

    observer.observe(whyOrbitSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Lock body scroll when mobile menu is open
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  // Close solutions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Navigation items - ordered from right to left: الرئيسية - من نحن - حلولنا - الاخبار - العروض
  // Note: Items are rendered individually in the nav for proper ordering

  // Navbar should be light when in dark section (WhyOrbit) for better contrast
  const navbarIsDark = isInDarkSection ? false : isDark;

  // Detect pages where navbar needs better text contrast (light pages with white background)
  const isBlogRoute = pathname?.startsWith('/blog') || pathname?.startsWith('/news');
  const needsHighContrast = pathname === '/enterprise' || pathname === '/healthcare' || pathname === '/packages' || pathname === '/offers' || isBlogRoute || pathname === '/request-quote';
  const isLandingPage = pathname === '/';
  const isWhatsAppPage = pathname === '/products/whatsapp';

  // Routes where the dark theme button should be hidden
  const hideThemeToggleRoutes = ['/', '/products/sms', '/products/whatsapp', '/products/o-time', '/products/gov-gate'];
  const showThemeToggle = !hideThemeToggleRoutes.includes(pathname || '');

  // Navbar background opacity based on page
  const navbarBgOpacity = navbarIsDark
    ? 'bg-[#161616]/95'
    : isLandingPage
      ? 'bg-white/60' // Very transparent on landing page like before
      : needsHighContrast
        ? 'bg-white/88' // More visible on business pages but still transparent
        : 'bg-white/80'; // Default transparent for other pages

  // Border opacity based on page
  const navbarBorder = navbarIsDark
    ? 'border-white/10'
    : isLandingPage
      ? 'border-gray-200/20'
      : needsHighContrast
        ? 'border-gray-300/50'
        : 'border-gray-200/35';

  // Shadow based on page
  const navbarShadow = navbarIsDark
    ? 'shadow-lg shadow-black/20'
    : isLandingPage
      ? 'shadow-sm shadow-gray-900/2'
      : needsHighContrast
        ? 'shadow-lg shadow-gray-900/8'
        : 'shadow-md shadow-gray-900/5';

  const textColorClass = navbarIsDark
    ? 'text-gray-100'
    : 'text-gray-900'; // Always use dark text in light theme for maximum visibility

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 ${navbarBgOpacity} backdrop-blur-xl border-b ${navbarBorder} transition-all duration-300 ${navbarShadow} gpu-accelerated`}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        willChange: 'transform',
        fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif'
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-2 sm:gap-4 relative">
          {/* Logo - Always in corner (left for LTR, right for RTL) */}
          <div className={`flex items-center flex-shrink-0 order-1`}>
            <Link href="/" className="flex items-center">
              <img
                src={navbarIsDark ? encodeImagePath("/logo/شعار المدار1-0٥.png") : encodeImagePath("/logo/شعار المدار1-0٢.png")}
                alt="ORBIT Logo"
                className="h-16 sm:h-20 md:h-24 lg:h-48 w-auto object-contain lg:-my-10"
                style={{
                  minWidth: 'auto',
                  maxWidth: '160px'
                }}
              />
            </Link>
          </div>

          {/* Center: Navigation Menu */}
          <nav className={`hidden lg:flex items-center gap-2 flex-1 justify-center px-4 ${isRTL ? 'order-2' : 'order-2'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Home - الرئيسية */}
            <NavLink item={{ name: t.nav.home, href: '/' }} isRTL={isRTL} navbarIsDark={navbarIsDark} textColorClass={textColorClass} />

            {SHOW_NAV_ABOUT && (
              <NavLink item={{ name: t.nav.about, href: '/about-us' }} isRTL={isRTL} navbarIsDark={navbarIsDark} textColorClass={textColorClass} index={1} />
            )}

            {/* Solutions Dropdown - حلولنا */}
            <div ref={solutionsRef} className="relative">
              <motion.button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className={`relative px-4 py-2 ${isRTL ? 'text-[13px]' : 'text-[11px]'} font-heading uppercase tracking-wider whitespace-nowrap overflow-hidden group ${textColorClass} flex items-center gap-1 ${isRTL ? 'font-ibm-plex-arabic' : ''} transition-colors duration-200`}
                dir={isRTL ? 'rtl' : 'ltr'}
                whileHover={{ y: -2 }}
                onHoverStart={() => setSolutionsOpen(true)}
                onHoverEnd={() => setSolutionsOpen(false)}
              >
                {/* Background on hover - more visible */}
                <motion.span
                  className={`absolute inset-0 rounded-md ${navbarIsDark ? 'bg-white/10' : 'bg-primary/12'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: solutionsOpen ? 1 : 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />

                <span className="relative z-10 font-semibold">{t.nav.products}</span>
                <motion.svg
                  className="w-4 h-4 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: solutionsOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>

                {/* Bottom border with gradient - more prominent */}
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: solutionsOpen ? 1 : 0, opacity: solutionsOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* Solutions Dropdown Menu */}
              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full ${isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} mt-2 w-64 ${navbarIsDark ? 'bg-[#161616]/95' : 'bg-white'} rounded-xl shadow-2xl border ${navbarIsDark ? 'border-white/10' : 'border-gray-200'} overflow-hidden`}
                    onMouseEnter={() => setSolutionsOpen(true)}
                    onMouseLeave={() => setSolutionsOpen(false)}
                  >
                    <div className="p-2">
                      {solutionsList.map((solution, index) => (
                        <motion.div
                          key={solution.slug}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={solution.href}
                            className={`block px-4 py-3 rounded-lg transition-all ${navbarIsDark ? 'hover:bg-white/5 text-gray-200' : needsHighContrast ? 'hover:bg-primary/10 text-gray-900' : 'hover:bg-primary/10 text-gray-700'} ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                            onClick={() => setSolutionsOpen(false)}
                          >
                            <div className="font-heading text-sm mb-1">{isRTL ? solution.nameAr : solution.nameEn}</div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Blog - المدونة */}
            <NavLink item={{ name: isRTL ? 'المدونة' : 'Blog', href: '/blog' }} isRTL={isRTL} navbarIsDark={navbarIsDark} textColorClass={textColorClass} index={3} />

            {SHOW_NAV_OFFERS && (
              <NavLink item={{ name: t.nav.offers, href: '/offers' }} isRTL={isRTL} navbarIsDark={navbarIsDark} textColorClass={textColorClass} index={5} />
            )}
          </nav>

          {/* Controls: Language Switcher, Theme Toggle, and Contact Button - Desktop only */}
          <div className={`hidden md:flex items-center gap-3 flex-shrink-0 min-w-0 order-3`}>
            {/* Language & Theme Controls */}
            <div className={`flex items-center rounded-full ${navbarIsDark ? 'bg-white/5 border border-white/10' : 'bg-secondary/40 border border-secondary/50'} p-1.5 backdrop-blur-md gap-1 shadow-sm flex-shrink-0`}>
              <LanguageSwitcher />
              {showThemeToggle && <ThemeToggle />}
            </div>

            {/* Contact Button */}
            <div className="flex-shrink-0 overflow-visible">
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  const config = (() => {
                    if (pathname?.startsWith('/solutions')) {
                      return { href: '/request-quote' };
                    }
                    if (pathname === '/request-quote') {
                      return { href: '/contact' };
                    }
                    return { href: '/contact' };
                  })();

                  router.push(config.href);
                }}
                className={`flex items-center justify-center min-w-[140px] px-5 py-2.5 ${isRTL ? 'text-[13px]' : 'text-[11px]'} rounded-lg text-white font-heading uppercase tracking-wider whitespace-nowrap ${isWhatsAppPage
                    ? 'bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1ea952] hover:to-[#0d6b5f] shadow-lg shadow-[#25D366]/50 hover:shadow-xl hover:shadow-[#25D366]/60'
                    : 'bg-gradient-to-r from-primary via-primary to-[#9a2d45] hover:from-[#9a2d45] hover:to-primary shadow-lg hover:shadow-xl'
                  } transition-all duration-300 relative overflow-hidden group ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <span className="relative z-10">
                  {(() => {
                    if (pathname?.startsWith('/solutions')) return t.clientInquiryPage.title;
                    if (pathname === '/request-quote') return t.nav.contact;
                    return t.nav.contact;
                  })()}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 pointer-events-none"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </div>
          </div>

          {/* Mobile menu button - Always visible, positioned opposite to logo */}
          <motion.button
            className={`lg:hidden p-2 rounded-lg relative z-50 flex-shrink-0 ${navbarIsDark ? 'text-gray-100 hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'} order-3`}
            onClick={toggleMenu}
            aria-label={t.nav.menu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ minWidth: '40px', minHeight: '40px' }}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                className={`block h-0.5 w-full rounded-full ${navbarIsDark ? 'bg-white' : 'bg-gray-800'}`}
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 10 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
              <motion.span
                className={`block h-0.5 w-full rounded-full ${navbarIsDark ? 'bg-white' : 'bg-gray-800'}`}
                animate={{
                  opacity: isOpen ? 0 : 1,
                  x: isOpen ? -20 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
              <motion.span
                className={`block h-0.5 w-full rounded-full ${navbarIsDark ? 'bg-white' : 'bg-gray-800'}`}
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -10 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            setIsOpen={setIsOpen}
            navbarIsDark={navbarIsDark}
            isRTL={isRTL}
            solutionsList={solutionsList}
            textColorClass={textColorClass}
            needsHighContrast={needsHighContrast}
            t={t}
            pathname={pathname}
            router={router}
            showThemeToggle={showThemeToggle}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

// NavLink Component
function NavLink({ item, isRTL, navbarIsDark, textColorClass, index = 0 }: { item: { name: string; href: string }, isRTL: boolean, navbarIsDark: boolean, textColorClass: string, index?: number }) {
  const isHashLink = item.href.startsWith('#');
  const isExternalLink = item.href.startsWith('http');

  if (isHashLink || isExternalLink) {
    return (
      <motion.a
        href={item.href}
        onClick={(e) => {
          if (isHashLink) {
            e.preventDefault();
            const id = item.href.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }}
        className={`relative px-4 py-2 ${isRTL ? 'text-[13px]' : 'text-[11px]'} font-heading uppercase tracking-wider whitespace-nowrap overflow-hidden group ${textColorClass} ${isRTL ? 'font-ibm-plex-arabic' : ''} transition-colors duration-200`}
        dir={isRTL ? 'rtl' : 'ltr'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          ease: 'easeOut',
        }}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        {/* Background on hover - more visible */}
        <motion.span
          className={`absolute inset-0 rounded-md ${navbarIsDark ? 'bg-white/10' : 'bg-primary/12'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Text with better contrast */}
        <span className="relative z-10 inline-block font-semibold">{item.name}</span>

        {/* Bottom border with gradient - more prominent */}
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </motion.a>
    );
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
    >
      <Link
        href={item.href}
        className={`relative px-4 py-2 ${isRTL ? 'text-[13px]' : 'text-[11px]'} font-heading uppercase tracking-wider whitespace-nowrap overflow-hidden group ${navbarIsDark ? 'text-gray-100' : 'text-gray-900'} ${isRTL ? 'font-ibm-plex-arabic' : ''} block transition-colors duration-200`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Background on hover - more visible */}
        <motion.span
          className={`absolute inset-0 rounded-md ${navbarIsDark ? 'bg-white/10' : 'bg-primary/12'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Text with better contrast */}
        <span className="relative z-10 inline-block font-semibold">{item.name}</span>

        {/* Bottom border with gradient - more prominent */}
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </Link>
    </motion.div>
  );
}

// Mobile Menu Component
interface MobileMenuProps {
  setIsOpen: (value: boolean) => void;
  navbarIsDark: boolean;
  isRTL: boolean;
  solutionsList: Array<{ slug: string; nameEn: string; nameAr: string; href: string }>;
  textColorClass: string;
  needsHighContrast: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  pathname: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any;
  showThemeToggle: boolean;
}

function MobileMenu({ setIsOpen, navbarIsDark, isRTL, solutionsList, textColorClass, needsHighContrast, t, pathname, router, showThemeToggle }: MobileMenuProps) {
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 lg:hidden backdrop-blur-md"
        style={{
          backgroundColor: navbarIsDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <motion.div
        className={`fixed top-20 ${isRTL ? 'right-0' : 'left-0'} w-full max-w-md overflow-y-auto z-40 lg:hidden ${navbarIsDark ? 'bg-[#161616]/95' : 'bg-white/95'} backdrop-blur-xl border-t ${navbarIsDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}
        style={{
          height: 'calc(100dvh - 5rem)', // Use dvh for better iOS support
          maxHeight: 'calc(100vh - 5rem)', // Fallback for older browsers
        }}
        initial={{ x: isRTL ? '100%' : '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: isRTL ? '100%' : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="p-6 space-y-4">
          {/* Theme & Language Controls */}
          <div className={`flex items-center gap-3 p-4 rounded-2xl ${navbarIsDark ? 'bg-white/5 border border-white/10' : 'bg-secondary/40 border border-secondary/50'} backdrop-blur-md`}>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${navbarIsDark ? 'bg-black/50' : 'bg-white'}`}>
                <LanguageSwitcher />
              </div>
              {showThemeToggle && (
                <div className={`p-1.5 rounded-lg ${navbarIsDark ? 'bg-black/50' : 'bg-white'}`}>
                  <ThemeToggle />
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {/* Home */}
            <MobileNavLink item={{ name: t.nav.home, href: '/' }} isRTL={isRTL} navbarIsDark={navbarIsDark} textColorClass={textColorClass} setIsOpen={setIsOpen} />
            {SHOW_NAV_ABOUT && (
              <MobileNavLink item={{ name: t.nav.about, href: '/about-us' }} isRTL={isRTL} navbarIsDark={navbarIsDark} textColorClass={textColorClass} setIsOpen={setIsOpen} />
            )}

            {/* Solutions with Accordion */}
            <div>
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 ${navbarIsDark ? 'hover:bg-white/5 text-gray-100' : 'hover:bg-gray-100 text-gray-800'} ${isRTL ? 'font-ibm-plex-arabic' : 'font-heading'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <span className="text-lg font-heading">{t.nav.solutions}</span>
                <motion.svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: solutionsOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`${isRTL ? 'pr-4' : 'pl-4'} space-y-1`}>
                      {solutionsList.map((solution: { slug: string; nameEn: string; nameAr: string; href: string }) => (
                        <Link
                          key={solution.slug}
                          href={solution.href}
                          className={`block px-4 py-3 rounded-lg transition-all ${navbarIsDark ? 'hover:bg-white/5 text-gray-200' : needsHighContrast ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-700'} ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
                          dir={isRTL ? 'rtl' : 'ltr'}
                          onClick={() => setIsOpen(false)}
                        >
                          {isRTL ? solution.nameAr : solution.nameEn}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Blog - المدونة */}
            <MobileNavLink item={{ name: isRTL ? 'المدونة' : 'Blog', href: '/blog' }} isRTL={isRTL} navbarIsDark={navbarIsDark} textColorClass={textColorClass} setIsOpen={setIsOpen} />

            {SHOW_NAV_OFFERS && (
              <MobileNavLink item={{ name: t.nav.offers, href: '/offers' }} isRTL={isRTL} navbarIsDark={navbarIsDark} textColorClass={textColorClass} setIsOpen={setIsOpen} />
            )}

          </nav>

          {/* Contact Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);

              const config = (() => {
                if (pathname?.startsWith('/solutions')) {
                  return { href: '/request-quote' };
                }
                if (pathname === '/request-quote') {
                  return { href: '/contact' };
                }
                return { href: '/contact' };
              })();

              router.push(config.href);
            }}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-heading text-base tracking-wide ${pathname === '/products/whatsapp'
                ? 'bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1ea952] hover:to-[#0d6b5f] shadow-lg shadow-[#25D366]/50 hover:shadow-2xl hover:shadow-[#25D366]/60'
                : 'bg-gradient-to-r from-primary to-[#9a2d45] hover:from-[#9a2d45] hover:to-primary shadow-lg hover:shadow-2xl'
              } transition-all duration-300 ${isRTL ? 'font-ibm-plex-arabic' : ''}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {(() => {
              if (pathname?.startsWith('/solutions')) return t.clientInquiryPage.title;
              if (pathname === '/request-quote') return t.nav.contact;
              return t.nav.contact;
            })()}
          </button>
        </div>
      </motion.div>
    </>
  );
}

// Mobile NavLink Component
interface MobileNavLinkProps {
  item: { name: string; href: string };
  isRTL: boolean;
  navbarIsDark: boolean;
  textColorClass: string;
  setIsOpen: (value: boolean) => void;
}

function MobileNavLink({ item, isRTL, navbarIsDark, textColorClass, setIsOpen }: MobileNavLinkProps) {
  const isHashLink = item.href.startsWith('#');

  if (isHashLink) {
    return (
      <a
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          document.body.style.overflow = 'unset';
          setIsOpen(false);
          const id = item.href.replace('#', '');
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }}
        className={`group flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 ${navbarIsDark ? 'hover:bg-white/5 text-gray-100' : `hover:bg-gray-100 ${textColorClass}`} ${isRTL ? 'font-ibm-plex-arabic' : 'font-heading'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <span className="text-lg font-heading">{item.name}</span>
        <motion.svg
          className="w-5 h-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ x: 0, opacity: 0.5 }}
          whileHover={{ x: isRTL ? -5 : 5, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </motion.svg>
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={() => {
        document.body.style.overflow = 'unset';
        setIsOpen(false);
      }}
      className={`group flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 ${navbarIsDark ? 'hover:bg-white/5 text-gray-100' : 'hover:bg-gray-100 text-gray-800'} ${isRTL ? 'font-ibm-plex-arabic' : 'font-heading'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <span className="text-lg font-heading">{item.name}</span>
      <motion.svg
        className="w-5 h-5 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        initial={{ x: 0, opacity: 0.5 }}
        whileHover={{ x: isRTL ? -5 : 5, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </motion.svg>
    </Link>
  );
}
