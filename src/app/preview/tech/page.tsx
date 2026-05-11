'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Code2, Terminal, Zap, Server, Globe, Lock, Cpu, Database, Activity, Layers, BarChart3, Clock, Shield, MessageCircle, Building2, CreditCard, Smartphone } from "lucide-react";
import { encodeImagePath } from "@/utils/imagePath";

const stats = [
  { number: 180, suffix: "M+", labelAr: "رسالة شهريًا", labelEn: "Messages Monthly", icon: Zap },
  { number: 20000, suffix: "+", labelAr: "عميل", labelEn: "Clients", icon: Building2 },
  { number: 3, suffix: "s", labelAr: "زمن تسليم OTP", labelEn: "OTP Delivery", icon: Clock, prefix: "<" },
  { number: 99.9, suffix: "%", labelAr: "نسبة تسليم", labelEn: "Delivery Rate", icon: Activity },
];

const solutions = [
  {
    icon: MessageCircle, color: "from-primary/20 to-primary/5", accent: "text-primary", titleAr: "الرسائل النصية SMS", titleEn: "SMS Messaging",
    descAr: "منصة ذكية للتواصل الفوري", descEn: "Smart instant messaging platform",
    tags: ["OTP", "حملات", "تنبيهات"], link: "/products/sms",
  },
  {
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    ),
    color: "from-emerald-500/20 to-emerald-500/5", accent: "text-emerald-400", titleAr: "واتساب أعمال API", titleEn: "WhatsApp Business API",
    descAr: "التواصل الرسمي عبر واتساب", descEn: "Official WhatsApp communication",
    tags: ["بوت ذكي", "علامة خضراء", "وسائط"], link: "/products/whatsapp",
  },
  {
    icon: Clock, color: "from-amber-500/20 to-amber-500/5", accent: "text-amber-400", titleAr: "نظام OTime", titleEn: "OTime HR System",
    descAr: "إدارة ذكية للموارد البشرية", descEn: "Smart HR management",
    tags: ["حضور", "رواتب", "إجازات"], link: "/products/o-time",
  },
  {
    icon: Shield, color: "from-primary/20 to-primary/5", accent: "text-primary", titleAr: "البوابة الحكومية", titleEn: "Gov Gate Portal",
    descAr: "مراسلات رسمية بأعلى أمان", descEn: "Official messaging with top security",
    tags: ["تشفير", "استضافة محلية", "صلاحيات"], link: "/products/gov-gate",
  },
];

const infraFeatures = [
  { icon: Server, titleAr: "استضافة محلية في السعودية", titleEn: "Local Hosting in KSA", descAr: "خوادم داخل المملكة لسرعة فائقة وامتثال كامل", descEn: "In-Kingdom servers for ultra speed and full compliance" },
  { icon: Zap, titleAr: "Direct Routes", titleEn: "Direct Routes", descAr: "طرق إرسال مباشرة مع شركات الاتصالات", descEn: "Direct routes with telecom providers" },
  { icon: Lock, titleAr: "تشفير من الطرف إلى الطرف", titleEn: "End-to-End Encryption", descAr: "TLS 1.3 + AES-256 لجميع البيانات", descEn: "TLS 1.3 + AES-256 for all data" },
];

const partnerLogos = [
  "حرس الحدود.png", "إمارة منطقة الرياض.png", "مستشفى الملك فهد بجدة.png",
  "جامعة الملك سعود.png", "وزارة التعليم.png", "الموارد البشرية.png", "شعار-هدف.png",
  "magrabi-health.png", "logo_004-removebg-preview.png", "logo_006-removebg-preview.png",
  "logo_007-removebg-preview.png", "logo_008-removebg-preview.png",
  "logo_009-removebg-preview.png", "logo_010-removebg-preview.png",
  "logo_011-removebg-preview.png", "logo_012-removebg-preview.png",
];

function CountUp({ end, duration = 2000, suffix = "", prefix = "" }: { end: number; duration?: number; suffix?: string; prefix?: string }) {
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
        const isFloat = suffix === "%" && end === 99.9;
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * end;
          setCount(isFloat ? Math.round(val * 10) / 10 : Math.floor(val));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, suffix]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export default function TechPage() {
  const [isRTL, setIsRTL] = React.useState(true);
  const [consoleLines, setConsoleLines] = React.useState<string[]>([]);
  const [showToast, setShowToast] = React.useState(false);
  const rotateRef = React.useRef<HTMLDivElement>(null);

  const t = (ar: string, en: string) => isRTL ? ar : en;
  const dir = isRTL ? "rtl" : "ltr";

  React.useEffect(() => {
    const lines = [
      "> orbit connect --api v3",
      "[OK] Authenticated ✓",
      "[OK] Route established — Latency: 12ms",
      "> send --to +9665XXXXXXXX --msg \"رمز التحقق: 4829\"",
      "[INFO] Delivered in 0.8s ✓",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setConsoleLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 700);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rotateRef.current) return;
    const rect = rotateRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateRef.current.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 15}deg)`;
  };
  const handleMouseLeave = () => {
    if (rotateRef.current) rotateRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden" dir={dir} style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif', background: "linear-gradient(150deg, #1a0a10 0%, #161616 30%, #0d0d0d 70%, #1a0a10 100%)" }}>
      {/* Dot grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #7A1E2E 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      {/* Floating orbs */}
      <div className="fixed top-1/4 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 -left-20 w-[400px] h-[400px] bg-beige/5 rounded-full blur-3xl pointer-events-none" style={{ animation: "pulse 4s ease-in-out infinite", animationDelay: "2s" }} />

      {/* ========== TOP BAR ========== */}
      <div className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <Image src={encodeImagePath("/logo/شعار المدار1-01.png")} alt="Orbit" width={32} height={12} className="h-6 w-auto brightness-0 invert" />
            <span className="text-white/60 text-xs font-mono hidden sm:inline">API v3.2</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-emerald-400/80">{t("شغّال", "Operational")}</span></div>
            <button onClick={() => setIsRTL(!isRTL)} className="text-primary/80 hover:text-primary font-bold text-xs px-3 py-1 rounded-full border border-white/10 hover:border-primary/30 transition-colors">
              {isRTL ? "EN" : "عربي"}
            </button>
          </div>
        </div>
      </div>

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
            {/* TEXT */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary/90 text-sm font-bold"
              >
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
                ⚡ {t("منصة اتصالات ذكية", "Intelligent Communication Platform")}
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                <span className="text-white">{t("أطلق العنان لقوة", "Unleash the power of")}</span><br />
                <span className="bg-gradient-to-r from-primary via-red-400 to-amber-300 bg-clip-text text-transparent">
                  {t("التواصل الرقمي", "digital communication")}
                </span>
              </h1>
              <p className="font-mono text-white/50 text-sm sm:text-base">
                <span className="text-emerald-400">$</span> {t("ربط مباشر · REST API · OTP في أقل من 3 ثوان", "Direct connect · REST API · OTP in &lt; 3 seconds")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold min-h-14 px-10 py-4 text-lg rounded-2xl backdrop-blur-sm border border-primary/50 shadow-xl shadow-primary/20 transition-all"
                >
                  <Terminal className="h-5 w-5" /> {t("أنشئ حسابك المجاني", "Create free account")}
                </motion.a>
                <a href="#" className="inline-flex items-center justify-center gap-2 min-h-14 px-8 py-4 text-lg border border-white/10 hover:border-primary/40 text-white/70 hover:text-white font-bold rounded-2xl backdrop-blur-sm transition-all">
                  <Code2 className="h-5 w-5" /> {t("تصفح التوثيق", "Browse Docs")} →
                </a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-white/30">
                <span className="text-emerald-400/70">99.99% Uptime</span><span className="text-white/20">·</span>
                <span className="text-emerald-400/70">&lt;50ms Latency</span><span className="text-white/20">·</span>
                <span className="text-emerald-400/70">ISO 27001</span><span className="text-white/20">·</span>
                <span className="text-emerald-400/70">TLS 1.3</span>
              </div>
            </motion.div>

            {/* PHONE MOCKUP */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
            >
              <div ref={rotateRef} className="transition-transform duration-200 ease-out" style={{ transformStyle: "preserve-3d" }}>
                <div className="relative rounded-[3rem] border-[6px] border-slate-600 bg-slate-800 w-[260px] aspect-[9/19] shadow-2xl shadow-black/50 overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-slate-800 rounded-b-2xl z-20" />
                  <div className="absolute inset-[3px] rounded-[2.5rem] overflow-hidden bg-[#0a0a0a]">
                    <div className="h-7 flex items-center justify-between px-6 pt-1 text-[9px] font-mono text-white/40">
                      <span>orbit@v3</span>
                      <div className="flex gap-1 items-center"><span>●●●</span></div>
                    </div>
                    <div className="p-3 font-mono text-[10px] leading-relaxed space-y-1">
                      {consoleLines.map((line, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                          <span className={line.startsWith(">") ? "text-blue-400" : line.includes("OK") || line.includes("INFO") ? "text-emerald-400" : "text-white/50"}>{line}</span>
                        </motion.div>
                      ))}
                      {consoleLines.length === 5 && (
                        <div className="flex items-center gap-1 text-emerald-400 mt-1">
                          <span>[STATS]</span> <span className="text-white/60">180M+ msg/mo · 98% delivery</span>
                        </div>
                      )}
                      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="text-emerald-400">▊</motion.span>
                    </div>
                    <AnimatePresence>
                      {showToast && (
                        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.3 }}
                          className="absolute bottom-12 inset-x-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-xl p-2.5"
                        >
                          <div className="flex items-center gap-2 text-[10px]">
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-300 font-bold">{t("تم التسليم · 0.8s", "Delivered · 0.8s")}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="absolute bottom-0 inset-x-0 bg-white/5 border-t border-white/5 py-2 px-3 flex items-center justify-between text-[9px] font-mono text-white/30">
                      <span>orb</span><span>│</span><span>ssh</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== STATS COUNTERS ========== */}
      <section className="py-16 border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center"
              >
                <stat.icon className="h-6 w-6 mx-auto text-primary/60 mb-3" />
                <div className="text-2xl md:text-3xl font-black text-white">
                  <CountUp end={stat.number} suffix={stat.suffix} prefix={stat.prefix || ""} />
                </div>
                <div className="text-xs text-white/50 mt-1">{t(stat.labelAr, stat.labelEn)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SOLUTIONS ========== */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
            <p className="font-mono text-xs text-primary/60 mb-2">// {t("أربع منصات متكاملة", "Four integrated platforms")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t("حلولنا التقنية", "Our Tech Solutions")}</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {solutions.map((sol, i) => (
              <motion.a key={i} href={sol.link} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`group block bg-gradient-to-br ${sol.color} backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl bg-white/10 ${sol.accent}`}><sol.icon className="h-6 w-6" /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:underline">{t(sol.titleAr, sol.titleEn)}</h3>
                    <p className="text-white/50 text-sm mt-1">{t(sol.descAr, sol.descEn)}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {sol.tags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-mono bg-white/10 text-white/70 px-2.5 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== DEV SPOTLIGHT ========== */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="font-mono text-xs text-emerald-400 mb-2">🚀 {t("صديق للمطورين", "Developer Friendly")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("API قوي ومرن", "Powerful & Flexible API")}</h2>
              <p className="text-white/50 mb-6">{t("REST API · Webhooks · SDK · تفعيل في 5 دقائق", "REST API · Webhooks · SDK · Active in 5 minutes")}</p>
              <div className="grid gap-3">
                {[
                  { icon: Database, title: t("SDK متعدد اللغات", "Multi-language SDK") },
                  { icon: Zap, title: t("Webhooks فورية", "Real-time Webhooks") },
                  { icon: Terminal, title: t("Sandbox تجريبي", "Testing Sandbox") },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/60 text-sm">
                    <item.icon className="h-4 w-4 text-primary/60" /><span>{item.title}</span>
                  </div>
                ))}
              </div>
              <a href="#" className="inline-flex mt-6 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                {t("تصفح التوثيق الكامل", "Browse full docs")} →
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-[#0d1117] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-amber-500/60" /><div className="w-3 h-3 rounded-full bg-emerald-500/60" /></div>
                <span className="text-[11px] font-mono text-white/40 ml-2">terminal — orbit api</span>
              </div>
              <div className="p-5 font-mono text-[12px] leading-relaxed">
                <div className="text-white/30 mb-2">{t("// تثبيت مكتبة Orbit", "// Install Orbit SDK")}</div>
                <div className="text-amber-300">$ npm install @orbit/api-client</div>
                <div className="my-3" />
                <div className="text-white/30 mb-2">{t("// إرسال رسالة في 3 أسطر", "// Send a message in 3 lines")}</div>
                <div className="text-blue-300">const</div>
                <div className="text-white/70 pl-4">orbit = <span className="text-blue-300">new</span> <span className="text-amber-200">OrbitClient</span>({'{'} apiKey: <span className="text-emerald-300">'sk_xxx'</span> {'}'})</div>
                <div className="text-white/70 pl-4"><span className="text-blue-300">await</span> orbit.sms.send({'{'}</div>
                <div className="text-white/50 pl-8">to: <span className="text-emerald-300">'+9665XXXXXXXX'</span>,</div>
                <div className="text-white/50 pl-8">message: <span className="text-emerald-300">'رمز التحقق: 4829'</span></div>
                <div className="text-white/70 pl-4">{'}'})</div>
                <div className="text-emerald-400/60 mt-1">{t("// ✅ تم التسليم في 0.8 ثانية", "// ✅ Delivered in 0.8s")}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== INFRASTRUCTURE ========== */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{t("بنية تقنية لا تُضاهى", "Unmatched Infrastructure")}</h2>
            <p className="text-white/40">{t("مصممة للأداء العالي والأمان", "Designed for high performance & security")}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {infraFeatures.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:border-primary/30 transition-all"
              >
                <f.icon className="h-10 w-10 mx-auto text-primary/60 mb-5" />
                <h3 className="text-lg font-bold text-white mb-3">{t(f.titleAr, f.titleEn)}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{t(f.descAr, f.descEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INTEGRATIONS ========== */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">{t("نتكامل مع منصاتك", "We integrate with your platforms")}</h2>
            <p className="text-white/40">{t("+ والمزيد عبر API المفتوح", "+ more via open API")}</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {["سلة", "دفترة", "نور", "إتقان", "حضوري"].map((name, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-5 font-bold text-white/70 hover:text-white hover:border-primary/40 hover:bg-white/10 transition-all cursor-default text-lg"
              >{name}</motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PARTNERS ========== */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">{t("شركاؤنا", "Our Partners")}</h2>
          </motion.div>
          <style>{`
            @keyframes scroll-tech { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .marquee-tech { animation: scroll-tech 50s linear infinite; }
            .marquee-tech:hover { animation-play-state: paused; }
          `}</style>
          <div className="overflow-hidden">
            <div className="marquee-tech flex gap-4">
              {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                <div key={i} className="flex-shrink-0 w-28 md:w-36 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 h-20 flex items-center justify-center">
                  <Image src={encodeImagePath(`/TrustedLogos/${logo}`)} alt="" width={80} height={40} className="max-h-12 max-w-full object-contain opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== PERSONA SWITCH ========== */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <TechPersonaTabs isRTL={isRTL} t={t} />
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7A1E2E 0%, #4A0E1A 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">⚡ {t("جاهز للانطلاق؟", "Ready to launch?")}</h2>
          <p className="text-xl text-white/70 mb-8">{t("أنشئ حسابك الآن واحصل على 50 رسالة تجريبية مجانية", "Create your account and get 50 free trial messages")}</p>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl shadow-black/30 hover:shadow-white/10 transition-shadow"
          >
            <Terminal className="h-5 w-5" /> {t("سجل الآن", "Register Now")} →
          </motion.a>
        </motion.div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 border-t border-white/5 text-white/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <Image src={encodeImagePath("/logo/شعار المدار1-01.png")} alt="Orbit" width={32} height={12} className="h-6 w-auto brightness-0 invert opacity-50" />
              <span>orbit.sa</span>
            </div>
            <div className="flex gap-4">
              <span>📡 920006900</span><span>📧 info@ot.com.sa</span><span>📍 {t("الرياض", "Riyadh")}</span>
            </div>
            <span>© {new Date().getFullYear()} — v3.2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TechPersonaTabs({ isRTL, t }: { isRTL: boolean; t: (ar: string, en: string) => string }) {
  const [tab, setTab] = React.useState(0);
  return (
    <div>
      <div className="flex justify-center mb-10">
        <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1">
          {[t("👨‍💻 للمطورين", "👨‍💻 Developers"), t("🛍️ للمسوقين", "🛍️ Marketers")].map((label, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${tab === i ? "bg-primary text-white shadow-lg" : "text-white/50 hover:text-white"}`}
            >{label}</button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          {tab === 0 ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center gap-6 text-white/40">
                <div><span className="text-emerald-400 font-bold text-lg">50ms</span><br /><span className="text-xs">API Latency</span></div>
                <div><span className="text-emerald-400 font-bold text-lg">5+</span><br /><span className="text-xs">SDKs</span></div>
                <div><span className="text-emerald-400 font-bold text-lg">24/7</span><br /><span className="text-xs">Dev Support</span></div>
              </div>
              <p className="text-white/50 text-sm">{t("REST API مرن، توثيق كامل، ودعم من مطور لمطور", "Flexible REST API, full docs, dev-to-dev support")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Database, title: t("استيراد", "Import"), desc: t("جهات الاتصال", "Contacts") },
                { icon: Layers, title: t("قوالب", "Templates"), desc: t("جاهزة ومعتمدة", "Ready & Verified") },
                { icon: BarChart3, title: t("تقارير", "Reports"), desc: t("أداء الحملات", "Performance") },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <s.icon className="h-6 w-6 mx-auto text-primary/60 mb-3" />
                  <h3 className="text-white font-bold text-sm">{s.title}</h3>
                  <p className="text-white/40 text-xs mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
