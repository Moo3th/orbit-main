'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Smartphone, Menu, X, ChevronDown, Globe } from 'lucide-react';
import Image from 'next/image';
import { encodeImagePath } from '@/utils/imagePath';

type NavbarVariant = 'dark' | 'light';

interface WANavbarProps {
  isRTL: boolean;
  setIsRTL: (v: boolean) => void;
  variant?: NavbarVariant;
}

const NAV_LINKS = [
  { labelAr: 'الرئيسية', labelEn: 'Home', href: '/' },
  { labelAr: 'المنتجات', labelEn: 'Products', href: '#features', hasDropdown: true },
  { labelAr: 'الأسعار', labelEn: 'Pricing', href: '#pricing' },
  { labelAr: 'الشارة الخضراء', labelEn: 'Green Tick', href: '#green-tick' },
  { labelAr: 'تواصل معنا', labelEn: 'Contact', href: '#contact' },
];

const PRODUCT_LINKS = [
  { labelAr: 'الرسائل النصية SMS', labelEn: 'SMS Messaging', href: '/products/sms' },
  { labelAr: 'واتساب أعمال API', labelEn: 'WhatsApp Business API', href: '/products/whatsapp' },
  { labelAr: 'سكول بت', labelEn: 'SchoolBit', href: '/products/schoolbit' },
  { labelAr: 'O-Time', labelEn: 'O-Time', href: '/products/o-time' },
];

export default function WANavbar({ isRTL, setIsRTL, variant = 'dark' }: WANavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isDark = variant === 'dark';

  const bg = isDark
    ? scrolled ? 'bg-slate-950/95 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
    : scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm' : 'bg-transparent';

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedColor = isDark ? 'text-slate-400' : 'text-gray-500';
  const hoverColor = isDark ? 'hover:text-green-400' : 'hover:text-[#128C7E]';

  return (
    <>
      {/* Top bar */}
      <div className={`${isDark ? 'bg-black/40 border-white/10' : 'bg-[#075E54] border-white/20'} backdrop-blur-md text-white text-xs py-2 px-4 md:px-8 flex items-center justify-between flex-wrap gap-2 border-b`}>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-bold">CST</span>
          <span className={`hidden sm:inline ${mutedColor} ${isDark ? '' : 'text-white/80'}`}>
            {isRTL ? 'معتمد من هيئة الاتصالات وتقنية المعلومات' : 'CST Certified — Communications & Information Technology Commission'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:920006900" className="hover:text-green-400 transition-colors flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            920006900
          </a>
          <button
            onClick={() => setIsRTL(!isRTL)}
            className={`${isDark ? 'bg-white/10 hover:bg-green-500/20 border-white/20' : 'bg-white/10 hover:bg-white/30 border-white/20'} border transition-colors px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
          >
            <Globe className="w-3 h-3" />
            {isRTL ? 'English' : 'عربي'}
          </button>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${bg}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src={encodeImagePath('/logo/شعار المدار-01.svg')}
              alt="Orbit المدار"
              width={120}
              height={40}
              className={`h-8 md:h-10 w-auto ${isDark ? 'brightness-0 invert' : ''}`}
            />
          </a>

          {/* Desktop links */}
          <div className={`hidden lg:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {NAV_LINKS.map((link) => (
              link.hasDropdown ? (
                <div key={link.href} ref={productsRef} className="relative">
                  <button
                    onClick={() => setProductsOpen(!productsOpen)}
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${textColor} ${hoverColor}`}
                  >
                    {isRTL ? link.labelAr : link.labelEn}
                    <ChevronDown className={`w-4 h-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {productsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} mt-2 w-56 ${isDark ? 'bg-slate-900/95 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-xl shadow-2xl border overflow-hidden`}
                        onMouseEnter={() => setProductsOpen(true)}
                        onMouseLeave={() => setProductsOpen(false)}
                      >
                        <div className="p-2">
                          {PRODUCT_LINKS.map((product, i) => (
                            <a
                              key={i}
                              href={product.href}
                              className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-gray-100 text-gray-700'} ${isRTL ? 'font-ibm-plex' : ''}`}
                            >
                              {isRTL ? product.labelAr : product.labelEn}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${textColor} ${hoverColor}`}
                >
                  {isRTL ? link.labelAr : link.labelEn}
                </a>
              )
            ))}
          </div>

          {/* CTA button + mobile menu */}
          <div className="flex items-center gap-3">
            <a
              href="https://app.mobile.net.sa/reg"
              className={`hidden sm:inline-flex items-center font-bold text-sm px-5 py-2.5 rounded-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25'
                  : 'bg-[#128C7E] hover:bg-[#0d6b5f] text-white shadow-md'
              }`}
            >
              {isRTL ? 'ابدأ الآن' : 'Start Now'}
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-80 h-full ${isDark ? 'bg-slate-950' : 'bg-white'} shadow-2xl lg:hidden overflow-y-auto`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Image
                    src={encodeImagePath('/logo/شعار المدار-01.svg')}
                    alt="Orbit المدار"
                    width={100}
                    height={35}
                    className={`h-8 w-auto ${isDark ? 'brightness-0 invert' : ''}`}
                  />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className={`p-2 rounded-lg ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    link.hasDropdown ? (
                      <div key={link.href}>
                        <a
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block px-4 py-3 rounded-xl text-base font-medium ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
                        >
                          {isRTL ? link.labelAr : link.labelEn}
                        </a>
                        <div className={`${isRTL ? 'pr-4' : 'pl-4'} space-y-1`}>
                          {PRODUCT_LINKS.map((product, i) => (
                            <a
                              key={i}
                              href={product.href}
                              onClick={() => setMobileOpen(false)}
                              className={`block px-4 py-2 rounded-lg text-sm ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                            >
                              {isRTL ? product.labelAr : product.labelEn}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-base font-medium ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
                      >
                        {isRTL ? link.labelAr : link.labelEn}
                      </a>
                    )
                  ))}
                </nav>

                <div className="mt-8 space-y-3">
                  <a
                    href="https://app.mobile.net.sa/reg"
                    className={`block w-full text-center font-bold py-3 px-6 rounded-xl ${
                      isDark
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                        : 'bg-[#128C7E] hover:bg-[#0d6b5f] text-white'
                    }`}
                  >
                    {isRTL ? 'ابدأ الآن — تجربة مجانية' : 'Start Now — Free Trial'}
                  </a>
                  <a
                    href="https://wa.me/966920006900"
                    className={`block w-full text-center font-bold py-3 px-6 rounded-xl border ${
                      isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {isRTL ? 'تحدث مع المبيعات' : 'Talk to Sales'}
                  </a>
                </div>

                <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex flex-col gap-3 text-sm">
                    <a href="tel:920006900" className={`${isDark ? 'text-slate-400 hover:text-green-400' : 'text-gray-500 hover:text-[#128C7E]'} transition-colors flex items-center gap-2`}>
                      <Smartphone className="w-4 h-4" /> 920006900
                    </a>
                    <a href="mailto:info@corbit.sa" className={`${isDark ? 'text-slate-400 hover:text-green-400' : 'text-gray-500 hover:text-[#128C7E]'} transition-colors`}>
                      info@corbit.sa
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}