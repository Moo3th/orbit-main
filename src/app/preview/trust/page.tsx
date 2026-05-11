'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Shield, Building2, Zap, Users, Headphones, CreditCard, Smartphone, TrendingUp } from "lucide-react";
import { encodeImagePath } from "@/utils/imagePath";

const stats = [
  { number: "20+", labelAr: "عامًا خبرة", labelEn: "Years Experience", icon: TrendingUp },
  { number: "20,000+", labelAr: "جهة حكومية وخاصة", labelEn: "Gov & Private Entities", icon: Building2 },
  { number: "180+", labelAr: "مليون رسالة شهريًا", labelEn: "M Messages Monthly", icon: Zap },
  { number: "98%+", labelAr: "نسبة رضا العملاء", labelEn: "Satisfaction Rate", icon: Users },
];

const solutions = [
  {
    icon: MessageCircle, titleAr: "الرسائل النصية SMS", titleEn: "SMS Messaging",
    descAr: "منصة رسائل ذكية للتواصل الفوري مع عملائك", descEn: "Smart messaging platform for instant communication",
    featuresAr: ["تنبيهات فورية", "حملات تسويقية", "رموز تحقق OTP"],
    featuresEn: ["Instant Alerts", "Marketing Campaigns", "OTP Verification"],
    link: "/solutions/sms-platform",
  },
  {
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    ),
    titleAr: "واتساب أعمال API", titleEn: "WhatsApp Business API",
    descAr: "حل متكامل للتواصل الرسمي عبر واتساب", descEn: "Complete solution for official WhatsApp communication",
    featuresAr: ["ردود تلقائية", "إشعارات الطلبات", "حملات معتمدة"],
    featuresEn: ["Auto Replies", "Order Notifications", "Verified Campaigns"],
    link: "/solutions/whatsapp-business-api",
  },
  {
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
    titleAr: "نظام OTime", titleEn: "OTime System",
    descAr: "نظام حضور وانصراف ذكي لإدارة الموارد البشرية", descEn: "Smart attendance system for HR management",
    featuresAr: ["تسجيل الحضور", "تقارير فورية", "حساب الرواتب"],
    featuresEn: ["Attendance Tracking", "Real-time Reports", "Payroll"],
    link: "/solutions/otime",
  },
  {
    icon: Building2, titleAr: "البوابة الحكومية Gov Gate", titleEn: "Gov Gate Portal",
    descAr: "بوابة مراسلات رسمية بأعلى مستويات الأمان", descEn: "Official messaging portal with highest security",
    featuresAr: ["رسائل معتمدة", "استضافة محلية", "تشفير عالي"],
    featuresEn: ["Certified Messages", "Local Hosting", "High Encryption"],
    link: "/solutions/gov-gate",
  },
];

const whyOrbitFeatures = [
  { icon: Users, titleAr: "خبرة محلية", titleEn: "Local Expertise", descAr: "فهم عميق لاحتياجات السوق السعودي", descEn: "Deep understanding of Saudi market needs" },
  { icon: Zap, titleAr: "بنية تقنية عالية الأداء", titleEn: "High-Performance Infrastructure", descAr: "أنظمة قوية ومستقرة", descEn: "Powerful and stable systems" },
  { icon: Headphones, titleAr: "دعم فني متخصص", titleEn: "Specialized Support", descAr: "فريق دعم سعودي محترف", descEn: "Professional Saudi support team" },
  { icon: TrendingUp, titleAr: "حلول قابلة للتوسع", titleEn: "Scalable Solutions", descAr: "تنمو مع نمو أعمالك", descEn: "Grow with your business" },
  { icon: Shield, titleAr: "توافق حكومي كامل", titleEn: "Government Compliance", descAr: "امتثال للمعايير الحكومية", descEn: "Compliance with government standards" },
  { icon: Smartphone, titleAr: "سرعة في التشغيل", titleEn: "Fast Deployment", descAr: "تكامل سريع وسلس", descEn: "Quick and seamless integration" },
];

const differentiators = [
  { icon: Headphones, titleAr: "دعم فني محلي", titleEn: "Local Support", descAr: "فريق سعودي 24/7 عبر واتساب والهاتف", descEn: "Saudi team 24/7 via WhatsApp & phone", color: "bg-primary" },
  { icon: Shield, titleAr: "أمان عالي", titleEn: "High Security", descAr: "بيانات مشفرة داخل السعودية - متوافق مع NCA", descEn: "Encrypted data in KSA - NCA compliant", color: "bg-emerald-600" },
  { icon: CreditCard, titleAr: "دفع مرن", titleEn: "Flexible Payment", descAr: "تحويل بنكي، مدى، فيزا، أو دفع آجل", descEn: "Bank transfer, Mada, Visa, or deferred", color: "bg-blue-600" },
];

const partnerLogos = [
  "حرس الحدود.png", "إمارة منطقة الرياض.png", "مستشفى الملك فهد بجدة.png",
  "جامعة الملك سعود.png", "وزارة التعليم.png", "الموارد البشرية.png", "شعار-هدف.png",
  "magrabi-health.png", "images-removebg-preview.png", "images.png",
  "logo_004-removebg-preview.png", "logo_006-removebg-preview.png",
  "logo_007-removebg-preview.png", "logo_008-removebg-preview.png",
  "logo_009-removebg-preview.png", "logo_010-removebg-preview.png",
  "logo_011-removebg-preview.png", "logo_012-removebg-preview.png",
  "logo_014-removebg-preview.png", "logo_015-removebg-preview.png",
  "logo_016-removebg-preview.png", "logo_017-removebg-preview.png",
  "logo_018-removebg-preview.png", "logo_020-removebg-preview.png",
];

const integrations = ["سلة", "دفترة", "نور", "إتقان", "حضوري"];

function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const hasRun = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function TrustPage() {
  const [isRTL, setIsRTL] = React.useState(true);
  const [showPhoneNotify, setShowPhoneNotify] = React.useState(true);
  const rotateRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowPhoneNotify(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rotateRef.current) return;
    const rect = rotateRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateRef.current.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
  };

  const handleMouseLeave = () => {
    if (rotateRef.current) rotateRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  };

  const t = (ar: string, en: string) => isRTL ? ar : en;
  const dir = isRTL ? "rtl" : "ltr";

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" dir={dir} style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}>
      {/* ========== TOP BAR ========== */}
      <div className="bg-slate-50 border-b border-slate-100 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>{t("معتمد من هيئة الاتصالات وتقنية المعلومات", "CST Certified & Licensed")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{t("📞 920006900", "📞 920006900")}</span>
            <button onClick={() => setIsRTL(!isRTL)} className="text-primary font-bold hover:underline">
              {isRTL ? "English" : "عربي"}
            </button>
          </div>
        </div>
      </div>

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #E8DCCB 50%, #FFFFFF 100%)" }}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Image src={encodeImagePath("/logo/شعار المدار-01.svg")} alt="" width={600} height={600} />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* TEXT */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
              <div className="mb-4">
                <Image src={encodeImagePath("/logo/شعار المدار-01.svg")} alt="Orbit" width={140} height={50} className="h-12 w-auto" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
                {t("منصة معتمدة وموثوقة", "Certified & Trusted Platform")}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.08] tracking-tight">
                {t("تواصل مع عملائك", "Connect with your customers")}
                <br />
                <span className="text-primary relative">
                  {t("بذكاء وثقة", "intelligently")}
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/20 rounded-full" />
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                {t("الشريك التقني الأول لأكثر من 20,000 جهة حكومية وخاصة في المملكة — ربط مباشر، معتمد من هيئة الاتصالات، وتجربة مجانية فورية", "The #1 tech partner for 20,000+ government and private entities in KSA — direct connection, CST certified, instant free trial")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold min-h-14 px-10 py-4 text-lg rounded-2xl shadow-xl shadow-primary/25 transition-colors"
                >
                  {t("ابدأ الآن بـ 50 رسالة مجانية", "Start with 50 free messages")}
                  {isRTL ? <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </motion.a>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 min-h-14 px-8 py-4 text-lg border-2 border-slate-200 hover:border-primary/30 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-all">
                  <MessageCircle className="h-5 w-5" /> {t("تحدث مع المبيعات", "Talk to Sales")}
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div className="flex -space-x-2">
                  {["/TrustedLogos/images.png", "/TrustedLogos/magrabi-health.png", "/TrustedLogos/logo_006-removebg-preview.png", "/TrustedLogos/logo_010-removebg-preview.png"].map((logo, i) => (
                    <div key={i} className="w-10 h-10 rounded-full ring-2 ring-white bg-white shadow-md overflow-hidden flex items-center justify-center p-1">
                      <Image src={encodeImagePath(logo)} alt="" width={36} height={36} className="object-contain" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 font-semibold">{t("يثق بنا 20,000+ شركة سعودية", "Trusted by 20,000+ Saudi companies")}</p>
              </div>
            </motion.div>

            {/* PHONE MOCKUP */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div ref={rotateRef} className="transition-transform duration-200 ease-out" style={{ transformStyle: "preserve-3d" }}>
                <div className="relative rounded-[3rem] border-[6px] border-slate-800 bg-slate-900 w-[260px] aspect-[9/19] shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-slate-900 rounded-b-2xl z-20" />
                  {/* Screen */}
                  <div className="absolute inset-[3px] rounded-[2.5rem] overflow-hidden bg-white">
                    {/* Status bar */}
                    <div className="h-8 bg-slate-50 flex items-center justify-between px-6 pt-1 text-[10px] font-bold text-slate-800">
                      <span>9:41</span>
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 border border-slate-800 rounded-sm flex items-end"><div className="w-full bg-primary h-[2px]" /></div>
                      </div>
                    </div>
                    {/* App content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center"><span className="text-white text-[10px] font-bold">O</span></div>
                        <span className="text-xs font-bold text-slate-900">{t("المدار", "Orbit")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-600 font-bold">{t("متصل", "Connected")}</span>
                      </div>
                      {/* Stats mini cards */}
                      <div className="grid grid-cols-3 gap-2">
                        {[ { v: "180M+", l: t("رسالة", "msgs") }, { v: "20K+", l: t("عميل", "clients") }, { v: "98%", l: t("تسليم", "delivery") } ].map((s, i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-2 text-center">
                            <div className="text-sm font-black text-primary">{s.v}</div>
                            <div className="text-[9px] text-slate-500">{s.l}</div>
                          </div>
                        ))}
                      </div>
                      {/* Activity card */}
                      <div className="bg-primary/5 rounded-xl p-3">
                        <div className="text-[10px] font-bold text-slate-700 mb-1">{t("آخر حملة", "Last Campaign")}</div>
                        <div className="text-[9px] text-slate-500">ID: #CAM-{Math.floor(Math.random() * 9000 + 1000)}</div>
                        <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-primary rounded-full" animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} style={{ width: "0%" }} />
                        </div>
                      </div>
                      {/* Notification card */}
                      <AnimatePresence>
                        {showPhoneNotify && (
                          <motion.div initial={{ y: 30, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <div className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                              <div>
                                <div className="text-[10px] font-bold text-emerald-800">{t("تم إرسال الحملة بنجاح", "Campaign sent successfully")}</div>
                                <div className="text-[9px] text-emerald-600 mt-0.5">{t("وصلت رسالتك إلى 10,000 عميل", "Your message reached 10,000 customers")}</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Bottom bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-slate-50 border-t border-slate-100 py-2 px-4 flex items-center justify-between">
                      <div className="flex gap-3">
                        {[...Array(4)].map((_, i) => <div key={i} className="w-5 h-5 rounded-md bg-slate-200" />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="space-y-2">
                <stat.icon className="h-8 w-8 mx-auto text-primary/60" />
                <div className="text-3xl md:text-4xl font-black text-slate-900"><CountUp end={parseInt(stat.number.replace(/[^0-9]/g, ""))} suffix={stat.number.replace(/[0-9]/g, "").replace("+", "+")} /></div>
                <div className="text-sm text-slate-500 font-medium">{t(stat.labelAr, stat.labelEn)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TRUSTED PARTNERS ========== */}
      <section className="py-16" style={{ background: "linear-gradient(to bottom, #FFFFFF, #E8DCCB40)" }}>
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">{t("شركاء النجاح", "Success Partners")}</h2>
            <p className="text-slate-600 text-lg">{t("يثق بنا أكثر من 20,000 جهة حكومية وخاصة في المملكة", "Trusted by 20,000+ government and private entities in the Kingdom")}</p>
          </motion.div>
          <style>{`
            @keyframes scroll-r1 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            @keyframes scroll-r2 { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
            .marquee-row { animation: scroll-r1 60s linear infinite; }
            .marquee-row.r2 { animation: scroll-r2 60s linear infinite; }
            .marquee-row:hover, .marquee-row.r2:hover { animation-play-state: paused; }
          `}</style>
          <div className="overflow-hidden mb-4">
            <div className="marquee-row flex gap-4">
              {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                <div key={i} className="flex-shrink-0 w-32 md:w-40 bg-white rounded-xl p-3 h-20 md:h-24 flex items-center justify-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <Image src={encodeImagePath(`/TrustedLogos/${logo}`)} alt="" width={100} height={50} className="max-h-14 max-w-full object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="marquee-row r2 flex gap-4">
              {[...partnerLogos.slice().reverse(), ...partnerLogos.slice().reverse()].map((logo, i) => (
                <div key={i} className="flex-shrink-0 w-32 md:w-40 bg-white rounded-xl p-3 h-20 md:h-24 flex items-center justify-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <Image src={encodeImagePath(`/TrustedLogos/${logo}`)} alt="" width={100} height={50} className="max-h-14 max-w-full object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== SOLUTIONS ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("حلول مصممة لاحتياجاتك", "Solutions tailored to your needs")}</h2>
            <p className="text-slate-500 text-lg">{t("اختر الطريقة الأمثل للتواصل مع عملائك", "Choose the best way to connect with your customers")}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {solutions.map((sol, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <sol.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <Link href={sol.link} className="text-xl font-bold text-slate-900 hover:text-primary transition-colors">{t(sol.titleAr, sol.titleEn)}</Link>
                    <p className="text-slate-600 mt-2 mb-4 text-sm">{t(sol.descAr, sol.descEn)}</p>
                    <div className="flex flex-wrap gap-2">
                      {(isRTL ? sol.featuresAr : sol.featuresEn).map((feat, j) => (
                        <span key={j} className="inline-flex items-center gap-1 text-xs font-medium bg-slate-50 text-slate-600 px-3 py-1 rounded-full">
                          <Check className="h-3 w-3 text-primary" /> {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY ORBIT ========== */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("لماذا المدار؟", "Why Orbit?")}</h2>
            <p className="text-slate-500 text-lg">{t("مزايا فريدة تجعل تجربتك أفضل", "Unique advantages for a better experience")}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyOrbitFeatures.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><f.icon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t(f.titleAr, f.titleEn)}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{t(f.descAr, f.descEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== DIFFERENTIATORS ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("ما يميزنا عن غيرنا", "What Sets Us Apart")}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 mx-auto ${d.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform`}>
                  <d.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t(d.titleAr, d.titleEn)}</h3>
                <p className="text-slate-500 leading-relaxed">{t(d.descAr, d.descEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INTEGRATIONS ========== */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("نتكامل مع أدواتك المفضلة", "We integrate with your favorite tools")}</h2>
            <p className="text-slate-500">{t("لن تضطر لتغيير نظام عملك الحالي", "No need to change your current workflow")}</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((name, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-5 font-bold text-slate-700 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all cursor-default text-lg"
              >{name}</motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PERSONA TABS ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("منصة للجميع", "A platform for everyone")}</h2>
          </motion.div>
          <PersonaTabs isRTL={isRTL} t={t} />
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src={encodeImagePath("/logo/شعار المدار-01.svg")} alt="" width={500} height={500} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">{t("لا تترك عملاءك ينتظرون..", "Don't keep your customers waiting..")}</h2>
          <p className="text-xl text-white/80 mb-8">{t("انضم إلى المدار اليوم", "Join Orbit today")}</p>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl hover:shadow-white/20 transition-shadow"
          >
            {t("سجل الآن", "Register Now")} {isRTL ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </motion.a>
          <p className="text-white/50 mt-4 text-sm">{t("لا حاجة لبطاقة ائتمانية - تفعيل فوري - 50 رسالة مجانية", "No credit card - Instant activation - 50 free messages")}</p>
        </motion.div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 bg-slate-900 text-white/70">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Image src={encodeImagePath("/logo/شعار المدار1-01.png")} alt="Orbit" width={80} height={30} className="h-10 w-auto brightness-0 invert opacity-80" />
            <div className="flex flex-wrap gap-6 text-sm">
              <span>📞 920006900</span>
              <span>✉️ info@ot.com.sa</span>
              <span>📍 {t("الرياض، طريق الملك فهد", "Riyadh, King Fahd Road")}</span>
            </div>
            <p className="text-xs opacity-50">© {new Date().getFullYear()} Orbit. {t("جميع الحقوق محفوظة", "All rights reserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PersonaTabs({ isRTL, t }: { isRTL: boolean; t: (ar: string, en: string) => string }) {
  const [tab, setTab] = React.useState(0);
  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="flex bg-slate-100 rounded-2xl p-1.5">
          {[t("للمتاجر والمسوقين", "For Merchants"), t("للمطورين والتقنيين", "For Developers")].map((label, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${tab === i ? "bg-primary text-white shadow-lg" : "text-slate-600 hover:text-slate-900"}`}
            >{label}</button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          {tab === 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: t("استيراد جهات الاتصال", "Import Contacts"), desc: t("ارفع قائمة عملائك تلقائياً من متجرك", "Auto-import your customer list") },
                { step: "2", title: t("قوالب رسائل جاهزة", "Ready Templates"), desc: t("اختر من مكتبة القوالب المعتمدة", "Choose from verified template library") },
                { step: "3", title: t("تقارير الأداء", "Performance Reports"), desc: t("تابع نتائج حملاتك بدقة", "Track campaign results precisely") },
              ].map((s, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                  <div className="w-12 h-12 mx-auto bg-primary text-white rounded-xl flex items-center justify-center text-lg font-black mb-4">{s.step}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-2xl p-8 text-left font-mono text-sm">
              <div className="text-emerald-400 mb-2"># Orbit REST API v3</div>
              <div className="text-slate-400 mb-1"><span className="text-blue-400">POST</span> /api/v3/sms/send</div>
              <div className="text-slate-500 mb-4">{'{'} &quot;to&quot;: &quot;+9665XXXXXXXX&quot;, &quot;message&quot;: &quot;رمز التحقق: 4829&quot; {'}'}</div>
              <div className="text-emerald-400">{'//'} 200 OK — {t("تم التسليم في 0.8 ثانية", "Delivered in 0.8s")} ✓</div>
              <div className="flex gap-2 mt-6">
                {["Python", "Node.js", "PHP", "Java", "Go"].map(l => <span key={l} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold">{l}</span>)}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
