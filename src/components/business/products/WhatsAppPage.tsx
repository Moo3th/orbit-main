'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  MessageCircle, Users, Shield, Smartphone, Globe,
  CheckCircle2, Zap, Bot, Send, BarChart3, Star,
  Clock, TrendingUp, Award, Target, Headphones, Sparkles,
  BadgeCheck, ArrowRight, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';
import {
  getDefaultWhatsAppConversationPrices,
  getDefaultWhatsAppPlans,
  parseWhatsAppConversationPrices,
  parseWhatsAppPlans,
  serializeWhatsAppConversationPrices,
  serializeWhatsAppPlans,
} from '@/lib/cms/whatsappPricing';

const cstLogo = "/WhatsAppPage/cst.png";
const metaLogo = "/WhatsAppPage/meta.png";
const solutionTeam = "/WhatsAppPage/الموقع - الفريق يدير رقم موحد.jpg.jpeg";
const solutionWorkflow = "/WhatsAppPage/الموقع - ادارة الصلاحيات.jpg.jpeg";
const solutionChatbot = "/WhatsAppPage/الموقع - الردود الالية.jpg.jpeg";
const solutionBroadcast = "/WhatsAppPage/الموقع - فلترة الرسائل.jpg.jpeg";
const solutionSchedule = "/WhatsAppPage/الموقع - جدولة الرسائل.jpg.jpeg";
const solutionReports = "/WhatsAppPage/الموقع - تقارير تفصيلية.jpg.jpeg";
const saudiRiyalSymbol = "/trustedby/Saudi_Riyal_Symbol.svg.png";

interface WhatsAppPageProps {
  cmsPage?: CmsPage | null;
}

export const WhatsAppPage = ({ cmsPage = null }: WhatsAppPageProps) => {
  const { isRTL } = useLanguage();
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const [selectedTiers, setSelectedTiers] = useState<Record<number, number>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ id: number, type: 'user' | 'bot' | 'sales', text: string, buttons?: boolean, confirmButton?: boolean }>>([
    { id: 1, type: 'bot', text: isRTL ? 'بالتأكيد! لدينا 3 باقات رئيسية تبدأ من 399 ر.س شهرياً...' : 'Absolutely! We have 3 main packages starting from 399 SAR monthly...', buttons: true }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // State للحلول slider
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const heroBadge = getCmsField(cmsPage, 'wa-hero', 'badge', isRTL, isRTL ? "واتساب أعمال API المعتمد" : "Official WhatsApp Business API");
  const heroTitle = getCmsField(cmsPage, 'wa-hero', 'title', isRTL, isRTL ? "تواصل إحترافي مع عملائك" : "Professional Communication");
  const heroSubtitle = getCmsField(cmsPage, 'wa-hero', 'subtitle', isRTL, isRTL ? "عبر واتساب أعمال API" : "via WhatsApp Business API");
  const heroDescription = getCmsField(
    cmsPage,
    'wa-hero',
    'description',
    isRTL,
    isRTL
      ? "كن أقرب لعملائك. نوفر لك ربطاً رسمياً ومعتمداً بخدمة واتساب مع أدوات متقدمة لإدارة المحادثات، الشات بوت، والحملات التسويقية."
      : "Get closer to your customers. We provide an official WhatsApp integration with advanced tools for chat management, chatbots, and marketing campaigns."
  );
  const pricingTitle = getCmsField(
    cmsPage,
    'wa-pricing',
    'title',
    isRTL,
    isRTL ? "اختر الباقة المناسبة لنمو أعمالك" : "Choose the right package for your business growth"
  );
  const pricingSubtitle = getCmsField(cmsPage, 'wa-pricing', 'subtitle', isRTL, isRTL ? "باقات مرنة تناسب جميع أحجام الأعمال من الشركات الناشئة إلى المؤسسات الكبرى" : "Flexible packages suitable for all business sizes from startups to large enterprises");
  const pricingPlansNote = getCmsField(cmsPage, 'wa-pricing', 'plans_note', isRTL, isRTL ? "ملاحظة مهمة" : "Important Note");
  const pricingContactNote = getCmsField(cmsPage, 'wa-pricing', 'contact_note', isRTL, isRTL ? "الأسعار الموضحة تشمل 3 شرائح لكل باقة. تتوفر خصومات خاصة للشركات الكبرى والجهات الحكومية." : "The stated prices include 3 tiers for each package. Special discounts are available for large companies and government entities.");
  const featuresSectionTitle = getCmsField(cmsPage, 'wa-features', 'title', isRTL, isRTL ? "أدوات احترافية لإدارة محادثاتك" : "Professional Tools to Manage Conversations");
  const featuresSectionSubtitle = getCmsField(cmsPage, 'wa-features', 'subtitle', isRTL, isRTL ? "كل ما تحتاجه لتحويل واتساب إلى قناة تواصل احترافية مع عملائك" : "Everything you need to turn WhatsApp into a professional communication channel with your customers");
  const solutionsTitle = getCmsField(cmsPage, 'wa-features', 'solutions_title', isRTL, featuresSectionTitle);
  const campaignsTitle = getCmsField(cmsPage, 'wa-features', 'campaigns_title', isRTL, isRTL ? "أطلق حملاتك التسويقية بذكاء" : "Launch Your Campaigns Smartly");
  const apiPricingTitle = getCmsField(
    cmsPage,
    'wa-pricing',
    'api_title',
    isRTL,
    getCmsField(cmsPage, 'wa-features', 'api_pricing_title', isRTL, isRTL ? "أسعار محادثات واتساب API" : "WhatsApp API Conversation Prices")
  );
  const apiPricingSubtitle = getCmsField(
    cmsPage,
    'wa-pricing',
    'api_subtitle',
    isRTL,
    isRTL ? "الأسعار التالية محددة من واتساب (Meta) للسوق السعودي" : "The following prices are standardized by WhatsApp (Meta) for the Saudi Market"
  );
  const apiTipTitle = getCmsField(cmsPage, 'wa-pricing', 'api_tip_title', isRTL, isRTL ? "نصيحة احترافية" : "Pro Tip");
  const apiTipDescription = getCmsField(
    cmsPage,
    'wa-pricing',
    'api_tip_description',
    isRTL,
    isRTL
      ? "محادثات خدمة العملاء مجانية تماماً خلال 24 ساعة من آخر رسالة! استفد من هذه الميزة للرد على استفسارات عملائك دون أي تكلفة إضافية."
      : "Customer service conversations are completely free within 24 hours of the last message. Use this to answer customer questions with no extra cost."
  );
  const primaryCtaText = getCmsField(cmsPage, 'wa-hero', 'cta_primary_text', isRTL, isRTL ? "اطلب الخدمة الآن" : "Order Service Now");
  const primaryCtaType = getCmsField(cmsPage, 'wa-hero', 'cta_primary_type', isRTL, "form");
  const primaryCtaUrlRaw = getCmsField(cmsPage, 'wa-hero', 'cta_primary_url', isRTL, "/products/whatsapp/request");
  const primaryCtaUrl = primaryCtaType === 'form' ? "/products/whatsapp/request" : primaryCtaUrlRaw;
  const secondaryCtaText = getCmsField(cmsPage, 'wa-hero', 'cta_secondary_text', isRTL, isRTL ? "استعرض الباقات" : "View Packages");
  const secondaryCtaType = getCmsField(cmsPage, 'wa-hero', 'cta_secondary_type', isRTL, "external");
  const secondaryCtaUrlRaw = getCmsField(cmsPage, 'wa-hero', 'cta_secondary_url', isRTL, "https://wa.me/966920006900");
  const secondaryCtaUrl = secondaryCtaType === 'form' ? "/products/whatsapp/request" : secondaryCtaUrlRaw;

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left (next)
      setCurrentSolutionIndex(prev => (prev === solutions.length - 1 ? 0 : prev + 1));
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right (previous)
      setCurrentSolutionIndex(prev => (prev === 0 ? solutions.length - 1 : prev - 1));
    }
  };

  // Auto-scroll للمحادثة عند إضافة رسائل جديدة
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // تحديث الشريحة المختارة لباقة معينة
  const handleTierChange = (planId: number, tierIndex: number) => {
    setSelectedTiers(prev => ({
      ...prev,
      [planId]: tierIndex
    }));
  };

  // تتبع الباقة المرئية عند السحب
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const cards = container.querySelectorAll('[data-plan-card]');
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActivePlanIndex(closestIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Globe,
      title: isRTL ? "المنصة رقم 1 في المملكة" : "The #1 Platform in the Kingdom",
      description: isRTL ? "الأكثر انتشاراً واستخداماً في السعودية" : "The most widespread and used in Saudi Arabia",
      color: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: CheckCircle2,
      title: isRTL ? "معدل فتح 98%" : "98% Open Rate",
      description: isRTL ? "يتم فتح وقراءة معظم الرسائل فوراً" : "Most messages are opened and read immediately",
      color: "bg-green-50",
      iconColor: "text-[#65BF7B]"
    },
    {
      icon: Shield,
      title: isRTL ? "آمن وموثوق" : "Secure & Reliable",
      description: isRTL ? "تشفير كامل من طرف لطرف للبيانات" : "End-to-end encryption for all data",
      color: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Smartphone,
      title: isRTL ? "سهل الاستخدام" : "Easy to Use",
      description: isRTL ? "تطبيق مألوف للجميع بدون تعقيد" : "Familiar app for everyone without complexity",
      color: "bg-orange-50",
      iconColor: "text-[#F15822]"
    }
  ];

  const solutions = [
    {
      icon: Users,
      title: isRTL ? "رقم موحد للفريق" : "Unified Team Number",
      description: isRTL ? "لا مزيد من تشتت المحادثات، رقم واحد يديره فريق كامل بكفاءة عالية" : "No more scattered conversations, one number managed efficiently by the whole team",
      image: solutionTeam
    },
    {
      icon: Target,
      title: isRTL ? "إدارة الصلاحيات" : "Permissions Management",
      description: isRTL ? "تحويل المحادثات بين المبيعات والدعم الفني بسلاسة واحترافية" : "Seamlessly transfer conversations between sales and technical support",
      image: solutionWorkflow
    },
    {
      icon: Bot,
      title: isRTL ? "الردود الآلية (Chatbot)" : "Automated Replies (Chatbot)",
      description: isRTL ? "خدمة عملاء 24/7 دون تدخل بشري، أجب على الأسئلة الشائعة تلقائياً" : "24/7 customer service without human intervention, automatically answer FAQs",
      image: solutionChatbot
    },
    {
      icon: MessageCircle,
      title: isRTL ? "صندوق وارد مشترك" : "Shared Inbox",
      description: isRTL ? "فلترة الرسائل (مقروءة، غير مقروءة، لم يتم الرد) في واجهة واحدة" : "Filter messages (read, unread, unanswered) in a single interface",
      image: solutionBroadcast
    },
    {
      icon: Clock,
      title: isRTL ? "جدولة الرسائل" : "Message Scheduling",
      description: isRTL ? "حدد وقت إرسال رسائلك مسبقاً للوصول في الوقت المثالي" : "Pre-schedule your messages to be sent at the optimal time",
      image: solutionSchedule
    },
    {
      icon: BarChart3,
      title: isRTL ? "تقارير تفصيلية" : "Detailed Reports",
      description: isRTL ? "تتبع أداء الحملات ومعدلات القراءة والاستجابة لحظياً" : "Track campaign performance, read rates, and instant responses",
      image: solutionReports
    }
  ];

  const campaigns = [
    {
      icon: Send,
      title: isRTL ? "استهداف دقيق" : "Precise Targeting",
      description: isRTL ? "حدد جمهورك بناءً على الموقع، الاهتمامات، والسلوك" : "Target your audience based on location, interests, and behavior"
    },
    {
      icon: Clock,
      title: isRTL ? "جدولة ذكية" : "Smart Scheduling",
      description: isRTL ? "أرسل في الوقت الأمثل لزيادة معدلات التفاعل" : "Send at the optimal time to increase interaction rates"
    },
    {
      icon: Sparkles,
      title: isRTL ? "قوالب جاهزة" : "Ready Templates",
      description: isRTL ? "رسائل احترافية مع أزرار تفاعلية وصور ومقاطع" : "Professional messages with interactive buttons, images, and videos"
    },
    {
      icon: TrendingUp,
      title: isRTL ? "تحليل الأداء" : "Performance Analysis",
      description: isRTL ? "تقارير شاملة عن معدلات الفتح والنقر والتحويل" : "Comprehensive reports on open rates, clicks, and conversions"
    }
  ];

  const defaultPricingPlans = useMemo(() => getDefaultWhatsAppPlans(isRTL), [isRTL]);
  const cmsPricingPlansRaw = useMemo(
    () => getCmsField(
      cmsPage,
      'wa-pricing',
      'plans_list',
      isRTL,
      serializeWhatsAppPlans(defaultPricingPlans)
    ),
    [cmsPage, defaultPricingPlans, isRTL]
  );
  const pricingPlans = useMemo(
    () => parseWhatsAppPlans(cmsPricingPlansRaw, defaultPricingPlans),
    [cmsPricingPlansRaw, defaultPricingPlans]
  );

  const greenTickComparison = [
    { feature: isRTL ? "ظهور اسم الشركة" : "Company Name Visibility", basic: true, verified: true, unverified: false },
    { feature: isRTL ? "الشارة الخضراء الرسمية" : "Official Green Badge", basic: false, verified: true, unverified: false },
    { feature: isRTL ? "ثقة أعلى من العملاء" : "Higher Customer Trust", basic: true, verified: true, unverified: false },
    { feature: isRTL ? "رسائل غير محدودة" : "Unlimited Messages", basic: false, verified: true, unverified: false }
  ];

  const defaultApiPricing = useMemo(() => getDefaultWhatsAppConversationPrices(isRTL), [isRTL]);
  const cmsApiPricingRaw = useMemo(
    () => getCmsField(
      cmsPage,
      'wa-pricing',
      'api_prices_list',
      isRTL,
      serializeWhatsAppConversationPrices(defaultApiPricing)
    ),
    [cmsPage, defaultApiPricing, isRTL]
  );
  const apiPricing = useMemo(
    () => parseWhatsAppConversationPrices(cmsApiPricingRaw, defaultApiPricing),
    [cmsApiPricingRaw, defaultApiPricing]
  );

  const planThemes = [
    { color: "border-gray-300", bgColor: "bg-white", buttonColor: "bg-gray-700 hover:bg-gray-800" },
    { color: "border-[#F15822]", bgColor: "bg-gradient-to-br from-orange-50 to-white", buttonColor: "bg-[#F15822] hover:bg-[#d94a1a]" },
    { color: "border-purple-400", bgColor: "bg-gradient-to-br from-purple-50 to-white", buttonColor: "bg-purple-700 hover:bg-purple-800" },
  ];
  const apiCardColors = ["bg-green-50 border-green-200", "bg-purple-50 border-purple-200", "bg-blue-50 border-blue-200", "bg-orange-50 border-orange-200"];
  const packageSummaryText = useMemo(() => {
    if (!pricingPlans.length) {
      return isRTL
        ? "يمكننا تجهيز باقة مخصصة لك حسب احتياج نشاطك."
        : "We can prepare a custom package based on your business needs.";
    }

    const summary = pricingPlans.map((plan) => {
      const firstTier = plan.tiers[0];
      const priceLabel = firstTier?.price
        ? `${firstTier.price} ${isRTL ? "ر.س" : "SAR"}`
        : (isRTL ? "سعر حسب الطلب" : "Custom pricing");
      return `${plan.name} (${priceLabel})`;
    });

    return isRTL
      ? `لدينا ${pricingPlans.length} باقات: ${summary.join("، ")}. كل باقة تحتوي على شرائح استخدام مختلفة حسب حجم أعمالك.`
      : `We have ${pricingPlans.length} packages: ${summary.join(", ")}. Each package includes multiple usage tiers for different business sizes.`;
  }, [pricingPlans, isRTL]);

  // التعامل مع الضغط على زر عرض الباقات
  const handleShowPackages = () => {
    // إضافة رسالة المستخدم أولاً
    setChatMessages(prev => [
      ...prev.map(msg => ({ ...msg, buttons: false })),
      {
        id: prev.length + 1,
        type: 'user',
        text: isRTL ? 'عرض الباقات' : 'Show Packages',
        buttons: false
      }
    ]);

    // إضافة رد البوت بعد delay
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'bot',
          text: packageSummaryText,
          buttons: false
        }
      ]);

      // إضافة سؤال المتابعة بعد delay آخر
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            type: 'bot',
            text: isRTL ? 'هل ترغب بالتحدث مع موظف المبيعات؟' : 'Would you like to speak with a sales representative?',
            confirmButton: true
          }
        ]);
      }, 1000);
    }, 800);
  };

  // التعامل مع الضغط على زر "نعم" للتواصل مع المبيعات
  const handleConfirmSales = () => {
    // إضافة رسالة المستخدم "نعم"
    setChatMessages(prev => [
      ...prev.map(msg => ({ ...msg, confirmButton: false })),
      {
        id: prev.length + 1,
        type: 'user',
        text: isRTL ? 'نعم' : 'Yes',
        buttons: false
      }
    ]);

    // إضافة رد موظف المبيعات
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'sales',
          text: isRTL 
            ? 'مرحباً! معك محمد من فريق المبيعات - المدار 👋 يسعدني مساعدتك في اختيار الباقة المناسبة لاحتياجاتك. هل لديك أي استفسار محدد؟'
            : 'Hello! This is Mohammed from ORBIT Sales 👋 I would be happy to help you choose the right package. Do you have any specific questions?',
          buttons: false
        }
      ]);
    }, 1000);
  };

  return (
    <div 
      className={`min-h-screen bg-white ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} 
      data-page="whatsapp"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-white via-green-50/30 to-orange-50/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI1RDM2NiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* النص - اليمين */}
            <div className={`text-${isRTL ? 'right' : 'left'} space-y-4 md:space-y-6`}>
              <Badge className="bg-[#25D366] text-white border-none px-4 py-2 text-sm">
                <MessageCircle className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {heroBadge}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#161616] leading-tight">
                {heroTitle}
                <br />
                <span className="text-[#25D366]">{heroSubtitle}</span><span className="text-[#F15822]">.</span>
              </h1>

              <p className="text-lg md:text-xl text-[#606161] leading-relaxed max-w-xl">
                {heroDescription}
              </p>

              <div className="flex gap-4 flex-wrap">
                <Button
                  size="lg"
                  className="bg-[#128C7E] hover:bg-[#0d6b5f] text-white font-bold px-8 h-14 text-lg shadow-lg shadow-[#128C7E]/30"
                  asChild
                >
                  {primaryCtaUrl.startsWith('http') ? (
                    <a href={primaryCtaUrl} target="_blank" rel="noopener noreferrer">
                      {primaryCtaText}
                      <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </a>
                  ) : (
                    <a href={primaryCtaUrl}>
                      {primaryCtaText}
                      <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </a>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#606161] text-[#161616] hover:bg-gray-50 font-bold px-8 h-14 text-lg"
                  onClick={() => {
                    const pricingSection = document.getElementById('pricing');
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {secondaryCtaText}
                  <BarChart3 className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </div>

              {/* إحصائيات سريعة */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-extrabold text-[#25D366]">98%</div>
                  <div className="text-sm text-gray-600">{isRTL ? "معدل الفتح" : "Open Rate"}</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#128C7E]">20,000+</div>
                  <div className="text-sm text-gray-600">{isRTL ? "عميل نشط" : "Active Clients"}</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#161616]">24/7</div>
                  <div className="text-sm text-gray-600">{isRTL ? "دعم فني" : "Support"}</div>
                </div>
              </div>
            </div>

            {/* الصورة - اليسار */}
            <div className="relative hidden md:block">
              <div className="relative">
                {/* واجهة صندوق الوارد الموحد */}
                <Card className="bg-white shadow-2xl border-0 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-[#25D366]" />
                          </div>
                          <div>
                            <div className="font-bold">صندوق لوارد الموحد</div>
                            <div className="text-xs opacity-90">15 محادثة نشطة</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* رسائل تجريبية */}
                    <div className="p-4 space-y-3 bg-gray-50 h-[300px] max-h-[300px] overflow-y-auto" ref={chatContainerRef} style={{ scrollBehavior: 'smooth' }}>
                      <div className="flex gap-2 items-start animate-fade-in">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[70%]">
                          <div className="text-xs text-gray-500 mb-1">{isRTL ? "أحمد - قسم المبيعات" : "Ahmed - Sales"}</div>
                          <div className="text-sm">{isRTL ? "مرحباً! كيف يمكنني مساعدتك اليوم؟" : "Hello! How can I help you today?"}</div>
                          <div className="text-xs text-gray-400 mt-1">10:30 AM</div>
                        </div>
                      </div>

                      <div className="flex gap-2 items-start justify-end animate-fade-in">
                        <div className="bg-[#DCF8C6] p-3 rounded-lg shadow-sm max-w-[70%]">
                          <div className="text-sm">{isRTL ? "أريد الاستفسار عن باقات واتساب API" : "I want to inquire about WhatsApp API packages"}</div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
                            10:31 AM
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          </div>
                        </div>
                      </div>

                      {chatMessages.map(msg => (
                        <div key={msg.id} className="animate-slide-up">
                          {msg.type === 'user' ? (
                            <div className="flex gap-2 items-start justify-end">
                              <div className="bg-[#DCF8C6] p-3 rounded-lg shadow-sm max-w-[70%]">
                                <div className="text-sm">{msg.text}</div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
                                  {new Date().toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                  <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-start">
                              <div className={`w-8 h-8 ${msg.type === 'bot' ? 'bg-green-500' : 'bg-blue-500'} rounded-full flex-shrink-0`}></div>
                              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[70%]">
                                <div className="text-xs text-gray-500 mb-1">
                                  {msg.type === 'bot' ? (isRTL ? 'بوت آلي 🤖' : 'Automated Bot 🤖') : (isRTL ? 'محمد - قسم المبيعات 👤' : 'Mohammed - Sales 👤')}
                                </div>
                                <div className="text-sm">{msg.text}</div>
                                {msg.buttons && (
                                  <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={handleShowPackages}>{isRTL ? 'عرض الباقات' : 'Show Packages'}</Button>
                                  </div>
                                )}
                                {msg.confirmButton && (
                                  <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={handleConfirmSales}>{isRTL ? 'نعم' : 'Yes'}</Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* شارة التوثيق */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-xl border-4 border-green-100">
                  <BadgeCheck className="w-12 h-12 text-[#25D366]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* لماذا واتساب الأعمال */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <Badge className="bg-green-100 text-[#25D366] border-none px-4 py-2 text-sm mb-3 md:mb-4">
              {isRTL ? "المميزات الرئيسية" : "Key Features"}
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#161616] mb-3 md:mb-4">
              {isRTL ? "لماذا واتساب الأعمال؟" : "Why WhatsApp Business?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isRTL ? "المنصة الأكثر ثقة وانتشاراً للتواصل مع عملائك في المملكة" : "The most trusted and widespread platform for communicating with your customers in the Kingdom"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#161616] mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* الحلول والمميزات */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <Badge className="bg-orange-100 text-[#F15822] border-none px-4 py-2 text-sm mb-3 md:mb-4">
              {isRTL ? "الحلول المتقدمة" : "Advanced Solutions"}
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#161616] mb-3 md:mb-4">
              {solutionsTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {featuresSectionSubtitle}
            </p>
          </div>

          {/* Slider الحلول */}
          <div className="relative max-w-6xl mx-auto">
            {/* السلايد الحالي */}
            <div
              className="px-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* النص - اليمين */}
                <div className="text-right space-y-4">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-br from-green-50 to-green-100 px-4 py-3 rounded-lg">
                    {(() => {
                      const CurrentIcon = solutions[currentSolutionIndex].icon;
                      return <CurrentIcon className="w-8 h-8 text-[#25D366]" />;
                    })()}
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#161616]">
                      {solutions[currentSolutionIndex].title}
                    </h3>
                  </div>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    {solutions[currentSolutionIndex].description}
                  </p>
                </div>

                {/* الصورة - اليسار */}
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <ImageWithFallback
                      src={solutions[currentSolutionIndex].image}
                      alt={solutions[currentSolutionIndex].title}
                      className="w-full h-[300px] md:h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التنقل - ديسكتوب فقط - خارج المحتوى */}
            <button
              onClick={() => setCurrentSolutionIndex(prev => (prev === 0 ? solutions.length - 1 : prev - 1))}
              className={`hidden md:block absolute ${isRTL ? '-right-6 lg:-right-12' : '-left-6 lg:-left-12'} top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-full p-3 shadow-lg transition-all hover:scale-110`}
            >
              {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setCurrentSolutionIndex(prev => (prev === solutions.length - 1 ? 0 : prev + 1))}
              className={`hidden md:block absolute ${isRTL ? '-left-6 lg:-left-12' : '-right-6 lg:-right-12'} top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-full p-3 shadow-lg transition-all hover:scale-110`}
            >
              {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>

            {/* نقاط التنقل */}
            <div className="flex justify-center gap-2 mt-8">
              {solutions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSolutionIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentSolutionIndex ? 'bg-[#25D366] w-8' : 'bg-gray-300 w-2'
                    }`}
                ></button>
              ))}
            </div>

            {/* مؤشر السحب للجوال */}
            <div className="md:hidden text-center mt-4">
              <p className="text-xs text-gray-500">{isRTL ? "← اسحب لرؤية المزيد →" : "← Swipe to see more →"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* الحملات التسويقية */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* النص */}
            <div>
              <Badge className="bg-[#F15822] text-white border-none px-4 py-2 text-sm mb-3 md:mb-4">
                {isRTL ? "التسويق الذكي" : "Smart Marketing"}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#161616] mb-4 md:mb-6">
                {campaignsTitle}
              </h2>
              <p className="text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
                {isRTL ? "استهدف عملاءك بدقة، حدد جدولة زمنية للحملات، واستخدم قوالب رسائل جاهزة مع أزرار تفاعلية لزيادة معدلات التحويل." : "Target your customers accurately, schedule campaigns, and use ready-made message templates with interactive buttons to increase conversion rates."}
              </p>

              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="flex gap-4 items-start bg-white p-4 rounded-lg border border-gray-200 hover:border-[#F15822] transition-all">
                    <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <campaign.icon className="w-5 h-5 text-[#F15822]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#161616] mb-1">{campaign.title}</h4>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* محاكاة التقرير */}
            <div>
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#161616]">{isRTL ? "تقرير الحملة الأخيرة" : "Last Campaign Report"}</h3>
                    <Badge className="bg-green-100 text-green-700">{isRTL ? "نشطة" : "Active"}</Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{isRTL ? "معدل الفتح" : "Open Rate"}</div>
                      <div className="text-3xl font-extrabold text-[#25D366]">94.2%</div>
                      <div className="w-full bg-white h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#25D366] h-full rounded-full" style={{ width: '94.2%' }}></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{isRTL ? "معدل النقر" : "Click Rate"}</div>
                      <div className="text-3xl font-extrabold text-blue-600">67.8%</div>
                      <div className="w-full bg-white h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '67.8%' }}></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{isRTL ? "معدل التحويل" : "Conversion"}</div>
                      <div className="text-3xl font-extrabold text-[#F15822]">23.4%</div>
                      <div className="w-full bg-white h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#F15822] h-full rounded-full" style={{ width: '23.4%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-2xl font-bold text-[#161616]">12,547</div>
                      <div className="text-xs text-gray-500">{isRTL ? "رسالة مرسلة" : "Messages Sent"}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#161616]">2,936</div>
                      <div className="text-xs text-gray-500">تحويلات ناجحة</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* التوثيق والشارة الخضراء */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#25D366] rounded-full mb-3 md:mb-4">
                <BadgeCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#161616] mb-3 md:mb-4">
                {isRTL ? "احصل على الشارة الخضراء (Green Tick)" : "Get the Green Tick"}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {isRTL ? "عزز ثقة عملائك وتميز عن المنافسين بحساب موثوق رسمياً من واتساب" : "Boost your customers' trust and stand out from competitors with an officially verified WhatsApp account"}
              </p>
            </div>

            {/* مقارنة */}
            <Card className="border-2 border-green-200 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-green-100 to-green-50">
                        <th className={`text-${isRTL ? 'right' : 'left'} p-4 font-bold text-[#161616]`}>{isRTL ? "المميزات" : "Features"}</th>
                        <th className="text-center p-4 font-bold text-gray-600">
                          {isRTL ? "بدون توثيق" : "Unverified"}
                        </th>
                        <th className="text-center p-4 font-bold text-blue-600">
                          {isRTL ? "حساب تجاري" : "Business Account"}
                          <BadgeCheck className={`w-5 h-5 inline ${isRTL ? 'mr-1' : 'ml-1'} text-blue-500`} />
                        </th>
                        <th className="text-center p-4 font-bold text-[#25D366]">
                          {isRTL ? "حساب موثوق" : "Verified Account"}
                          <BadgeCheck className={`w-5 h-5 inline ${isRTL ? 'mr-1' : 'ml-1'}`} />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {greenTickComparison.map((item, index) => (
                        <tr key={index} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="p-4 text-[#161616]">{item.feature}</td>
                          <td className="p-4 text-center">
                            <X className="w-6 h-6 text-red-500 mx-auto" strokeWidth={3} />
                          </td>
                          <td className="p-4 text-center">
                            {item.basic ? (
                              <BadgeCheck className="w-6 h-6 text-blue-500 mx-auto" />
                            ) : (
                              <X className="w-6 h-6 text-red-500 mx-auto" strokeWidth={3} />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {item.verified ? (
                              <CheckCircle2 className="w-6 h-6 text-[#25D366] mx-auto" />
                            ) : (
                              <X className="w-6 h-6 text-red-500 mx-auto" strokeWidth={3} />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <Award className="w-12 h-12 text-[#25D366] mx-auto mb-3" />
              <p className="text-lg font-bold text-[#161616] mb-2">
                {isRTL ? "فريق المدار يساعدك في تجهيز المتطلبات" : "ORBIT Team helps you prepare the requirements"}
              </p>
              <p className="text-gray-600 mb-4">
                {isRTL ? "نوفر لك الدعم الكامل للحصول على التوثيق الرسمي من واتساب" : "We provide you with full support to get official WhatsApp verification"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* باقات الأسعار */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-none px-4 py-2 text-sm mb-4">
              {isRTL ? "الباقات والأسعار" : "Packages and Pricing"}
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#161616] mb-4">
              {pricingTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {pricingSubtitle}
            </p>
          </div>

          {/* الباقات - تبديل أفقي على الجوال */}
          <div className="relative max-w-6xl mx-auto mb-12">
            {/* مؤشر السحب على الجوال */}
            <div className="md:hidden text-center mb-4">
              <p className="text-sm text-gray-500">{isRTL ? "← اسحب لرؤية المزيد →" : "← Swipe to see more →"}</p>
            </div>

            {/* حاوية الباقات */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto md:overflow-visible pb-8 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory"
            >
              <div className="flex md:grid md:grid-cols-3 gap-6 lg:gap-8 min-w-max md:min-w-0">
                {pricingPlans.map((plan, planIndex) => {
                  const theme = planThemes[planIndex] || planThemes[0];
                  const rawTierIndex = selectedTiers[planIndex] ?? 0;
                  const currentTierIndex = Math.min(Math.max(rawTierIndex, 0), Math.max(plan.tiers.length - 1, 0));
                  const currentTier = plan.tiers[currentTierIndex] || plan.tiers[0];
                  const popularBadge = plan.badge || (isRTL ? "الأكثر طلباً" : "Most Popular");
                  const subscribeLabel = plan.subscribeLabel || (isRTL ? "اشترك الآن" : "Subscribe Now");
                  const subscribeUrlType = plan.subscribeUrlType || 'external';
                  const subscribeUrl = subscribeUrlType === 'form' 
                    ? `/products/whatsapp/request?plan=${encodeURIComponent(plan.id)}&tier=${encodeURIComponent(currentTier.name)}`
                    : (plan.subscribeUrl || primaryCtaUrl);
                  const featureItems = plan.additionalFeatures.length
                    ? plan.additionalFeatures
                    : [isRTL ? "يمكنك إضافة مميزات إضافية من لوحة التحكم" : "Add more features from CMS"];

                  return (
                    <Card
                      key={plan.id || `plan-${planIndex}`}
                      data-plan-card
                      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex-shrink-0 w-[85vw] md:w-auto snap-center ${plan.popular ? `border-4 ${theme.color} shadow-xl md:scale-105` : `border-2 ${theme.color}`} ${theme.bgColor}`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 left-0 right-0">
                          <div className="bg-[#F15822] text-white text-center py-2 text-sm font-bold">
                            ⭐ {popularBadge}
                          </div>
                        </div>
                      )}

                      <CardContent className={`p-6 ${plan.popular ? 'pt-14' : 'pt-6'}`}>
                        <div className="text-center mb-6">
                          <h3 className="text-lg md:text-2xl font-extrabold text-[#161616] mb-3 md:mb-4">
                            {plan.name}
                          </h3>

                          {/* Tabs لاختيار الشريحة */}
                          <div className="mb-4 md:mb-6">
                            <div className="flex gap-1.5 md:gap-2 justify-center mb-3 md:mb-4 flex-wrap">
                              {plan.tiers.map((tier, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleTierChange(planIndex, index)}
                                  className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${currentTierIndex === index
                                    ? 'bg-[#128C7E] text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                  {tier.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* السعة والحدود - خارج الشرائح */}
                          <div className="mb-4 md:mb-6 bg-blue-50 rounded-lg p-3 md:p-4 border-2 border-blue-200">
                            <h4 className="text-[10px] md:text-xs font-bold text-blue-900 mb-2 md:mb-3 flex items-center justify-center gap-1.5 md:gap-2">
                              <BarChart3 className="w-3 md:w-4 h-3 md:h-4" />
                              {isRTL ? "السعة والحدود" : "Capacity and Limits"}
                            </h4>
                            <div className="space-y-1.5 md:space-y-2 text-[10px] md:text-xs">
                              <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                <CheckCircle2 className="w-3 md:w-4 h-3 md:h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-gray-700 font-semibold">{currentTier.conversations} {isRTL ? "محادثة" : "Conversations"}</span>
                              </div>
                              <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                <CheckCircle2 className="w-3 md:w-4 h-3 md:h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-gray-700 font-semibold">{currentTier.broadcastMessages} {isRTL ? "رسالة بث" : "Broadcasts"}</span>
                              </div>
                              <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                <CheckCircle2 className="w-3 md:w-4 h-3 md:h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-gray-700 font-semibold">{isRTL ? `حتى ${currentTier.users} مستخدمين` : `Up to ${currentTier.users} Users`}</span>
                              </div>
                            </div>
                          </div>

                          {/* الأسعار - داخل الشرائح */}
                          <div className="flex items-baseline justify-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                            <span className="text-3xl md:text-5xl font-extrabold text-[#161616]">
                              {currentTier.price}
                            </span>
                            <span className="inline-flex items-center">
                              <ImageWithFallback
                                src={saudiRiyalSymbol}
                                alt={isRTL ? "رمز الريال السعودي" : "Saudi Riyal symbol"}
                                width={20}
                                height={20}
                                className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] object-contain opacity-70"
                              />
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-500 mb-0.5 md:mb-1">{plan.period || (isRTL ? "شهرياً" : "Monthly")}</p>
                          <p className="text-[10px] md:text-xs text-gray-400 inline-flex items-center justify-center gap-1">
                            <span>{isRTL ? "شامل الضريبة:" : "Tax included:"}</span>
                            <span>{currentTier.priceWithTax}</span>
                            <ImageWithFallback
                              src={saudiRiyalSymbol}
                              alt={isRTL ? "رمز الريال السعودي" : "Saudi Riyal symbol"}
                              width={12}
                              height={12}
                              className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] object-contain opacity-70"
                            />
                          </p>
                          <p className="text-[10px] md:text-xs text-gray-400 inline-flex items-center justify-center gap-1">
                            <span>{isRTL ? "رسوم التأسيس:" : "Setup fee:"}</span>
                            <span>{currentTier.setupFee}</span>
                            <ImageWithFallback
                              src={saudiRiyalSymbol}
                              alt={isRTL ? "رمز الريال السعودي" : "Saudi Riyal symbol"}
                              width={12}
                              height={12}
                              className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] object-contain opacity-70"
                            />
                          </p>
                        </div>

                        <Button
                          className={`w-full ${theme.buttonColor} text-white font-bold mb-4 md:mb-6 h-10 md:h-12 text-sm md:text-base`}
                          asChild
                        >
                          {subscribeUrl.startsWith('http') ? (
                            <a href={subscribeUrl} target="_blank" rel="noopener noreferrer">
                              {subscribeLabel}
                            </a>
                          ) : (
                            <a href={subscribeUrl}>
                              {subscribeLabel}
                            </a>
                          )}
                        </Button>

                        {/* المميزات الإضافية - داخل الشرائح */}
                        <div>
                          <h4 className="text-xs md:text-sm font-bold text-[#161616] mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                            <div className="w-5 md:w-6 h-5 md:h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <Sparkles className="w-2.5 md:w-3 h-2.5 md:h-3 text-[#25D366]" />
                            </div>
                            {isRTL ? "المميزات الإضافية" : "Additional Features"}
                          </h4>
                          <div className="space-y-2 md:space-y-3">
                            {featureItems.map((feature, index) => (
                              <div key={index} className="flex items-start gap-2 md:gap-3">
                                <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                                <span className={`text-xs md:text-sm text-gray-700 text-${isRTL ? 'right' : 'left'}`}>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* مؤشرات النقاط على الجوال */}
            <div className="md:hidden flex justify-center gap-2 mt-4">
              {pricingPlans.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${index === activePlanIndex ? 'bg-[#F15822] w-8' : 'bg-gray-300 w-2'
                    }`}
                ></div>
              ))}
            </div>
          </div>

          {/* ملاحظة الأسعار */}
          <div className="text-center bg-blue-50 border-2 border-blue-200 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-blue-600" />
              <p className="font-bold text-[#161616]">{pricingPlansNote}</p>
            </div>
            <p className="text-gray-600">
              {pricingContactNote}
            </p>
          </div>
        </div>
      </section>

      {/* تكلفة محادثات واتساب API */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-2 text-sm mb-4">
                {isRTL ? "تكلفة المحادثات" : "Conversation Costs"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#161616] mb-4">
                {apiPricingTitle}
              </h2>
              <p className="text-lg text-gray-600">
                {apiPricingSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {apiPricing.map((pricing, index) => (
                <Card key={index} className={`border-2 ${apiCardColors[index % apiCardColors.length]} hover:shadow-lg transition-all`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-[#161616] mb-2">
                        {pricing.type}
                      </h3>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl font-extrabold text-[#161616]">
                          {pricing.price}
                        </span>
                        {!pricing.isFree && (
                          <span className="inline-flex items-center">
                            <ImageWithFallback
                              src={saudiRiyalSymbol}
                              alt={isRTL ? "رمز الريال السعودي" : "Saudi Riyal symbol"}
                              width={16}
                              height={16}
                              className="w-[14px] h-[14px] object-contain opacity-70"
                            />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{pricing.duration}</p>
                    </div>
                    <p className="text-xs text-gray-600 text-center leading-relaxed">
                      {pricing.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-xl p-4 md:p-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="bg-[#25D366] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-[#161616] mb-1 md:mb-2 text-start">💡 {apiTipTitle}</h4>
                  <p className={`text-sm md:text-base text-gray-600 text-${isRTL ? 'right' : 'left'}`}>
                    {apiTipDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-20 bg-gradient-to-r from-[#128C7E] via-[#0d6b5f] to-[#0a5a50] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-[#25D366] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {isRTL ? "جاهز لنقل خدمة عملائك لمستوى آخر؟" : "Ready to take your customer service to the next level?"}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {isRTL ? "فريقنا جاهز لمساعدتك في الحصول على الشارة الخضراء وربط الـ API بكل سهولة واحترافية" : "Our team is ready to help you get the Green Badge and integrate the API easily and professionally"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#F15822] hover:bg-[#d94a1a] text-white font-bold px-10 h-14 text-lg shadow-2xl shadow-[#F15822]/50"
                asChild
              >
                {primaryCtaUrl.startsWith('http') ? (
                  <a href={primaryCtaUrl} target="_blank" rel="noopener noreferrer">
                    {primaryCtaText}
                    <ArrowRight className={`w-6 h-6 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </a>
                ) : (
                  <a href={primaryCtaUrl}>
                    {primaryCtaText}
                    <ArrowRight className={`w-6 h-6 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </a>
                )}
              </Button>
              <Button
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ea952] border-2 border-[#25D366] text-white font-bold px-10 h-14 text-lg shadow-2xl shadow-[#25D366]/50"
                asChild
              >
                <a href={secondaryCtaUrl} target="_blank" rel="noopener noreferrer">
                  {secondaryCtaText}
                  <Headphones className={`w-6 h-6 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </a>
              </Button>
            </div>

            {/* شارات الثقة */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 pt-6 border-t border-white/20">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <ImageWithFallback src={cstLogo} alt="هيئة الاتصالات والفضاء والتقنية" className="h-24 md:h-32 w-auto" />
              </div>
              <div className="bg-white rounded-lg shadow-lg p-4">
                <ImageWithFallback src={metaLogo} alt="Meta Business Partner" className="h-24 md:h-32 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
