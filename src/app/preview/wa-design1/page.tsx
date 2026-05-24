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
  Zap,
  Building2,
  Users,
  TrendingUp,
  Headphones,
  CreditCard,
  Smartphone,
  Bot,
  BarChart3,
  MessageCirclePlus,
  FileText,
  Globe,
  BadgeCheck,
  Send,
  Clock,
  Target,
  Sparkles,
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

const MARQUEE_ROW1 = PARTNER_LOGOS.slice(0, 12);
const MARQUEE_ROW2 = PARTNER_LOGOS.slice(12);

type ChatMsg =
  | { id: number; type: 'bot'; textAr: string; textEn: string; delay: number }
  | { id: number; type: 'quick_replies'; optionsAr: string[]; optionsEn: string[]; delay: number }
  | { id: number; type: 'user'; textAr: string; textEn: string };

type ChatNode = {
  messages: ChatMsg[];
  children?: Record<string, ChatNode>;
};

const CHAT_TREE: ChatNode = {
  messages: [
    { id: 1, type: 'bot', textAr: 'مرحباً بك! 👋 أنا بوت المدار، مساعدك الذكي لخدمات واتساب أعمال', textEn: "Hello! 👋 I'm Orbit Bot, your smart assistant for WhatsApp Business services", delay: 0 },
    { id: 2, type: 'bot', textAr: 'كيف يمكنني مساعدتك اليوم؟', textEn: 'How can I help you today?', delay: 1800 },
    { id: 3, type: 'quick_replies', optionsAr: ['الباقات والأسعار', 'تحدث مع المبيعات', 'استفسار عام'], optionsEn: ['Packages & Pricing', 'Talk to Sales', 'General Inquiry'], delay: 3200 },
  ],
  children: {
    'الباقات والأسعار': {
      messages: [
        { id: 100, type: 'user', textAr: 'الباقات والأسعار', textEn: 'Packages & Pricing' },
        { id: 101, type: 'bot', textAr: 'بالتأكيد! لدينا 3 باقات رئيسية 📋', textEn: 'Of course! We have 3 main packages 📋', delay: 1200 },
        { id: 102, type: 'bot', textAr: '🟢 الأساسية: 399 ر.س\n🔵 النمو: 659 ر.س\n🟣 الاحترافية: 999 ر.س', textEn: '🟢 Basic: 399 SAR\n🔵 Growth: 659 SAR\n🟣 Professional: 999 SAR', delay: 2800 },
        { id: 103, type: 'bot', textAr: 'هل تريد التحدث مع فريق المبيعات للحصول على عرض مخصص؟ 😊', textEn: 'Would you like to talk to our sales team for a custom offer? 😊', delay: 4500 },
        { id: 104, type: 'quick_replies', optionsAr: ['نعم، أريد عرض مخصص', 'لا، شكراً'], optionsEn: ['Yes, custom offer', 'No, thanks'], delay: 5800 },
      ],
      children: {
        'نعم، أريد عرض مخصص': {
          messages: [
            { id: 200, type: 'user', textAr: 'نعم، أريد عرض مخصص', textEn: 'Yes, custom offer' },
            { id: 201, type: 'bot', textAr: 'رائع! 🎉 سيتواصل معك فريق المبيعات خلال دقائق لتحضير عرض مخصص يناسب احتياجاتك', textEn: 'Great! 🎉 Our sales team will contact you within minutes to prepare a custom offer', delay: 1500 },
            { id: 202, type: 'bot', textAr: 'يمكنك أيضاً التواصل مباشرة عبر واتساب: wa.me/966920006900 📱', textEn: 'You can also reach us directly on WhatsApp: wa.me/966920006900 📱', delay: 3500 },
          ],
        },
        'لا، شكراً': {
          messages: [
            { id: 210, type: 'user', textAr: 'لا، شكراً', textEn: 'No, thanks' },
            { id: 211, type: 'bot', textAr: 'لا مشكلة! 😊 إذا احتجت أي مساعدة مستقبلاً، أنا هنا دائماً', textEn: 'No problem! 😊 If you need any help in the future, I\'m always here', delay: 1500 },
          ],
        },
      },
    },
    'تحدث مع المبيعات': {
      messages: [
        { id: 110, type: 'user', textAr: 'تحدث مع المبيعات', textEn: 'Talk to Sales' },
        { id: 111, type: 'bot', textAr: 'جاري تحويلك لفريق المبيعات... 🔄', textEn: 'Transferring you to our sales team... 🔄', delay: 1200 },
        { id: 112, type: 'bot', textAr: 'مرحباً! 👋 معك محمد من فريق المبيعات. كيف يمكنني مساعدتك؟', textEn: 'Hello! 👋 This is Mohammed from sales. How can I help you?', delay: 3500 },
      ],
    },
    'استفسار عام': {
      messages: [
        { id: 120, type: 'user', textAr: 'استفسار عام', textEn: 'General Inquiry' },
        { id: 121, type: 'bot', textAr: 'بالطبع! يمكنك سؤالي عن أي شيء يتعلق بخدمات واتساب أعمال 📱', textEn: 'Of course! You can ask me anything about WhatsApp Business services 📱', delay: 1200 },
        { id: 122, type: 'bot', textAr: 'أو يمكنك زيارة صفحة الأسئلة الشائعة على: ot.com.sa/faq', textEn: 'Or visit our FAQ page at: ot.com.sa/faq', delay: 3000 },
      ],
    },
  },
};

const WHATSAPP_FEATURES = [
  { icon: Users, titleAr: 'رقم موحد للفريق', titleEn: 'Unified Team Number', descAr: 'لا مزيد من تشتت المحادثات، رقم واحد يديره فريق كامل بكفاءة عالية', descEn: 'No more scattered conversations, one number managed efficiently by the whole team' },
  { icon: Shield, titleAr: 'إدارة الصلاحيات', titleEn: 'Permissions Management', descAr: 'تحويل المحادثات بين المبيعات والدعم الفني بسلاسة واحترافية', descEn: 'Seamlessly transfer conversations between sales and technical support' },
  { icon: Bot, titleAr: 'الردود الآلية (Chatbot)', titleEn: 'Automated Replies (Chatbot)', descAr: 'خدمة عملاء 24/7 دون تدخل بشري، أجب على الأسئلة الشائعة تلقائياً', descEn: '24/7 customer service without human intervention, automatically answer FAQs' },
  { icon: MessageCirclePlus, titleAr: 'صندوق وارد مشترك', titleEn: 'Shared Inbox', descAr: 'فلترة الرسائل (مقروءة، غير مقروءة، لم يتم الرد) في واجهة واحدة', descEn: 'Filter messages (read, unread, unanswered) in a single interface' },
  { icon: Clock, titleAr: 'جدولة الرسائل', titleEn: 'Message Scheduling', descAr: 'حدد وقت إرسال رسائلك مسبقاً للوصول في الوقت المثالي', descEn: 'Pre-schedule your messages to be sent at the optimal time' },
  { icon: BarChart3, titleAr: 'تقارير تفصيلية', titleEn: 'Detailed Reports', descAr: 'تتبع أداء الحملات ومعدلات القراءة والاستجابة لحظياً', descEn: 'Track campaign performance, read rates, and instant responses' },
];

const WHY_ORBIT = [
  { icon: Globe, titleAr: 'المنصة رقم 1 في المملكة', titleEn: 'The #1 Platform in the Kingdom', descAr: 'الأكثر انتشاراً واستخداماً في السعودية', descEn: 'The most widespread and used in Saudi Arabia' },
  { icon: CheckCircle2, titleAr: 'معدل فتح 98%', titleEn: '98% Open Rate', descAr: 'يتم فتح وقراءة معظم الرسائل فوراً', descEn: 'Most messages are opened and read immediately' },
  { icon: Shield, titleAr: 'آمن وموثوق', titleEn: 'Secure & Reliable', descAr: 'تشفير كامل من طرف لطرف للبيانات', descEn: 'End-to-end encryption for all data' },
  { icon: Smartphone, titleAr: 'سهل الاستخدام', titleEn: 'Easy to Use', descAr: 'تطبيق مألوف للجميع بدون تعقيد', descEn: 'Familiar app for everyone without complexity' },
];

const COMPETITIVE_EDGE = [
  { icon: BadgeCheck, titleAr: 'ظهور اسم الشركة', titleEn: 'Company Name Visibility', descAr: 'يظهر اسم شركتك بجانب رقم الهاتف في واتساب', descEn: 'Your company name appears next to the phone number in WhatsApp' },
  { icon: BadgeCheck, titleAr: 'الشارة الخضراء الرسمية', titleEn: 'Official Green Badge', descAr: 'احصل على الشارة الخضراء التي تمنح ثقة عملائك', descEn: 'Get the official green badge that gives your customers confidence' },
  { icon: CheckCircle2, titleAr: 'ثقة أعلى من العملاء', titleEn: 'Higher Customer Trust', descAr: 'العملاء يثقون أكثر بالحسابات المعتمدة والموثقة', descEn: 'Customers trust verified and authenticated accounts more' },
  { icon: Send, titleAr: 'رسائل غير محدودة', titleEn: 'Unlimited Messages', descAr: 'أرسل رسائل غير محدودة لعملائك بدون قيود', descEn: 'Send unlimited messages to your customers without restrictions' },
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

const GREEN_TICK_COMPARISON = [
  { featureAr: 'ظهور اسم الشركة', featureEn: 'Company Name Visibility', unverified: false, business: true, verified: true },
  { featureAr: 'الشارة الخضراء الرسمية', featureEn: 'Official Green Badge', unverified: false, business: false, verified: true },
  { featureAr: 'ثقة أعلى من العملاء', featureEn: 'Higher Customer Trust', unverified: false, business: true, verified: true },
  { featureAr: 'رسائل غير محدودة', featureEn: 'Unlimited Messages', unverified: false, business: false, verified: true },
];

const PRICING_PLANS = [
  {
    id: 'basic',
    nameAr: 'الباقة الأساسية',
    nameEn: 'Basic Package',
    popular: false,
    color: 'border-white/20',
    bgColor: 'bg-white/5',
    buttonColor: 'bg-slate-600 hover:bg-slate-700',
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
    color: 'border-green-500/50',
    bgColor: 'bg-green-500/10',
    buttonColor: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
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
    color: 'border-purple-500/30',
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
  { typeAr: 'محادثات خدمة العملاء', typeEn: 'Customer Service Conversations', priceAr: 'مجانية', priceEn: 'Free', durationAr: '24 ساعة', durationEn: '24 Hours', descAr: 'الرد على استفسارات العملاء خلال 24 ساعة من آخر رسالة', descEn: 'Reply to customer inquiries within 24 hours of their last message', isFree: true, color: 'bg-green-500/10 border-green-500/20' },
  { typeAr: 'رسائل التحقق (OTP)', typeEn: 'Verification Messages (OTP)', priceAr: '0.15', priceEn: '0.15', unitAr: 'ر.س', unitEn: 'SAR', durationAr: 'للمحادثة', durationEn: 'per conversation', descAr: 'رموز التحقق وتأكيد الهوية للمصادقة الآمنة', descEn: 'Verification codes and identity confirmation for secure authentication', isFree: false, color: 'bg-purple-500/10 border-purple-500/20' },
  { typeAr: 'محادثات التفعيل', typeEn: 'Utility Conversations', priceAr: '0.30', priceEn: '0.30', unitAr: 'ر.س', unitEn: 'SAR', durationAr: 'للمحادثة', durationEn: 'per conversation', descAr: 'تأكيد الطلبات، إشعارات الشحن، وتحديثات الحساب', descEn: 'Order confirmations, shipping notices, and account updates', isFree: false, color: 'bg-blue-500/10 border-blue-500/20' },
  { typeAr: 'محادثات التسويق', typeEn: 'Marketing Conversations', priceAr: '0.64', priceEn: '0.64', unitAr: 'ر.س', unitEn: 'SAR', durationAr: 'للمحادثة', durationEn: 'per conversation', descAr: 'رسائل ترويجية وحملات إعلانية للعملاء', descEn: 'Promotional messages and ad campaigns for customers', isFree: false, color: 'bg-orange-500/10 border-orange-500/20' },
];

export default function WADesign1Page() {
  const [isRTL, setIsRTL] = useState(true);
  const [activeTab, setActiveTab] = useState<'merchant' | 'developer'>('merchant');
  const [selectedTier, setSelectedTier] = useState<Record<string, number>>({});
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentNode, setCurrentNode] = useState<ChatNode>(CHAT_TREE);
  const [pendingQuickReplies, setPendingQuickReplies] = useState<{ optionsAr: string[]; optionsEn: string[] } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const appendMessages = useCallback((node: ChatNode, startIdx: number = 0) => {
    const msgs = node.messages;
    let idx = startIdx;

    const showNext = () => {
      if (idx >= msgs.length) return;

      const msg = msgs[idx];
      const isUser = msg.type === 'user';

      if (msg.type === 'quick_replies') {
        setPendingQuickReplies({ optionsAr: msg.optionsAr, optionsEn: msg.optionsEn });
        idx++;
        return;
      }

      setIsTyping(true);
      const waitMs = isUser ? 300 : (idx === 0 ? 800 : 1200);

      setTimeout(() => {
        setIsTyping(false);
        setChatMessages(prev => [...prev, msg]);
        idx++;
        if (idx < msgs.length) {
          showNext();
        }
      }, waitMs);
    };

    showNext();
  }, []);

  useEffect(() => {
    appendMessages(CHAT_TREE);
  }, []);

  useEffect(() => {
    const el = chatEndRef.current?.parentElement;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatMessages, isTyping]);

  const handleQuickReply = useCallback((optionAr: string, optionEn: string) => {
    if (!currentNode.children) return;
    const nextNode = currentNode.children[optionAr] || currentNode.children[optionEn];
    if (!nextNode) return;

    setPendingQuickReplies(null);
    setCurrentNode(nextNode);
    setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', textAr: optionAr, textEn: optionEn }]);

    setTimeout(() => {
      appendMessages(nextNode, 1);
    }, 500);
  }, [currentNode, appendMessages]);

  const fontFamily = isRTL ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', sans-serif";

  return (
    <div style={{ fontFamily }} dir={isRTL ? 'rtl' : 'ltr'} className="bg-slate-950 text-white overflow-x-hidden selection:bg-green-500 selection:text-white">
      <WANavbar isRTL={isRTL} setIsRTL={setIsRTL} variant="dark" />

      {/* ================================================================= */}
      {/* 2. HERO SECTION - Glass Morphism                                   */}
      {/* ================================================================= */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        {/* Glass mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-green-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-emerald-500/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-green-400/5 blur-[80px]" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          {/* WhatsApp icon watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] text-green-400">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.277.297-1.26 1.232-1.26 3.002s1.287 3.487 1.467 3.723c.18.232 2.544 3.887 6.162 5.453.86.372 1.53.595 2.054.768.862.274 1.647.236 2.267.144.69-.1 1.26-.708 1.563-1.389.302-.68.302-1.26.209-1.38-.09-.124-.347-.223-.644-.325z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.66 0-3.2-.505-4.486-1.377l-.254-.153-2.98.884.884-2.98-.153-.254A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* LEFT – TEXT */}
          <ScrollReveal>
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-semibold">
                  {isRTL ? 'واتساب أعمال API المعتمد' : 'Official WhatsApp Business API'}
                </span>
              </div>

              <Image
                src={encodeImagePath('/logo/شعار المدار-01.svg')}
                alt="Orbit المدار"
                width={160}
                height={55}
                className="h-12 md:h-14 w-auto brightness-0 invert"
              />

               <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                {isRTL ? (
                  <>
                    تواصل احترافي مع عملائك{' '}
                    <br />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                      عبر واتساب أعمال
                    </span>
                  </>
                ) : (
                  <>
                    Professional Communication{' '}
                    <br />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                      via WhatsApp Business
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl">
                {isRTL
                  ? 'كن أقرب لعملائك على واتساب — رسائل تسويقية معتمدة، ردود آلية ذكية، وإدارة محادثات مركزية من لوحة تحكم واحدة'
                  : 'Get closer to your customers on WhatsApp — verified marketing messages, smart auto-replies, and centralized chat management from one dashboard'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://app.mobile.net.sa/reg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg text-center hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5"
                >
                  {isRTL ? 'ابدأ الآن — تجربة مجانية لواتساب أعمال' : 'Start Now — Free WhatsApp Business Trial'}
                </a>
                <a
                  href="#contact"
                  className="border-2 border-white/20 text-white backdrop-blur-sm px-8 py-4 rounded-2xl font-bold text-lg text-center hover:bg-white/10 hover:border-green-500/50 transition-all"
                >
                  {isRTL ? 'تحدث مع المبيعات' : 'Talk to Sales'}
                </a>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {['/logo/شعار المدار1-01.png', '/TrustedLogos/حرس الحدود.png', '/TrustedLogos/إمارة منطقة الرياض.png', '/TrustedLogos/جامعة الملك سعود.png'].map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-700 bg-slate-800 overflow-hidden shadow-sm">
                      <Image src={src} alt="" width={40} height={40} className="object-contain p-0.5" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  {isRTL ? '+20,000 جهة تستخدم واتساب أعمال معنا' : '+20,000 entities using WhatsApp Business with us'}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT – PHONE MOCKUP */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-[280px] sm:w-[340px] bg-slate-900 rounded-[2.5rem] shadow-2xl border-[6px] border-slate-700 overflow-hidden relative h-[520px] sm:h-[600px]">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-700 rounded-b-2xl z-10" />
              {/* Status bar */}
              <div className="bg-[#075E54] px-5 pt-8 pb-2 flex items-center justify-between text-white text-xs">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 border border-white/60 rounded-sm"><div className="w-3 h-full bg-white/80 rounded-sm" /></div>
                </div>
              </div>
              {/* Chat header */}
              <div className="bg-[#075E54] px-4 pb-3 flex items-center gap-3 text-white">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    {isRTL ? 'بوت المدار 🤖' : 'Orbit Bot 🤖'}
                    <BadgeCheck className="w-3.5 h-3.5 text-green-300" />
                  </div>
                  <div className="text-[10px] opacity-80">{isRTL ? 'متصل الآن' : 'Online'}</div>
                </div>
              </div>
              {/* Chat messages */}
              <div className="bg-[#0b141a] px-3 py-3 space-y-2.5 flex-1 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'} style={{ height: 'calc(100% - 180px)' }}>
                {/* Date separator */}
                <div className="flex justify-center">
                  <span className="text-[9px] bg-[#1d2730] text-slate-400 px-3 py-0.5 rounded-full">{isRTL ? 'اليوم' : 'Today'}</span>
                </div>

                {chatMessages.map((msg, idx) => {
                  if (msg.type === 'quick_replies') return null;

                  if (msg.type === 'bot') {
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-2 items-start"
                      >
                        <div className="w-7 h-7 bg-[#00a884] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="bg-[#1d2730] p-2 rounded-lg max-w-[75%]">
                          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{isRTL ? msg.textAr : msg.textEn}</p>
                          <div className="text-[9px] text-slate-500 mt-0.5 text-right">9:41</div>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-end gap-2 items-start"
                    >
                      <div className="bg-[#005c4b] p-2 rounded-lg max-w-[75%]">
                        <p className="text-xs text-slate-100 leading-relaxed">{isRTL ? msg.textAr : msg.textEn}</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <span className="text-[9px] text-slate-400">9:41</span>
                          <CheckCircle2 className="w-3 h-3 text-[#53bdeb]" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Quick reply buttons */}
                {pendingQuickReplies && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap gap-1.5 max-w-[85%]"
                  >
                    {(isRTL ? pendingQuickReplies.optionsAr : pendingQuickReplies.optionsEn).map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const optsAr = pendingQuickReplies.optionsAr;
                          const optsEn = pendingQuickReplies.optionsEn;
                          handleQuickReply(optsAr[i], optsEn[i]);
                        }}
                        className="bg-[#005c4b] border border-[#00a884]/40 text-[#86efac] text-[10px] px-3 py-1.5 rounded-full hover:bg-[#00a884]/20 transition-colors cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 items-start"
                  >
                    <div className="w-7 h-7 bg-[#00a884] rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-[#1d2730] p-2 rounded-lg">
                      <div className="flex items-center gap-1">
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-[#00a884]" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#00a884]" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#00a884]" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input bar */}
              <div className="bg-[#1d2730] px-3 py-2.5 flex items-center gap-2 border-t border-[#2a3942]">
                <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[10px] text-slate-500">
                  {isRTL ? 'اكتب رسالة...' : 'Type a message...'}
                </div>
                <div className="w-7 h-7 rounded-full bg-[#00a884] flex items-center justify-center flex-shrink-0">
                  <Send className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. STATS BAR - Glass cards                                        */}
      {/* ================================================================= */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[200px] rounded-full bg-green-500/5 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[150px] rounded-full bg-emerald-500/5 blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS_DATA.map((stat, i) => {
              const { ref, inView } = useInView();
              const count = useCountUp(stat.end, 2200, inView);
              return (
                <div key={i} ref={ref} className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 md:p-6 border border-white/10 text-center hover:border-green-500/30 transition-all">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    {count.toLocaleString('en-US')}{stat.suffix}
                  </div>
                  <div className="mt-2 text-xs md:text-sm text-slate-400 font-medium">
                    {isRTL ? stat.labelAr : stat.labelEn}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. TRUSTED PARTNERS - Glass cards                                 */}
      {/* ================================================================= */}
      <section className="py-16 md:py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[600px] h-[300px] rounded-full bg-green-500/3 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 text-center mb-10 md:mb-12">
          <ScrollReveal>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              {isRTL ? 'شركاء النجاح' : 'Success Partners'}
            </h2>
            <p className="mt-3 text-slate-500 text-sm md:text-lg max-w-xl mx-auto">
              {isRTL
                ? 'يثق بنا أكثر من 20,000 جهة حكومية وخاصة في المملكة'
                : 'Trusted by over 20,000 government and private entities in the Kingdom'}
            </p>
          </ScrollReveal>
        </div>

        {/* Row 1 */}
        <div className="relative overflow-hidden mb-6">
          <div className="marquee-row-glass flex gap-4 w-max">
            {[...MARQUEE_ROW1, ...MARQUEE_ROW1].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-xl p-4 h-20 w-36 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:border-green-500/30 hover:bg-white/10"
              >
                <Image src={logo} alt="" width={100} height={40} className="object-contain max-h-12 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="relative overflow-hidden">
          <div className="marquee-row-reverse-glass flex gap-4 w-max">
            {[...MARQUEE_ROW2, ...MARQUEE_ROW2].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-xl p-4 h-20 w-36 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:border-green-500/30 hover:bg-white/10"
              >
                <Image src={logo} alt="" width={100} height={40} className="object-contain max-h-12 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .marquee-row-glass {
            animation: marquee-g1 35s linear infinite;
          }
          .marquee-row-reverse-glass {
            animation: marquee-g2 35s linear infinite;
          }
          @keyframes marquee-g1 {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-g2 {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </section>

      {/* ================================================================= */}
      {/* 5. WHATSAPP FEATURES - Glass cards                                */}
      {/* ================================================================= */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-green-500/5 blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <ScrollReveal className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-semibold">
                {isRTL ? 'واتساب أعمال API' : 'WhatsApp Business API'}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              {isRTL ? 'أدوات احترافية لإدارة محادثاتك' : 'Professional Tools to Manage Conversations'}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {WHATSAPP_FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <ScrollReveal key={i}>
                  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:bg-white/10 h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {isRTL ? feat.titleAr : feat.titleEn}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {isRTL ? feat.descAr : feat.descEn}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. WHY ORBIT - Glass cards                                        */}
      {/* ================================================================= */}
      <section className="py-16 md:py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-emerald-500/5 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <ScrollReveal className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-4xl font-bold text-white">
              {isRTL ? 'لماذا واتساب الأعمال؟' : 'Why WhatsApp Business?'}
            </h2>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
              {isRTL ? 'المنصة الأكثر ثقة وانتشاراً للتواصل مع عملائك في المملكة' : 'The most trusted and widespread platform for communicating with your customers in the Kingdom'}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {WHY_ORBIT.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <ScrollReveal key={i}>
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-green-500/20">
                      <Icon className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {isRTL ? feat.titleAr : feat.titleEn}
                    </h3>
                    <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                      {isRTL ? feat.descAr : feat.descEn}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. CAMPAIGNS                                                       */}
      {/* ================================================================= */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[300px] rounded-full bg-orange-500/5 blur-[150px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 text-sm font-bold">{isRTL ? 'التسويق الذكي' : 'Smart Marketing'}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  {isRTL ? 'أطلق حملاتك التسويقية بذكاء' : 'Launch Your Campaigns Smartly'}
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  {isRTL ? 'استهدف عملاءك بدقة، حدد جدولة زمنية للحملات، واستخدم قوالب رسائل جاهزة مع أزرار تفاعلية لزيادة معدلات التحويل.' : 'Target your customers accurately, schedule campaigns, and use ready-made message templates with interactive buttons to increase conversion rates.'}
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
            {/* Campaign report mockup */}
            <ScrollReveal>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl shadow-green-500/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">{isRTL ? 'تقرير الحملة الأخيرة' : 'Last Campaign Report'}</h3>
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">{isRTL ? 'نشطة' : 'Active'}</span>
                </div>
                <div className="space-y-4 mb-6">
                  {[
                    { label: isRTL ? 'معدل الفتح' : 'Open Rate', value: '94.2%', color: 'from-green-500/20 to-green-600/10', bar: 'bg-green-400', border: 'border-green-500/20' },
                    { label: isRTL ? 'معدل النقر' : 'Click Rate', value: '67.8%', color: 'from-blue-500/20 to-blue-600/10', bar: 'bg-blue-400', border: 'border-blue-500/20' },
                    { label: isRTL ? 'معدل التحويل' : 'Conversion', value: '23.4%', color: 'from-orange-500/20 to-orange-600/10', bar: 'bg-orange-400', border: 'border-orange-500/20' },
                  ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-r ${stat.color} p-4 rounded-xl border ${stat.border}`}>
                      <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                      <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                      <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden"><div className={`${stat.bar} h-full rounded-full`} style={{ width: stat.value }} /></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t border-white/10">
                  <div><div className="text-2xl font-extrabold text-white">12,547</div><div className="text-xs text-slate-500">{isRTL ? 'رسالة مرسلة' : 'Messages Sent'}</div></div>
                  <div><div className="text-2xl font-extrabold text-white">2,936</div><div className="text-xs text-slate-500">{isRTL ? 'تحويلات ناجحة' : 'Conversions'}</div></div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. PRICING                                                         */}
      {/* ================================================================= */}
      <section id="pricing" className="py-16 md:py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
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
                  <div className={`relative rounded-2xl overflow-hidden border-2 ${plan.color} ${plan.bgColor} backdrop-blur-xl ${plan.popular ? 'shadow-[0_0_40px_rgba(16,185,129,0.2)] md:scale-105' : ''}`}>
                    {plan.popular && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-2 text-sm font-bold">
                        ⭐ {isRTL ? plan.badgeAr : plan.badgeEn}
                      </div>
                    )}
                    <div className={`p-6 ${plan.popular ? 'pt-4' : ''}`}>
                      <h3 className="text-xl md:text-2xl font-extrabold text-white text-center mb-4">{isRTL ? plan.nameAr : plan.nameEn}</h3>
                      {plan.tiers.length > 1 && (
                        <div className="flex gap-1.5 justify-center mb-4">
                          {plan.tiers.map((t, ti) => (
                            <button key={ti} onClick={() => setSelectedTier(prev => ({ ...prev, [plan.id]: ti }))} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tierIndex === ti ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>
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
                          <span className="text-green-400 font-bold text-lg">{isRTL ? 'ر.س' : 'SAR'}</span>
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
                          <Sparkles className="w-3 h-3 text-green-400" />
                          {isRTL ? 'المميزات الإضافية' : 'Additional Features'}
                        </h4>
                        {(isRTL ? plan.featuresAr : plan.featuresEn).map((f, fi) => (
                          <div key={fi} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
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

      {/* ================================================================= */}
      {/* 9. API PRICING                                                     */}
      {/* ================================================================= */}
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
                <div className={`border ${item.color} rounded-2xl p-6 hover:shadow-lg hover:shadow-green-500/5 transition-all backdrop-blur-sm`}>
                  <div className="text-center mb-4">
                    <h3 className="text-sm md:text-base font-bold text-white mb-2">{isRTL ? item.typeAr : item.typeEn}</h3>
                    {item.isFree ? (
                      <div className="text-2xl font-extrabold text-green-400">{isRTL ? 'مجانية' : 'Free'}</div>
                    ) : (
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-2xl font-extrabold text-white">{isRTL ? item.priceAr : item.priceEn}</span>
                        <span className="text-green-400 text-xs font-bold">{isRTL ? item.unitAr : item.unitEn}</span>
                        <span className="text-slate-400 text-xs">{isRTL ? item.durationAr : item.durationEn}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 text-center leading-relaxed">{isRTL ? item.descAr : item.descEn}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="mt-8 bg-green-500/10 border-2 border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
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

      {/* ================================================================= */}
      {/* 10. GREEN TICK COMPARISON                                        */}
      {/* ================================================================= */}
      <section id="green-tick" className="py-16 md:py-20 bg-gradient-to-b from-emerald-950/20 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 shadow-lg shadow-green-500/30">
              <BadgeCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">{isRTL ? 'احصل على الشارة الخضراء' : 'Get the Green Tick'}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">{isRTL ? 'عزز ثقة عملائك وتميز عن المنافسين بحساب موثوق رسمياً من واتساب' : 'Boost your customers\' trust and stand out from competitors with an officially verified WhatsApp account'}</p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="border-2 border-green-500/30 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-500/10 border-b border-green-500/20">
                      <th className={`text-${isRTL ? 'right' : 'left'} p-4 font-bold text-white`}>{isRTL ? 'المميزات' : 'Features'}</th>
                      <th className="text-center p-4 font-bold text-slate-400">{isRTL ? 'بدون توثيق' : 'Unverified'}</th>
                      <th className="text-center p-4 font-bold text-blue-400">{isRTL ? 'حساب تجاري' : 'Business'} <BadgeCheck className={`w-5 h-5 inline ${isRTL ? 'mr-1' : 'ml-1'} text-blue-400`} /></th>
                      <th className="text-center p-4 font-bold text-green-400">{isRTL ? 'حساب موثوق' : 'Verified'} <BadgeCheck className={`w-5 h-5 inline ${isRTL ? 'mr-1' : 'ml-1'} text-green-400`} /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {GREEN_TICK_COMPARISON.map((item, i) => (
                      <tr key={i} className={`border-t border-white/10 ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.05]'}`}>
                        <td className="p-4 text-white font-medium">{isRTL ? item.featureAr : item.featureEn}</td>
                        <td className="p-4 text-center"><X className="w-6 h-6 text-red-400 mx-auto" strokeWidth={3} /></td>
                        <td className="p-4 text-center">{item.business ? <CheckCircle2 className="w-6 h-6 text-blue-400 mx-auto" /> : <X className="w-6 h-6 text-red-400 mx-auto" strokeWidth={3} />}</td>
                        <td className="p-4 text-center">{item.verified ? <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto" /> : <X className="w-6 h-6 text-red-400 mx-auto" strokeWidth={3} />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="mt-8 text-center bg-green-500/10 border-2 border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
              <Award className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-white mb-2">{isRTL ? 'فريق المدار يساعدك في تجهيز المتطلبات' : 'ORBIT Team helps you prepare the requirements'}</p>
              <p className="text-slate-300 mb-4">{isRTL ? 'نوفر لك الدعم الكامل للحصول على التوثيق الرسمي من واتساب' : 'We provide you with full support to get official WhatsApp verification'}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. INTEGRATIONS                                                   */}
      {/* ================================================================= */}
      <section className="py-16 md:py-20 bg-slate-900/50 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <ScrollReveal className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              {isRTL ? 'نتكامل مع أدواتك المفضلة' : 'Seamless Integrations'}
            </h2>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {INTEGRATIONS.map((item, i) => (
              <ScrollReveal key={i}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl px-5 md:px-6 py-4 md:py-5 border border-white/10 hover:border-green-500/30 hover:bg-white/10 transition-all group"
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

      {/* ================================================================= */}
      {/* 9. PERSONA TABS                                                   */}
      {/* ================================================================= */}
      <section className="py-16 md:py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-green-500/3 blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-10">
          <ScrollReveal className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              {isRTL ? 'اختر مسارك' : 'Choose Your Path'}
            </h2>
          </ScrollReveal>

          <div className="flex justify-center mb-8 md:mb-10">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-1.5 inline-flex gap-1 border border-white/10">
              <button
                onClick={() => setActiveTab('merchant')}
                className={`px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all ${
                  activeTab === 'merchant'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isRTL ? 'للمتاجر والمسوقين' : 'For Merchants & Marketers'}
              </button>
              <button
                onClick={() => setActiveTab('developer')}
                className={`px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all ${
                  activeTab === 'developer'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isRTL ? 'للمطورين والتقنيين' : 'For Developers & Engineers'}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'merchant' ? (
              <motion.div
                key="merchant"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {[
                    {step: '01', titleAr: 'أنشئ قالب واتساب', titleEn: 'Create WhatsApp Template', descAr: 'صمّم قالب رسالتك المعتمدة من واتساب بنقرة واحدة', descEn: 'Design your WhatsApp-approved message template with one click' },
                    { step: '02', titleAr: 'أدر محادثاتك', titleEn: 'Manage Conversations', descAr: 'رد على عملائك من لوحة تحكم مركزية مع ردود سريعة', descEn: 'Reply to customers from a central dashboard with quick replies' },
                    { step: '03', titleAr: 'حلّل أداءك', titleEn: 'Analyze Performance', descAr: 'تتبع نسب الفتح والنقر والتحويل بتقارير واتساب التفصيلية', descEn: 'Track open, click & conversion rates with detailed WhatsApp reports' },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">{item.step}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {isRTL ? item.titleAr : item.titleEn}
                      </h3>
                      <p className="text-slate-400 text-sm">{isRTL ? item.descAr : item.descEn}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8 md:mt-10">
                  <a
                    href="https://app.mobile.net.sa/reg"
                    className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
                  >
                      {isRTL ? 'ابدأ تجربتك المجانية لواتساب' : 'Start Your Free WhatsApp Trial'}
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="developer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-12"
              >
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">REST API</h3>
                      <p className="text-sm text-slate-400">
                        {isRTL ? 'REST API مرن مع توثيق كامل' : 'Flexible REST API with complete documentation'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 mb-6 md:mb-8 overflow-x-auto border border-white/5">
                    <pre className="text-green-400 text-xs md:text-sm font-mono leading-relaxed">
                      <code>{`// Send WhatsApp Message via Orbit API
POST https://api.mobile.net.sa/v1/whatsapp
Authorization: Bearer YOUR_API_KEY

{
  "to": "9665xxxxxxxx",
  "template": "welcome_ar",
  "parameters": ["أحمد", "المدار"]
}

// Response
{
  "status": "sent",
  "messageId": "msg_wa_abc123",
  "cost": 1
}`}</code>
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                    {[
                      { ar: 'SDK متعدد اللغات', en: 'Multi-language SDK' },
                      { ar: 'Webhooks فورية', en: 'Instant Webhooks' },
                      { ar: 'بيئة اختبار Sandbox', en: 'Sandbox Environment' },
                    ].map((tool, i) => (
                      <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                        <Check className="w-5 h-5 text-green-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-white">{isRTL ? tool.ar : tool.en}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <a
                      href="https://docs.mobile.net.sa"
                      className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
                    >
                      {isRTL ? 'تصفح التوثيق' : 'Browse Documentation'}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 13. FINAL CTA                                                     */}
      {/* ================================================================= */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-10 text-center">
          <ScrollReveal>
            <Sparkles className="w-16 h-16 text-green-300 mx-auto mb-6" />
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {isRTL ? 'جاهز لنقل خدمة عملائك لمستوى آخر؟' : 'Ready to take your customer service to the next level?'}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {isRTL ? 'فريقنا جاهز لمساعدتك في الحصول على الشارة الخضراء وربط الـ API بكل سهولة واحترافية' : 'Our team is ready to help you get the Green Badge and integrate the API easily and professionally'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://app.mobile.net.sa/reg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl shadow-orange-500/50 transition-all hover:-translate-y-0.5">
                {isRTL ? 'اطلب الخدمة الآن' : 'Order Service Now'} <ArrowRight className={`w-5 h-5 inline ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </a>
              <a href="https://wa.me/966920006900" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 border-2 border-green-500 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl shadow-green-500/50 transition-all hover:-translate-y-0.5">
                {isRTL ? 'تحدث مع المبيعات' : 'Talk to Sales'} <Headphones className={`w-5 h-5 inline ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 pt-6 border-t border-white/20">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <Image src={encodeImagePath('/WhatsAppPage/cst.png')} alt="CST" className="h-24 md:h-32 w-auto" width={120} height={80} />
              </div>
              <div className="bg-white rounded-lg shadow-lg p-4">
                <Image src={encodeImagePath('/WhatsAppPage/meta.png')} alt="Meta" className="h-24 md:h-32 w-auto" width={120} height={80} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <WAFooter isRTL={isRTL} variant="dark" />
    </div>
  );
}