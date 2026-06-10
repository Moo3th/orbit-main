'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/business/ui/button";
import {
  MessageSquare, Zap, Rocket, ShieldCheck, Headphones,
  Calendar, Handshake, Code2, ArrowLeft, ArrowRight,
  Store, Building2, GraduationCap, Truck, Heart, Smartphone,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TrustedPartners } from "./TrustedPartners";
import { useLanguage } from '@/contexts/LanguageContext';
import type { CmsPage, CmsPartner } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';
import { encodeImagePath } from '@/utils/imagePath';

interface SMSPageProps {
  cmsPage?: CmsPage | null;
  partners?: CmsPartner[];
}

interface PricingPlan {
  messages: number | null;
  price: number | null;
  originalPrice?: number | null;
  feature: string;
  description: string;
  featured?: boolean;
  isCustom?: boolean;
}

const parsePlanBoolean = (value: string | undefined): boolean => {
  if (!value) return false;
  return value.trim().toLowerCase() === "true";
};

const parsePlansList = (raw: string, fallback: PricingPlan[]): PricingPlan[] => {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return fallback;
  }

  const parsed = lines
    .map((line) => {
      const [messagesRaw, priceRaw, featureRaw, descriptionRaw, featuredRaw, customRaw, originalPriceRaw] = line.split("|");
      const messagesIsCustom = (messagesRaw || "").trim().toLowerCase() === "custom";
      const messages = messagesIsCustom ? null : Number(messagesRaw);
      const price = priceRaw?.trim() ? Number(priceRaw) : null;
      const originalPrice = originalPriceRaw?.trim() ? Number(originalPriceRaw) : null;
      const feature = (featureRaw || "").trim();
      const description = (descriptionRaw || "").trim();
      const featured = parsePlanBoolean(featuredRaw);
      const isCustom = parsePlanBoolean(customRaw) || messagesIsCustom;

      const hasInvalidMessages = !messagesIsCustom && (typeof messages !== "number" || !Number.isFinite(messages) || messages <= 0);
      const hasInvalidPrice = !isCustom && price !== null && !Number.isFinite(price);
      if (hasInvalidMessages || hasInvalidPrice) {
        return null;
      }

      return {
        messages: messagesIsCustom ? null : messages,
        price: Number.isFinite(price ?? NaN) ? price : null,
        originalPrice: Number.isFinite(originalPrice ?? NaN) ? originalPrice : null,
        feature,
        description,
        featured,
        isCustom,
      } as PricingPlan;
    })
    .filter((item): item is PricingPlan => Boolean(item));

  return parsed.length ? parsed : fallback;
};

const serializePlansList = (plans: PricingPlan[]): string => plans
  .map((plan) => {
    const messages = plan.isCustom ? "custom" : String(plan.messages ?? "");
    const price = plan.price ?? "";
    return `${messages}|${price}|${plan.feature}|${plan.description}|${Boolean(plan.featured)}|${Boolean(plan.isCustom)}`;
  })
  .join("\n");

export const SMSPage = ({ cmsPage = null, partners = [] }: SMSPageProps) => {
  const { t, isRTL } = useLanguage();
  const headingFontClass = isRTL ? "font-ibm-plex-arabic" : "font-ibm-plex";
  const numberFormatter = useMemo(() => new Intl.NumberFormat('en-US'), []);
  const formatNumber = useCallback((value: number) => numberFormatter.format(value), [numberFormatter]);
  const [activeTab, setActiveTab] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  
  const cmsValueTitle = getCmsField(cmsPage, 'sms-value', 'title', isRTL, t.products.sms.valueProps.title);
  const cmsPricingTitle = getCmsField(cmsPage, 'sms-pricing', 'title', isRTL, t.products.sms.packages.title);
  
  const trustedBadgeLogos = React.useMemo(() => {
    const dbLogos = partners
      .filter((partner) => partner.active && partner.logo)
      .map((partner) => partner.logo);
    if (dbLogos.length) return dbLogos.slice(0, 3);
    return [
      '/TrustedLogos/images.png',
      '/TrustedLogos/magrabi-health.png',
      '/TrustedLogos/logo_006-removebg-preview.png',
    ];
  }, [partners]);

  const getHeroMessages = useCallback((
    prefix: "retail" | "finance" | "education" | "logistics" | "health",
    fallback: { sender: string; text: string }[]
  ) => {
    const first = fallback[0] || { sender: "", text: "" };
    const second = fallback[1] || { sender: "", text: "" };

    return [
      {
        sender: getCmsField(cmsPage, "sms-hero", `${prefix}_msg1_sender`, isRTL, first.sender),
        text: getCmsField(cmsPage, "sms-hero", `${prefix}_msg1_text`, isRTL, first.text),
      },
      {
        sender: getCmsField(cmsPage, "sms-hero", `${prefix}_msg2_sender`, isRTL, second.sender),
        text: getCmsField(cmsPage, "sms-hero", `${prefix}_msg2_text`, isRTL, second.text),
      },
    ];
  }, [cmsPage, isRTL]);

  const heroBadgePrefix = getCmsField(cmsPage, 'sms-hero', 'general_badge_prefix', isRTL, t.common.solutions);
  const heroClientsCount = getCmsField(cmsPage, 'sms-hero', 'general_clients_count', isRTL, '+20,000');
  const heroClientsLabel = getCmsField(cmsPage, 'sms-hero', 'general_clients_label', isRTL, t.common.clientsTrustUs);
  const heroMsg1Time = getCmsField(cmsPage, 'sms-hero', 'general_msg1_time', isRTL, t.common.now);
  const heroMsg2Time = getCmsField(cmsPage, 'sms-hero', 'general_msg2_time', isRTL, t.common.oneMinAgo);

  const slidesJson = getCmsField(cmsPage, 'sms-hero', 'slides_json', isRTL, '');
  
  const heroTabs = useMemo(() => {
    try {
      if (slidesJson) {
        const parsed = JSON.parse(slidesJson);
        return parsed.map((s: any, idx: number) => ({
          id: s.id || `slide_${idx}`,
          title: isRTL ? s.titleAr : s.titleEn,
          description: isRTL ? s.descAr : s.descEn,
          cta: isRTL ? s.ctaTextAr : s.ctaTextEn,
          icon: Store,
          label: isRTL ? (s.badgeAr || s.titleAr) : (s.badgeEn || s.titleEn),
          messages: s.messages || [
            { sender: isRTL ? "المدار" : "CORBIT", text: isRTL ? "مرحباً بك في عالم المراسلة!" : "Welcome to the world of messaging!" },
            { sender: isRTL ? "أوربيت" : "CORBIT", text: isRTL ? "طلبك قيد المعالجة." : "Your order is being processed." }
          ],
          color: idx % 2 === 0 ? "bg-pink-50" : "bg-blue-50",
          imgColor: idx % 2 === 0 ? "bg-pink-100" : "bg-blue-100"
        }));
      }
    } catch (e) {
      console.error("Error parsing sms hero slides", e);
    }

    return [
      {
        id: "retail",
        title: getCmsField(cmsPage, 'sms-hero', 'retail_title', isRTL, t.products.sms.heroTabs.retail.title),
        description: getCmsField(cmsPage, 'sms-hero', 'retail_description', isRTL, t.products.sms.heroTabs.retail.description),
        cta: getCmsField(cmsPage, 'sms-hero', 'retail_cta', isRTL, t.products.sms.heroTabs.retail.cta),
        icon: Store,
        label: getCmsField(cmsPage, 'sms-hero', 'retail_label', isRTL, t.products.sms.heroTabs.retail.label),
        messages: getHeroMessages("retail", t.products.sms.heroTabs.retail.messages),
        color: "bg-pink-50",
        imgColor: "bg-pink-100"
      },
      {
        id: "finance",
        title: getCmsField(cmsPage, 'sms-hero', 'finance_title', isRTL, t.products.sms.heroTabs.finance.title),
        description: getCmsField(cmsPage, 'sms-hero', 'finance_description', isRTL, t.products.sms.heroTabs.finance.description),
        cta: getCmsField(cmsPage, 'sms-hero', 'finance_cta', isRTL, t.products.sms.heroTabs.finance.cta),
        icon: Building2,
        label: getCmsField(cmsPage, 'sms-hero', 'finance_label', isRTL, t.products.sms.heroTabs.finance.label),
        messages: getHeroMessages("finance", t.products.sms.heroTabs.finance.messages),
        color: "bg-blue-50",
        imgColor: "bg-blue-100"
      },
      {
        id: "education",
        title: getCmsField(cmsPage, 'sms-hero', 'education_title', isRTL, t.products.sms.heroTabs.education.title),
        description: getCmsField(cmsPage, 'sms-hero', 'education_description', isRTL, t.products.sms.heroTabs.education.description),
        cta: getCmsField(cmsPage, 'sms-hero', 'education_cta', isRTL, t.products.sms.heroTabs.education.cta),
        icon: GraduationCap,
        label: getCmsField(cmsPage, 'sms-hero', 'education_label', isRTL, t.products.sms.heroTabs.education.label),
        messages: getHeroMessages("education", t.products.sms.heroTabs.education.messages),
        color: "bg-purple-50",
        imgColor: "bg-purple-100"
      },
      {
        id: "logistics",
        title: getCmsField(cmsPage, 'sms-hero', 'logistics_title', isRTL, t.products.sms.heroTabs.logistics.title),
        description: getCmsField(cmsPage, 'sms-hero', 'logistics_description', isRTL, t.products.sms.heroTabs.logistics.description),
        cta: getCmsField(cmsPage, 'sms-hero', 'logistics_cta', isRTL, t.products.sms.heroTabs.logistics.cta),
        icon: Truck,
        label: getCmsField(cmsPage, 'sms-hero', 'logistics_label', isRTL, t.products.sms.heroTabs.logistics.label),
        messages: getHeroMessages("logistics", t.products.sms.heroTabs.logistics.messages),
        color: "bg-orange-50",
        imgColor: "bg-orange-100"
      },
      {
        id: "health",
        title: getCmsField(cmsPage, 'sms-hero', 'health_title', isRTL, t.products.sms.heroTabs.health.title),
        description: getCmsField(cmsPage, 'sms-hero', 'health_description', isRTL, t.products.sms.heroTabs.health.description),
        cta: getCmsField(cmsPage, 'sms-hero', 'health_cta', isRTL, t.products.sms.heroTabs.health.cta),
        icon: Heart,
        label: getCmsField(cmsPage, 'sms-hero', 'health_label', isRTL, t.products.sms.heroTabs.health.label),
        messages: getHeroMessages("health", t.products.sms.heroTabs.health.messages),
        color: "bg-green-50",
        imgColor: "bg-green-100"
      }
    ];
  }, [cmsPage, getHeroMessages, isRTL, t, slidesJson]);

  const defaultPackages: PricingPlan[] = useMemo(() => [
    { messages: 1000, price: 110, feature: t.products.sms.packages.items.startup.feature, description: t.products.sms.packages.items.startup.description },
    { messages: 3000, price: 311, feature: t.products.sms.packages.items.strong.feature, description: t.products.sms.packages.items.strong.description },
    { messages: 5000, price: 489, feature: t.products.sms.packages.items.medium.feature, description: t.products.sms.packages.items.medium.description },
    { messages: 10000, price: 863, feature: t.products.sms.packages.items.professional.feature, description: t.products.sms.packages.items.professional.description, featured: true },
    { messages: 20000, price: 1610, feature: t.products.sms.packages.items.enterprise.feature, description: t.products.sms.packages.items.enterprise.description },
    { messages: 50000, price: 3738, feature: t.products.sms.packages.items.huge.feature, description: t.products.sms.packages.items.huge.description },
    { messages: 100000, price: 6900, feature: t.products.sms.packages.items.massive.feature, description: t.products.sms.packages.items.massive.description },
    { messages: null, price: null, feature: t.products.sms.packages.items.custom.feature, description: t.products.sms.packages.items.custom.description, isCustom: true },
  ], [t]);

  const cmsPricingSubtitle = getCmsField(cmsPage, 'sms-pricing', 'subtitle', isRTL, t.products.sms.packages.subtitle);
  const pricingBenefits = useMemo(() => [
    {
      label: getCmsField(cmsPage, "sms-pricing", "benefit1_label", isRTL, t.products.sms.packages.benefits.validity),
      description: getCmsField(cmsPage, "sms-pricing", "benefit1_desc", isRTL, t.products.sms.packages.benefits.validityDesc),
    },
    {
      label: getCmsField(cmsPage, "sms-pricing", "benefit2_label", isRTL, t.products.sms.packages.benefits.senderId),
      description: getCmsField(cmsPage, "sms-pricing", "benefit2_desc", isRTL, t.products.sms.packages.benefits.senderIdDesc),
    },
    {
      label: getCmsField(cmsPage, "sms-pricing", "benefit3_label", isRTL, t.products.sms.packages.benefits.instant),
      description: getCmsField(cmsPage, "sms-pricing", "benefit3_desc", isRTL, t.products.sms.packages.benefits.instantDesc),
    },
  ], [cmsPage, isRTL, t]);

  const cmsPlansRaw = useMemo(() => getCmsField(cmsPage, "sms-pricing", "plans_list", isRTL, serializePlansList(defaultPackages)), [cmsPage, defaultPackages, isRTL]);
  const packages = useMemo(() => parsePlansList(cmsPlansRaw, defaultPackages), [cmsPlansRaw, defaultPackages]);

  const safeActiveTab = heroTabs.length ? activeTab % heroTabs.length : 0;
  const currentHeroTab = heroTabs[safeActiveTab];
  const handleTabSelect = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  useEffect(() => {
    if (!heroTabs.length) return;
    const autoplay = window.setInterval(() => {
      setActiveTab((prev) => (prev + 1) % heroTabs.length);
    }, 4000);
    return () => window.clearInterval(autoplay);
  }, [heroTabs.length]);

  return (
    <div 
      className={`min-h-screen bg-white ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`}
      data-page="sms"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <section ref={heroSectionRef} className={`pt-24 pb-8 md:pt-32 md:pb-16 overflow-hidden transition-colors duration-700 ${currentHeroTab.color} min-h-[700px] flex flex-col justify-center`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center flex-1">
            <AnimatePresence mode="wait">
              <motion.div 
                key={safeActiveTab}
                initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -40 : 40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6 md:space-y-8 max-w-2xl text-center lg:text-right"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-[#7A1E2E]/10 rounded-full text-sm font-bold text-[#7A1E2E] mx-auto lg:mx-0 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A1E2E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7A1E2E]"></span>
                  </span>
                  <span>{currentHeroTab.label}</span>
                </div>
                <h1 className={`${headingFontClass} text-4xl md:text-7xl font-black text-[#7A1E2E] leading-[1.1] tracking-tight`}>
                  {currentHeroTab.title}
                </h1>
                <p className="text-lg md:text-2xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium opacity-90">
                  {currentHeroTab.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                  <Button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#7A1E2E] hover:bg-[#601824] text-white h-14 md:h-16 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-[#7A1E2E]/20 w-full sm:w-auto transform transition-transform hover:scale-105">
                    {currentHeroTab.cta}
                  </Button>
                  <div className="hidden sm:flex items-center gap-4 px-6 py-2 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                    <div className="flex -space-x-3 space-x-reverse overflow-visible">
                      {trustedBadgeLogos.map((logo, idx) => (
                        <div key={`${logo}-${idx}`} className="w-10 h-10 rounded-full border-2 border-white bg-white shadow-md overflow-hidden flex items-center justify-center p-1.5 hover:z-10 transition-all hover:scale-110">
                          <Image src={encodeImagePath(logo)} alt={`Partner ${idx + 1}`} width={40} height={40} quality={100} className="h-full w-full object-contain" />
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 leading-none">{heroClientsCount}</p>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">{heroClientsLabel}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="relative flex justify-center lg:justify-end z-10 mt-8 lg:mt-0">
               <AnimatePresence mode="wait">
                <motion.div key={safeActiveTab + '-img'} initial={{ opacity: 0, scale: 0.9, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.9, rotate: 5 }} transition={{ duration: 0.7, ease: "backOut" }} className="relative w-full max-w-[320px] md:max-w-md">
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full blur-[80px] opacity-40 transition-colors duration-1000 ${currentHeroTab.imgColor}`}></div>
                  <div className="aspect-[4/5] md:aspect-[4/5] rounded-[2.5rem] bg-white/40 backdrop-blur-md border-4 border-white/60 shadow-2xl overflow-hidden relative group ring-1 ring-black/5">
                    <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8 space-y-4 md:space-y-6">
                      {currentHeroTab.messages.map((msg, mIdx) => (
                        <motion.div key={mIdx} initial={{ x: isRTL ? 50 : -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + mIdx * 0.2, duration: 0.5 }} className="transform transition-transform duration-500 hover:scale-105">
                          <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl border border-white/80 ring-1 ring-black/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#7A1E2E]"></div>
                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#7A1E2E] to-[#5a1622] flex items-center justify-center text-white text-sm md:text-lg font-black shadow-lg shadow-[#7A1E2E]/20">{msg.sender.charAt(0)}</div>
                                <div className="text-right">
                                  <p className="font-black text-slate-900 text-sm md:text-base leading-none">{msg.sender}</p>
                                  <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">{mIdx === 0 ? heroMsg1Time : heroMsg2Time}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${mIdx === 0 ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                              </div>
                            </div>
                            <p className="text-slate-800 font-bold leading-relaxed text-sm md:text-xl text-right">{msg.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-12 md:mt-20 relative z-20">
            <div ref={scrollContainerRef} className="flex overflow-x-auto md:overflow-visible gap-3 md:gap-4 justify-start md:justify-center px-4 md:px-0 scrollbar-hide py-4">
              {heroTabs.map((tab, index) => (
                <button key={tab.id} onClick={() => handleTabSelect(index)} className={`flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-2xl transition-all duration-500 font-black text-sm md:text-lg whitespace-nowrap shrink-0 border-2 ${safeActiveTab === index ? "bg-[#7A1E2E] text-white border-[#7A1E2E] shadow-2xl shadow-[#7A1E2E]/30 scale-105 -translate-y-1" : "bg-white/80 backdrop-blur-sm text-slate-500 hover:bg-white hover:text-[#7A1E2E] border-slate-100 hover:border-[#7A1E2E]/20 shadow-sm"}`}>
                  <tab.icon className={`w-5 h-5 md:w-6 md:h-6 ${safeActiveTab === index ? "text-white" : "text-[#7A1E2E]/40"}`} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="max-w-md mx-auto h-1.5 bg-slate-200/50 rounded-full mt-4 overflow-hidden backdrop-blur-sm">
               <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} key={safeActiveTab} transition={{ duration: 4, ease: "linear" }} className="h-full bg-[#7A1E2E]" />
            </div>
          </div>
        </div>
      </section>
      <TrustedPartners partners={partners} />
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#7A1E2E] mb-4`}>{cmsValueTitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#7A1E2E]/10 rounded-xl flex items-center justify-center shrink-0"><Rocket className="w-6 h-6 text-[#7A1E2E]" /></div>
                <h3 className={`${headingFontClass} text-xl font-bold text-slate-900`}>{getCmsField(cmsPage, 'sms-value', 'feature1_title', isRTL, t.products.sms.valueProps.zeroLatency.title)}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">{getCmsField(cmsPage, 'sms-value', 'feature1_desc', isRTL, t.products.sms.valueProps.zeroLatency.description)}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#7A1E2E]/10 rounded-xl flex items-center justify-center shrink-0"><ShieldCheck className="w-6 h-6 text-[#7A1E2E]" /></div>
                <h3 className={`${headingFontClass} text-xl font-bold text-slate-900`}>{getCmsField(cmsPage, 'sms-value', 'feature2_title', isRTL, t.products.sms.valueProps.senderId.title)}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">{getCmsField(cmsPage, 'sms-value', 'feature2_desc', isRTL, t.products.sms.valueProps.senderId.description)}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#7A1E2E]/10 rounded-xl flex items-center justify-center shrink-0"><Headphones className="w-6 h-6 text-[#7A1E2E]" /></div>
                <h3 className={`${headingFontClass} text-xl font-bold text-slate-900`}>{getCmsField(cmsPage, 'sms-value', 'feature3_title', isRTL, t.products.sms.valueProps.support.title)}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">{getCmsField(cmsPage, 'sms-value', 'feature3_desc', isRTL, t.products.sms.valueProps.support.description)}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-[#7A1E2E] to-[#5a1622] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-6 border border-white/20">{getCmsField(cmsPage, 'sms-special-offer', 'badge', isRTL, t.products.sms.specialOffer.badge)}</div>
          <h2 className={`${headingFontClass} text-3xl md:text-5xl font-bold mb-6`}>{getCmsField(cmsPage, 'sms-special-offer', 'title_part1', isRTL, t.products.sms.specialOffer.titlePart1)}<br /><span className="text-[#F8A36B] mt-4 block">{getCmsField(cmsPage, 'sms-special-offer', 'title_part2', isRTL, t.products.sms.specialOffer.titlePart2)}</span></h2>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Button asChild className="bg-white text-[#7A1E2E] hover:bg-[#E8DCCB] h-14 px-10 text-lg font-bold rounded-xl shadow-2xl shadow-black/20 transform hover:scale-105 transition-all">
              <a href={getCmsField(cmsPage, 'sms-special-offer', 'cta_url', isRTL, '#pricing')} target="_blank" rel="noopener noreferrer">{getCmsField(cmsPage, 'sms-special-offer', 'cta_text', isRTL, t.products.sms.specialOffer.cta)}</a>
            </Button>
            <p className="text-white/60 text-sm">{getCmsField(cmsPage, 'sms-special-offer', 'disclaimer', isRTL, t.products.sms.specialOffer.disclaimer)}</p>
          </div>
        </div>
      </section>
      {/* 5. Use Cases */}
      <section className="py-24 bg-[#E8DCCB]/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className={`${headingFontClass} text-3xl font-bold text-[#7A1E2E] mb-8`}>{getCmsField(cmsPage, 'sms-usecases', 'title', isRTL, t.products.sms.useCases.title)}</h2>
              <div className="space-y-6">
                {(() => {
                  const usecasesJson = getCmsField(cmsPage, 'sms-usecases', 'usecases_json', isRTL, '');
                  try {
                    if (usecasesJson) {
                      const items = JSON.parse(usecasesJson);
                      return items.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="mt-1 bg-white p-2 rounded-xl shadow-sm border border-slate-100"><CheckCircle2 className="w-6 h-6 text-[#7A1E2E]" /></div>
                          <div>
                            <h3 className={`${headingFontClass} text-xl font-bold text-slate-900 mb-2`}>{isRTL ? item.titleAr : item.titleEn}</h3>
                            <p className="text-slate-600">{isRTL ? item.descAr : item.descEn}</p>
                          </div>
                        </div>
                      ));
                    }
                  } catch (e) {}

                  return [
                    { title: getCmsField(cmsPage, 'sms-usecases', 'otp_title', isRTL, t.products.sms.useCases.otp.title), desc: getCmsField(cmsPage, 'sms-usecases', 'otp_desc', isRTL, t.products.sms.useCases.otp.description) },
                    { title: getCmsField(cmsPage, 'sms-usecases', 'api_title', isRTL, t.products.sms.useCases.api.title), desc: getCmsField(cmsPage, 'sms-usecases', 'api_desc', isRTL, t.products.sms.useCases.api.description) },
                    { title: getCmsField(cmsPage, 'sms-usecases', 'marketing_title', isRTL, t.products.sms.useCases.marketing.title), desc: getCmsField(cmsPage, 'sms-usecases', 'marketing_desc', isRTL, t.products.sms.useCases.marketing.description) }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-[#7A1E2E]" /></div>
                      <div>
                        <h3 className={`${headingFontClass} text-xl font-bold text-slate-900 mb-2`}>{item.title}</h3>
                        <p className="text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#7A1E2E]/10">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Smartphone className="w-5 h-5 text-slate-600" /></div>
                <div className={`text-${isRTL ? 'right' : 'left'}`}>
                  <h4 className={`${headingFontClass} font-bold text-slate-900`}>{isRTL ? "سجل الإرسال المباشر" : "Live Delivery Log"}</h4>
                  <span className="text-xs text-green-600 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{isRTL ? "متصل الآن" : "Online Now"}</span>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                    <div>
                      <div className="flex justify-between items-center w-full gap-8 mb-1">
                        <span className="text-xs font-bold text-slate-700">96650xxxxxxx</span>
                        <span className="text-[10px] text-slate-400">{isRTL ? "الآن" : "Now"}</span>
                      </div>
                      <p className={`text-xs text-slate-500 text-${isRTL ? 'right' : 'left'}`}>{isRTL ? "تم استلام طلبك رقم #8821 بنجاح وسيتم تجهيزه..." : "Your order #8821 has been received successfully and will be processed..."}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className={`${headingFontClass} text-3xl md:text-5xl font-extrabold text-[#7A1E2E] mb-4`}>{cmsPricingTitle}</h2>
            <p className="text-slate-500 text-lg mb-8">{cmsPricingSubtitle}</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 inline-flex mx-auto">
              <div className="flex items-center gap-3 text-sm md:text-base text-slate-700">
                <div className="bg-[#7A1E2E]/10 p-2 rounded-full"><Calendar className="w-5 h-5 text-[#7A1E2E]" /></div>
                <span><span className="font-bold">{pricingBenefits[0].label}:</span> {pricingBenefits[0].description}</span>
              </div>
              <div className="hidden md:block w-px h-10 bg-slate-200"></div>
              <div className="flex items-center gap-3 text-sm md:text-base text-slate-700">
                <div className="bg-[#7A1E2E]/10 p-2 rounded-full"><Handshake className="w-5 h-5 text-[#7A1E2E]" /></div>
                <span><span className="font-bold">{pricingBenefits[1].label}:</span> {pricingBenefits[1].description}</span>
              </div>
              <div className="hidden md:block w-px h-10 bg-slate-200"></div>
              <div className="flex items-center gap-3 text-sm md:text-base text-slate-700">
                <div className="bg-[#7A1E2E]/10 p-2 rounded-full"><Zap className="w-5 h-5 text-[#7A1E2E]" /></div>
                <span><span className="font-bold">{pricingBenefits[2].label}:</span> {pricingBenefits[2].description}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <div key={index} className={`relative flex flex-col p-4 md:p-6 rounded-2xl transition-all duration-300 ${pkg.featured ? "border-2 border-[#7A1E2E] bg-white shadow-xl scale-105 z-10" : "border border-slate-200 bg-white hover:border-[#7A1E2E]/30 hover:shadow-lg"}`}>
                {pkg.featured && <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#7A1E2E] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">{t.products.sms.packages.items.professional.description}</div>}
                
                {/* Discount Badge */}
                {!pkg.isCustom && pkg.price && pkg.originalPrice && pkg.originalPrice > pkg.price && (
                  <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm animate-pulse`}>
                    {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% {isRTL ? 'خصم' : 'OFF'}
                  </div>
                )}

                <div className="mb-4 text-center">
                  <h3 className={`${headingFontClass} text-xl font-bold text-slate-900`}>{pkg.messages ? `${formatNumber(pkg.messages)} ${isRTL ? 'رسالة' : 'Messages'}` : (isRTL ? "مخصص" : "Custom")}</h3>
                  <p className="text-sm text-slate-500 mt-1">{pkg.description}</p>
                </div>
                {!pkg.isCustom && pkg.price !== null ? (
                  <div className="mb-6 text-center space-y-1">
                    {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                       <div className="flex items-center justify-center gap-1 text-gray-400 line-through text-sm decoration-red-500/50">
                          <span>{formatNumber(pkg.originalPrice)}</span>
                       </div>
                    )}
                    <div className="flex items-baseline gap-1 justify-center">
                      <span className="text-3xl font-extrabold text-[#7A1E2E]">{formatNumber(pkg.price)}</span>
                      <span className="inline-flex items-center"><Image src="/trustedby/Saudi_Riyal_Symbol.svg.png" alt={isRTL ? "رمز الريال السعودي" : "Saudi Riyal symbol"} width={18} height={18} className="w-[18px] h-[18px] object-contain opacity-70" /></span>
                    </div>
                  </div>
                ) : <div className="mb-6 text-center"><p className="text-lg text-slate-600 font-semibold">{t.products.sms.packages.items.custom.feature}</p></div>}
                <div className={`mt-auto bg-slate-50 rounded-xl p-3 mb-6 text-center border ${pkg.featured ? "bg-[#7A1E2E]/5 border-[#7A1E2E]/10" : "border-transparent"}`}><p className="text-sm text-slate-700 font-medium">{pkg.feature}</p></div>
                <Button className={`w-full font-bold ${pkg.featured ? "bg-[#7A1E2E] hover:bg-[#601824] text-white" : "bg-transparent border border-[#7A1E2E] text-[#7A1E2E] hover:bg-[#7A1E2E]/5"}`} asChild>
                  {pkg.isCustom ? <Link href="/contact">{t.products.sms.packages.buttons.contact}</Link> : <a href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer">{pkg.featured ? getCmsField(cmsPage, 'sms-pricing', 'btn_topup', isRTL, isRTL ? "اشحن الآن" : "Top Up Now") : getCmsField(cmsPage, 'sms-pricing', 'btn_choose', isRTL, isRTL ? "اختر الباقة" : "Choose Package")}</a>}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#F9FAFB] border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-[#7A1E2E] bg-[#7A1E2E]/10 px-3 py-1 rounded-full text-xs font-bold mb-4"><Code2 className="w-4 h-4" /> {getCmsField(cmsPage, 'sms-developers', 'badge', isRTL, t.products.sms.developers.badge)}</div>
              <h2 className={`${headingFontClass} text-3xl font-bold text-[#7A1E2E] mb-4`}>{getCmsField(cmsPage, 'sms-developers', 'title', isRTL, t.products.sms.developers.title)}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">{getCmsField(cmsPage, 'sms-developers', 'description', isRTL, t.products.sms.developers.description)}</p>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {(() => {
                  const platformsJson = getCmsField(cmsPage, 'sms-developers', 'platforms_json', isRTL, '');
                  try {
                    if (platformsJson) {
                      const items = JSON.parse(platformsJson);
                      return items.map((item: any, i: number) => (
                        <div key={i} className="bg-white border-2 border-slate-100 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm hover:border-primary/20 transition-all">
                          {item.icon && <img src={item.icon} className="w-5 h-5 object-contain" alt="" />}
                          <span className="text-sm font-bold text-slate-700">{isRTL ? item.titleAr : item.titleEn}</span>
                        </div>
                      ));
                    }
                  } catch (e) {}
                  
                  return [1, 2, 3, 4].map(i => {
                    const val = getCmsField(cmsPage, 'sms-developers', `platform_${i}`, isRTL, '');
                    if (!val) return null;
                    return (
                      <span key={i} className="bg-white border px-3 py-1 rounded text-sm font-bold text-slate-600">{val}</span>
                    );
                  });
                })()}
              </div>
              <a href={getCmsField(cmsPage, 'sms-developers', 'cta_url', isRTL, '#')} className="flex items-center gap-2 text-[#7A1E2E] font-bold hover:underline">{getCmsField(cmsPage, 'sms-developers', 'cta_text', isRTL, t.products.sms.developers.cta)} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}</a>
            </div>
            <div className="w-full max-w-md bg-[#1E293B] rounded-xl p-6 shadow-2xl overflow-hidden font-mono text-xs text-blue-300">
              <div className="flex gap-1.5 mb-4"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
              <p className="text-slate-400 mb-2">{`// Send SMS Example`}</p>
              <p className="mb-1"><span className="text-purple-400">await</span> orbit.send({`{`}</p>
              <p className="pl-4"><span className="text-blue-400">to</span>: <span className="text-green-400">&quot;96650xxxxxxx&quot;</span>,</p>
              <p className="pl-4"><span className="text-blue-400">body</span>: <span className="text-green-400">&quot;Your OTP is 1234&quot;</span>,</p>
              <p className="pl-4"><span className="text-blue-400">sender</span>: <span className="text-green-400">&quot;MyStore&quot;</span></p>
              <p className="mb-1">{`}`});</p>
              <p className="mt-2 text-green-500">{`// Result: Message Sent ✅`}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <MessageSquare className="w-16 h-16 text-[#7A1E2E] mx-auto mb-6 opacity-20" />
          <h2 className={`${headingFontClass} text-3xl font-bold text-[#7A1E2E] mb-6`}>{getCmsField(cmsPage, 'sms-final-cta', 'title', isRTL, t.products.sms.finalCta.title)}</h2>
          <Button size="lg" className="bg-[#7A1E2E] hover:bg-[#601824] text-white text-lg px-10 h-16 rounded-xl shadow-xl shadow-[#7A1E2E]/20" asChild>
            <a href={getCmsField(cmsPage, 'sms-final-cta', 'cta_url', isRTL, 'https://app.mobile.net.sa/reg')} target="_blank" rel="noopener noreferrer">{getCmsField(cmsPage, 'sms-final-cta', 'cta_text', isRTL, t.products.sms.finalCta.cta)}</a>
          </Button>
          <p className="mt-4 text-slate-400 text-sm">{getCmsField(cmsPage, 'sms-final-cta', 'subtitle', isRTL, t.products.sms.finalCta.sub)}</p>
        </div>
      </section>
    </div>
  );
};
