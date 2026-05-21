'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/business/ui/button";
import {
  GraduationCap, LayoutDashboard, Clock, Users, MessageCircle,
  BarChart3, Shield, Lock, Check, ChevronDown, ChevronUp,
  Zap, Bell, CalendarDays, BookOpen,
  ClipboardCheck, AlertTriangle, Globe, FileSpreadsheet, ScanLine,
  Eye, CheckCircle2, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TrustedPartners } from "./TrustedPartners";
import { useLanguage } from '@/contexts/LanguageContext';
import type { CmsPage, CmsPartner } from '@/lib/cms/types';
import { getCmsField, getCmsSpacing, getCmsMarginBefore, getCmsMarginAfter } from '@/lib/cms/helpers';
import { encodeImagePath } from '@/utils/imagePath';
import { parseSchoolBitPlans, getDefaultSchoolBitPlans, getDiscountPercent, get3MonthDiscountPercent, getYearlyTotal, get3MonthTotal, parseSchoolBitSmsPlans, getDefaultSchoolBitSmsPlans } from '@/lib/cms/schoolbitPricing';

interface SchoolBitPageProps {
  cmsPage?: CmsPage | null;
  partners?: CmsPartner[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Clock, Users, MessageCircle, BarChart3,
  Shield, Eye, Zap, Globe, FileSpreadsheet, Bell,
  CalendarDays, BookOpen, ClipboardCheck, GraduationCap,
  ScanLine, AlertTriangle, Check, Lock, AlertCircle,
};

function parseJsonField<T>(raw: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function getIcon(name: string): React.ElementType {
  return ICON_MAP[name] || LayoutDashboard;
}

export const SchoolBitPage = ({ cmsPage = null, partners = [] }: SchoolBitPageProps) => {
  const { t, isRTL } = useLanguage();
  const headingFontClass = isRTL ? "font-ibm-plex-arabic" : "font-ibm-plex";
  const st = t.products.schoolbit;

  const [activeRoleTab, setActiveRoleTab] = useState(0);
  const [activeModuleTab, setActiveModuleTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingToggle, setBillingToggle] = useState<'monthly' | '3months' | 'yearly'>('monthly');

  const plans = useMemo(() => {
    const cmsPlansRaw = getCmsField(cmsPage, 'schoolbit-pricing', 'plans_list', isRTL, '');
    if (cmsPlansRaw) {
      return parseSchoolBitPlans(cmsPlansRaw, getDefaultSchoolBitPlans(isRTL));
    }
    return getDefaultSchoolBitPlans(isRTL);
  }, [cmsPage, isRTL]);

  const smsPlans = useMemo(() => {
    const raw = getCmsField(cmsPage, 'schoolbit-pricing', 'sms_plans_json', isRTL, '');
    if (raw) {
      return parseSchoolBitSmsPlans(raw, getDefaultSchoolBitSmsPlans(isRTL));
    }
    return getDefaultSchoolBitSmsPlans(isRTL);
  }, [cmsPage, isRTL]);

  const benefits = useMemo(() => {
    const raw = getCmsField(cmsPage, 'schoolbit-benefits', 'benefits_json', isRTL, '');
    return parseJsonField<{ icon: string; title: string; titleEn: string; desc: string; descEn: string }>(raw, []);
  }, [cmsPage, isRTL]);

  const roles = useMemo(() => {
    const raw = getCmsField(cmsPage, 'schoolbit-roles', 'roles_json', isRTL, '');
    return parseJsonField<{ key: string; name: string; nameEn: string; icon: string; bullets: string[]; bulletsEn: string[] }>(raw, []);
  }, [cmsPage, isRTL]);

  const modules = useMemo(() => {
    const raw = getCmsField(cmsPage, 'schoolbit-modules', 'modules_json', isRTL, '');
    return parseJsonField<{ key: string; label: string; labelEn: string; title: string; titleEn: string; subtitle: string; subtitleEn: string; icon: string; bullets: string[]; bulletsEn: string[] }>(raw, []);
  }, [cmsPage, isRTL]);

  const automationItems = useMemo(() => {
    const raw = getCmsField(cmsPage, 'schoolbit-automation', 'automation_json', isRTL, '');
    return parseJsonField<{ icon: string; title: string; titleEn: string; desc: string; descEn: string }>(raw, []);
  }, [cmsPage, isRTL]);

  const integrationItems = useMemo(() => {
    const raw = getCmsField(cmsPage, 'schoolbit-integrations', 'integrations_json', isRTL, '');
    return parseJsonField<{ name: string; nameEn: string }>(raw, []);
  }, [cmsPage, isRTL]);

  const securityFeatures = useMemo(() => {
    const raw = getCmsField(cmsPage, 'schoolbit-security', 'features_json', isRTL, '');
    return parseJsonField<{ text: string; textEn: string }>(raw, []);
  }, [cmsPage, isRTL]);

  const outcomeItems = useMemo(() => {
    const raw = getCmsField(cmsPage, 'schoolbit-outcomes', 'outcomes_json', isRTL, '');
    return parseJsonField<{ icon: string; title: string; titleEn: string; desc: string; descEn: string }>(raw, []);
  }, [cmsPage, isRTL]);

  const faqItems = useMemo(() => {
    const raw = getCmsField(cmsPage, 'schoolbit-faq', 'faq_json', isRTL, '');
    return parseJsonField<{ q: string; qEn: string; a: string; aEn: string }>(raw, []);
  }, [cmsPage, isRTL]);

  const isSectionVisible = useCallback((sectionId: string): boolean => {
    if (!cmsPage?.sections) return true;
    const section = cmsPage.sections.find(s => s.id === sectionId);
    if (!section) return true;
    const visibleField = section.fields?.find(f => f.key === 'visible');
    if (visibleField) return visibleField.value !== 'false';
    return true;
  }, [cmsPage]);

  const moduleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modulePauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const defaultModules = useMemo(() => [
    { key: 'dashboard', label: st.modules.dashboard.label, labelEn: st.modules.dashboard.label, title: st.modules.dashboard.title, titleEn: st.modules.dashboard.title, subtitle: st.modules.dashboard.subtitle, subtitleEn: st.modules.dashboard.subtitle, icon: 'LayoutDashboard', bullets: st.modules.dashboard.bullets, bulletsEn: st.modules.dashboard.bullets },
    { key: 'attendance', label: st.modules.attendance.label, labelEn: st.modules.attendance.label, title: st.modules.attendance.title, titleEn: st.modules.attendance.title, subtitle: st.modules.attendance.subtitle, subtitleEn: st.modules.attendance.subtitle, icon: 'Clock', bullets: st.modules.attendance.bullets, bulletsEn: st.modules.attendance.bullets },
    { key: 'studentProfile', label: st.modules.studentProfile.label, labelEn: st.modules.studentProfile.label, title: st.modules.studentProfile.title, titleEn: st.modules.studentProfile.title, subtitle: st.modules.studentProfile.subtitle, subtitleEn: st.modules.studentProfile.subtitle, icon: 'Users', bullets: st.modules.studentProfile.bullets, bulletsEn: st.modules.studentProfile.bullets },
    { key: 'messaging', label: st.modules.messaging.label, labelEn: st.modules.messaging.label, title: st.modules.messaging.title, titleEn: st.modules.messaging.title, subtitle: st.modules.messaging.subtitle, subtitleEn: st.modules.messaging.subtitle, icon: 'MessageCircle', bullets: st.modules.messaging.bullets, bulletsEn: st.modules.messaging.bullets },
    { key: 'schedules', label: st.modules.schedules.label, labelEn: st.modules.schedules.label, title: st.modules.schedules.title, titleEn: st.modules.schedules.title, subtitle: st.modules.schedules.subtitle, subtitleEn: st.modules.schedules.subtitle, icon: 'CalendarDays', bullets: st.modules.schedules.bullets, bulletsEn: st.modules.schedules.bullets },
    { key: 'reports', label: st.modules.reports.label, labelEn: st.modules.reports.label, title: st.modules.reports.title, titleEn: st.modules.reports.title, subtitle: st.modules.reports.subtitle, subtitleEn: st.modules.reports.subtitle, icon: 'BarChart3', bullets: st.modules.reports.bullets, bulletsEn: st.modules.reports.bullets },
  ], [st]);

  const moduleData = modules.length > 0 ? modules : defaultModules;

  useEffect(() => {
    if (!isSectionVisible('schoolbit-modules')) return;
    moduleTimerRef.current = setInterval(() => {
      setActiveModuleTab(prev => (prev + 1) % moduleData.length);
    }, 5000);
    return () => { if (moduleTimerRef.current) clearInterval(moduleTimerRef.current); };
  }, [moduleData.length, isSectionVisible]);

  const handleModuleTabClick = useCallback((index: number) => {
    setActiveModuleTab(index);
    if (moduleTimerRef.current) clearInterval(moduleTimerRef.current);
    if (modulePauseRef.current) clearTimeout(modulePauseRef.current);
    modulePauseRef.current = setTimeout(() => {
      moduleTimerRef.current = setInterval(() => {
        setActiveModuleTab(prev => (prev + 1) % moduleData.length);
      }, 5000);
    }, 15000);
  }, [moduleData.length]);

  return (
    <div
      className={`min-h-screen bg-white ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`}
      data-page="schoolbit"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ===== HERO SECTION ===== */}
      {isSectionVisible('schoolbit-hero') && (
        <section className={`relative ${getCmsMarginBefore(cmsPage, 'schoolbit-hero', '')} ${getCmsSpacing(cmsPage, 'schoolbit-hero', 'pt-24 pb-16 md:pt-32 md:pb-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-hero', '')} overflow-hidden bg-white`}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#1B6BF1]/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#0EA8F1]/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 md:space-y-8 max-w-2xl text-center lg:text-start">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0EA8F1]/10 border border-[#0EA8F1]/20 rounded-full text-sm font-bold text-[#0EA8F1] mx-auto lg:mx-0">
                  <GraduationCap className="w-4 h-4" />
                  {getCmsField(cmsPage, 'schoolbit-hero', 'eyebrow', isRTL, st.hero.eyebrow)}
                </div>
                <h1 className={`${headingFontClass} text-4xl md:text-6xl lg:text-7xl font-black text-[#021E4A] leading-[1.1] tracking-tight`}>
                  {getCmsField(cmsPage, 'schoolbit-hero', 'title', isRTL, st.hero.title)}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium opacity-90">
                  {getCmsField(cmsPage, 'schoolbit-hero', 'description', isRTL, st.hero.description)}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                  <Button asChild className="bg-[#FF7A1A] hover:bg-[#e56a0f] text-white h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-[#FF7A1A]/20 w-full sm:w-auto transform transition-transform hover:scale-105">
                    <Link href={getCmsField(cmsPage, 'schoolbit-hero', 'cta1_url', isRTL, '#contact') || '#contact'}>{getCmsField(cmsPage, 'schoolbit-hero', 'cta1_text', isRTL, st.hero.cta1)}</Link>
                  </Button>
                  <Button asChild className="bg-transparent border-2 border-[#021E4A] text-[#021E4A] hover:bg-[#021E4A] hover:text-white h-14 px-10 text-lg font-bold rounded-2xl w-full sm:w-auto">
                    <Link href={getCmsField(cmsPage, 'schoolbit-hero', 'cta2_url', isRTL, '#features') || '#features'}>{getCmsField(cmsPage, 'schoolbit-hero', 'cta2_text', isRTL, st.hero.cta2)}</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
                  {[
                    { text: getCmsField(cmsPage, 'schoolbit-hero', 'chip_noor', isRTL, st.hero.chipNoor), icon: Globe },
                    { text: getCmsField(cmsPage, 'schoolbit-hero', 'chip_biotime', isRTL, st.hero.chipBiotime), icon: ScanLine },
                    { text: getCmsField(cmsPage, 'schoolbit-hero', 'chip_messages', isRTL, st.hero.chipMessages), icon: MessageCircle },
                    { text: getCmsField(cmsPage, 'schoolbit-hero', 'chip_reports', isRTL, st.hero.chipReports), icon: BarChart3 },
                  ].map((chip, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-[#F7F9FC] border border-[#E3E7EF] rounded-full px-3 py-1.5 text-sm font-medium text-slate-700">
                      <chip.icon className="w-3.5 h-3.5 text-[#1B6BF1]" />
                      {chip.text}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                {getCmsField(cmsPage, 'schoolbit-hero', 'hero_image', isRTL, '') ? (
                  <div className="relative w-full max-w-[480px] md:max-w-[560px]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full bg-[#0EA8F1]/10 blur-[80px]" />
                    <Image
                      src={encodeImagePath(getCmsField(cmsPage, 'schoolbit-hero', 'hero_image', isRTL, ''))}
                      alt={getCmsField(cmsPage, 'schoolbit-hero', 'title', isRTL, st.hero.title)}
                      width={480}
                      height={400}
                      className="relative z-10 w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="relative w-full max-w-[400px] md:max-w-[480px]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full bg-[#0EA8F1]/10 blur-[80px]" />
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#E3E7EF] p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E3E7EF]">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1B6BF1] to-[#0EA8F1] flex items-center justify-center text-white font-bold text-lg">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className={`${headingFontClass} font-bold text-[#021E4A]`}>SchoolBit</h3>
                          <span className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" /> {isRTL ? 'متصل' : 'Connected'}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-[#F7F9FC] rounded-xl p-3 text-center border border-[#E3E7EF]">
                          <div className="text-2xl font-extrabold text-[#021E4A]">1,247</div>
                          <div className="text-xs text-slate-500 mt-0.5">{isRTL ? 'طالب' : 'Students'}</div>
                        </div>
                        <div className="bg-[#F7F9FC] rounded-xl p-3 text-center border border-[#E3E7EF]">
                          <div className="text-2xl font-extrabold text-[#1B6BF1]">94.2%</div>
                          <div className="text-xs text-slate-500 mt-0.5">{isRTL ? 'الحضور' : 'Attendance'}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <motion.div initial={{ x: isRTL ? 30 : -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-green-50 rounded-xl p-3 border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-green-800">{isRTL ? 'حضور اليوم' : "Today's Attendance"}</span>
                          </div>
                          <div className="text-xs text-green-600">{isRTL ? 'تم تسجيل 94% من الطلاب' : '94% of students checked in'}</div>
                        </motion.div>
                        <motion.div initial={{ x: isRTL ? 30 : -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-red-50 rounded-xl p-3 border border-[#FF2F8E]/20">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-[#FF2F8E]" />
                            <span className="text-sm font-bold text-red-800">{isRTL ? 'الطلاب في خطر' : 'At-Risk Students'}</span>
                          </div>
                          <div className="text-xs text-red-600">{isRTL ? '12 طالب يتجاوزون حد الغياب' : '12 students exceed absence threshold'}</div>
                        </motion.div>
                        <motion.div initial={{ x: isRTL ? 30 : -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageCircle className="w-4 h-4 text-[#1B6BF1]" />
                            <span className="text-sm font-bold text-blue-800">{isRTL ? 'رسالة غياب أُرسلت' : 'Absence Message Sent'}</span>
                          </div>
                          <div className="text-xs text-blue-600">{isRTL ? 'تم إخطار 38 ولي أمر' : '38 parents notified'}</div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== TRUST BAR ===== */}
      {isSectionVisible('schoolbit-trust') && (
        <section className={`${getCmsMarginBefore(cmsPage, 'schoolbit-trust', '')} ${getCmsSpacing(cmsPage, 'schoolbit-trust', 'py-10 md:py-14')} ${getCmsMarginAfter(cmsPage, 'schoolbit-trust', '')} bg-white border-y border-[#E3E7EF]`}>
          <div className="container mx-auto px-4 md:px-6">
            <p className="text-center text-sm text-slate-500 font-medium mb-8">
              {getCmsField(cmsPage, 'schoolbit-trust', 'title', isRTL, st.trust.title)}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {([
                { icon: LayoutDashboard, label: getCmsField(cmsPage, 'schoolbit-trust', 'dashboard_label', isRTL, st.trust.dashboard), desc: getCmsField(cmsPage, 'schoolbit-trust', 'dashboard_desc', isRTL, st.trust.dashboardDesc) },
                { icon: Clock, label: getCmsField(cmsPage, 'schoolbit-trust', 'attendance_label', isRTL, st.trust.attendance), desc: getCmsField(cmsPage, 'schoolbit-trust', 'attendance_desc', isRTL, st.trust.attendanceDesc) },
                { icon: MessageCircle, label: getCmsField(cmsPage, 'schoolbit-trust', 'messages_label', isRTL, st.trust.messages), desc: getCmsField(cmsPage, 'schoolbit-trust', 'messages_desc', isRTL, st.trust.messagesDesc) },
                { icon: BarChart3, label: getCmsField(cmsPage, 'schoolbit-trust', 'reports_label', isRTL, st.trust.reports), desc: getCmsField(cmsPage, 'schoolbit-trust', 'reports_desc', isRTL, st.trust.reportsDesc) },
                { icon: Globe, label: getCmsField(cmsPage, 'schoolbit-trust', 'integrations_label', isRTL, st.trust.integrations), desc: getCmsField(cmsPage, 'schoolbit-trust', 'integrations_desc', isRTL, st.trust.integrationsDesc) },
              ]).map((item, i) => (
                <div key={i} className="text-center p-4 md:p-6 rounded-2xl bg-[#F7F9FC] border border-[#E3E7EF] hover:shadow-md transition-all">
                  <item.icon className="w-6 h-6 md:w-8 md:h-8 text-[#1B6BF1] mx-auto mb-2 md:mb-3" />
                  <div className="font-bold text-[#021E4A] text-sm md:text-base">{item.label}</div>
                  <div className="text-xs md:text-sm text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <TrustedPartners partners={partners} />

      {/* ===== PROBLEM / VALUE SECTION ===== */}
      {isSectionVisible('schoolbit-problem') && (
        <section className={`${getCmsMarginBefore(cmsPage, 'schoolbit-problem', '')} ${getCmsSpacing(cmsPage, 'schoolbit-problem', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-problem', '')} bg-[#F7F9FC]`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#021E4A] mb-4`}>
                {getCmsField(cmsPage, 'schoolbit-problem', 'title', isRTL, st.problem.title)}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: AlertCircle, title: getCmsField(cmsPage, 'schoolbit-problem', 'p1_title', isRTL, st.problem.p1Title), desc: getCmsField(cmsPage, 'schoolbit-problem', 'p1_desc', isRTL, st.problem.p1Desc), color: '#FF7A1A' },
                { icon: Eye, title: getCmsField(cmsPage, 'schoolbit-problem', 'p2_title', isRTL, st.problem.p2Title), desc: getCmsField(cmsPage, 'schoolbit-problem', 'p2_desc', isRTL, st.problem.p2Desc), color: '#FF2F8E' },
                { icon: MessageCircle, title: getCmsField(cmsPage, 'schoolbit-problem', 'p3_title', isRTL, st.problem.p3Title), desc: getCmsField(cmsPage, 'schoolbit-problem', 'p3_desc', isRTL, st.problem.p3Desc), color: '#0EA8F1' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-[#E3E7EF] shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}15` }}>
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className={`${headingFontClass} text-xl font-bold text-[#021E4A] mb-2`}>{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#021E4A] rounded-2xl p-6 md:p-8 text-center">
              <Zap className="w-8 h-8 text-[#FF7A1A] mx-auto mb-3" />
              <h3 className={`${headingFontClass} text-xl md:text-2xl font-bold text-white`}>
                {getCmsField(cmsPage, 'schoolbit-problem', 'solution_text', isRTL, st.problem.solution)}
              </h3>
            </div>
          </div>
        </section>
      )}

      {/* ===== BENEFITS GRID ===== */}
      {isSectionVisible('schoolbit-benefits') && (
        <section className={`${getCmsMarginBefore(cmsPage, 'schoolbit-benefits', '')} ${getCmsSpacing(cmsPage, 'schoolbit-benefits', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-benefits', '')} bg-white`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#021E4A]`}>
                {getCmsField(cmsPage, 'schoolbit-benefits', 'title', isRTL, st.benefits.title)}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(benefits.length > 0 ? benefits : [
                { icon: 'LayoutDashboard', title: st.benefits.b1Title, titleEn: st.benefits.b1Title, desc: st.benefits.b1Desc, descEn: st.benefits.b1Desc },
                { icon: 'Eye', title: st.benefits.b2Title, titleEn: st.benefits.b2Title, desc: st.benefits.b2Desc, descEn: st.benefits.b2Desc },
                { icon: 'MessageCircle', title: st.benefits.b3Title, titleEn: st.benefits.b3Title, desc: st.benefits.b3Desc, descEn: st.benefits.b3Desc },
                { icon: 'FileSpreadsheet', title: st.benefits.b4Title, titleEn: st.benefits.b4Title, desc: st.benefits.b4Desc, descEn: st.benefits.b4Desc },
                { icon: 'Zap', title: st.benefits.b5Title, titleEn: st.benefits.b5Title, desc: st.benefits.b5Desc, descEn: st.benefits.b5Desc },
                { icon: 'Globe', title: st.benefits.b6Title, titleEn: st.benefits.b6Title, desc: st.benefits.b6Desc, descEn: st.benefits.b6Desc },
              ]).map((item, i) => {
                const Icon = getIcon(item.icon);
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 md:p-8 border border-[#E3E7EF] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-[#1B6BF1]/10 flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7 text-[#1B6BF1]" />
                    </div>
                    <h3 className={`${headingFontClass} text-xl font-bold text-[#021E4A] mb-3`}>{isRTL ? item.title : (item.titleEn || item.title)}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{isRTL ? item.desc : (item.descEn || item.desc)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== ROLE-BASED TABS ===== */}
      {isSectionVisible('schoolbit-roles') && (
        <section className={`${getCmsMarginBefore(cmsPage, 'schoolbit-roles', '')} ${getCmsSpacing(cmsPage, 'schoolbit-roles', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-roles', '')} bg-[#F7F9FC]`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#021E4A]`}>
                {getCmsField(cmsPage, 'schoolbit-roles', 'title', isRTL, st.roles.title)}
              </h2>
            </div>
            {roles.length > 0 && (
              <>
                <div className="flex justify-center mb-10">
                  <div className="bg-white rounded-2xl p-1.5 inline-flex gap-1 border border-[#E3E7EF] overflow-x-auto max-w-full">
                    {roles.map((role, i) => {
                      const Icon = getIcon(role.icon);
                      return (
                        <button
                          key={role.key}
                          onClick={() => setActiveRoleTab(i)}
                          className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                            activeRoleTab === i
                              ? 'bg-[#1B6BF1] text-white shadow-md'
                              : 'text-slate-500 hover:text-[#021E4A] hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {isRTL ? role.name : (role.nameEn || role.name)}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRoleTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl border border-[#E3E7EF] p-8 md:p-12 shadow-sm"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        {(isRTL ? roles[activeRoleTab]?.bullets : (roles[activeRoleTab]?.bulletsEn || roles[activeRoleTab]?.bullets) || []).map((bullet: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#1B6BF1] mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{bullet}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#F7F9FC] rounded-2xl p-6 border border-[#E3E7EF]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-[#1B6BF1] flex items-center justify-center">
                            {React.createElement(getIcon(roles[activeRoleTab]?.icon || 'LayoutDashboard'), { className: 'w-5 h-5 text-white' })}
                          </div>
                          <span className="font-bold text-[#021E4A]">{isRTL ? roles[activeRoleTab]?.name : (roles[activeRoleTab]?.nameEn || roles[activeRoleTab]?.name)}</span>
                        </div>
                        <div className="space-y-3">
                          {[1, 2, 3].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-3 border border-[#E3E7EF]">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#1B6BF1] rounded-full" />
                                <div className="h-2 bg-slate-200 rounded flex-1" style={{ width: `${70 - i * 15}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </section>
      )}

      {/* ===== MODULES SHOWCASE ===== */}
      {isSectionVisible('schoolbit-modules') && (() => {
        const currentModule = moduleData[activeModuleTab] || moduleData[0];
        const CurrentIcon = getIcon(currentModule?.icon || 'LayoutDashboard');

        return (
          <section id="features" className={`${getCmsMarginBefore(cmsPage, 'schoolbit-modules', '')} ${getCmsSpacing(cmsPage, 'schoolbit-modules', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-modules', '')} bg-[#F7F9FC]`}>
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#021E4A]`}>
                  {getCmsField(cmsPage, 'schoolbit-modules', 'title', isRTL, st.modules.dashboard ? (isRTL ? 'الوحدات الرئيسية' : 'Core Modules') : 'Core Modules')}
                </h2>
              </div>
              <div className="flex justify-center mb-10 overflow-x-auto">
                <div className="bg-white rounded-2xl p-1.5 inline-flex gap-1 border border-[#E3E7EF]">
                  {moduleData.map((mod, i) => {
                    const ModIcon = getIcon(mod.icon);
                    const isActive = activeModuleTab === i;
                    return (
                      <button
                        key={mod.key}
                        onClick={() => handleModuleTabClick(i)}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                          isActive ? 'bg-[#1B6BF1] text-white shadow-md' : 'text-slate-500 hover:text-[#021E4A] hover:bg-slate-50'
                        }`}
                      >
                        <ModIcon className="w-4 h-4" />
                        {isRTL ? mod.label : (mod.labelEn || mod.label)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModuleTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center"
                >
                  <div>
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E3E7EF] p-6 md:p-8 max-w-md mx-auto">
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E3E7EF]">
                        <div className="w-10 h-10 rounded-xl bg-[#1B6BF1] flex items-center justify-center">
                          <CurrentIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-[#021E4A]">{isRTL ? currentModule.title : (currentModule.titleEn || currentModule.title)}</span>
                      </div>
                      <div className="space-y-3">
                        {(isRTL ? currentModule.bullets : (currentModule.bulletsEn || currentModule.bullets)).slice(0, 4).map((_: string, bi: number) => (
                          <div key={bi} className="bg-[#F7F9FC] rounded-lg p-3 border border-[#E3E7EF]">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-[#1B6BF1] rounded-full" />
                              <div className="h-2 bg-slate-200 rounded flex-1" style={{ width: `${80 - bi * 10}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-[#0EA8F1]/10 border border-[#0EA8F1]/20 rounded-full px-3 py-1 text-xs font-semibold text-[#0EA8F1] mb-4">
                      {isRTL ? currentModule.label : (currentModule.labelEn || currentModule.label)}
                    </span>
                    <h3 className={`${headingFontClass} text-2xl md:text-3xl font-bold text-[#021E4A] mt-3`}>
                      {isRTL ? currentModule.title : (currentModule.titleEn || currentModule.title)}
                    </h3>
                    <p className="text-slate-500 leading-relaxed mt-3 mb-6">
                      {isRTL ? currentModule.subtitle : (currentModule.subtitleEn || currentModule.subtitle)}
                    </p>
                    <ul className="space-y-3">
                      {(isRTL ? currentModule.bullets : (currentModule.bulletsEn || currentModule.bullets)).map((bullet: string, bi: number) => (
                        <li key={bi} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#1B6BF1] mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-8">
                {moduleData.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to module ${i + 1}`}
                    aria-current={activeModuleTab === i ? 'step' : undefined}
                    onClick={() => handleModuleTabClick(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${activeModuleTab === i ? 'bg-[#1B6BF1] w-6' : 'bg-slate-300 hover:bg-slate-400'}`}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ===== AUTOMATION SECTION ===== */}
      {isSectionVisible('schoolbit-automation') && (
        <section className={`${getCmsMarginBefore(cmsPage, 'schoolbit-automation', '')} ${getCmsSpacing(cmsPage, 'schoolbit-automation', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-automation', '')} bg-gradient-to-br from-[#021E4A] to-[#061437] text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B6BF1]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold`}>
                {getCmsField(cmsPage, 'schoolbit-automation', 'title', isRTL, st.automation.title)}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {(automationItems.length > 0 ? automationItems : st.automation.items.map((item: { title: string; desc: string }, i: number) => ({
                icon: ['Bell', 'CalendarDays', 'ClipboardCheck', 'GraduationCap', 'ScanLine', 'AlertTriangle'][i % 6],
                title: item.title, titleEn: item.title, desc: item.desc, descEn: item.desc,
              }))).map((item, i) => {
                const Icon = getIcon(item.icon);
                return (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all">
                    <Icon className="w-8 h-8 text-[#0EA8F1] mb-4" />
                    <h3 className={`${headingFontClass} font-bold text-white mb-2`}>{isRTL ? item.title : (item.titleEn || item.title)}</h3>
                    <p className="text-white/60 text-sm">{isRTL ? item.desc : (item.descEn || item.desc)}</p>
                  </div>
                );
              })}
            </div>
            <blockquote className="text-xl md:text-2xl font-bold text-white/90 italic text-center max-w-3xl mx-auto">
              &ldquo;{getCmsField(cmsPage, 'schoolbit-automation', 'highlight_text', isRTL, st.automation.highlight)}&rdquo;
            </blockquote>
            <div className="w-16 h-1 bg-[#FF7A1A] mx-auto mt-4 rounded-full" />
          </div>
        </section>
      )}

      {/* ===== INTEGRATIONS SECTION ===== */}
      {isSectionVisible('schoolbit-integrations') && (
        <section className={`${getCmsMarginBefore(cmsPage, 'schoolbit-integrations', '')} ${getCmsSpacing(cmsPage, 'schoolbit-integrations', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-integrations', '')} bg-white`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#021E4A] mb-4`}>
                  {getCmsField(cmsPage, 'schoolbit-integrations', 'title', isRTL, st.integrations.title)}
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                  {getCmsField(cmsPage, 'schoolbit-integrations', 'description', isRTL, st.integrations.description)}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(integrationItems.length > 0 ? integrationItems : st.integrations.items).map((item, i) => (
                  <div key={i} className="bg-[#F7F9FC] rounded-2xl p-6 text-center border border-[#E3E7EF] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <span className="font-bold text-[#021E4A] text-sm md:text-base">{isRTL ? item.name : (item.nameEn || item.name)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== SECURITY & PERMISSIONS ===== */}
      {isSectionVisible('schoolbit-security') && (
        <section className={`${getCmsMarginBefore(cmsPage, 'schoolbit-security', '')} ${getCmsSpacing(cmsPage, 'schoolbit-security', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-security', '')} bg-[#F7F9FC]`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="bg-white rounded-2xl shadow-xl border border-[#E3E7EF] p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <Shield className="w-6 h-6 text-[#1B6BF1]" />
                  <h4 className={`${headingFontClass} font-bold text-[#021E4A]`}>{isRTL ? 'إدارة الصلاحيات' : 'Permission Management'}</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E3E7EF]">
                        <th className="py-2 text-start text-slate-500 font-medium">{isRTL ? 'الصلاحية' : 'Permission'}</th>
                        <th className="py-2 text-center text-slate-500 font-medium">{isRTL ? 'المدير' : 'Principal'}</th>
                        <th className="py-2 text-center text-slate-500 font-medium">{isRTL ? 'وكيل' : 'Vice'}</th>
                        <th className="py-2 text-center text-slate-500 font-medium">{isRTL ? 'معلم' : 'Teacher'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { perm: isRTL ? 'إدارة الطلاب' : 'Student Management', admin: true, vice: true, teacher: false },
                        { perm: isRTL ? 'التقارير' : 'Reports', admin: true, vice: true, teacher: true },
                        { perm: isRTL ? 'إرسال رسائل' : 'Send Messages', admin: true, vice: true, teacher: false },
                        { perm: isRTL ? 'إدارة الجداول' : 'Schedule Management', admin: true, vice: true, teacher: false },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-[#E3E7EF]/50">
                          <td className="py-2.5 text-slate-700 font-medium">{row.perm}</td>
                          <td className="py-2.5 text-center">{row.admin ? <Check className="w-4 h-4 text-[#1B6BF1] mx-auto" /> : <span className="text-slate-300">&mdash;</span>}</td>
                          <td className="py-2.5 text-center">{row.vice ? <Check className="w-4 h-4 text-[#1B6BF1] mx-auto" /> : <span className="text-slate-300">&mdash;</span>}</td>
                          <td className="py-2.5 text-center">{row.teacher ? <Check className="w-4 h-4 text-[#1B6BF1] mx-auto" /> : <span className="text-slate-300">&mdash;</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="bg-[#F7F9FC] rounded-lg p-3 border border-[#E3E7EF] text-center flex-1">
                    <Lock className="w-4 h-4 text-[#1B6BF1] mx-auto mb-1" />
                    <span className="text-xs text-slate-600">2FA</span>
                  </div>
                  <div className="bg-[#F7F9FC] rounded-lg p-3 border border-[#E3E7EF] text-center flex-1">
                    <Shield className="w-4 h-4 text-[#1B6BF1] mx-auto mb-1" />
                    <span className="text-xs text-slate-600">{isRTL ? '37 صلاحية' : '37 Permissions'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#021E4A] mb-4`}>
                  {getCmsField(cmsPage, 'schoolbit-security', 'title', isRTL, st.security.title)}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-8">
                  {getCmsField(cmsPage, 'schoolbit-security', 'description', isRTL, st.security.description)}
                </p>
                <div className="space-y-4">
                  {(securityFeatures.length > 0 ? securityFeatures : st.security.features.map((f: string) => ({ text: f, textEn: f }))).map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#1B6BF1] mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{isRTL ? feature.text : (feature.textEn || feature.text)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 bg-[#021E4A]/5 rounded-xl p-4 border border-[#021E4A]/10">
                  <p className="font-bold text-[#021E4A] text-sm">
                    {getCmsField(cmsPage, 'schoolbit-security', 'highlight_text', isRTL, st.security.highlight)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== PRICING SECTION ===== */}
      {isSectionVisible('schoolbit-pricing') && (
        <section id="pricing" className={`${getCmsMarginBefore(cmsPage, 'schoolbit-pricing', '')} ${getCmsSpacing(cmsPage, 'schoolbit-pricing', 'py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-pricing', '')} bg-white`}>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className={`${headingFontClass} text-3xl md:text-5xl font-extrabold text-[#021E4A] mb-4`}>
                {getCmsField(cmsPage, 'schoolbit-pricing', 'title', isRTL, st.pricing.title)}
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                {getCmsField(cmsPage, 'schoolbit-pricing', 'subtitle', isRTL, st.pricing.subtitle)}
              </p>
              <div role="tablist" className="inline-flex items-center bg-[#F7F9FC] rounded-2xl p-1.5 border border-[#E3E7EF]">
                <button
                  role="tab"
                  aria-selected={billingToggle === 'monthly'}
                  onClick={() => setBillingToggle('monthly')}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${billingToggle === 'monthly' ? 'bg-[#021E4A] text-white shadow-md' : 'text-slate-500 hover:text-[#021E4A]'}`}
                >
                  {getCmsField(cmsPage, 'schoolbit-pricing', 'monthly_label', isRTL, st.pricing.monthly)}
                </button>
                <button
                  role="tab"
                  aria-selected={billingToggle === '3months'}
                  onClick={() => setBillingToggle('3months')}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${billingToggle === '3months' ? 'bg-[#021E4A] text-white shadow-md' : 'text-slate-500 hover:text-[#021E4A]'}`}
                >
                  {getCmsField(cmsPage, 'schoolbit-pricing', '_3months_label', isRTL, st.pricing._3months)}
                  {plans[1]?.price && plans[1]?.price3Months ? (
                    <span className="text-[#0EA8F1] text-xs font-bold ms-1"> ({get3MonthDiscountPercent(plans[1].price ?? 0, plans[1].price3Months ?? 0)}% {isRTL ? 'وفر' : 'save'})</span>
                  ) : null}
                </button>
                <button
                  role="tab"
                  aria-selected={billingToggle === 'yearly'}
                  onClick={() => setBillingToggle('yearly')}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${billingToggle === 'yearly' ? 'bg-[#021E4A] text-white shadow-md' : 'text-slate-500 hover:text-[#021E4A]'}`}
                >
                  {getCmsField(cmsPage, 'schoolbit-pricing', 'yearly_label', isRTL, st.pricing.yearly)}
                  {plans[1]?.price && plans[1]?.priceYearly ? (
                    <span className="text-[#FF7A1A] text-xs font-bold ms-1"> ({getDiscountPercent(plans[1].price ?? 0, plans[1].priceYearly ?? 0)}% {isRTL ? 'وفر' : 'save'})</span>
                  ) : null}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => {
                const popularLabel = getCmsField(cmsPage, 'schoolbit-pricing', 'popular_label', isRTL, isRTL ? 'الأكثر طلباً' : 'Most Popular');
                const customLabel = getCmsField(cmsPage, 'schoolbit-pricing', 'custom_label', isRTL, st.pricing.custom);
                const allFeaturesLabel = getCmsField(cmsPage, 'schoolbit-pricing', 'all_features_label', isRTL, st.pricing.allFeatures);
                
                return (
                  <div
                    key={index}
                    className={`relative flex flex-col rounded-2xl p-6 md:p-8 transition-all duration-300 ${
                        plan.featured
                          ? 'border-2 border-[#FF7A1A] bg-white shadow-xl md:scale-105 z-10'
                        : 'border border-[#E3E7EF] bg-white hover:border-[#1B6BF1]/30 hover:shadow-lg'
                    }`}
                  >
                    {plan.featured && (
                      <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#FF7A1A] text-white px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                        {popularLabel}
                      </div>
                    )}
                    <div className="mb-6 text-center">
                      <h3 className={`${headingFontClass} text-xl font-bold text-[#021E4A]`}>
                        {isRTL ? plan.name : plan.nameEn}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{isRTL ? plan.description : plan.descriptionEn}</p>
                    </div>
                    {plan.isCustom ? (
                      <div className="mb-6 text-center">
                        <p className="text-2xl font-bold text-[#021E4A]">{customLabel}</p>
                      </div>
                    ) : (
                      <div className="mb-6 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-extrabold text-[#021E4A]">
                            {billingToggle === '3months' && plan.price3Months != null && plan.price3Months > 0
                              ? plan.price3Months
                              : billingToggle === 'yearly' && plan.priceYearly
                                ? plan.priceYearly
                                : plan.price}
                          </span>
                          <Image src="/trustedby/Saudi_Riyal_Symbol.svg.png" alt="ر.س" width={18} height={18} className="w-[18px] h-[18px] object-contain opacity-70" />
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          /{getCmsField(cmsPage, 'schoolbit-pricing', 'monthly_label', isRTL, isRTL ? 'شهر' : 'month')}
                        </p>
                        {billingToggle === '3months' && plan.price3Months != null && plan.price3Months > 0 && (
                          <div className="mt-2 bg-[#0EA8F1]/10 rounded-lg py-1.5 px-3">
                            <p className="text-sm font-bold text-[#0EA8F1]">
                              {get3MonthTotal(plan.price ?? 0, plan.price3Months)} <Image src="/trustedby/Saudi_Riyal_Symbol.svg.png" alt="ر.س" width={12} height={12} className="w-[12px] h-[12px] object-contain opacity-70 inline" />
                              <span className="text-xs text-[#0EA8F1]"> {getCmsField(cmsPage, 'schoolbit-pricing', '_3months_label', isRTL, isRTL ? '/3 أشهر' : '/3 months')}</span>
                            </p>
                            {plan.price && plan.price3Months && plan.price > plan.price3Months && (
                              <p className="text-xs text-green-600 font-medium mt-0.5">
                                {getCmsField(cmsPage, 'schoolbit-pricing', 'save_label', isRTL, isRTL ? 'وفر' : 'Save')} {get3MonthDiscountPercent(plan.price, plan.price3Months)}%
                              </p>
                            )}
                          </div>
                        )}
                        {billingToggle === 'yearly' && plan.priceYearly != null && plan.priceYearly > 0 && (
                          <div className="mt-2 bg-[#FF7A1A]/10 rounded-lg py-1.5 px-3">
                            <p className="text-sm font-bold text-[#FF7A1A]">
                              {getYearlyTotal(plan.price ?? 0, plan.priceYearly)} <Image src="/trustedby/Saudi_Riyal_Symbol.svg.png" alt="ر.س" width={12} height={12} className="w-[12px] h-[12px] object-contain opacity-70 inline" />
                              <span className="text-xs text-[#FF7A1A]"> {getCmsField(cmsPage, 'schoolbit-pricing', 'perYear', isRTL, isRTL ? '/سنة' : '/year')}</span>
                            </p>
                            {plan.price && plan.priceYearly && plan.price > plan.priceYearly && (
                              <p className="text-xs text-green-600 font-medium mt-0.5">
                                {getCmsField(cmsPage, 'schoolbit-pricing', 'save_label', isRTL, isRTL ? 'وفر' : 'Save')} {getDiscountPercent(plan.price, plan.priceYearly)}%
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <div className={`mt-auto mb-6 rounded-xl p-3 text-center border ${plan.featured ? 'bg-[#FF7A1A]/5 border-[#FF7A1A]/10' : 'bg-[#F7F9FC] border-transparent'}`}>
                      <p className="text-sm text-slate-700 font-medium">
                        {plan.isCustom ? (isRTL ? 'أسعار مخصصة' : 'Custom pricing') : `${allFeaturesLabel} ${isRTL ? plan.name : plan.nameEn}`}
                      </p>
                    </div>
                    <div className="space-y-3 mb-6">
                      {(isRTL ? plan.features : plan.featuresEn).map((feature, fi) => (
                        <div key={fi} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.featured ? 'text-[#FF7A1A]' : 'text-[#1B6BF1]'}`} />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      asChild
                      className={`w-full font-bold mt-auto ${
                        plan.featured
                          ? 'bg-[#FF7A1A] hover:bg-[#e56a0f] text-white'
                          : 'bg-transparent border-2 border-[#021E4A] text-[#021E4A] hover:bg-[#021E4A] hover:text-white'
                      }`}
                    >
                      {plan.isCustom ? (
                        <Link href={(isRTL ? plan.ctaUrl : (plan.ctaUrlEn || plan.ctaUrl)) || '/contact'}>{isRTL ? plan.name : plan.nameEn}</Link>
                      ) : (
                        <a href={(isRTL ? plan.ctaUrl : (plan.ctaUrlEn || plan.ctaUrl)) || 'https://schoolbit.corbit.sa/'} target="_blank" rel="noopener noreferrer">{plan.featured ? (isRTL ? 'ابدأ الآن' : 'Start Now') : (isRTL ? 'اختر الباقة' : 'Choose Plan')}</a>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* BioTime device add-on */}
            <div className="mt-10 max-w-5xl mx-auto">
              <div className="bg-[#F7F9FC] rounded-2xl p-6 border border-[#E3E7EF] flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1B6BF1]/10 flex items-center justify-center">
                    <ScanLine className="w-6 h-6 text-[#1B6BF1]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#021E4A]">{getCmsField(cmsPage, 'schoolbit-pricing', 'biotime_title', isRTL, st.pricing.biotimeTitle)}</p>
                    <p className="text-slate-500 text-sm">{getCmsField(cmsPage, 'schoolbit-pricing', 'biotime_price', isRTL, st.pricing.biotimePrice)}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-[#E3E7EF] hidden sm:block" />
                <p className="text-slate-500 text-sm">{getCmsField(cmsPage, 'schoolbit-pricing', 'biotime_additional', isRTL, st.pricing.biotimeAdditional)}</p>
              </div>
            </div>

            {/* SMS Plans */}
            <div className="mt-16 max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h3 className={`${headingFontClass} text-2xl md:text-3xl font-bold text-[#021E4A] mb-2`}>
                  {getCmsField(cmsPage, 'schoolbit-pricing', 'sms_title', isRTL, st.pricing.smsPlansTitle)}
                </h3>
                <p className="text-slate-500">
                  {getCmsField(cmsPage, 'schoolbit-pricing', 'sms_subtitle', isRTL, st.pricing.smsPlansSubtitle)}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {smsPlans.map((smsPlan, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-[#E3E7EF] text-center hover:border-[#1B6BF1]/30 hover:shadow-md transition-all">
                    <div className="text-3xl font-extrabold text-[#021E4A] mb-1">{smsPlan.messages.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mb-3">{isRTL ? 'رسالة' : 'messages'}</div>
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span className="text-xl font-bold text-[#1B6BF1]">{smsPlan.price}</span>
                      <Image src="/trustedby/Saudi_Riyal_Symbol.svg.png" alt="ر.س" width={14} height={14} className="w-[14px] h-[14px] object-contain opacity-70" />
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {smsPlan.messages > 0 ? (smsPlan.price / smsPlan.messages).toFixed(3) : '0'} {getCmsField(cmsPage, 'schoolbit-pricing', 'sms_per_message', isRTL, isRTL ? 'ر.س/رسالة' : 'SAR/msg')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== OUTCOMES SECTION ===== */}
      {isSectionVisible('schoolbit-outcomes') && (
        <section className={`${getCmsMarginBefore(cmsPage, 'schoolbit-outcomes', '')} ${getCmsSpacing(cmsPage, 'schoolbit-outcomes', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-outcomes', '')} bg-[#F7F9FC]`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#021E4A]`}>
                {getCmsField(cmsPage, 'schoolbit-outcomes', 'title', isRTL, st.outcomes.title)}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(outcomeItems.length > 0 ? outcomeItems : st.outcomes.items.map((item: { title: string; desc: string }, i: number) => ({
                icon: ['Clock', 'Eye', 'Zap', 'MessageCircle'][i % 4], title: item.title, titleEn: item.title, desc: item.desc, descEn: item.desc,
              }))).map((item, i) => {
                const Icon = getIcon(item.icon);
                return (
                  <div key={i} className="text-center p-6 md:p-8 rounded-2xl bg-white border border-[#E3E7EF] hover:shadow-md transition-all">
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-[#1B6BF1] mx-auto mb-4" />
                    <h3 className={`${headingFontClass} text-lg md:text-xl font-bold text-[#021E4A]`}>{isRTL ? item.title : (item.titleEn || item.title)}</h3>
                    <p className="text-sm text-slate-500 mt-2">{isRTL ? item.desc : (item.descEn || item.desc)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== FINAL CTA ===== */}
      {isSectionVisible('schoolbit-cta') && (
        <section className={`bg-[#021E4A] ${getCmsMarginBefore(cmsPage, 'schoolbit-cta', '')} ${getCmsSpacing(cmsPage, 'schoolbit-cta', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-cta', '')} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
            {getCmsField(cmsPage, 'schoolbit-cta', 'logo_image', isRTL, '') ? (
              <Image
                src={encodeImagePath(getCmsField(cmsPage, 'schoolbit-cta', 'logo_image', isRTL, ''))}
                alt="Orbit"
                width={100}
                height={35}
                className="h-10 w-auto mx-auto mb-6"
              />
            ) : (
              <Image
                src={encodeImagePath('/logo/شعار المدار-01.svg')}
                alt="Orbit"
                width={100}
                height={35}
                className="h-10 w-auto mx-auto mb-6 invert opacity-30"
              />
            )}
            <h2 className={`${headingFontClass} text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4`}>
              {getCmsField(cmsPage, 'schoolbit-cta', 'title', isRTL, st.finalCta.title)}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {getCmsField(cmsPage, 'schoolbit-cta', 'description', isRTL, st.finalCta.description)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-[#FF7A1A] hover:bg-[#e56a0f] text-white h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-[#FF7A1A]/20 transform transition-transform hover:scale-105">
                <Link href={getCmsField(cmsPage, 'schoolbit-cta', 'button_url', isRTL, st.finalCta.ctaUrl) || '#contact'}>{getCmsField(cmsPage, 'schoolbit-cta', 'button_text', isRTL, st.finalCta.cta)}</Link>
              </Button>
              <Button asChild className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#021E4A] h-14 px-10 text-lg font-bold rounded-2xl">
                <Link href={getCmsField(cmsPage, 'schoolbit-cta', 'secondary_url', isRTL, st.finalCta.secondaryUrl) || '#'}>{getCmsField(cmsPage, 'schoolbit-cta', 'secondary_text', isRTL, st.finalCta.secondary)}</Link>
              </Button>
            </div>
            <p className="mt-4 text-white/50 text-sm">
              {getCmsField(cmsPage, 'schoolbit-cta', 'disclaimer', isRTL, st.finalCta.disclaimer)}
            </p>
          </div>
        </section>
      )}

      {/* ===== FAQ SECTION ===== */}
      {isSectionVisible('schoolbit-faq') && (
        <section className={`${getCmsMarginBefore(cmsPage, 'schoolbit-faq', '')} ${getCmsSpacing(cmsPage, 'schoolbit-faq', 'py-20 md:py-24')} ${getCmsMarginAfter(cmsPage, 'schoolbit-faq', '')} bg-white`}>
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-10">
              <h2 className={`${headingFontClass} text-3xl md:text-4xl font-bold text-[#021E4A]`}>
                {getCmsField(cmsPage, 'schoolbit-faq', 'title', isRTL, st.faq.title)}
              </h2>
            </div>
            <div className="space-y-4">
              {(faqItems.length > 0 ? faqItems : st.faq.items.map((item: { q: string; a: string }) => ({ q: item.q, qEn: item.q, a: item.a, aEn: item.a }))).map((item, i) => (
                <div key={i} className="border border-[#E3E7EF] rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="w-full flex items-center justify-between p-5 bg-[#F7F9FC] hover:bg-[#E3E7EF]/50 transition-colors text-start"
                  >
                    <span className="font-semibold text-[#021E4A] pe-4">{isRTL ? item.q : (item.qEn || item.q)}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-[#1B6BF1] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 text-slate-500 leading-relaxed">{isRTL ? item.a : (item.aEn || item.a)}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};