'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/business/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { encodeImagePath } from "@/utils/imagePath";

import { useLanguage } from '@/contexts/LanguageContext';
import type { CmsPage, CmsPartner } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface HeroProps {
  pageData?: CmsPage | null;
  partners?: CmsPartner[];
}

export const Hero = ({ pageData = null, partners = [] }: HeroProps) => {
  const { t, isRTL } = useLanguage();
  const badgeText = getCmsField(pageData, 'home-hero', 'badge', isRTL, t.landing.heroNew.badge);
  const titleLine1 = getCmsField(pageData, 'home-hero', 'title', isRTL, `${t.landing.heroNew.titlePart1} ${t.landing.heroNew.titlePart2}${t.landing.heroNew.titlePart3}`);
  const description = getCmsField(pageData, 'home-hero', 'description', isRTL, t.landing.heroNew.description);
  const ctaStart = getCmsField(pageData, 'home-hero', 'cta1_text', isRTL, t.landing.heroNew.ctaStart);
  const ctaStartUrl = getCmsField(pageData, 'home-hero', 'cta1_url', isRTL, "https://app.mobile.net.sa/reg");
  const ctaSales = getCmsField(pageData, 'home-hero', 'cta2_text', isRTL, t.landing.heroNew.ctaSales);
  const trustText = getCmsField(pageData, 'home-hero', 'trust_text', isRTL, t.landing.heroNew.trustedBy);
  const heroImageUrl = getCmsField(pageData, 'home-hero', 'hero_image_url', isRTL, "https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080");
  const notificationTitle = getCmsField(pageData, 'home-hero', 'notification_title', isRTL, t.landing.heroNew.notificationTitle);
  const notificationDesc = getCmsField(pageData, 'home-hero', 'notification_desc', isRTL, t.landing.heroNew.notificationDesc);
  const trustedBadgeLogos = React.useMemo(() => {
    const dbLogos = partners
      .filter((partner) => partner.active && partner.logo)
      .map((partner) => partner.logo);
    if (dbLogos.length) {
      return dbLogos.slice(0, 4);
    }
    return [
      '/TrustedLogos/images.png',
      '/TrustedLogos/magrabi-health.png',
      '/TrustedLogos/logo_006-removebg-preview.png',
      '/TrustedLogos/logo_010-removebg-preview.png',
    ];
  }, [partners]);

  return (
    <section 
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
      id="hero"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start lg:items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`space-y-5 sm:space-y-6 max-w-full ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <div className="inline-flex max-w-full items-center gap-2 px-3 py-1 rounded-full bg-accent border border-primary/20 text-primary text-sm font-medium whitespace-normal break-words">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {badgeText}
            </div>

            <h1
              className={`font-bold text-slate-900 tracking-tight leading-[1.08] w-full max-w-full whitespace-normal break-words [overflow-wrap:anywhere] [word-break:break-word] ${
                isRTL ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
              }`}
            >
              {titleLine1}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 w-full max-w-xl">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold min-h-12 h-auto px-5 sm:px-8 py-3 text-base sm:text-lg text-center leading-snug whitespace-normal break-words shadow-lg shadow-primary/25"
                asChild
              >
                <a href={ctaStartUrl} target="_blank" rel="noopener noreferrer">
                  <span className="min-w-0 whitespace-normal break-words">{ctaStart}</span>
                  {isRTL ? <ArrowLeft className="mr-2 h-5 w-5 shrink-0" /> : <ArrowRight className="ml-2 h-5 w-5 shrink-0" />}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-12 h-auto px-5 sm:px-8 py-3 text-base sm:text-lg border-slate-300 hover:bg-slate-50 text-slate-700 text-center whitespace-normal break-words"
                asChild
              >
                <Link href="/contact">
                  <MessageCircle className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 shrink-0`} />
                  <span className="min-w-0 whitespace-normal break-words">{ctaSales}</span>
                </Link>
              </Button>
            </div>

            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-500">
              <div className="flex -space-x-3 space-x-reverse overflow-visible">
                {trustedBadgeLogos.map((logo, idx) => (
                  <div
                    key={`${logo}-${idx}`}
                    className="inline-flex h-11 w-11 rounded-full ring-2 ring-white/95 bg-white shadow-sm overflow-hidden items-center justify-center p-1.5"
                  >
                    <Image
                      src={encodeImagePath(logo)}
                      alt={`Trusted partner ${idx + 1}`}
                      width={48}
                      height={48}
                      quality={100}
                      sizes="44px"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
              <p className="leading-relaxed">{trustText}</p>
            </div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Abstract Background Shapes for Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-3xl transform rotate-3 scale-95" />

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
              <img
                src={heroImageUrl}
                alt="System Dashboard"
                className="w-full h-auto object-cover"
              />

              {/* Floating Notification Card */}
              <div className="absolute bottom-6 right-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100 animate-in slide-in-from-bottom-4 duration-1000">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm">{notificationTitle}</h4>
                    <p className="text-xs text-slate-500 mt-1">{notificationDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
