'use client';

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Users, Shield, Smartphone, Globe, Cloud, Lock, Languages, Zap,
  CheckCircle2, Calendar, DollarSign, Target, TrendingUp, 
  FileText, Briefcase, Award, Clock, Settings, ChevronLeft, ChevronRight,
  ArrowRight, Play, Download, Star, Building2, BarChart3, Sparkles,
  MessageCircle, Bell, FileSpreadsheet, GraduationCap, Server, Monitor,
  CheckSquare, CreditCard, MapPin, Mail, Phone, Video
} from "lucide-react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

// استخدام الصور من المجلد العام
const dashboardImg = "/otime/dashboardOtime.png";
const payrollImg = "/otime/payrollOtime.png";
const attendanceImg = "/otime/attendenceOtime.png";

interface OTimePageProps {
  cmsPage?: CmsPage | null;
}

export const OTimePage = ({ cmsPage = null }: OTimePageProps) => {
  const { isRTL } = useLanguage();
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [currentModule, setCurrentModule] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const heroBadge = getCmsField(cmsPage, 'ot-hero', 'badge', isRTL, isRTL ? "نظام الموارد البشرية السحابي المتكامل" : "Integrated Cloud HR System");
  const heroTitle = getCmsField(
    cmsPage,
    'ot-hero',
    'title',
    isRTL,
    isRTL ? "مركز قيادة متكامل" : "Comprehensive Command Center"
  );
  const heroDescription = getCmsField(
    cmsPage,
    'ot-hero',
    'description',
    isRTL,
    isRTL
      ? "من التوظيف إلى التقاعد، O-Time يمنحك السيطرة الكاملة على الرواتب، الحضور، الأداء، والتوظيف في منصة سحابية واحدة آمنة وقابلة للتوسع."
      : "From recruitment to retirement, O-Time gives you full control over payroll, attendance, performance, and recruitment in a single, secure, and scalable cloud platform."
  );
  const heroHighlight = getCmsField(cmsPage, 'ot-hero', 'highlight', isRTL, isRTL ? "لإدارة الموارد البشرية" : "For Human Resources Management");
  const primaryCtaText = getCmsField(cmsPage, 'ot-hero', 'cta_primary_text', isRTL, isRTL ? "احجز ديمو الآن" : "Book a Demo Now");
  const primaryCtaUrl = getCmsField(cmsPage, 'ot-hero', 'cta_primary_url', isRTL, "https://wa.me/966920006900");
  const secondaryCtaText = getCmsField(cmsPage, 'ot-hero', 'cta_secondary_text', isRTL, isRTL ? "جرب النظام مجاناً" : "Try the System for Free");
  const secondaryCtaUrl = getCmsField(cmsPage, 'ot-hero', 'cta_secondary_url', isRTL, "https://otime.mobile.sa/register");
  const valueSectionTitle = getCmsField(cmsPage, 'ot-features', 'title', isRTL, isRTL ? "لماذا O-Time؟" : "Why O-Time?");
  const valueSectionSubtitle = getCmsField(cmsPage, 'ot-features', 'subtitle', isRTL, isRTL ? "منصة موحدة تجمع كل ما تحتاجه لإدارة الموارد البشرية بكفاءة عالية." : "A unified platform covering everything you need to manage HR efficiently.");
  const modulesSectionTitle = getCmsField(cmsPage, 'ot-features', 'modules_title', isRTL, isRTL ? "وحدات متكاملة لإدارة الموارد البشرية" : "Integrated HR Management Modules");
  const screenshotsSectionTitle = getCmsField(cmsPage, 'ot-features', 'screenshots_title', isRTL, isRTL ? "شاهد O-Time في العمل" : "See O-Time in Action");
  const techSectionTitle = getCmsField(cmsPage, 'ot-features', 'tech_title', isRTL, isRTL ? "بنية تحتية قوية وآمنة" : "Robost & Secure Infrastructure");

  // Screenshots للنظام
  const screenshots = [
    {
      title: isRTL ? "لوحة التحكم - مركز القيادة" : "Dashboard - Command Center",
      description: isRTL ? "نظرة شاملة على جميع عمليات الموارد البشرية في لوحة واحدة" : "Comprehensive overview of all HR operations in a single dashboard",
      image: dashboardImg
    },
    {
      title: isRTL ? "نظام الرواتب الذكي" : "Smart Payroll System",
      description: isRTL ? "حساب وإصدار الرواتب تلقائياً مع التوافق الكامل مع نظام حماية الأجور" : "Automated salary calculation and issuance, fully compliant with the Wage Protection System (WPS)",
      image: payrollImg
    },
    {
      title: isRTL ? "الحضور والانصراف" : "Attendance & Departure",
      description: isRTL ? "تتبع دقيق لساعات العمل مع دعم البصمة والموقع الجغرافي" : "Accurate tracking of working hours with biometric and GPS support",
      image: attendanceImg
    }
  ];

  // إعادة تعيين currentScreenshot إذا كان خارج النطاق
  React.useEffect(() => {
    if (currentScreenshot >= screenshots.length) {
      setCurrentScreenshot(0);
    }
  }, [currentScreenshot, screenshots.length]);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentScreenshot(prev => (prev === screenshots.length - 1 ? 0 : prev + 1));
    }
    if (touchStart - touchEnd < -75) {
      setCurrentScreenshot(prev => (prev === 0 ? screenshots.length - 1 : prev - 1));
    }
  };

  const valueProps = [
    {
      icon: TrendingUp,
      title: isRTL ? "التميز التشغيلي" : "Operational Excellence",
      description: isRTL ? "توحيد عمليات الموارد البشرية وتقليل العمل اليدوي والأخطاء بنسبة تصل إلى 80%" : "Unify HR operations and reduce manual work and errors by up to 80%",
      color: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: BarChart3,
      title: isRTL ? "قرارات مبنية على البيانات" : "Data-Driven Decisions",
      description: isRTL ? "لوحات تحكم تعرض تحليلات فورية للرواتب، الحضور، والأداء لدعم اتخاذ القرار" : "Dashboards showing real-time analytics for payroll, attendance, and performance to support decision making",
      color: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Shield,
      title: isRTL ? "أمان وسهولة" : "Secure & Simple",
      description: isRTL ? "نظام سحابي مشفر، متوافق مع كافة الأجهزة، ويدعم الامتثال للأنظمة المحلية" : "Encrypted cloud system, compatible with all devices, and supports compliance with local regulations",
      color: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const modules = [
    {
      icon: Users,
      title: isRTL ? "إدارة الموظفين والملفات" : "Employee & File Management",
      description: isRTL ? "سجلات رقمية شاملة لدورة حياة الموظف الكاملة، إدارة العقود، الوثائق، والهيكل التنظيمي الديناميكي" : "Comprehensive digital records for the entire employee lifecycle, contract and document management, and dynamic organizational structure",
      color: "bg-gradient-to-br from-[#104E8B] to-[#0d3d6e]",
      features: isRTL ? ["ملفات رقمية شاملة", "إدارة العقود والوثائق", "الهيكل التنظيمي", "المسار المهني"] : ["Comprehensive digital files", "Contract and document management", "Organizational structure", "Career path"]
    },
    {
      icon: DollarSign,
      title: isRTL ? "نظام الرواتب الذكي" : "Smart Payroll System",
      description: isRTL ? "إعداد مسيرات الرواتب تلقائياً، حساب البدلات والخصومات، وإصدار قسائم الدفع بما يتوافق مع نظام حماية الأجور" : "Automate payroll generation, calculate allowances and deductions, and issue payslips in compliance with the Wage Protection System",
      color: "bg-gradient-to-br from-[#FFA502] to-[#e69302]",
      features: isRTL ? ["حساب آلي للرواتب", "نظام حماية الأجور", "قسائم الراتب", "تقارير مالية"] : ["Automated salary calculation", "Wage protection system", "Payslips", "Financial reports"]
    },
    {
      icon: Clock,
      title: isRTL ? "الحضور والانصراف" : "Attendance & Departure",
      description: isRTL ? "تتبع دقيق لساعات العمل عبر الأجهزة البيومترية أو الموقع الجغرافي، مع إدارة سهلة للإجازات والمغادرات" : "Accurate tracking of working hours via biometric devices or GPS, with easy management of leaves and early departures",
      color: "bg-gradient-to-br from-[#00BCD4] to-[#0097a7]",
      features: isRTL ? ["تتبع البصمة", "الموقع الجغرافي", "إدارة الإجازات", "نظام الورديات"] : ["Biometric tracking", "Geolocation", "Leave management", "Shift management"]
    },
    {
      icon: Target,
      title: isRTL ? "إدارة الأداء والتقييم" : "Performance & Evaluation Management",
      description: isRTL ? "نظام KPIs متطور، تقييمات دورية، ومتابعة أهداف الموظفين لرفع الإنتاجية وتحقيق التميز" : "Advanced KPIs system, periodic evaluations, and tracking employee goals to increase productivity and achieve excellence",
      color: "bg-gradient-to-br from-[#104E8B] to-[#0d3d6e]",
      features: isRTL ? ["نظام KPIs", "تقييمات دورية", "متابعة الأهداف", "تقارير الأداء"] : ["KPIs system", "Periodic evaluations", "Goal tracking", "Performance reports"]
    },
    {
      icon: Briefcase,
      title: isRTL ? "التوظيف والتهيئة" : "Recruitment & Onboarding",
      description: isRTL ? "إدارة دورة التوظيف الكاملة من نشر الوظائف، فرز السير الذاتية، وحتى تهيئة الموظف الجديد (Onboarding)" : "Manage the entire recruitment cycle from job posting, resume screening, to new employee onboarding",
      color: "bg-gradient-to-br from-[#FFA502] to-[#e69302]",
      features: isRTL ? ["نظام ATS", "نشر الوظائف", "إدارة المقابلات", "Onboarding"] : ["ATS system", "Job posting", "Interview management", "Onboarding"]
    },
    {
      icon: CreditCard,
      title: isRTL ? "الإدارة المالية والعهدة" : "Financial & Custody Management",
      description: isRTL ? "تتبع المصروفات، العهد العينية (Assets)، السلف والقروض، وإدارة ميزانية الموارد البشرية بدقة" : "Track expenses, physical assets, advances and loans, and accurately manage the HR budget",
      color: "bg-gradient-to-br from-[#00BCD4] to-[#0097a7]",
      features: isRTL ? ["إدارة العهد", "السلف والقروض", "المصروفات", "الميزانية"] : ["Custody management", "Advances and loans", "Expenses", "Budgeting"]
    },
    {
      icon: Smartphone,
      title: isRTL ? "الخدمة الذاتية للموظف" : "Employee Self-Service",
      description: isRTL ? "تطبيق وبوابة تتيح للموظف تقديم الطلبات (إجازات، خطابات، سلف) ومتابعتها دون الرجوع لموظف HR" : "An application and portal that allows employees to submit requests (leaves, letters, advances) and track them without returning to the HR employee",
      color: "bg-gradient-to-br from-[#104E8B] to-[#0d3d6e]",
      features: isRTL ? ["بوابة الموظف", "تقديم الطلبات", "قسائم الراتب", "السجل الوظيفي"] : ["Employee portal", "Submit requests", "Payslips", "Employment record"]
    },
    {
      icon: GraduationCap,
      title: isRTL ? "التدريب والتطوير" : "Training & Development",
      description: isRTL ? "جدولة الدورات التدريبية، تتبع سجلات التدريب، وإدارة الشهادات لضمان النمو المستمر للموظفين" : "Schedule training courses, track training records, and manage certificates to ensure continuous employee growth",
      color: "bg-gradient-to-br from-[#FFA502] to-[#e69302]",
      features: isRTL ? ["إدارة الدورات", "سجلات التدريب", "الشهادات", "خطط التطوير"] : ["Course management", "Training records", "Certificates", "Development plans"]
    }
  ];

  const uxFeatures = [
    {
      icon: Bell,
      title: isRTL ? "تنبيهات فورية" : "Instant Notifications",
      description: isRTL ? "قوالب إشعارات جاهزة للرواتب، الإجازات، والقرارات الإدارية" : "Ready-made notification templates for payroll, leaves, and administrative decisions"
    },
    {
      icon: MessageCircle,
      title: isRTL ? "تواصل فعال" : "Effective Communication",
      description: isRTL ? "نظام رسائل داخلي متكامل وتكامل مع Zoom للاجتماعات" : "Integrated internal messaging system and integration with Zoom for meetings"
    },
    {
      icon: FileSpreadsheet,
      title: isRTL ? "تقارير بضغطة زر" : "One-Click Reports",
      description: isRTL ? "أكثر من 20 تقرير جاهز للتصدير (Excel/PDF) لدعم اتخاذ القرار" : "More than 20 ready-to-export reports (Excel/PDF) to support decision making"
    },
    {
      icon: Languages,
      title: isRTL ? "واجهة متعددة اللغات" : "Multilingual Interface",
      description: isRTL ? "دعم كامل للعربية والإنجليزية مع إمكانية التبديل الفوري" : "Full support for Arabic and English with instant switching capability"
    }
  ];

  const technicalSpecs = [
    {
      category: isRTL ? "المنصات المدعومة" : "Supported Platforms",
      items: ["Windows", "macOS", "Android", "iOS", "Web Browsers"]
    },
    {
      category: isRTL ? "المتصفحات" : "Browsers",
      items: ["Chrome", "Safari", "Firefox", "Edge", "Opera"]
    },
    {
      category: isRTL ? "الأمان" : "Security",
      items: isRTL ? ["تشفير SSL/TLS", "مصادقة ثنائية (2FA)", "صلاحيات دقيقة", "نسخ احتياطي يومي"] : ["SSL/TLS Encryption", "Two-Factor Auth (2FA)", "Granular Permissions", "Daily Backups"]
    },
    {
      category: isRTL ? "التكامل" : "Integration",
      items: isRTL ? ["Zoom", "Microsoft Teams", "البنوك السعودية", "أجهزة البصمة"] : ["Zoom", "Microsoft Teams", "Saudi Banks", "Biometric Devices"]
    }
  ];

  const localFeatures = [
    isRTL ? "دعم التقويم الهجري والميلادي" : "Gregorian and Hijri Calendar Support",
    isRTL ? "العطلات الرسمية السعودية" : "Saudi Public Holidays",
    isRTL ? "نظام حماية الأجور (WPS)" : "Wage Protection System (WPS)",
    isRTL ? "تكامل مع منصة قوى" : "Integration with Qiwa Platform",
    isRTL ? "دعم الهويات الوطنية والإقامات" : "National ID and Iqama Support",
    isRTL ? "إدارة التأشيرات والجوازات" : "Visas and Passports Management"
  ];

  const stats = [
    { value: "10,000+", label: isRTL ? "موظف يستخدم النظام" : "Employees Use the System" },
    { value: "500+", label: isRTL ? "شركة تثق في O-Time" : "Companies Trust O-Time" },
    { value: "99.9%", label: isRTL ? "وقت التشغيل" : "Uptime" },
    { value: "24/7", label: isRTL ? "دعم فني متواصل" : "Continuous Technical Support" }
  ];

  return (
    <div
      className={`min-h-screen bg-white ${isRTL ? "font-ibm-plex-arabic" : "font-ibm-plex"}`}
      data-page="otime"
      style={{ fontFamily: isRTL ? "'IBM Plex Sans Arabic', sans-serif" : "'IBM Plex Sans', sans-serif" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-[#E8DCCB] via-white to-[#D4CEC0] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzdBMUUyRSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* النص - اليمين */}
            <div className="text-right space-y-4 md:space-y-6">
              <Badge className="bg-gradient-to-r from-[#104E8B] to-[#0d3d6e] text-white border-none px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 ml-2 inline" />
                {heroBadge}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#161616] leading-tight">
                {heroTitle}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#104E8B] to-[#00BCD4]">{heroHighlight}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#606161] leading-relaxed max-w-xl">
                {heroDescription}
              </p>
              
              <div className="flex gap-4 flex-wrap">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#104E8B] to-[#0d3d6e] hover:from-[#0d3d6e] hover:to-[#0a2f56] text-white font-bold px-8 h-14 text-lg shadow-lg shadow-[#104E8B]/30"
                  onClick={() => window.open(primaryCtaUrl, '_blank')}
                >
                  {primaryCtaText}
                  <Play className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"}`} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-[#FFA502] text-[#FFA502] hover:bg-[#FFA502] hover:text-white font-bold px-8 h-14 text-lg"
                  onClick={() => window.open(secondaryCtaUrl, '_blank')}
                >
                  {secondaryCtaText}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"}`} />
                </Button>
              </div>
            </div>

            {/* صورة Dashboard - اليسار */}
            <div className="relative hidden md:block">
              <div className="relative">
                {/* Dashboard Mockup - Laptop */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-gray-200 bg-white mb-6">
                  <div className="bg-gradient-to-r from-[#104E8B] to-[#00BCD4] p-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-white text-sm mr-2">{isRTL ? "مركز القيادة - O-Time" : "Command Center - O-Time"}</div>
                  </div>
                  <div className="p-6 bg-gray-50">
                    {/* محاكاة Dashboard */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">{isRTL ? "إجمالي الموظفين" : "Total Employees"}</div>
                          <div className="text-2xl font-bold text-blue-600">247</div>
                          <div className="text-xs text-green-500 mt-1">↑ 12 {isRTL ? "هذا الشهر" : "this month"}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">{isRTL ? "حاضر اليوم" : "Present Today"}</div>
                          <div className="text-2xl font-bold text-green-600">234</div>
                          <div className="text-xs text-gray-500 mt-1">94.7%</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">{isRTL ? "في إجازة" : "On Leave"}</div>
                          <div className="text-2xl font-bold text-orange-600">13</div>
                          <div className="text-xs text-gray-500 mt-1">5.3%</div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-bold text-gray-700">{isRTL ? "معدل الحضور - هذا الأسبوع" : "Attendance Rate - This Week"}</div>
                          <Badge className="bg-green-100 text-green-700 text-xs">{isRTL ? "ممتاز" : "Excellent"}</Badge>
                        </div>
                        <div className="flex items-end gap-2 h-20">
                          {[85, 92, 88, 95, 90, 93, 91].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div 
                                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" 
                                style={{height: `${val}%`}}
                              ></div>
                              <div className="text-[10px] text-gray-400">
                                {isRTL ? ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'][i] : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                          <div className="text-xs text-purple-700 mb-1">{isRTL ? "طلبات معلقة" : "Pending Requests"}</div>
                          <div className="text-xl font-bold text-purple-700">8</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200">
                          <div className="text-xs text-orange-700 mb-1">{isRTL ? "وظائف مفتوحة" : "Open Jobs"}</div>
                          <div className="text-xl font-bold text-orange-700">5</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview - متداخل */}
                <div className="absolute bottom-0 right-6 w-32 bg-gray-900 rounded-[1.5rem] shadow-2xl p-2 border-4 border-gray-800">
                  <div className="bg-white rounded-[1rem] overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-center">
                      <div className="text-white text-[10px] font-bold">O-Time</div>
                    </div>
                    <div className="p-2 space-y-2 bg-gray-50">
                      <div className="bg-white p-2 rounded shadow-sm">
                        <div className="text-[8px] text-gray-500">{isRTL ? "الحضور" : "Attendance"}</div>
                        <div className="text-xs font-bold text-green-600">{isRTL ? "8:30 ص" : "8:30 AM"}</div>
                      </div>
                      <div className="bg-white p-2 rounded shadow-sm">
                        <div className="text-[8px] text-gray-500">{isRTL ? "الإجازات" : "Leaves"}</div>
                        <div className="text-xs font-bold text-blue-600">{isRTL ? "12 يوم" : "12 Days"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* شارة التميز */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-xl border-4 border-indigo-100">
                  <Award className="w-12 h-12 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* لماذا O-Time */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-2 text-sm mb-3 md:mb-4">
              {valueSectionTitle}
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#161616] mb-3 md:mb-4">
              {isRTL ? "القيمة الاستراتيجية التي تحتاجها" : "The Strategic Value You Need"}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {valueSectionSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {valueProps.map((prop, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className={`${prop.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <prop.icon className={`w-8 h-8 ${prop.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#161616] mb-3">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {prop.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* المميزات الرئيسية - 8 وحدات */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 border-none px-4 py-2 text-sm mb-3 md:mb-4">
              {modulesSectionTitle}
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#161616] mb-3 md:mb-4">
              {isRTL ? "نظام شامل لكل احتياجاتك" : "A Comprehensive System for All Your Needs"}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {isRTL ? "من التوظيف إلى التقاعد - إدارة دورة حياة الموظف الكاملة في منصة واحدة متكاملة" : "From recruitment to retirement - Manage the full employee lifecycle in a single integrated platform"}
            </p>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                <div className={`${module.color} p-5 text-white`}>
                  <module.icon className="w-10 h-10 mb-3" />
                  <h3 className="text-lg font-bold leading-tight">{module.title}</h3>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {module.description}
                  </p>
                  <div className="space-y-2">
                    {module.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile: Slider */}
          <div className="md:hidden relative">
            <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-4 pb-4 px-1">
              {modules.map((module, index) => (
                <div key={index} className="snap-center flex-shrink-0 w-[85%]">
                  <Card className="border-0 shadow-lg overflow-hidden h-full">
                    <div className={`${module.color} p-5 text-white`}>
                      <module.icon className="w-10 h-10 mb-3" />
                      <h3 className="text-lg font-bold leading-tight">{module.title}</h3>
                    </div>
                    <CardContent className="p-5">
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {module.description}
                      </p>
                      <div className="space-y-2">
                        {module.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* نقاط التنقل للجوال */}
            <div className="flex justify-center gap-2 mt-4">
              {modules.map((_, index) => (
                <div
                  key={index}
                  className="h-2 w-2 rounded-full bg-gray-300"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* تجربة المستخدم */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <Badge className="bg-white/20 text-white border-none px-4 py-2 text-sm mb-3 md:mb-4">
              {isRTL ? "UX/UI متقدم" : "Advanced UX/UI"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 md:mb-4">
              {isRTL ? "تجربة مستخدم لا تضاهى" : "Unmatched User Experience"}
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {isRTL ? "واجهة بديهية مصممة بعناية لتوفير أفضل تجربة لجميع المستخدمين" : "An intuitive interface carefully designed to provide the best experience for all users"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {uxFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/80">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* صورة توضيحية للتنبيهات */}
          <div className="max-w-3xl mx-auto mt-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900">{isRTL ? "التنبيهات الأخيرة" : "Recent Notifications"}</h4>
                    <Badge className="bg-red-100 text-red-700">{isRTL ? "3 جديد" : "3 New"}</Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: DollarSign, text: isRTL ? "تم إصدار مسير رواتب شهر يناير" : "January payroll issued", time: isRTL ? "قبل ساعة" : "an hour ago", color: "green" },
                      { icon: Calendar, text: isRTL ? "طلب إجازة جديد من أحمد محمد" : "New leave request from Ahmed", time: isRTL ? "قبل ساعتين" : "2 hours ago", color: "blue" },
                      { icon: Users, text: isRTL ? "5 متقدمين جدد لوظيفة مدير تسويق" : "5 new applicants for Marketing Manager", time: isRTL ? "قبل 3 ساعات" : "3 hours ago", color: "orange" }
                    ].map((notif, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`bg-${notif.color}-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <notif.icon className={`w-5 h-5 text-${notif.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">{notif.text}</div>
                          <div className="text-xs text-gray-500">{notif.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* لقطات من النظام */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#E8DCCB] to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <Badge className="bg-[#FFA502]/10 text-[#FFA502] border-none px-4 py-2 text-sm mb-3 md:mb-4">
              {isRTL ? "جولة في النظام" : "System Tour"}
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#161616] mb-3 md:mb-4">
              {screenshotsSectionTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isRTL ? "لقطات حقيقية من داخل النظام توضح سهولة الاستخدام والقوة الشاملة" : "Real screenshots from inside the system showing ease of use and comprehensive power"}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Carousel */}
            <div className="relative">
              <div 
                className="overflow-hidden rounded-2xl shadow-2xl bg-white border-8 border-gray-200"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="bg-gradient-to-r from-[#104E8B] to-[#00BCD4] p-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-white text-sm mr-4 font-semibold">{screenshots[currentScreenshot].title}</div>
                </div>
                
                {/* محتوى Screenshot - الصور الحقيقية */}
                <div className="bg-white">
                  <ImageWithFallback 
                    src={screenshots[currentScreenshot].image} 
                    alt={screenshots[currentScreenshot].title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* أزرار التنقل */}
              <button
                onClick={() => setCurrentScreenshot(prev => (prev === 0 ? screenshots.length - 1 : prev - 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#00BCD4]/10 text-[#104E8B] rounded-full p-3 shadow-lg transition-all hover:scale-110 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentScreenshot(prev => (prev === screenshots.length - 1 ? 0 : prev + 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#00BCD4]/10 text-[#104E8B] rounded-full p-3 shadow-lg transition-all hover:scale-110 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* نقاط التنقل */}
              <div className="flex justify-center gap-2 mt-6">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentScreenshot(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentScreenshot ? 'bg-[#104E8B] w-8' : 'bg-gray-300 w-2'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

            <div className="text-center mt-8 bg-[#00BCD4]/10 border-2 border-[#00BCD4]/30 rounded-xl p-4">
              <p className="text-sm text-[#161616]">
                💡 <strong>{isRTL ? "نصيحة:" : "Tip:"}</strong> {isRTL ? "احجز عرضاً توضيحياً مباشراً لرؤية جميع المميزات والتفاعل مع النظام الحي" : "Book a live demo to see all features and interact with the live system"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* المواصفات التقنية والتكامل */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <Badge className="bg-white/20 text-white border-none px-4 py-2 text-sm mb-3 md:mb-4">
              <Server className="w-4 h-4 ml-2 inline" />
              {isRTL ? "المواصفات التقنية" : "Technical Specifications"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 md:mb-4">
              {techSectionTitle}
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {isRTL ? "تقنية حديثة مع أعلى معايير الأمان والتوافق" : "Modern technology with the highest standards of security and compatibility"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {technicalSpecs.map((spec, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    {index === 0 && <Monitor className="w-5 h-5" />}
                    {index === 1 && <Globe className="w-5 h-5" />}
                    {index === 2 && <Shield className="w-5 h-5" />}
                    {index === 3 && <Zap className="w-5 h-5" />}
                    {spec.category}
                  </h3>
                  <div className="space-y-2">
                    {spec.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* أنواع الصلاحيات */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-white mb-6 text-center">{isRTL ? "نظام صلاحيات متقدم" : "Advanced Permission System"}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { role: "Admin", desc: isRTL ? "صلاحيات كاملة" : "Full Access", icon: Settings, color: "red" },
                    { role: "HR Manager", desc: isRTL ? "إدارة الموارد البشرية" : "HR Management", icon: Users, color: "blue" },
                    { role: "Employee", desc: isRTL ? "الخدمة الذاتية" : "Self Service", icon: Smartphone, color: "green" }
                  ].map((role, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-4 text-center">
                      <div className={`bg-${role.color}-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <role.icon className={`w-6 h-6 text-${role.color}-400`} />
                      </div>
                      <div className="font-bold text-white mb-1">{role.role}</div>
                      <div className="text-sm text-white/70">{role.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* التوافق المحلي */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="bg-white/20 text-white border-none px-4 py-2 text-sm mb-3 md:mb-4">
                <MapPin className="w-4 h-4 ml-2 inline" />
                {isRTL ? "مصمم للسوق السعودي" : "Designed for the Saudi Market"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3 md:mb-4">
                {isRTL ? "متوافق 100% مع الأنظمة المحلية" : "100% Compatible with Local Regulations"}
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                {isRTL ? "دعم كامل للأنظمة واللوائح السعودية مع تحديثات مستمرة" : "Full support for Saudi regulations and policies with continuous updates"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localFeatures.map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                      <span className="text-white font-semibold">{feature}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
              <Award className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-white mb-2">{isRTL ? "معتمد من الجهات الرسمية" : "Officially Certified"}</h4>
              <p className="text-white/80">
                {isRTL ? "متوافق مع متطلبات وزارة الموارد البشرية والتنمية الاجتماعية" : "Compliant with the requirements of the Ministry of Human Resources and Social Development"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#104E8B] via-[#0d3d6e] to-[#0a2f56] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGQTUwMiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-[#FFA502] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              {isRTL ? "هل أنت مستعد لنقل إدارة الموارد البشرية إلى مستوى جديد؟" : "Are you ready to take your HR management to a new level?"}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {isRTL ? "انضم إلى الشركات التي تعتمد على O-Time لتحقيق الكفاءة والامتثال" : "Join the companies relying on O-Time to achieve efficiency and compliance"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-[#FFA502] text-white hover:bg-[#e69302] font-bold px-10 h-14 text-lg shadow-2xl"
                onClick={() => window.open(secondaryCtaUrl, '_blank')}
              >
                {secondaryCtaText}
                <ArrowRight className={`w-6 h-6 ${isRTL ? "mr-2" : "ml-2"}`} />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-2 border-[#00BCD4] text-[#00BCD4] hover:bg-[#00BCD4] hover:text-white font-bold px-10 h-14 text-lg backdrop-blur-sm"
                onClick={() => window.open(primaryCtaUrl, '_blank')}
              >
                <Play className={`w-6 h-6 ${isRTL ? "ml-2" : "mr-2"}`} />
                {primaryCtaText}
              </Button>
            </div>

            {/* معلومات التواصل */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#FFA502]" />
                <span className="text-sm">920006900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#FFA502]" />
                <span className="text-sm">info@corbit.sa</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#FFA502]" />
                <span className="text-sm">{isRTL ? "احجز ديمو" : "Book Demo"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
