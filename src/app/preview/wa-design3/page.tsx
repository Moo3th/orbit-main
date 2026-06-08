'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  X,
  MessageCircle,
  Shield,
  Users,
  TrendingUp,
  Headphones,
  Smartphone,
  Bot,
  BarChart3,
  MessageCirclePlus,
  Globe,
  BadgeCheck,
  Send,
  Clock,
  Target,
  Sparkles,
  Zap,
  Star,
  Award,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { encodeImagePath } from '@/utils/imagePath';
import WANavbar from '../components/WANavbar';
import WAFooter from '../components/WAFooter';

function useCountUp(end: number, duration: number = 2000, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let startTime: number | null = null;
    let raf: number;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, trigger]);
  return count;
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const PARTNER_LOGOS = [
  '/TrustedLogos/حرس الحدود.png',
  '/TrustedLogos/إمارة منطقة الرياض.png',
  '/TrustedLogos/مستشفى الملك فهد بجدة.png',
  '/TrustedLogos/جامعة الملك سعود.png',
  '/TrustedLogos/وزارة التعليم.png',
  '/TrustedLogos/الموارد البشرية.png',
  '/TrustedLogos/شعار-هدف.png',
  '/TrustedLogos/magrabi-health.png',
  '/TrustedLogos/logo_004.png',
  '/TrustedLogos/logo_005.png',
  '/TrustedLogos/logo_007.png',
  '/TrustedLogos/logo_009.png',
  '/TrustedLogos/logo_012.png',
  '/TrustedLogos/logo_015.png',
  '/TrustedLogos/logo_018.png',
  '/TrustedLogos/logo_021.png',
  '/TrustedLogos/logo_025.png',
  '/TrustedLogos/logo_029.png',
  '/TrustedLogos/logo_033.png',
  '/TrustedLogos/logo_037.png',
  '/TrustedLogos/logo_041.png',
  '/TrustedLogos/logo_045.png',
  '/TrustedLogos/logo_049.png',
  '/TrustedLogos/logo_053.png',
  '/TrustedLogos/logo_057.png',
];

const NOTIFICATIONS = [
  { title: 'أحمد - قسم المبيعات', subtitle: 'مرحباً! كيف يمكنني مساعدتك اليوم؟' },
  { title: 'طلب واتساب API', subtitle: 'أريد الاستفسار عن باقات واتساب API' },
  { title: 'بوت آلي 🤖', subtitle: 'بالتأكيد! لدينا 3 باقات رئيسية تبدأ من 399 ر.س شهرياً...' },
  { title: 'محمد من المبيعات 👤', subtitle: 'مرحباً! معك محمد من فريق المبيعات - المدار 👋' },
];

const WHATSAPP_FEATURES = [
  { icon: Users, titleAr: 'رقم موحد للفريق', titleEn: 'Unified Team Number', descAr: 'لا مزيد من تشتت المحادثات، رقم واحد يديره فريق كامل بكفاءة عالية', descEn: 'No more scattered conversations, one number managed efficiently by the whole team' },
  { icon: Shield, titleAr: 'إدارة الصلاحيات', titleEn: 'Permissions Management', descAr: 'تحويل المحادثات بين المبيعات والدعم الفني بسلاسة واحترافية', descEn: 'Seamlessly transfer conversations between sales and technical support' },
  { icon: Bot, titleAr: 'الردود الآلية (Chatbot)', titleEn: 'Automated Replies (Chatbot)', descAr: 'خدمة عملاء 24/7 دون تدخل بشري، أجب على الأسئلة الشائعة تلقائياً', descEn: '24/7 customer service without human intervention, automatically answer FAQs' },
  { icon: MessageCirclePlus, titleAr: 'صندوق وارد مشترك', titleEn: 'Shared Inbox', descAr: 'فلترة الرسائل (مقروءة، غير مقروءة، لم يتم الرد) في واجهة واحدة', descEn: 'Filter messages (read, unread, unanswered) in a single interface' },
  { icon: Clock, titleAr: 'جدولة الرسائل', titleEn: 'Message Scheduling', descAr: 'حدد وقت إرسال رسائلك مسبقاً للوصول في الوقت المثالي', descEn: 'Pre-schedule your messages to be sent at the optimal time' },
  { icon: BarChart3, titleAr: 'تقارير تفصيلية', titleEn: 'Detailed Reports', descAr: 'تتبع أداء الحملات ومعدلات القراءة والاستجابة لحظياً', descEn: 'Track campaign performance, read rates, and instant responses' },
];

const WHY_CORBIT = [
  { icon: Globe, titleAr: 'المنصة رقم 1 في المملكة', titleEn: 'The #1 Platform in the Kingdom', descAr: 'الأكثر انتشاراً واستخداماً في السعودية', descEn: 'The most widespread and used in Saudi Arabia' },
  { icon: CheckCircle2, titleAr: 'معدل فتح 98%', titleEn: '98% Open Rate', descAr: 'يتم فتح وقراءة معظم الرسائل فوراً', descEn: 'Most messages are opened and read immediately' },
  { icon: Shield, titleAr: 'آمن وموثوق', titleEn: 'Secure & Reliable', descAr: 'تشفير كامل من طرف لطرف للبيانات', descEn: 'End-to-end encryption for all data' },
  { icon: Smartphone, titleAr: 'سهل الاستخدام', titleEn: 'Easy to Use', descAr: 'تطبيق مألوف للجميع بدون تعقيد', descEn: 'Familiar app for everyone without complexity' },
];

const COMPETITIVE_EDGE = [
  { featureAr: 'ظهور اسم الشركة', featureEn: 'Company Name Visibility', unverified: false, business: true, verified: true },
  { featureAr: 'الشارة الخضراء الرسمية', featureEn: 'Official Green Badge', unverified: false, business: false, verified: true },
  { featureAr: 'ثقة أعلى من العملاء', featureEn: 'Higher Customer Trust', unverified: false, business: true, verified: true },
  { featureAr: 'رسائل غير محدودة', featureEn: 'Unlimited Messages', unverified: false, business: false, verified: true },
];

const CAMPAIGNS = [
  { icon: Target, titleAr: 'استهداف دقيق', titleEn: 'Precise Targeting', descAr: 'حدد جمهورك بناءً على الموقع، الاهتمامات، والسلوك', descEn: 'Target your audience based on location, interests, and behavior' },
  { icon: Clock, titleAr: 'جدولة ذكية', titleEn: 'Smart Scheduling', descAr: 'أرسل في الوقت الأمثل لزيادة معدلات التفاعل', descEn: 'Send at the optimal time to increase interaction rates' },
  { icon: Sparkles, titleAr: 'قوالب جاهزة', titleEn: 'Ready Templates', descAr: 'رسائل احترافية مع أزرار تفاعلية وصور ومقاطع', descEn: 'Professional messages with interactive buttons, images, and videos' },
  { icon: TrendingUp, titleAr: 'تحليل الأداء', titleEn: 'Performance Analysis', descAr: 'تقارير شاملة عن معدلات الفتح والنقر والتحويل', descEn: 'Comprehensive reports on open rates, clicks, and conversions' },
];

const INTEGRATIONS = [
  { nameAr: 'سلة', nameEn: 'Salla', icon: '/integrations/salla.svg', link: 'https://salla.sa' },
  { nameAr: 'دفترة', nameEn: 'Daftra', icon: '/integrations/daftra.svg', link: 'https://daftra.com' },
  { nameAr: 'نظام نور', nameEn: 'Noor System', icon: '/integrations/noor.svg', link: 'https://noor.moe.gov.sa' },
  { nameAr: 'إتقان', nameEn: 'Itqan', icon: '/integrations/itqan.svg', link: 'https://itqanapps.com' },
  { nameAr: 'حضوري', nameEn: 'Haddari', icon: '/integrations/haddari.svg', link: 'https://haddari.com' },
];

const STATS_DATA = [
  { suffix: '%+', end: 98, labelAr: 'نسبة فتح الرسائل على واتساب', labelEn: 'WhatsApp message open rate' },
  { suffix: 'x', end: 5, labelAr: 'أعلى من البريد الإلكتروني', labelEn: 'Higher than email' },
  { suffix: '+', end: 2, labelAr: 'مليار مستخدم واتساب عالمياً', labelEn: 'Billion WhatsApp users globally' },
  { suffix: '%+', end: 40, labelAr: 'زيادة في المبيعات عبر واتساب', labelEn: 'Increase in sales via WhatsApp' },
];

const PRICING_PLANS = [
  {
    id: 'basic',
    nameAr: 'الباقة الأساسية',
    nameEn: 'Basic Package',
    popular: false,
    borderColor: 'border-emerald-500/20',
    glowBorder: '',
    bgColor: 'bg-white/5',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
    tiers: [
      { nameAr: 'الشريحة 1', nameEn: 'Tier 1', price: '399', priceWithTax: '459', setupFee: '850', conversations: '1,000', broadcastMessages: '10,000', users: 7 },
      { nameAr: 'الشريحة 2', nameEn: 'Tier 2', price: '699', priceWithTax: '804', setupFee: '850', conversations: '2,500', broadcastMessages: '25,000', users: 15 },
      { nameAr: 'الشريحة 3', nameEn: 'Tier 3', price: '1,199', priceWithTax: '1,379', setupFee: '850', conversations: '5,000', broadcastMessages: '50,000', users: 25 },
    ],
    featuresAr: ['الويب هوك وواجهة برمجة التطبيقات', 'ربط المتجر مع المنصة', 'دعم فني فضي'],
    featuresEn: ['Webhooks and API', 'Store integration with platform', 'Silver technical support'],
  },
  {
    id: 'growth',
    nameAr: 'باقة النمو',
    nameEn: 'Growth Package',
    popular: true,
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Most Popular',
    borderColor: 'border-emerald-400',
    glowBorder: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]',
    bgColor: 'bg-emerald-500/10',
    buttonColor: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
    tiers: [
      { nameAr: 'الشريحة 1', nameEn: 'Tier 1', price: '659', priceWithTax: '758', setupFee: '1,919', conversations: '1,000', broadcastMessages: '10,000', users: 7 },
      { nameAr: 'الشريحة 2', nameEn: 'Tier 2', price: '999', priceWithTax: '1,149', setupFee: '1,919', conversations: '2,500', broadcastMessages: '25,000', users: 15 },
      { nameAr: 'الشريحة 3', nameEn: 'Tier 3', price: '1,619', priceWithTax: '1,862', setupFee: '1,919', conversations: '5,000', broadcastMessages: '50,000', users: 25 },
    ],
    featuresAr: ['كل مميزات الباقة الأساسية', 'ربط أكثر من متجر مع المنصة', 'شات بوت ذكي (Smart Chatbot)', 'مدير حساب مخصص', 'دعم فني ذهبي'],
    featuresEn: ['All features of the Basic Package', 'Multiple store integrations', 'Smart Chatbot', 'Dedicated Account Manager', 'Gold technical support'],
  },
  {
    id: 'professional',
    nameAr: 'الباقة الاحترافية',
    nameEn: 'Professional Package',
    popular: false,
    borderColor: 'border-purple-500/30',
    glowBorder: '',
    bgColor: 'bg-purple-500/10',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    tiers: [
      { nameAr: 'الشريحة 1', nameEn: 'Tier 1', price: '999', priceWithTax: '1,149', setupFee: '2,919', conversations: '1,000', broadcastMessages: '10,000', users: 7 },
      { nameAr: 'الشريحة 2', nameEn: 'Tier 2', price: '1,499', priceWithTax: '1,724', setupFee: '2,919', conversations: '2,500', broadcastMessages: '25,000', users: 15 },
      { nameAr: 'الشريحة 3', nameEn: 'Tier 3', price: '2,199', priceWithTax: '2,529', setupFee: '2,919', conversations: '5,000', broadcastMessages: '50,000', users: 25 },
    ],
    featuresAr: ['كل مميزات باقة النمو', 'موظف ذكاء اصطناعي (AI Agent)', 'استضافة محلية (حسب الطلب)', 'مدير حساب VIP', 'دعم فني بلاتيني'],
    featuresEn: ['All features of the Growth Package', 'AI Agent Employee', 'Local Hosting (Upon request)', 'VIP Account Manager', 'Platinum technical support'],
  },
];

const API_PRICING = [
  { typeAr: 'محادثات خدمة العملاء', typeEn: 'Customer Service Conversations', priceAr: 'مجانية', priceEn: 'Free', durationAr: '24 ساعة', durationEn: '24 Hours', descAr: 'الرد على استفسارات العملاء خلال 24 ساعة من آخر رسالة', descEn: 'Reply to customer inquiries within 24 hours of their last message', isFree: true, icon: '💬' },
  { typeAr: 'رسائل التحقق (OTP)', typeEn: 'Verification Messages (OTP)', priceAr: '0.15', priceEn: '0.15', unitAr: 'ر.س', unitEn: 'SAR', durationAr: 'للمحادثة', durationEn: 'per conversation', descAr: 'رموز التحقق وتأكيد الهوية للمصادقة الآمنة', descEn: 'Verification codes and identity confirmation for secure authentication', isFree: false, icon: '🔐' },
  { typeAr: 'محادثات التفعيل', typeEn: 'Utility Conversations', priceAr: '0.30', priceEn: '0.30', unitAr: 'ر.س', unitEn: 'SAR', durationAr: 'للمحادثة', durationEn: 'per conversation', descAr: 'تأكيد الطلبات، إشعارات الشحن، وتحديثات الحساب', descEn: 'Order confirmations, shipping notices, and account updates', isFree: false, icon: '📦' },
  { typeAr: 'محادثات التسويق', typeEn: 'Marketing Conversations', priceAr: '0.64', priceEn: '0.64', unitAr: 'ر.س', unitEn: 'SAR', durationAr: 'للمحادثة', durationEn: 'per conversation', descAr: 'رسائل ترويجية وحملات إعلانية للعملاء', descEn: 'Promotional messages and ad campaigns for customers', isFree: false, icon: '📣' },
];

export default function WADesign3Page() {
  const [isRTL, setIsRTL] = useState(true);
  const [notificationIdx, setNotificationIdx] = useState(0);
  const [showNotification, setShowNotification] = useState(true);
  const [activeTab, setActiveTab] = useState<'merchant' | 'developer'>('merchant');
  const [selectedTier, setSelectedTier] = useState<Record<string, number>>({});
  const phoneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(false);
      setTimeout(() => {
        setNotificationIdx((prev) => (prev + 1) % NOTIFICATIONS.length);
        setShowNotification(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePhoneMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!phoneRef.current) return;
      const rect = phoneRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
      setTilt({ x, y });
    },
    [],
  );
  const handlePhoneMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const fontFamily = isRTL ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', sans-serif";

  return (
    <div style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'} className="bg-slate-950 text-white overflow-x-hidden selection:bg-emerald-500 selection:text-white">

      <WANavbar isRTL={isRTL} setIsRTL={setIsRTL} variant="dark" />

      {/* HERO */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/50 to-slate-900" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-emerald-500/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-green-500/5 blur-[120px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-emerald-400">▸</span>
              <span className="text-emerald-300 text-sm font-semibold">{isRTL ? 'واتساب أعمال API المعتمد' : 'Official WhatsApp Business API'}</span>
              <span className="text-emerald-500/50 animate-pulse">_</span>
            </div>
            <Image src={encodeImagePath('/logo/شعار المدار-01.svg')} alt="Orbit" width={160} height={55} className="h-12 md:h-14 w-auto brightness-0 invert" />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              {isRTL ? (
                <>تواصل احترافي مع عملائك <span className="text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">عبر واتساب أعمال</span></>
              ) : (
                <>Professional Communication <span className="text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">via WhatsApp Business</span></>
              )}
            </h1>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl font-mono">
              {isRTL
                ? '// كن أقرب لعملائك على واتساب — رسائل معتمدة، ردود آلية، وإدارة مركزية'
                : '// Get closer to your customers on WhatsApp — verified messages, auto-replies, centralized management'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://app.mobile.net.sa/reg" className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg text-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all">
                {isRTL ? 'ابدأ الآن — تجربة مجانية' : 'Start Now — Free Trial'}
              </a>
              <a href="#pricing" className="border-2 border-white/20 text-white backdrop-blur-sm px-8 py-4 rounded-2xl font-bold text-lg text-center hover:bg-white/10 hover:border-emerald-500/50 transition-all">
                {isRTL ? 'استعرض الباقات' : 'View Packages'}
              </a>
            </div>
          </div>

          {/* PHONE MOCKUP */}
          <div className="relative hidden md:flex justify-center" onMouseMove={handlePhoneMouseMove} onMouseLeave={handlePhoneMouseLeave} ref={phoneRef}>
            <motion.div animate={{ rotateX: tilt.y, rotateY: tilt.x }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="w-[320px]" style={{ perspective: '1000px' }}>
              <div className="w-full bg-slate-900 rounded-[2.5rem] border-[3px] border-slate-700 shadow-2xl shadow-emerald-500/10 overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-xl z-10" />
                <div className="bg-emerald-600 px-4 pt-8 pb-2 text-white flex items-center justify-between text-xs">
                  <span>{isRTL ? '٩:٤١' : '9:41'}</span>
                  <div className="flex items-center gap-1"><div className="w-4 h-2 border border-white/60 rounded-sm"><div className="w-3 h-full bg-white/80 rounded-sm" /></div></div>
                </div>
                <div className="bg-emerald-600 px-4 pb-3 flex items-center gap-2 text-white">
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">م</div>
                  <div>
                    <div className="font-bold text-sm">{isRTL ? 'صندوق الوارد الموحد' : 'Shared Inbox'}</div>
                    <div className="text-[10px] opacity-80">{isRTL ? '15 محادثة نشطة' : '15 active chats'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-800">
                  <div className="bg-emerald-500/10 backdrop-blur-sm rounded-lg p-2 text-center border border-emerald-500/20">
                    <div className="text-lg font-extrabold text-emerald-400">98%</div>
                    <div className="text-[7px] text-slate-500">{isRTL ? 'نسبة فتح' : 'Open Rate'}</div>
                  </div>
                  <div className="bg-emerald-500/10 backdrop-blur-sm rounded-lg p-2 text-center border border-emerald-500/20">
                    <div className="text-lg font-extrabold text-emerald-400">2min</div>
                    <div className="text-[7px] text-slate-500">{isRTL ? 'متوسط رد' : 'Avg Reply'}</div>
                  </div>
                  <div className="bg-emerald-500/10 backdrop-blur-sm rounded-lg p-2 text-center border border-emerald-500/20">
                    <div className="text-lg font-extrabold text-emerald-400">5x</div>
                    <div className="text-[7px] text-slate-500">{isRTL ? 'أعلى من Email' : 'vs Email'}</div>
                  </div>
                </div>
                <div className="bg-slate-800/80 backdrop-blur-sm p-3 space-y-2 h-[180px] overflow-hidden">
                  <div className="flex gap-2 items-start">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 text-[8px] flex items-center justify-center font-bold">أ</div>
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg max-w-[75%] border border-white/10">
                      <div className="text-[8px] text-slate-400">{isRTL ? 'أحمد - المبيعات' : 'Ahmed - Sales'}</div>
                      <div className="text-[10px]">{isRTL ? 'مرحباً! كيف أساعدك؟' : 'Hello! How can I help?'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start justify-end">
                    <div className="bg-emerald-500/20 backdrop-blur-md p-2 rounded-lg max-w-[75%] border border-emerald-500/20">
                      <div className="text-[10px]">{isRTL ? 'أريد الاستفسار عن باقات واتساب' : 'I want to inquire about WA packages'}</div>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    {showNotification && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-2 items-start">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex-shrink-0" />
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg max-w-[75%] border border-white/10">
                          <div className="text-[8px] text-emerald-400">{NOTIFICATIONS[notificationIdx].title}</div>
                          <div className="text-[10px]">{NOTIFICATIONS[notificationIdx].subtitle}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            <div className="absolute -bottom-3 -right-3 bg-slate-900 rounded-full p-3 shadow-xl border-2 border-emerald-500/50 z-20">
              <BadgeCheck className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-6 bg-slate-900/50 border-y border-white/5 overflow-hidden">
        <p className="text-center text-xs text-slate-500 mb-3">{isRTL ? 'شركاء النجاح' : 'Success Partners'}</p>
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, i) => (
            <div key={i} className="flex-shrink-0 w-24 h-14 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-2 flex items-center justify-center">
              <Image src={encodeImagePath(src)} alt="" width={80} height={40} className="max-w-full max-h-full object-contain brightness-0 invert opacity-40 hover:opacity-80 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <StatsSection isRTL={isRTL} />

      {/* WHY WHATSAPP */}
      <section className="py-16 md:py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[500px] h-[300px] rounded-full bg-emerald-500/5 blur-[150px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <ScrollReveal className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
              {isRTL ? 'لماذا واتساب الأعمال؟' : 'Why WhatsApp Business?'}
            </h2>
            <p className="text-emerald-400/60 mt-3 max-w-2xl mx-auto font-mono text-sm">
              {isRTL ? 'المنصة الأكثر ثقة وانتشاراً للتواصل مع عملائك في المملكة' : 'The most trusted and widespread platform for communicating with your customers in the Kingdom'}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {WHY_CORBIT.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <ScrollReveal key={i}>
                  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all h-full">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{isRTL ? feat.titleAr : feat.titleEn}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{isRTL ? feat.descAr : feat.descEn}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[300px] rounded-full bg-green-500/5 blur-[150px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <ScrollReveal className="text-center mb-10 md:mb-14">
            <span className="text-emerald-400 font-mono text-xs">{isRTL ? '>> الحلول المتقدمة' : '>> Advanced Solutions'}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
              {isRTL ? 'أدوات احترافية لإدارة محادثاتك' : 'Professional Tools to Manage Conversations'}
            </h2>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto font-mono text-sm">
              {isRTL ? '// كل ما تحتاجه لتحويل واتساب إلى قناة تواصل احترافية' : '// Everything you need to turn WhatsApp into a professional channel'}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {WHATSAPP_FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <ScrollReveal key={i}>
                  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{isRTL ? feat.titleAr : feat.titleEn}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{isRTL ? feat.descAr : feat.descEn}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAMPAIGNS */}
      <section className="py-16 md:py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <span className="text-orange-400 font-mono text-xs">{isRTL ? '>> التسويق الذكي' : '>> Smart Marketing'}</span>
                <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-4">
                  {isRTL ? 'أطلق حملاتك التسويقية بذكاء' : 'Launch Your Campaigns Smartly'}
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed font-mono text-sm">
                  {isRTL ? '// استهدف عملاءك بدقة، واستخدم قوالب جاهزة مع أزرار تفاعلية' : '// Target precisely, use ready templates with interactive buttons'}
                </p>
                <div className="space-y-4">
                  {CAMPAIGNS.map((campaign, i) => {
                    const Icon = campaign.icon;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: isRTL ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4 items-start bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all group">
                        <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-1 text-lg">{isRTL ? campaign.titleAr : campaign.titleEn}</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{isRTL ? campaign.descAr : campaign.descEn}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollReveal>
            </div>
            {/* Campaign mockup */}
            <ScrollReveal>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl shadow-emerald-500/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">{isRTL ? 'تقرير الحملة' : 'Campaign Report'}</h3>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">{isRTL ? 'نشطة' : 'Active'}</span>
                </div>
                <div className="space-y-4 mb-6">
                  {[
                    { label: isRTL ? 'معدل الفتح' : 'Open Rate', value: '94.2%', color: 'from-emerald-500/20 to-emerald-600/10', bar: 'bg-emerald-400', borderColor: 'border-emerald-500/20' },
                    { label: isRTL ? 'معدل النقر' : 'Click Rate', value: '67.8%', color: 'from-blue-500/20 to-blue-600/10', bar: 'bg-blue-400', borderColor: 'border-blue-500/20' },
                    { label: isRTL ? 'معدل التحويل' : 'Conversion', value: '23.4%', color: 'from-orange-500/20 to-orange-600/10', bar: 'bg-orange-400', borderColor: 'border-orange-500/20' },
                  ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-r ${stat.color} p-4 rounded-xl border ${stat.borderColor}`}>
                      <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                      <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                      <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden"><div className={`${stat.bar} h-full rounded-full`} style={{ width: stat.value }} /></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t border-white/10">
                  <div><div className="text-2xl font-bold text-white">12,547</div><div className="text-xs text-slate-500">{isRTL ? 'رسالة مرسلة' : 'Messages Sent'}</div></div>
                  <div><div className="text-2xl font-bold text-white">2,936</div><div className="text-xs text-slate-500">{isRTL ? 'تحويلات ناجحة' : 'Conversions'}</div></div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzEwRjE3RCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <ScrollReveal className="text-center mb-10 md:mb-14">
            <span className="text-purple-400 font-mono text-xs">{isRTL ? '>> الباقات والأسعار' : '>> Packages & Pricing'}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-3">
              {isRTL ? 'اختر الباقة المناسبة لنمو أعمالك' : 'Choose the Right Package for Your Business Growth'}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">{isRTL ? 'باقات مرنة تناسب جميع أحجام الأعمال' : 'Flexible packages suitable for all business sizes'}</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {PRICING_PLANS.map((plan, planIndex) => {
              const tierIndex = selectedTier[plan.id] ?? 0;
              const tier = plan.tiers[tierIndex];
              return (
                <ScrollReveal key={plan.id}>
                  <div className={`relative rounded-2xl overflow-hidden ${plan.borderColor} border-2 ${plan.glowBorder} ${plan.bgColor} backdrop-blur-xl`}>
                    {plan.popular && (
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-center py-2 text-sm font-bold">
                        ⭐ {isRTL ? plan.badgeAr : plan.badgeEn}
                      </div>
                    )}
                    <div className={`p-6 ${plan.popular ? 'pt-4' : ''}`}>
                      <h3 className="text-xl md:text-2xl font-extrabold text-white text-center mb-4">{isRTL ? plan.nameAr : plan.nameEn}</h3>
                      {plan.tiers.length > 1 && (
                        <div className="flex gap-1.5 justify-center mb-4">
                          {plan.tiers.map((t, ti) => (
                            <button key={ti} onClick={() => setSelectedTier(prev => ({ ...prev, [plan.id]: ti }))} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tierIndex === ti ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>
                              {isRTL ? t.nameAr : t.nameEn}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-3 border border-blue-500/20 mb-4">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-blue-300 mb-2">
                          <BarChart3 className="w-3.5 h-3.5" />
                          {isRTL ? 'السعة والحدود' : 'Capacity & Limits'}
                        </div>
                        <div className="space-y-1.5 text-[10px] md:text-xs">
                          <div className="flex items-center justify-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /><span className="text-slate-300 font-semibold">{tier.conversations} {isRTL ? 'محادثة' : 'Conversations'}</span></div>
                          <div className="flex items-center justify-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /><span className="text-slate-300 font-semibold">{tier.broadcastMessages} {isRTL ? 'رسالة بث' : 'Broadcasts'}</span></div>
                          <div className="flex items-center justify-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /><span className="text-slate-300 font-semibold">{isRTL ? `حتى ${tier.users} مستخدمين` : `Up to ${tier.users} Users`}</span></div>
                        </div>
                      </div>
                      <div className="text-center mb-2">
                        <div className="flex items-baseline justify-center gap-1.5">
                          <span className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">{tier.price}</span>
                          <span className="text-emerald-400 font-bold text-lg">{isRTL ? 'ر.س' : 'SAR'}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{isRTL ? 'شهرياً' : 'Monthly'}</p>
                        <p className="text-slate-500 text-[10px]">{isRTL ? `شامل الضريبة: ${tier.priceWithTax} ر.س` : `Tax included: ${tier.priceWithTax} SAR`}</p>
                        <p className="text-slate-500 text-[10px]">{isRTL ? `رسوم التأسيس: ${tier.setupFee} ر.س` : `Setup fee: ${tier.setupFee} SAR`}</p>
                      </div>
                      <a href="https://app.mobile.net.sa/reg" className={`w-full block text-center text-white font-bold mb-4 py-3 rounded-xl transition-all ${plan.buttonColor} shadow-lg`}>
                        {isRTL ? 'اشترك الآن' : 'Subscribe Now'}
                      </a>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          {isRTL ? 'المميزات الإضافية' : 'Additional Features'}
                        </h4>
                        {(isRTL ? plan.featuresAr : plan.featuresEn).map((f, fi) => (
                          <div key={fi} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-300">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          <ScrollReveal>
            <div className="text-center bg-blue-500/10 border-2 border-blue-500/20 rounded-xl p-6 max-w-4xl mx-auto mt-8 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-blue-400" />
                <p className="font-bold text-white">{isRTL ? 'ملاحظة مهمة' : 'Important Note'}</p>
              </div>
              <p className="text-slate-400">{isRTL ? 'الأسعار الموضحة تشمل 3 شرائح لكل باقة. تتوفر خصومات خاصة للشركات الكبرى والجهات الحكومية.' : 'The stated prices include 3 tiers for each package. Special discounts available for large companies and government entities.'}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* API PRICING */}
      <section id="api-pricing" className="py-16 md:py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[400px] h-[300px] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-10 md:mb-14">
            <span className="text-blue-400 font-mono text-xs">{isRTL ? '>> تكلفة المحادثات' : '>> Conversation Costs'}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-3">{isRTL ? 'أسعار محادثات واتساب API' : 'WhatsApp API Conversation Prices'}</h2>
            <p className="text-slate-400">{isRTL ? 'الأسعار التالية محددة من واتساب (Meta) للسوق السعودي' : 'The following prices are standardized by WhatsApp (Meta) for the Saudi Market'}</p>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {API_PRICING.map((item, i) => (
              <ScrollReveal key={i}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-sm md:text-base font-bold text-white mb-2">{isRTL ? item.typeAr : item.typeEn}</h3>
                  {item.isFree ? (
                    <div className="text-2xl font-extrabold text-emerald-400 mb-1">{isRTL ? 'مجانية' : 'Free'}</div>
                  ) : (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-extrabold text-white">{isRTL ? item.priceAr : item.priceEn}</span>
                      <span className="text-emerald-400 text-xs font-bold">{isRTL ? item.unitAr : item.unitEn}</span>
                      <span className="text-slate-400 text-xs">{isRTL ? item.durationAr : item.durationEn}</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-2">{isRTL ? item.descAr : item.descEn}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="mt-8 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">💡 {isRTL ? 'نصيحة احترافية' : 'Pro Tip'}</h4>
                  <p className="text-slate-300 text-sm">{isRTL ? 'محادثات خدمة العملاء مجانية تماماً خلال 24 ساعة من آخر رسالة! استفد من هذه الميزة للرد على استفسارات عملائك دون أي تكلفة إضافية.' : 'Customer service conversations are completely free within 24 hours of the last message. Use this to answer customer questions with no extra cost.'}</p>
                  <p className="text-slate-500 text-xs mt-2">{isRTL ? '* الأسعار قابلة للتغيير من Meta (واتساب) وقد تختلف حسب المنطقة والعملة.' : '* Prices are subject to change by Meta (WhatsApp) and may vary by region and currency.'}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* GREEN TICK */}
      <section id="green-tick" className="py-16 md:py-20 bg-gradient-to-b from-emerald-950/20 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI1RDM2NiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4 shadow-lg shadow-emerald-500/30">
              <BadgeCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">{isRTL ? 'احصل على الشارة الخضراء' : 'Get the Green Tick'}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">{isRTL ? 'عزز ثقة عملائك وتميز عن المنافسين بحساب موثوق رسمياً من واتساب' : 'Boost your customers\' trust and stand out from competitors with an officially verified WhatsApp account'}</p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="border-2 border-emerald-500/30 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-emerald-500/10 border-b border-emerald-500/20">
                      <th className={`text-${isRTL ? 'right' : 'left'} p-4 font-bold text-white`}>{isRTL ? 'المميزات' : 'Features'}</th>
                      <th className="text-center p-4 font-bold text-slate-400">{isRTL ? 'بدون توثيق' : 'Unverified'}</th>
                      <th className="text-center p-4 font-bold text-blue-400">{isRTL ? 'حساب تجاري' : 'Business'} <BadgeCheck className={`w-5 h-5 inline ${isRTL ? 'mr-1' : 'ml-1'} text-blue-400`} /></th>
                      <th className="text-center p-4 font-bold text-emerald-400">{isRTL ? 'حساب موثوق' : 'Verified'} <BadgeCheck className={`w-5 h-5 inline ${isRTL ? 'mr-1' : 'ml-1'} text-emerald-400`} /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPETITIVE_EDGE.map((item, i) => (
                      <tr key={i} className={`border-t border-white/10 ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.05]'}`}>
                        <td className="p-4 text-white font-medium">{isRTL ? item.featureAr : item.featureEn}</td>
                        <td className="p-4 text-center"><X className="w-6 h-6 text-red-400 mx-auto" strokeWidth={3} /></td>
                        <td className="p-4 text-center">{item.business ? <CheckCircle2 className="w-6 h-6 text-blue-400 mx-auto" /> : <X className="w-6 h-6 text-red-400 mx-auto" strokeWidth={3} />}</td>
                        <td className="p-4 text-center">{item.verified ? <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" /> : <X className="w-6 h-6 text-red-400 mx-auto" strokeWidth={3} />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="mt-8 text-center bg-emerald-500/10 border-2 border-emerald-500/20 rounded-xl p-6 backdrop-blur-sm">
              <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-white mb-2">{isRTL ? 'فريق المدار يساعدك في تجهيز المتطلبات' : 'CORBIT Team helps you prepare the requirements'}</p>
              <p className="text-slate-300">{isRTL ? 'نوفر لك الدعم الكامل للحصول على التوثيق الرسمي من واتساب' : 'We provide you with full support to get official WhatsApp verification'}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="py-16 md:py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <ScrollReveal className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white">{isRTL ? 'نتكامل مع أدواتك المفضلة' : 'Seamless Integrations'}</h2>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {INTEGRATIONS.map((item, i) => (
              <ScrollReveal key={i}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl px-5 md:px-6 py-4 md:py-5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all group"
                >
                  {item.icon && (
                    <Image
                      src={encodeImagePath(item.icon)}
                      alt={isRTL ? item.nameAr : item.nameEn}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <span className="text-base md:text-lg font-bold text-white">{isRTL ? item.nameAr : item.nameEn}</span>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <ScrollReveal className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-white">{isRTL ? 'اختر مسارك' : 'Choose Your Path'}</h2>
          </ScrollReveal>
          <div className="flex justify-center gap-4 mb-8">
            <button onClick={() => setActiveTab('merchant')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'merchant' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
              {isRTL ? 'للتجار' : 'For Merchants'}
            </button>
            <button onClick={() => setActiveTab('developer')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'developer' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
              {isRTL ? 'للمطورين' : 'For Developers'}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {activeTab === 'merchant' ? (
              <motion.div key="merchant" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-3 gap-6 md:gap-8">
                {[
                  { step: '01', titleAr: 'أنشئ قالب واتساب', titleEn: 'Create WhatsApp Template', descAr: 'صمّم قالب رسالتك المعتمدة من واتساب بنقرة واحدة', descEn: 'Design your WhatsApp-approved message template with one click' },
                  { step: '02', titleAr: 'أدر محادثاتك', titleEn: 'Manage Conversations', descAr: 'رد على عملائك من لوحة تحكم مركزية مع ردود سريعة', descEn: 'Reply to customers from a central dashboard with quick replies' },
                  { step: '03', titleAr: 'حلّل أداءك', titleEn: 'Analyze Performance', descAr: 'تتبع نسب الفتح والنقر والتحويل بتقارير واتساب التفصيلية', descEn: 'Track open, click & conversion rates with detailed WhatsApp reports' },
                ].map((item, i) => (
                  <div key={i} className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{isRTL ? item.titleAr : item.titleEn}</h3>
                    <p className="text-slate-400">{isRTL ? item.descAr : item.descEn}</p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="developer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-3 gap-6 md:gap-8">
                {[
                  { title: 'REST API', desc: isRTL ? 'واجهة برمجة تطبيقات شاملة للتكامل مع أنظمتك' : 'Comprehensive API for integrating with your systems' },
                  { title: 'Webhooks', desc: isRTL ? 'إشعارات فورية للأحداث في الوقت الحقيقي' : 'Real-time event notifications via webhooks' },
                  { title: 'Sandbox', desc: isRTL ? 'بيئة اختبار كاملة قبل النشر على الإنتاج' : 'Full sandbox environment before production deployment' },
                ].map((item, i) => (
                  <div key={i} className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-emerald-400 font-mono font-bold">&lt;/&gt;</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-emerald-700 via-[#0d6b5f] to-[#0a5a50] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <Sparkles className="w-16 h-16 text-emerald-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            {isRTL ? 'جاهز لنقل خدمة عملائك لمستوى آخر؟' : 'Ready to take your customer service to the next level?'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {isRTL ? 'فريقنا جاهز لمساعدتك في الحصول على الشارة الخضراء وربط الـ API بكل سهولة واحترافية' : 'Our team is ready to help you get the Green Badge and integrate the API easily and professionally'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://app.mobile.net.sa/reg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl text-lg shadow-2xl shadow-orange-500/50 transition-all hover:-translate-y-0.5">
              {isRTL ? 'اطلب الخدمة الآن' : 'Order Service Now'} <ArrowRight className={`w-5 h-5 inline ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </a>
            <a href="https://wa.me/966920006900" target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-500 text-white font-bold px-10 py-4 rounded-xl text-lg shadow-2xl shadow-emerald-500/50 transition-all hover:-translate-y-0.5">
              {isRTL ? 'تحدث مع المبيعات' : 'Talk to Sales'} <Headphones className={`w-5 h-5 inline ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 pt-6 border-t border-white/20">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <Image src={encodeImagePath('/WhatsAppPage/cst.png')} alt="CST" className="h-24 md:h-32 w-auto" width={120} height={80} />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <Image src={encodeImagePath('/WhatsAppPage/meta.png')} alt="Meta" className="h-24 md:h-32 w-auto" width={120} height={80} />
            </div>
          </div>
        </div>
      </section>

      <WAFooter isRTL={isRTL} variant="dark" />

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

function StatsSection({ isRTL }: { isRTL: boolean }) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const count1 = useCountUp(98, 2000, inView);
  const count2 = useCountUp(5, 1500, inView);
  const count3 = useCountUp(2, 1500, inView);
  const count4 = useCountUp(40, 1800, inView);

  return (
    <section ref={statsRef} className="py-16 md:py-20 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: count1, suffix: '%+', label: isRTL ? 'نسبة فتح الرسائل' : 'Message Open Rate' },
            { value: count2, suffix: 'x', label: isRTL ? 'أعلى من البريد الإلكتروني' : 'Higher than Email' },
            { value: count3, suffix: '+', extra: isRTL ? 'مليار' : 'Billion', label: isRTL ? 'مستخدم واتساب عالمياً' : 'WhatsApp Users Globally' },
            { value: count4, suffix: '%+', label: isRTL ? 'زيادة في المبيعات' : 'Increase in Sales' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-2">
                {stat.value}{stat.suffix}
                {stat.extra && <span className="text-xl ml-1">{stat.extra}</span>}
              </div>
              <div className="text-white/70 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}