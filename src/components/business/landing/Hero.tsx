'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/business/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { encodeImagePath } from "@/utils/imagePath";

import { useLanguage } from '@/contexts/LanguageContext';
import type { CmsPage, CmsPartner } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface Slide {
  id: string | number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaUrl: string;
  image: string;
  badgeAr?: string;
  badgeEn?: string;
}

interface HeroProps {
  pageData?: CmsPage | null;
  partners?: CmsPartner[];
}

export const Hero = ({ pageData = null, partners = [] }: HeroProps) => {
  const { t, isRTL } = useLanguage();
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  
  const slidesJson = getCmsField(pageData, 'home-hero', 'slides_json', isRTL, '');
  
  const slides: Slide[] = React.useMemo(() => {
    try {
      if (slidesJson) {
        return JSON.parse(slidesJson);
      }
    } catch (e) {
      console.error("Error parsing hero slides", e);
    }
    
    // Default fallback slide (Legacy compatibility)
    return [{
      id: 'default',
      titleAr: getCmsField(pageData, 'home-hero', 'title', true, t.landing.heroNew.titlePart1),
      titleEn: getCmsField(pageData, 'home-hero', 'title', false, t.landing.heroNew.titlePart1),
      descAr: getCmsField(pageData, 'home-hero', 'description', true, t.landing.heroNew.description),
      descEn: getCmsField(pageData, 'home-hero', 'description', false, t.landing.heroNew.description),
      ctaTextAr: getCmsField(pageData, 'home-hero', 'cta1_text', true, t.landing.heroNew.ctaStart),
      ctaTextEn: getCmsField(pageData, 'home-hero', 'cta1_text', false, t.landing.heroNew.ctaStart),
      ctaUrl: getCmsField(pageData, 'home-hero', 'cta1_url', isRTL, "https://app.mobile.net.sa/reg"),
      image: getCmsField(pageData, 'home-hero', 'hero_image_url', isRTL, "https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"),
      badgeAr: getCmsField(pageData, 'home-hero', 'badge', true, t.landing.heroNew.badge),
      badgeEn: getCmsField(pageData, 'home-hero', 'badge', false, t.landing.heroNew.badge),
    }];
  }, [slidesJson, pageData, t, isRTL]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const trustText = getCmsField(pageData, 'home-hero', 'trust_text', isRTL, t.landing.heroNew.trustedBy);
  const notificationTitle = getCmsField(pageData, 'home-hero', 'notification_title', isRTL, t.landing.heroNew.notificationTitle);
  const notificationDesc = getCmsField(pageData, 'home-hero', 'notification_desc', isRTL, t.landing.heroNew.notificationDesc);

  const trustedBadgeLogos = React.useMemo(() => {
    const dbLogos = partners
      .filter((partner) => partner.active && partner.logo)
      .map((partner) => partner.logo);
    if (dbLogos.length) return dbLogos.slice(0, 4);
    return [
      '/TrustedLogos/images.png',
      '/TrustedLogos/magrabi-health.png',
      '/TrustedLogos/logo_006-removebg-preview.png',
      '/TrustedLogos/logo_010-removebg-preview.png',
    ];
  }, [partners]);

  return (
    <section 
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-[600px] flex items-center"
      id="hero"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center"
          >
            {/* Text Content */}
            <div className={`space-y-6 sm:space-y-8 max-w-full ${isRTL ? 'text-right' : 'text-left'}`}>
              {(currentSlide.badgeAr || currentSlide.badgeEn) && (
                <div className="inline-flex max-w-full items-center gap-2 px-4 py-1.5 rounded-full bg-accent/50 border border-primary/20 text-primary text-sm font-bold whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {isRTL ? currentSlide.badgeAr : currentSlide.badgeEn}
                </div>
              )}

              <h1
                className={`font-black text-slate-900 tracking-tight leading-[1.1] w-full max-w-full whitespace-normal break-words ${
                  isRTL ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
                }`}
              >
                {isRTL ? currentSlide.titleAr : currentSlide.titleEn}
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium opacity-90">
                {isRTL ? currentSlide.descAr : currentSlide.descEn}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full max-w-xl">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold min-h-14 h-auto px-10 py-4 text-lg text-center rounded-2xl shadow-xl shadow-primary/25 transition-all hover:scale-105"
                  asChild
                >
                  <a href={currentSlide.ctaUrl} target="_blank" rel="noopener noreferrer">
                    <span>{isRTL ? currentSlide.ctaTextAr : currentSlide.ctaTextEn}</span>
                    {isRTL ? <ArrowLeft className="mr-2 h-6 w-6 shrink-0 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 h-6 w-6 shrink-0 group-hover:translate-x-1 transition-transform" />}
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-h-14 h-auto px-8 py-4 text-lg border-2 border-slate-200 hover:border-primary/30 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-all"
                  asChild
                >
                  <Link href="/contact">
                    <MessageCircle className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 shrink-0`} />
                    {t.nav.contact}
                  </Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500 border-t border-slate-100">
                <div className="flex -space-x-3 space-x-reverse overflow-visible">
                  {trustedBadgeLogos.map((logo, idx) => (
                    <div
                      key={`${logo}-${idx}`}
                      className="inline-flex h-11 w-11 rounded-full ring-2 ring-white bg-white shadow-md overflow-hidden items-center justify-center p-1.5 hover:z-10 transition-all hover:scale-110"
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
                <p className="leading-relaxed font-semibold">{trustText}</p>
              </div>
            </div>

            {/* Image Content */}
            <div className="relative group">
              {/* Decorative shapes behind image */}
              <motion.div 
                animate={{ rotate: [3, -3, 3], scale: [0.95, 1, 0.95] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-secondary/15 rounded-[2.5rem] transform rotate-3" 
              />
              
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50 bg-white ring-1 ring-slate-100">
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  src={currentSlide.image}
                  alt={isRTL ? currentSlide.titleAr : currentSlide.titleEn}
                  className="w-full h-auto min-h-[350px] object-cover aspect-[4/3] lg:aspect-auto"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />

                {/* Floating Notification */}
                <AnimatePresence>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-6 right-6 left-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2.5 rounded-xl">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{notificationTitle}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{notificationDesc}</p>
                      </div>
                      <div className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {isRTL ? 'الآن' : 'Now'}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Interactive Navigation Dots (for multiple slides) */}
              {slides.length > 1 && (
                <div className={`absolute -bottom-12 ${isRTL ? 'right-0' : 'left-0'} flex items-center gap-2`}>
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentSlideIndex(dotIdx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        currentSlideIndex === dotIdx ? 'w-10 bg-primary shadow-lg shadow-primary/20' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
