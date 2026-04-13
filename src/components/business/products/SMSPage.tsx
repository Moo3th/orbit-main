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
      const [messagesRaw, priceRaw, featureRaw, descriptionRaw, featuredRaw, customRaw] = line.split("|");
      const messagesIsCustom = (messagesRaw || "").trim().toLowerCase() === "custom";
      const messages = messagesIsCustom ? null : Number(messagesRaw);
      const price = priceRaw?.trim() ? Number(priceRaw) : null;
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const cmsValueTitle = getCmsField(cmsPage, 'sms-value', 'title', isRTL, t.products.sms.valueProps.title);
  const cmsPricingTitle = getCmsField(cmsPage, 'sms-pricing', 'title', isRTL, t.products.sms.packages.title);
  const trustedBadgeLogos = React.useMemo(() => {
    const dbLogos = partners
      .filter((partner) => partner.active && partner.logo)
      .map((partner) => partner.logo);
    if (dbLogos.length) {
      return dbLogos.slice(0, 3);
    }
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

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };



  const heroTabs = useMemo(() => [
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
  ], [
    cmsPage,
    getHeroMessages,
    isRTL,
    t
  ]);

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
  const cmsPlansRaw = useMemo(() => getCmsField(
    cmsPage,
    "sms-pricing",
    "plans_list",
    isRTL,
    serializePlansList(defaultPackages),
  ), [cmsPage, defaultPackages, isRTL]);
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
    }, 3000);

    return () => {
      window.clearInterval(autoplay);
    };
  }, [heroTabs.length]);

  return (
    <div 
      className={`min-h-screen bg-white ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`}
      data-page="sms"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >


      {/* 1. Tabbed Hero Section */}
      <section ref={heroSectionRef} className={`pt-24 pb-8 md:pt-24 md:pb-16 overflow-hidden transition-colors duration-500 ${currentHeroTab.color} min-h-[80vh] md:min-h-0 flex flex-col justify-center`}>
        <div className="container mx-auto px-3 md:px-6 flex flex-col h-full">

          {/* Tab Navigation - At top for mobile, bottom for desktop */}
          <div className="order-1 md:order-3 mt-0 mb-4 md:mt-20 md:mb-0">
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex md:flex-wrap overflow-x-auto md:overflow-visible gap-2 md:gap-4 justify-start md:justify-center px-2 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
            >
              {heroTabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelect(index)}
                    className={`
                      flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 font-bold text-xs md:text-base whitespace-nowrap shrink-0
                      ${safeActiveTab === index
                        ? "bg-[#7A1E2E] text-white shadow-md md:shadow-lg shadow-[#7A1E2E]/20 scale-100 md:scale-105"
                        : "bg-white/60 md:bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 md:border-transparent"
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 md:w-5 md:h-5 ${safeActiveTab === index ? "text-white" : "text-slate-400"} ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-3 md:gap-8 items-center flex-1 order-2 md:order-1">
            {/* Right Content */}
            <div className="space-y-2 md:space-y-6 max-w-2xl animate-in slide-in-from-right-8 duration-500 fade-in key={safeActiveTab} text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-full text-xs md:text-sm font-medium text-slate-600 mx-auto lg:mx-0">
                <span>{`${heroBadgePrefix} ${currentHeroTab.label}`}</span>
              </div>
              <h1 className={`${headingFontClass} text-2xl md:text-6xl font-extrabold text-[#7A1E2E] leading-tight`}>
                {currentHeroTab.title}
              </h1>
              <p className="text-xs md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {currentHeroTab.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 pt-1 md:pt-4 justify-center lg:justify-start">
                <Button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#7A1E2E] hover:bg-[#601824] text-white h-10 md:h-14 px-5 md:px-8 text-sm md:text-lg font-bold rounded-xl shadow-lg shadow-[#7A1E2E]/20 w-full sm:w-auto"
                >
                  {currentHeroTab.cta}
                </Button>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2">
                  <div className="flex -space-x-3 space-x-reverse overflow-visible">
                    {trustedBadgeLogos.map((logo, idx) => (
                      <div
                        key={`${logo}-${idx}`}
                        className="w-12 h-12 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden flex items-center justify-center p-1.5"
                      >
                        <Image
                          src={encodeImagePath(logo)}
                          alt={`Trusted partner ${idx + 1}`}
                          width={48}
                          height={48}
                          quality={100}
                          sizes="48px"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-slate-900">{heroClientsCount}</p>
                    <p className="text-slate-500 text-xs">{heroClientsLabel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Content (Visual & Message Bubble) */}
            <div className="relative flex justify-center lg:justify-end animate-in slide-in-from-left-8 duration-700 fade-in key={safeActiveTab + '-img'} z-10 mt-2 md:mt-0">
              {/* Abstract Background Blob */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-3xl opacity-50 ${currentHeroTab.imgColor}`}></div>

              <div className="relative w-full max-w-[280px] md:max-w-md">
                {/* Main Image Placeholder - Representative of the sector */}
                <div className="aspect-[4/5] md:aspect-[4/5] rounded-2xl md:rounded-[2rem] bg-slate-900/5 backdrop-blur-sm border border-white/20 shadow-xl md:shadow-2xl overflow-hidden relative group">
                  <div className={`absolute inset-0 opacity-20 ${currentHeroTab.imgColor}`}></div>

                  {/* Floating SMS Bubbles - Two Messages */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[90%] space-y-2 md:space-y-4">
                    {/* First Message */}
                    <div className="transform transition-transform duration-500 hover:scale-105">
                      <div className="bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl p-2 md:p-4 shadow-xl border border-white/50">
                        <div className="flex items-center justify-between mb-1.5 md:mb-3 pb-1.5 md:pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#7A1E2E] flex items-center justify-center text-white text-[9px] md:text-xs font-bold shadow-md">
                              {currentHeroTab.messages[0].sender.charAt(0)}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900 text-xs md:text-sm">{currentHeroTab.messages[0].sender}</p>
                              <p className="text-[9px] md:text-[10px] text-slate-400">{heroMsg1Time}</p>
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed text-xs md:text-base text-right">
                          {currentHeroTab.messages[0].text}
                        </p>
                      </div>
                    </div>

                    {/* Second Message */}
                    <div className="transform transition-transform duration-500 hover:scale-105">
                      <div className="bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl p-2 md:p-4 shadow-xl border border-white/50">
                        <div className="flex items-center justify-between mb-1.5 md:mb-3 pb-1.5 md:pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#7A1E2E] flex items-center justify-center text-white text-[9px] md:text-xs font-bold shadow-md">
                              {currentHeroTab.messages[1].sender.charAt(0)}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900 text-xs md:text-sm">{currentHeroTab.messages[1].sender}</p>
                              <p className="text-[9px] md:text-[10px] text-slate-400">{heroMsg2Time}</p>
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed text-xs md:text-base text-right">
                          {currentHeroTab.messages[1].text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trusted Partners Section */}
      <TrustedPartners partners={partners} />

      {/* 3. Value Proposition */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#7A1E2E] mb-4`}>{cmsValueTitle}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#7A1E2E]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Rocket className="w-6 h-6 text-[#7A1E2E]" />
                </div>
                <h3 className={`${headingFontClass} text-xl font-bold text-slate-900`}>{t.products.sms.valueProps.zeroLatency.title}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {t.products.sms.valueProps.zeroLatency.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#7A1E2E]/10 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#7A1E2E]" />
                </div>
                <h3 className={`${headingFontClass} text-xl font-bold text-slate-900`}>{t.products.sms.valueProps.senderId.title}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {t.products.sms.valueProps.senderId.description}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#7A1E2E]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6 text-[#7A1E2E]" />
                </div>
                <h3 className={`${headingFontClass} text-xl font-bold text-slate-900`}>{t.products.sms.valueProps.support.title}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {t.products.sms.valueProps.support.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Special Offer (The Hook) */}
      <section className="py-20 bg-gradient-to-r from-[#7A1E2E] to-[#5a1622] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-6 border border-white/20">
            {t.products.sms.specialOffer.badge}
          </div>
          <h2 className={`${headingFontClass} text-3xl md:text-5xl font-bold mb-6`}>
            {t.products.sms.specialOffer.titlePart1}<br />
            <span className="text-[#F8A36B] mt-4 block">{t.products.sms.specialOffer.titlePart2}</span>
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-[#7A1E2E] hover:bg-[#E8DCCB] h-14 px-10 text-lg font-bold rounded-xl shadow-2xl shadow-black/20 transform hover:scale-105 transition-all"
            >
              {t.products.sms.specialOffer.cta}
            </Button>
            <p className="text-white/60 text-sm">{t.products.sms.specialOffer.disclaimer}</p>
          </div>
        </div>
      </section>

      {/* 5. Use Cases */}
      <section className="py-24 bg-[#E8DCCB]/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className={`${headingFontClass} text-3xl font-bold text-[#7A1E2E] mb-8`}>{t.products.sms.useCases.title}</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-[#7A1E2E]" />
                  </div>
                  <div>
                    <h3 className={`${headingFontClass} text-xl font-bold text-slate-900 mb-2`}>{t.products.sms.useCases.otp.title}</h3>
                    <p className="text-slate-600">{t.products.sms.useCases.otp.description}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-[#7A1E2E]" />
                  </div>
                  <div>
                    <h3 className={`${headingFontClass} text-xl font-bold text-slate-900 mb-2`}>{t.products.sms.useCases.api.title}</h3>
                    <p className="text-slate-600">
                      {t.products.sms.useCases.api.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-[#7A1E2E]" />
                  </div>
                  <div>
                    <h3 className={`${headingFontClass} text-xl font-bold text-slate-900 mb-2`}>{t.products.sms.useCases.marketing.title}</h3>
                    <p className="text-slate-600">
                      {t.products.sms.useCases.marketing.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#7A1E2E]/10">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-slate-600" />
                </div>
                <div className={`text-${isRTL ? 'right' : 'left'}`}>
                  <h4 className={`${headingFontClass} font-bold text-slate-900`}>{isRTL ? "سجل الإرسال المباشر" : "Live Delivery Log"}</h4>
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {isRTL ? "متصل الآن" : "Online Now"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="mt-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center w-full gap-8 mb-1">
                        <span className="text-xs font-bold text-slate-700">96650xxxxxxx</span>
                        <span className="text-[10px] text-slate-400">{isRTL ? "الآن" : "Now"}</span>
                      </div>
                      <p className={`text-xs text-slate-500 text-${isRTL ? 'right' : 'left'}`}>
                        {isRTL ? "تم استلام طلبك رقم #8821 بنجاح وسيتم تجهيزه..." : "Your order #8821 has been received successfully and will be processed..."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing - Grid of Cards */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4">

          {/* Header & Global Features */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className={`${headingFontClass} text-3xl md:text-5xl font-extrabold text-[#7A1E2E] mb-4`}>
              {cmsPricingTitle}
            </h2>
            <p className="text-slate-500 text-lg mb-8">
              {cmsPricingSubtitle}
            </p>

            {/* Benefits Bar */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 inline-flex mx-auto">
              <div className="flex items-center gap-3 text-sm md:text-base text-slate-700">
                <div className="bg-[#7A1E2E]/10 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-[#7A1E2E]" />
                </div>
                <span><span className="font-bold">{pricingBenefits[0].label}:</span> {pricingBenefits[0].description}</span>
              </div>
              <div className="hidden md:block w-px h-10 bg-slate-200"></div>
              <div className="flex items-center gap-3 text-sm md:text-base text-slate-700">
                <div className="bg-[#7A1E2E]/10 p-2 rounded-full">
                  <Handshake className="w-5 h-5 text-[#7A1E2E]" />
                </div>
                <span><span className="font-bold">{pricingBenefits[1].label}:</span> {pricingBenefits[1].description}</span>
              </div>
              <div className="hidden md:block w-px h-10 bg-slate-200"></div>
              <div className="flex items-center gap-3 text-sm md:text-base text-slate-700">
                <div className="bg-[#7A1E2E]/10 p-2 rounded-full">
                  <Zap className="w-5 h-5 text-[#7A1E2E]" />
                </div>
                <span><span className="font-bold">{pricingBenefits[2].label}:</span> {pricingBenefits[2].description}</span>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`
                  relative flex flex-col p-4 md:p-6 rounded-2xl transition-all duration-300
                  ${pkg.featured
                    ? "border-2 border-[#7A1E2E] bg-white shadow-xl scale-105 z-10"
                    : "border border-slate-200 bg-white hover:border-[#7A1E2E]/30 hover:shadow-lg"
                  }
                `}
              >
                {pkg.featured && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#7A1E2E] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                    {t.products.sms.packages.items.professional.description}
                  </div>
                )}

                <div className="mb-4 text-center">
                  <h3 className={`${headingFontClass} text-xl font-bold text-slate-900`}>
                    {pkg.messages ? `${formatNumber(pkg.messages)} ${isRTL ? 'رسالة' : 'Messages'}` : (isRTL ? "مخصص" : "Custom")}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{pkg.description}</p>
                </div>

                {!pkg.isCustom && pkg.price !== null ? (
                  <div className="mb-6 text-center">
                    <div className="flex items-baseline gap-1 justify-center">
                      <span className="text-3xl font-extrabold text-[#7A1E2E]">{formatNumber(pkg.price)}</span>
                      <span className="inline-flex items-center">
                        <Image
                          src="/trustedby/Saudi_Riyal_Symbol.svg.png"
                          alt={isRTL ? "رمز الريال السعودي" : "Saudi Riyal symbol"}
                          width={18}
                          height={18}
                          className="w-[18px] h-[18px] object-contain opacity-70"
                        />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 text-center">
                    <p className="text-lg text-slate-600 font-semibold">{t.products.sms.packages.items.custom.feature}</p>
                  </div>
                )}

                <div className={`
                  mt-auto bg-slate-50 rounded-xl p-3 mb-6 text-center border
                  ${pkg.featured ? "bg-[#7A1E2E]/5 border-[#7A1E2E]/10" : "border-transparent"}
                `}>
                  <p className="text-sm text-slate-700 font-medium">{pkg.feature}</p>
                </div>

                <Button
                  className={`w-full font-bold ${pkg.featured ? "bg-[#7A1E2E] hover:bg-[#601824] text-white" : "bg-transparent border border-[#7A1E2E] text-[#7A1E2E] hover:bg-[#7A1E2E]/5"}`}
                  asChild
                >
                  {pkg.isCustom ? (
                    <Link href="/contact">{t.products.sms.packages.buttons.contact}</Link>
                  ) : (
                    <a href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer">
                      {pkg.featured ? (isRTL ? "اشحن الآن" : "Top Up Now") : (isRTL ? "اختر الباقة" : "Choose Package")}
                    </a>
                  )}
                </Button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Developers */}
      <section className="py-20 bg-[#F9FAFB] border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-[#7A1E2E] bg-[#7A1E2E]/10 px-3 py-1 rounded-full text-xs font-bold mb-4">
                <Code2 className="w-4 h-4" /> {t.products.sms.developers.badge}
              </div>
              <h2 className={`${headingFontClass} text-3xl font-bold text-[#7A1E2E] mb-4`}>{t.products.sms.developers.title}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {t.products.sms.developers.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                {/* Platform Badges */}
                <span className="bg-white border px-3 py-1 rounded text-sm font-bold text-slate-600">{isRTL ? "دفترة" : "Daftra"}</span>
                <span className="bg-white border px-3 py-1 rounded text-sm font-bold text-slate-600">{isRTL ? "سلة" : "Salla"}</span>
                <span className="bg-white border px-3 py-1 rounded text-sm font-bold text-slate-600">{isRTL ? "نظام نور" : "Noor"}</span>
                <span className="bg-white border px-3 py-1 rounded text-sm font-bold text-slate-600">{isRTL ? "إتقان" : "Itqan"}</span>
              </div>

              <a href="#" className="flex items-center gap-2 text-[#7A1E2E] font-bold hover:underline">
                {t.products.sms.developers.cta} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>
            </div>

            <div className="w-full max-w-md bg-[#1E293B] rounded-xl p-6 shadow-2xl overflow-hidden font-mono text-xs text-blue-300">
              <div className="flex gap-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
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

      {/* 8. Final CTA Footer */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <MessageSquare className="w-16 h-16 text-[#7A1E2E] mx-auto mb-6 opacity-20" />
          <h2 className={`${headingFontClass} text-3xl font-bold text-[#7A1E2E] mb-6`}>{t.products.sms.finalCta.title}</h2>
          <Button
            size="lg"
            className="bg-[#7A1E2E] hover:bg-[#601824] text-white text-lg px-10 h-16 rounded-xl shadow-xl shadow-[#7A1E2E]/20"
            asChild
          >
            <a href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer">
              {t.products.sms.finalCta.cta}
            </a>
          </Button>
          <p className="mt-4 text-slate-400 text-sm">{t.products.sms.finalCta.sub}</p>
        </div>
      </section>

    </div>
  );
};
