'use client';

import React from 'react';
import { Smartphone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import { encodeImagePath } from '@/utils/imagePath';

type FooterVariant = 'dark' | 'light';

interface WAFooterProps {
  isRTL: boolean;
  variant?: FooterVariant;
}

const QUICK_LINKS = [
  { labelAr: 'الرئيسية', labelEn: 'Home', href: '/' },
  { labelAr: 'المنتجات', labelEn: 'Products', href: '#features' },
  { labelAr: 'الأسعار', labelEn: 'Pricing', href: '#pricing' },
  { labelAr: 'تواصل معنا', labelEn: 'Contact', href: '#contact' },
];

const SOLUTIONS = [
  { labelAr: 'الرسائل النصية SMS', labelEn: 'SMS Messaging', href: '/products/sms' },
  { labelAr: 'واتساب أعمال API', labelEn: 'WhatsApp Business API', href: '/products/whatsapp' },
  { labelAr: 'سكول بت', labelEn: 'SchoolBit', href: '/products/schoolbit' },
  { labelAr: 'O-Time', labelEn: 'O-Time', href: '/products/o-time' },
];

export default function WAFooter({ isRTL, variant = 'dark' }: WAFooterProps) {
  const isDark = variant === 'dark';

  const bg = isDark ? 'bg-black' : 'bg-white';
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedColor = isDark ? 'text-slate-400' : 'text-gray-500';
  const hoverColor = isDark ? 'hover:text-green-400' : 'hover:text-[#128C7E]';
  const sectionTitleColor = isDark ? 'text-white' : 'text-gray-900';
  const iconBg = isDark ? 'bg-green-500/20' : 'bg-[#128C7E]/10';
  const iconColor = isDark ? 'text-green-400' : 'text-[#128C7E]';

  return (
    <footer className={`${bg} ${isDark ? 'text-slate-300' : 'text-gray-600'} py-12 md:py-16 border-t ${borderColor}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Logo & Info */}
          <div>
            <Image
              src={encodeImagePath('/logo/شعار المدار-01.svg')}
              alt="Orbit المدار"
              width={140}
              height={48}
              className={`h-10 md:h-12 w-auto mb-4 ${isDark ? 'brightness-0 invert' : ''}`}
            />
            <p className={`text-sm ${mutedColor} leading-relaxed mb-4`}>
              {isRTL
                ? 'منصة المدار للحلول الرقمية — شريكك الموثوق لخدمات واتساب أعمال API والرسائل النصية في المملكة العربية السعودية'
                : 'Orbit Digital Solutions — Your trusted partner for WhatsApp Business API and SMS services in Saudi Arabia'}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/orbittec_sa"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full ${isDark ? 'bg-white/10 hover:bg-green-500/20' : 'bg-gray-100 hover:bg-[#128C7E]/10'} flex items-center justify-center transition-colors`}
              >
                <svg className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://x.com/orbittec_sa"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full ${isDark ? 'bg-white/10 hover:bg-green-500/20' : 'bg-gray-100 hover:bg-[#128C7E]/10'} flex items-center justify-center transition-colors`}
              >
                <svg className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-base font-bold mb-4 ${sectionTitleColor}`}>
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className={`text-sm ${mutedColor} ${hoverColor} transition-colors`}>
                    {isRTL ? link.labelAr : link.labelEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className={`text-base font-bold mb-4 ${sectionTitleColor}`}>
              {isRTL ? 'حلولنا' : 'Our Solutions'}
            </h4>
            <ul className="space-y-3">
              {SOLUTIONS.map((sol, i) => (
                <li key={i}>
                  <a href={sol.href} className={`text-sm ${mutedColor} ${hoverColor} transition-colors`}>
                    {isRTL ? sol.labelAr : sol.labelEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`text-base font-bold mb-4 ${sectionTitleColor}`}>
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Smartphone className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                  <p className={`text-xs ${mutedColor}`}>{isRTL ? 'الهاتف' : 'Phone'}</p>
                  <a href="tel:920006900" className={`text-sm ${textColor} ${hoverColor} transition-colors`} dir="ltr">920006900</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Mail className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                  <p className={`text-xs ${mutedColor}`}>{isRTL ? 'البريد الإلكتروني' : 'Email'}</p>
                  <a href="mailto:info@ot.com.sa" className={`text-sm ${textColor} ${hoverColor} transition-colors`}>info@ot.com.sa</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                  <MapPin className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                  <p className={`text-xs ${mutedColor}`}>{isRTL ? 'العنوان' : 'Address'}</p>
                  <p className={`text-sm ${textColor}`}>{isRTL ? 'الرياض، طريق الملك فهد' : 'Riyadh, King Fahd Road'}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`border-t ${borderColor} pt-6 flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div className={`flex items-center gap-3 text-xs ${mutedColor}`}>
            <Image
              src={encodeImagePath('/WhatsAppPage/cst.png')}
              alt="CST"
              width={60}
              height={30}
              className="h-6 w-auto"
            />
            <Image
              src={encodeImagePath('/WhatsAppPage/meta.png')}
              alt="Meta"
              width={60}
              height={30}
              className="h-6 w-auto"
            />
          </div>
          <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs ${mutedColor}`}>
            <span>&copy; {new Date().getFullYear()} {isRTL ? 'المدار. جميع الحقوق محفوظة' : 'Orbit. All rights reserved'}</span>
            <span>{isRTL ? 'السجل التجاري: 1010956877' : 'CR: 1010956877'}</span>
            <span>{isRTL ? 'رقم الترخيص: 16-01-001098' : 'License: 16-01-001098'}</span>
            <a href="https://app.mobile.net.sa/terms-of-use" target="_blank" rel="noopener noreferrer" className={`${hoverColor} transition-colors`}>
              {isRTL ? 'شروط الاستخدام' : 'Terms of Use'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}