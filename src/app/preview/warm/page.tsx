'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, MessageCircle, Shield, Smile, Star, Zap, Coffee, Handshake, Clock, CreditCard, Smartphone, Send, Gift, MapPin, Mail, Phone } from "lucide-react";
import { encodeImagePath } from "@/utils/imagePath";

const successStories = [
  {
    titleAr: "مستشفى الملك فهد", titleEn: "King Fahd Hospital",
    descAr: "قللنا المواعيد الفائتة بنسبة 40% عبر رسائل التذكير الآلية", descEn: "Reduced missed appointments by 40% via automated reminders",
    icon: "🏥",
  },
  {
    titleAr: "جامعة الملك سعود", titleEn: "King Saud University",
    descAr: "نرسل أكثر من 2 مليون إشعار للطلاب وأعضاء هيئة التدريس سنوياً", descEn: "2M+ notifications to students and faculty annually",
    icon: "🎓",
  },
  {
    titleAr: "متجر سلة", titleEn: "Salla Store",
    descAr: "ضاعفنا مبيعات المتاجر عبر حملات الواتساب التسويقية", descEn: "Doubled store sales through WhatsApp campaigns",
    icon: "🛍️",
  },
];

const solutions = [
  {
    icon: Send, accent: "bg-orange-100 text-orange-600", titleAr: "الرسائل النصية SMS", titleEn: "SMS Messaging",
    descAr: "أسرع طريقة للوصول لكل الجوالات. مثالية للإشعارات ورموز التحقق", descEn: "Fastest way to reach all phones. Perfect for alerts & OTP",
    cta: "📱 جرب 50 رسالة مجانية", link: "/products/sms",
  },
  {
    icon: MessageCircle, accent: "bg-emerald-100 text-emerald-600", titleAr: "واتساب للأعمال", titleEn: "WhatsApp Business",
    descAr: "تواصل مع عملائك على تطبيقهم المفضل. ردود آلية، وسائط، والمزيد", descEn: "Connect on their favorite app. Auto-replies, media & more",
    cta: "💚 تفعيل فوري", link: "/products/whatsapp",
  },
  {
    icon: Clock, accent: "bg-violet-100 text-violet-600", titleAr: "نظام OTime", titleEn: "OTime System",
    descAr: "خلّص نفسك من تعقيد الحضور والانصراف. نظام سهل وذكي لإدارة موظفينك", descEn: "Say goodbye to complex attendance. Smart & easy HR management",
    cta: "⏰ جرّبه مجاناً", link: "/products/o-time",
  },
  {
    icon: Shield, accent: "bg-primary/10 text-primary", titleAr: "البوابة الحكومية", titleEn: "Gov Gate",
    descAr: "للجهات الحكومية والكبيرة. بوابة مراسلات خاصة بأعلى معايير الأمان", descEn: "For government & enterprises. Private portal with top security",
    cta: "🏛️ تحدث معنا", link: "/products/gov-gate",
  },
];

const loveReasons = [
  { icon: "💚", titleAr: "دعم فني 24/7", titleEn: "24/7 Support", descAr: "فريقنا موجود دايمًا عشانك. اتصل، واتساب، أو إيميل — بنرد عليك بسرعة", descEn: "We're always here for you. Call, WhatsApp, or email — quick response" },
  { icon: "🏠", titleAr: "استضافة سعودية", titleEn: "Saudi Hosting", descAr: "بياناتك في بلدك، تحت حماية الأنظمة السعودية", descEn: "Your data in your country, under Saudi regulation" },
  { icon: "💰", titleAr: "أسعار منافسة", titleEn: "Competitive Prices", descAr: "مافي رسوم خفية، والباقات تناسب كل الأحجام", descEn: "No hidden fees, packages for all sizes" },
  { icon: "🚀", titleAr: "سرعة فائقة", titleEn: "Ultra Speed", descAr: "رسايلك توصل في ثواني مو دقايق", descEn: "Messages delivered in seconds, not minutes" },
  { icon: "🤝", titleAr: "شريك مو مجرد مزود", titleEn: "Partner, not just provider", descAr: "نفهم احتياجك ونقدم استشارات متخصصة", descEn: "We understand you and provide specialized consulting" },
  { icon: "🔒", titleAr: "أمان عالي", titleEn: "High Security", descAr: "تشفير كامل، امتثال للأمن السيبراني السعودي", descEn: "Full encryption, compliance with Saudi cybersecurity" },
];

const partnerLogos = [
  "حرس الحدود.png", "إمارة منطقة الرياض.png", "مستشفى الملك فهد بجدة.png",
  "جامعة الملك سعود.png", "وزارة التعليم.png", "الموارد البشرية.png", "شعار-هدف.png",
  "magrabi-health.png", "images-removebg-preview.png", "images.png",
  "logo_004-removebg-preview.png", "logo_006-removebg-preview.png",
  "logo_007-removebg-preview.png", "logo_008-removebg-preview.png",
  "logo_009-removebg-preview.png", "logo_010-removebg-preview.png",
  "logo_011-removebg-preview.png", "logo_012-removebg-preview.png",
];

const chatMessages = [
  { from: "bot", ar: "أهلاً بك في المدار! كيف نقدر نساعدك؟ 😊", en: "Welcome to CORBIT! How can we help? 😊", delay: 0.5 },
  { from: "user", ar: "أبغى أرسل رسائل لعملائي", en: "I want to send messages to my customers", delay: 1.5 },
  { from: "bot", ar: "طيب! حمّل جهات اتصالك وابدأ الإرسال فوراً ✅", en: "Great! Upload your contacts and start sending now ✅", delay: 2.5 },
  { from: "bot", ar: "عندك 50 رسالة مجانية كهدية ترحيبية 🎁", en: "You have 50 free welcome messages 🎁", delay: 3.5 },
];

export default function WarmPage() {
  const [isRTL, setIsRTL] = React.useState(true);
  const [visibleMessages, setVisibleMessages] = React.useState<number[]>([]);
  const [showHeart, setShowHeart] = React.useState(false);
  const floatRef = React.useRef<HTMLDivElement>(null);

  const t = (ar: string, en: string) => isRTL ? ar : en;
  const dir = isRTL ? "rtl" : "ltr";

  React.useEffect(() => {
    chatMessages.forEach((_, i) => {
      setTimeout(() => setVisibleMessages(prev => [...prev, i]), (i + 1) * 1200);
    });
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 2000);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!floatRef.current) return;
    const rect = floatRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    floatRef.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) translateY(${-3 + Math.sin(Date.now() / 2000) * 3}px)`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden" dir={dir} style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif', background: "linear-gradient(180deg, #FFFBF5 0%, #E8DCCB 30%, #FFFBF5 60%, #E8DCCB 100%)" }}>
      {/* Warm floating blobs */}
      <div className="fixed top-20 -right-32 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(122,30,46,0.06) 0%, transparent 70%)" }} />
      <div className="fixed bottom-20 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(200,160,100,0.08) 0%, transparent 70%)" }} />

      {/* ========== TOP BAR ========== */}
      <div className="bg-[#FFF8F0] border-b border-amber-100/50 py-2.5 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Smile className="h-4 w-4 text-primary" />
            <span>{t("أهلاً بك في المدار 💫", "Welcome to CORBIT 💫")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>📞 920006900</span>
            <button onClick={() => setIsRTL(!isRTL)} className="text-primary font-bold hover:underline text-xs">
              {isRTL ? "English" : "عربي"}
            </button>
          </div>
        </div>
      </div>

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-20 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none">
          <Image src={encodeImagePath("/logo/شعار المدار-01.svg")} alt="" width={500} height={500} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="container mx-auto px-4 md:px-6 relative z-10 space-y-6">
          <Image src={encodeImagePath("/logo/شعار المدار-01.svg")} alt="Orbit" width={120} height={40} className="h-10 w-auto mx-auto" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-primary text-sm font-bold mx-auto">
            💝 {t("منصة سعودية موثوقة", "Trusted Saudi Platform")}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.08] tracking-tight max-w-3xl mx-auto">
            {t("تواصل مع عملائك", "Connect with your customers")}
            <br />
            <span className="font-light text-slate-600">{t("بكل حب وسهولة", "with love & ease")}</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t("نساعد أكثر من 20,000 جهة حكومية وخاصة على التواصل بشكل أفضل، أسرع، وأكثر إنسانية مع عملائهم", "Helping 20,000+ entities communicate better, faster, and more humanely")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold min-h-14 px-10 py-4 text-lg rounded-full shadow-xl shadow-primary/20 transition-all"
            >
              ✨ {t("ابدأ بـ 50 رسالة مجانية", "Start with 50 free messages")}
            </motion.a>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 min-h-14 px-10 py-4 text-lg border-2 border-amber-200 hover:border-primary/30 hover:bg-white/50 text-slate-700 font-bold rounded-full transition-all">
              💬 {t("تحدث معنا", "Talk to us")}
            </Link>
          </div>
          <p className="text-sm text-slate-400">⭐ {t("98% من عملائنا يوصون بخدماتنا", "98% of our clients recommend us")}</p>

          {/* PHONE MOCKUP */}
          <motion.div ref={floatRef} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
            className="flex justify-center pt-8" onMouseMove={handleMouseMove}
            style={{ transition: "transform 0.3s ease-out" }}
          >
            <div className="relative rounded-[3rem] border-[5px] border-amber-200/60 bg-white w-[240px] aspect-[9/19] shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-amber-100/50 rounded-b-2xl z-20" />
              <div className="absolute inset-[3px] rounded-[2.5rem] overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFBF5 0%, #FFF8F0 100%)" }}>
                {/* Header */}
                <div className="h-8 flex items-center justify-between px-4 pt-1 text-[10px] font-bold text-primary">
                  <span>{t("المدار ✨", "Orbit ✨")}</span>
                  <span>♡</span>
                </div>
                {/* Chat */}
                <div className="p-3 space-y-3">
                  {chatMessages.map((msg, i) => (
                    visibleMessages.includes(i) && (
                      <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }}>
                        {msg.from === "bot" ? (
                          <div className="flex justify-start">
                            <div className="bg-white border border-amber-100 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm max-w-[85%]">
                              <div className="text-[10px] text-slate-700 leading-relaxed">{t(msg.ar, msg.en)}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <div className="bg-primary/10 border border-primary/10 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                              <div className="text-[10px] text-slate-700 leading-relaxed">{t(msg.ar, msg.en)}</div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )
                  ))}
                </div>
                {/* Input bar */}
                <div className="absolute bottom-2 inset-x-3 flex items-center gap-2 bg-white border border-amber-100 rounded-full px-3 py-1.5 shadow-sm">
                  <input readOnly className="flex-1 bg-transparent text-[10px] text-slate-400 outline-none" placeholder={t("اكتب رسالتك...", "Type a message...")} />
                  <Send className="h-3.5 w-3.5 text-primary/60" />
                </div>
                {/* Floating heart */}
                <AnimatePresence>
                  {showHeart && (
                    <motion.div initial={{ y: 10, opacity: 1, scale: 0.5 }} animate={{ y: -50, opacity: 0, scale: 1.2 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
                      className="absolute bottom-12 right-6 text-lg pointer-events-none"
                    >💕</motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== SUCCESS STORIES ========== */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <Heart className="h-8 w-8 mx-auto text-primary/40 mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("قصص نجاح نفتخر بها", "Success stories we're proud of")}</h2>
            <p className="text-slate-500">{t("عملاؤنا هم قصة نجاحنا", "Our clients are our success story")}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-100 border border-amber-50 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{story.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{t(story.titleAr, story.titleEn)}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{t(story.descAr, story.descEn)}</p>
                <span className="inline-block mt-4 text-primary text-sm font-bold hover:underline cursor-pointer">{t("قراءة القصة ←", "Read story →")}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-12 text-center">
            <div><div className="text-2xl font-black text-primary">180M+</div><div className="text-xs text-slate-400">{t("رسالة شهرياً", "Messages monthly")}</div></div>
            <div><div className="text-2xl font-black text-primary">20K+</div><div className="text-xs text-slate-400">{t("عميل", "Clients")}</div></div>
            <div><div className="text-2xl font-black text-primary">98%</div><div className="text-xs text-slate-400">{t("رضا العملاء", "Satisfaction")}</div></div>
          </div>
        </div>
      </section>

      {/* ========== HOW CAN WE HELP ========== */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #FFFBF5, #E8DCCB40, #FFFBF5)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("كيف نقدر نساعدك؟", "How can we help you?")}</h2>
            <p className="text-slate-500 text-lg">{t("حلولنا مصممة عشانك", "Solutions designed for you")}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {solutions.map((sol, i) => (
              <motion.a key={i} href={sol.link} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl p-8 md:p-10 shadow-md shadow-slate-100 border border-amber-50 hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${sol.accent} rounded-2xl flex items-center justify-center mb-5`}>
                  <sol.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t(sol.titleAr, sol.titleEn)}</h3>
                <p className="text-slate-500 leading-relaxed mb-4 text-sm">{t(sol.descAr, sol.descEn)}</p>
                <span className="text-primary font-bold text-sm group-hover:underline">{sol.cta}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY PEOPLE LOVE CORBIT ========== */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <Star className="h-8 w-8 mx-auto text-amber-400 mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{t("لماذا يحبون المدار؟", "Why do people love Orbit?")}</h2>
            <p className="text-slate-500">{t("لأننا نهتم", "Because we care")}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loveReasons.map((reason, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl p-6 border border-amber-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-2xl mb-3">{reason.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{t(reason.titleAr, reason.titleEn)}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{t(reason.descAr, reason.descEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BENEFITS (3 big cards) ========== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🧑‍💻", iconBg: "bg-primary/10", titleAr: "دعم فني محلي", titleEn: "Local Support", descAr: "فريق سعودي 100% يرد عليك واتساب أو اتصال. 24 ساعة، 7 أيام. لأنك أهم", descEn: "100% Saudi team responds via WhatsApp or call. 24/7 because you matter" },
              { icon: "🛡️", iconBg: "bg-emerald-100", titleAr: "أمان تثق فيه", titleEn: "Security you trust", descAr: "بياناتك مشفرة ومحفوظة داخل السعودية. ملتزمون بمعايير هيئة الأمن السيبراني", descEn: "Your data is encrypted and stored in KSA. NCA compliant" },
              { icon: "💳", iconBg: "bg-blue-100", titleAr: "دفع بالطريقة اللي تناسبك", titleEn: "Pay your way", descAr: "حول، ادفع بمدى أو فيزا، أو أجل الدفع إذا كنت شركة كبيرة", descEn: "Transfer, Mada, Visa, or deferred for large companies" },
            ].map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 mx-auto ${b.iconBg} rounded-3xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>{b.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t(b.titleAr, b.titleEn)}</h3>
                <p className="text-slate-500 leading-relaxed">{t(b.descAr, b.descEn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INTEGRATIONS ========== */}
      <section className="py-16" style={{ background: "linear-gradient(180deg, #E8DCCB30, #FFFBF5)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t("نتكامل مع منصاتك الحالية", "We integrate with your platforms")}</h2>
            <p className="text-slate-500">{t("ما تحتاج تغير أنظمتك — نحن نتكيف معها 💫", "No need to change — we adapt 💫")}</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {["سلة", "دفترة", "نور", "إتقان", "حضوري"].map((name, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-amber-100 shadow-sm px-8 py-5 font-bold text-slate-700 hover:text-primary hover:border-primary/20 hover:shadow-md transition-all cursor-default text-lg"
              >{name}</motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PARTNERS ========== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <Handshake className="h-8 w-8 mx-auto text-amber-400 mb-3" />
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t("شركاء نفتخر بهم 🤍", "Partners we're proud of 🤍")}</h2>
          </motion.div>
          <style>{`
            @keyframes scroll-warm { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            @keyframes scroll-warm-r { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
            .marquee-warm { animation: scroll-warm 60s linear infinite; }
            .marquee-warm.r { animation: scroll-warm-r 60s linear infinite; }
            .marquee-warm:hover, .marquee-warm.r:hover { animation-play-state: paused; }
          `}</style>
          <div className="overflow-hidden mb-4">
            <div className="marquee-warm flex gap-4">
              {[...partnerLogos, ...partnerLogos].map((logo, i) => (
                <div key={i} className="flex-shrink-0 w-28 md:w-36 bg-[#FFFBF5] rounded-2xl p-3 h-20 flex items-center justify-center shadow-sm border border-amber-50">
                  <Image src={encodeImagePath(`/TrustedLogos/${logo}`)} alt="" width={80} height={40} className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="marquee-warm r flex gap-4">
              {[...partnerLogos.slice().reverse(), ...partnerLogos.slice().reverse()].map((logo, i) => (
                <div key={i} className="flex-shrink-0 w-28 md:w-36 bg-[#FFFBF5] rounded-2xl p-3 h-20 flex items-center justify-center shadow-sm border border-amber-50">
                  <Image src={encodeImagePath(`/TrustedLogos/${logo}`)} alt="" width={80} height={40} className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOR EVERYONE ========== */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #FFFBF5, #E8DCCB30, #FFFBF5)" }}>
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <WarmPersonaTabs isRTL={isRTL} t={t} />
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FFFBF5 0%, #E8DCCB 100%)" }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Image src={encodeImagePath("/logo/شعار المدار-01.svg")} alt="" width={400} height={400} />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <Gift className="h-10 w-10 mx-auto text-primary mb-4" />
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">💫 {t("خلينا نبدأ رحلة النجاح سوا", "Let's start the success journey together")}</h2>
          <p className="text-xl text-slate-500 mb-2">{t("أنشئ حسابك الآن واحصل على 50 رسالة ترحيبية مجانية 🎁", "Create your account and get 50 free welcome messages 🎁")}</p>
          <p className="text-sm text-slate-400 mb-8">{t("بدون بطاقة ائتمانية · تفعيل فوري · دعم 24/7", "No credit card · Instant activation · 24/7 support")}</p>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold text-lg px-14 py-5 rounded-full shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-shadow"
          >
            ✨ {t("سجل الآن", "Register Now")} {isRTL ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </motion.a>
        </motion.div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 bg-slate-900 text-white/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src={encodeImagePath("/logo/شعار المدار1-01.png")} alt="Orbit" width={80} height={30} className="h-8 w-auto brightness-0 invert opacity-70" />
              <span className="text-xs">{t("صنع في 🇸🇦 السعودية", "Made in 🇸🇦 Saudi Arabia")}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span>📞 920006900</span>
              <span>✉️ info@corbit.sa</span>
              <span>📍 {t("المدينة المنورة، حي الراية، طريق الملك عبدالله بن عبدالعزيز", "Madinah, Ar Rayah Dist., King Abdullah Bin Abdulaziz Rd.")}</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span>Instagram</span><span>·</span><span>X</span>
            </div>
          </div>
          <p className="text-center text-xs opacity-40 mt-6">© {new Date().getFullYear()} Orbit. {t("جميع الحقوق محفوظة", "All rights reserved")}</p>
        </div>
      </footer>
    </div>
  );
}

function WarmPersonaTabs({ isRTL, t }: { isRTL: boolean; t: (ar: string, en: string) => string }) {
  const [tab, setTab] = React.useState(0);
  return (
    <div>
      <div className="flex justify-center mb-10">
        <div className="text-center mb-8">
          <Coffee className="h-6 w-6 mx-auto text-amber-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-900">{t("المدار للجميع", "Orbit for everyone")}</h3>
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-amber-100">
          {[t("🧑‍💼 لرواد الأعمال", "🧑‍💼 Entrepreneurs"), t("👨‍💻 للمطورين", "👨‍💻 Developers")].map((label, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${tab === i ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}
            >{label}</button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          {tab === 0 ? (
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { icon: "📋", title: t("ارفع قائمتك", "Upload your list"), desc: t("استيراد جهات الاتصال بضغطة زر", "Import contacts in one click") },
                { icon: "📝", title: t("اختر النموذج", "Pick a template"), desc: t("قوالب معتمدة وجاهزة للإرسال", "Verified ready-to-send templates") },
                { icon: "📊", title: t("تابع الأداء", "Track performance"), desc: t("تقارير واضحة ومباشرة", "Clear & direct reports") },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-amber-50 shadow-sm">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{s.title}</h4>
                  <p className="text-slate-500 text-xs">{s.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-3xl p-8 text-left font-mono text-sm">
              <div className="text-emerald-400 mb-1">{t("// مكتبة Orbit للمطورين", "// Orbit Developer SDK")}</div>
              <div className="text-blue-300 mb-3">npm install @orbit/api-client</div>
              <div className="text-white/60">{t("// توثيق كامل بالعربي والإنجليزي", "// Full docs in Arabic & English")}</div>
              <div className="text-white/60">{t("// فريق دعم مطورين جاهز لمساعدتك", "// Dev support team ready to help")}</div>
              <div className="flex gap-2 mt-5">
                {["REST", "Webhooks", "SDK", "Sandbox"].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-[10px] font-bold">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
