'use client';

import React, { useEffect } from "react";
import Image from "next/image";
import { encodeImagePath } from "@/utils/imagePath";

import { useLanguage } from '@/contexts/LanguageContext';
import type { CmsPage, CmsPartner } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface TrustSectionProps {
  pageData?: CmsPage | null;
  partners?: CmsPartner[];
}

export const TrustSection = ({ pageData = null, partners = [] }: TrustSectionProps) => {
  const { t, isRTL } = useLanguage();
  // All logos from TrustedLogos folder - each file appears ONCE (excluding duplicate files with "(1)")
  const logoFiles = [
    'images-removebg-preview.png',
    'images.png',
    'magrabi-health.png',
    'logo_004-removebg-preview.png',
    'logo_006-removebg-preview.png',
    'logo_007-removebg-preview.png',
    'logo_008-removebg-preview.png',
    'logo_009-removebg-preview.png',
    'logo_010-removebg-preview.png',
    'logo_011-removebg-preview.png',
    'logo_012-removebg-preview.png',
    'logo_014-removebg-preview.png',
    'logo_015-removebg-preview.png',
    'logo_016-removebg-preview.png',
    'logo_017-removebg-preview.png',
    'logo_018-removebg-preview.png',
    'logo_020-removebg-preview.png',
    'logo_021-removebg-preview.png',
    'logo_022-removebg-preview.png',
    'logo_023-removebg-preview.png',
    'logo_024-removebg-preview.png',
    'logo_025-removebg-preview.png',
    'logo_026-removebg-preview.png',
    'logo_027-removebg-preview.png',
    'logo_028-removebg-preview.png',
    'logo_029-removebg-preview.png',
    'logo_030-removebg-preview.png',
    'logo_031-removebg-preview.png',
    'logo_032-removebg-preview.png',
    'logo_033-removebg-preview.png',
    'logo_034-removebg-preview.png',
    'logo_035-removebg-preview.png',
    'logo_036-removebg-preview.png',
    'logo_037-removebg-preview.png',
    'logo_038-removebg-preview.png',
    'logo_039-removebg-preview.png',
    'logo_040-removebg-preview.png',
    'logo_041-removebg-preview.png',
    'logo_042-removebg-preview.png',
    'logo_043-removebg-preview.png',
    'logo_044-removebg-preview.png',
    'logo_045-removebg-preview.png',
    'logo_046-removebg-preview.png',
    'logo_047-removebg-preview.png',
    'logo_048-removebg-preview.png',
    'logo_049-removebg-preview.png',
    'logo_050-removebg-preview.png',
    'logo_051-removebg-preview.png',
    'logo_052-removebg-preview.png',
    'logo_053-removebg-preview.png',
    'logo_054-removebg-preview.png',
    'logo_055-removebg-preview.png',
    'logo_056-removebg-preview.png',
    'logo_057-removebg-preview.png',
    'حرس الحدود.png',
    'إمارة منطقة الرياض.png',
    'مستشفى الملك فهد بجدة.png',
    'جامعة الملك سعود.png',
    'وزارة التعليم.png',
    'الموارد البشرية.png',
    'شعار-هدف.png',
  ];

  const initialLogos = React.useMemo(() => {
    const dbPartners = partners.filter((partner) => partner.active && partner.logo);
    return dbPartners.length
      ? dbPartners.map((partner) => partner.logo)
      : logoFiles;
  }, [partners]);

  // State to hold partners, initialized with static list to match Server Side Rendering
  const [shuffledLogos, setShuffledLogos] = React.useState(initialLogos);

  useEffect(() => {
    // Shuffle logos only on the client side after mount to avoid hydration mismatch
    const timer = setTimeout(() => {
      const shuffled = [...initialLogos];
      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledLogos(shuffled);
    }, 0);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLogos]);

  // Create partners array from shuffled logo files - each logo appears ONCE only
  const sectionPartners = shuffledLogos.map((logoFile, index) => ({
    id: `partner-${index}`,
    name: `Partner ${index + 1}`,
    logo: logoFile.startsWith('/') ? logoFile : `/TrustedLogos/${logoFile}`,
  }));

  // Split into two rows - distribute logos evenly
  const midPoint = Math.ceil(sectionPartners.length / 2);
  const row1 = sectionPartners.slice(0, midPoint);
  const row2 = sectionPartners.slice(midPoint);

  const title = getCmsField(pageData, 'home-trust', 'title', isRTL, t.landing.trust.title);
  const subtitle = getCmsField(
    pageData,
    'home-trust',
    'subtitle',
    isRTL,
    `${t.landing.trust.descriptionPart1} ${t.landing.trust.descriptionPart2} ${t.landing.trust.descriptionPart3}`
  );

  // ... (lines 73-95 omitted)

  return (
    <section 
      className="py-16 bg-gradient-to-b from-white to-[#E8DCCB]/30 overflow-hidden"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <div className="container mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7A1E2E] mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-lg">
            {subtitle}
          </p>
        </div>

        {/* Row 1 - Scrolling left to right */}
        <div className="mb-6 overflow-hidden">
          <div className="flex animate-scroll-row1 gap-6">
            {[...row1, ...row1].map((partner, index) => (
              <div
                key={`row1-${partner.id}-${index}`}
                className="flex-shrink-0 w-32 md:w-40"
              >
                <div className="bg-white rounded-lg p-4 md:p-6 h-20 md:h-24 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
                  <Image
                    src={encodeImagePath(partner.logo)}
                    alt={partner.name}
                    width={120}
                    height={60}
                    className="max-h-12 md:max-h-16 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Scrolling right to left (reverse) */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll-row2 gap-6">
            {[...row2, ...row2].map((partner, index) => (
              <div
                key={`row2-${partner.id}-${index}`}
                className="flex-shrink-0 w-32 md:w-40"
              >
                <div className="bg-white rounded-lg p-4 md:p-6 h-20 md:h-24 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
                  <Image
                    src={encodeImagePath(partner.logo)}
                    alt={partner.name}
                    width={120}
                    height={60}
                    className="max-h-12 md:max-h-16 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-row1 {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-row2 {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @media (min-width: 768px) {
          .animate-scroll-row1 {
            animation: scroll-row1 80s linear infinite;
            will-change: transform;
          }

          .animate-scroll-row2 {
            animation: scroll-row2 80s linear infinite;
            will-change: transform;
          }
        }

        @media (max-width: 767px) {
          .animate-scroll-row1 {
            animation: scroll-row1 60s linear infinite;
            will-change: transform;
          }

          .animate-scroll-row2 {
            animation: scroll-row2 60s linear infinite;
            will-change: transform;
          }
        }

        .animate-scroll-row1:hover,
        .animate-scroll-row2:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

