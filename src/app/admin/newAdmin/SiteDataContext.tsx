'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  getDefaultWhatsAppConversationPrices,
  getDefaultWhatsAppPlans,
  serializeWhatsAppConversationPrices,
  serializeWhatsAppPlans,
} from "@/lib/cms/whatsappPricing";
import {
  getDefaultSchoolBitPlans,
  getDefaultSchoolBitSmsPlans,
  serializeSchoolBitPlans,
} from "@/lib/cms/schoolbitPricing";

export interface Partner {
  id: string;
  name: string;
  logo: string;
  active: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  icon: string;
  url: string;
  active: boolean;
}

export interface FooterNavItem {
  id: string;
  labelAr: string;
  labelEn: string;
  href: string;
}

export interface FooterSocialItem {
  id: string;
  platform: string;
  icon: "instagram" | "twitter" | "linkedin" | "facebook" | "youtube" | "github" | "globe";
  url: string;
  active: boolean;
  openInNewTab: boolean;
}

export interface FooterData {
  logoDefault: string;
  logoDark: string;
  logoWhatsApp: string;
  licensedByAr: string;
  licensedByEn: string;
  madeInSaudiAr: string;
  madeInSaudiEn: string;
  quickLinks: FooterNavItem[];
  solutions: FooterNavItem[];
  phoneLabelAr: string;
  phoneLabelEn: string;
  phoneNumber: string;
  emailLabelAr: string;
  emailLabelEn: string;
  emailAddress: string;
  addressLabelAr: string;
  addressLabelEn: string;
  addressDetailAr: string;
  addressDetailEn: string;
  socialItems: FooterSocialItem[];
  copyrightAr: string;
  copyrightEn: string;
  countryAr: string;
  countryEn: string;
  commercialRegistryAr: string;
  commercialRegistryEn: string;
  licenseAr: string;
  licenseEn: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  product: string;
  date: string;
  read: boolean;
}

export interface WhatsAppServiceRequest {
  id: string;
  _id?: string;
  planId: string;
  tierId: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  otherIndustry: string;
  goal: string;
  employeeCount: string;
  notes: string;
  status: string;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "submission" | "system" | "info";
  date: string;
  read: boolean;
  submissionId?: string;
}

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  enabled: boolean;
}

export interface SectionField {
  key: string;
  label: string;
  labelEn: string;
  type: "text" | "textarea" | "url" | "list" | "select" | "image" | "spacing" | "display" | "margin";
  value: string;
  valueEn?: string;
  options?: { value: string; label: string; labelEn: string }[];
}

export interface PageSection {
  id: string;
  name: string;
  nameEn: string;
  fields: SectionField[];
  visible: boolean;
}

export interface PageSeo {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  keywords: string;
  keywordsEn: string;
  canonical: string;
  noIndex: boolean;
  ogImage: string;
}

export interface PageData {
  id: string;
  title: string;
  titleEn: string;
  path: string;
  visible?: boolean;
  sections: PageSection[];
  lastEdited: string;
  seo?: PageSeo;
}

interface SiteDataContextType {
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  addPartner: (name: string, logo: string) => void;
  removePartner: (id: string) => void;
  togglePartner: (id: string) => void;
  updatePartnerName: (id: string, name: string) => void;
  pages: PageData[];
  setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
  updateSectionField: (pageId: string, sectionId: string, fieldKey: string, value: string, lang: "ar" | "en") => void;
  toggleSectionVisibility: (pageId: string, sectionId: string) => void;
  getField: (pageId: string, sectionId: string, fieldKey: string) => string;
  isSectionVisible: (pageId: string, sectionId: string) => boolean;
  updatePageSeo: (pageId: string, seo: any) => void;
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
  addSocialLink: (platform: string, icon: string, url: string) => void;
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;
  contactSubmissions: ContactSubmission[];
  addContactSubmission: (submission: Omit<ContactSubmission, "id" | "date" | "read">) => void;
  markSubmissionRead: (id: string) => void;
  deleteSubmission: (id: string) => void;
  whatsAppRequests: WhatsAppServiceRequest[];
  fetchWhatsAppRequests: () => Promise<void>;
  updateWhatsAppRequestStatus: (id: string, status: string) => Promise<void>;
  deleteWhatsAppRequest: (id: string) => Promise<void>;
  notificationEmail: string;
  setNotificationEmail: React.Dispatch<React.SetStateAction<string>>;
  footerData: FooterData;
  setFooterData: React.Dispatch<React.SetStateAction<FooterData>>;
  saveSiteData: (overridePages?: PageData[]) => Promise<boolean>;
  refreshData: () => Promise<void>;
  isSyncing: boolean;
}

const canonicalFooterLogo = "/logo/شعار المدار-04.svg";
const legacyFooterLogos = new Set([
  "/logo/شعار المدار1-0١.png",
  "/logo/شعار المدار0-0٤.png",
  "/logo/شعار المدار1-0٢.png",
  "/logo/شعار المدار-01.svg",
]);

const normalizeFooterLogo = (value: unknown): string => {
  if (typeof value !== "string" || !value.trim()) {
    return canonicalFooterLogo;
  }
  const normalized = value.trim();
  return legacyFooterLogos.has(normalized) ? canonicalFooterLogo : normalized;
};

const normalizeQuickLinkHref = (item: FooterNavItem): string => {
  const href = typeof item.href === "string" ? item.href.trim() : "";
  if (!href) return "/";
  if (item.id === "ql-about" && href === "#about") return "/about-us";
  if (href === "#solutions" || href === "#products" || href === "/#solutions") return "#footer-products";
  if (href === "#news" || href === "#blog") return "/blog";
  if (href === "/news") return "/blog";
  return href;
};

const normalizeQuickLinks = (value: unknown): FooterNavItem[] => {
  if (!Array.isArray(value)) return [];
  const mapped = value
    .filter((item): item is FooterNavItem => Boolean(item && typeof item === "object"))
    .map((item) => ({
      ...item,
      id: item.id === "ql-solutions" ? "ql-products" : item.id,
      labelAr: item.id === "ql-solutions" && item.labelAr === "الحلول" ? "المنتجات" : item.labelAr,
      labelEn: item.id === "ql-solutions" && item.labelEn === "Solutions" ? "Products" : item.labelEn,
      href: normalizeQuickLinkHref({
        ...item,
        id: item.id === "ql-solutions" ? "ql-products" : item.id,
      }),
    }));

  const deduped = mapped.filter((item, index, arr) => arr.findIndex((x) => x.id === item.id) === index);
  const hasBlog = deduped.some((item) => item.id === "ql-blog");
  if (!hasBlog) {
    deduped.push({ id: "ql-blog", labelAr: "المدونة", labelEn: "Blog", href: "/blog" });
  }
  return deduped;
};

const homeSolutionsExtraFields: SectionField[] = [
  { key: "title", label: "عنوان القسم", labelEn: "Section Title", type: "text", value: "حلولنا الرئيسية", valueEn: "Our Key Solutions" },
  { key: "subtitle", label: "وصف القسم", labelEn: "Section Subtitle", type: "text", value: "نقدم لك مجموعة من الحلول التقنية المتكاملة التي تلبي احتياجات عملك", valueEn: "We offer a range of integrated technical solutions that meet your business needs" },
  { key: "wa_title", label: "عنوان بطاقة واتساب", labelEn: "WhatsApp Card Title", type: "text", value: "واتساب أعمال API", valueEn: "WhatsApp Business API" },
  { key: "wa_desc", label: "وصف بطاقة واتساب", labelEn: "WhatsApp Card Description", type: "textarea", value: "تواصل مع عملائك عبر واتساب بشكل احترافي وآمن مع إمكانيات متقدمة للحملات التسويقية.", valueEn: "Connect with your customers professionally via WhatsApp with advanced campaign capabilities." },
  { key: "wa_features", label: "مميزات واتساب (مفصولة بفواصل)", labelEn: "WhatsApp Features (comma separated)", type: "list", value: "حملات تسويقية موجهة,قوالب رسائل معتمدة,دعم متعدد العملاء,تقارير أداء مفصلة", valueEn: "Targeted marketing campaigns,Approved message templates,Multi-agent support,Detailed performance reports" },
  { key: "sms_title", label: "عنوان بطاقة SMS", labelEn: "SMS Card Title", type: "text", value: "خدمة الرسائل النصية SMS", valueEn: "SMS Messaging Service" },
  { key: "sms_desc", label: "وصف بطاقة SMS", labelEn: "SMS Card Description", type: "textarea", value: "خدمة رسائل نصية موثوقة وسريعة تصل لآلاف العملاء في ثوانٍ معدودة.", valueEn: "Reliable and fast SMS messaging service reaching thousands of customers in seconds." },
  { key: "sms_features", label: "مميزات SMS (مفصولة بفواصل)", labelEn: "SMS Features (comma separated)", type: "list", value: "إرسال جماعي سريع,واجهة برمجة تطبيقات مرنة,تقارير إرسال فورية,حماية من الرسائل المزعجة", valueEn: "Fast bulk sending,Flexible API,Real-time delivery reports,Spam protection" },
  { key: "otime_title", label: "عنوان بطاقة O-Time", labelEn: "O-Time Card Title", type: "text", value: "O-Time برنامج الموارد البشرية", valueEn: "O-Time HR Software" },
  { key: "otime_desc", label: "وصف بطاقة O-Time", labelEn: "O-Time Card Description", type: "textarea", value: "منصة متكاملة لإدارة الموارد البشرية تشمل الحضور والرواتب ودورة حياة الموظف بالكامل.", valueEn: "A complete HR operations platform for attendance, payroll, and employee lifecycle management." },
  { key: "otime_features", label: "مزايا O-Time (مفصولة بفواصل)", labelEn: "O-Time Features (comma separated)", type: "list", value: "إدارة الحضور والإجازات,أتمتة مسيرات الرواتب,بوابة الخدمة الذاتية للموظف,لوحات تحكم وتحليلات فورية", valueEn: "Attendance and leave management,Automated payroll workflows,Employee self-service portal,Real-time HR analytics dashboards" },
  { key: "govgate_title", label: "عنوان بطاقة Gov Gate", labelEn: "Gov Gate Card Title", type: "text", value: "Gov Gate", valueEn: "Gov Gate" },
  { key: "govgate_desc", label: "وصف بطاقة Gov Gate", labelEn: "Gov Gate Card Description", type: "textarea", value: "بوابة مراسلة مؤسسية آمنة ببنية مخصصة وامتثال كامل وتحكم متقدم.", valueEn: "Secure enterprise messaging gateway with dedicated infrastructure, compliance, and advanced controls." },
  { key: "govgate_features", label: "مزايا Gov Gate (مفصولة بفواصل)", labelEn: "Gov Gate Features (comma separated)", type: "list", value: "بوابة مراسلة خاصة وآمنة,صلاحيات دقيقة بحسب الأدوار,أمان مؤسسي وامتثال تشريعي,تقارير تشغيلية وسجل تدقيق مفصل", valueEn: "Private secure messaging portal,Granular role-based permissions,Enterprise-grade security and compliance,Detailed operational audit reporting" },
];

const homeHeroExtraFields: SectionField[] = [
  { key: "slides_json", label: "قائمة السلايدر (JSON)", labelEn: "Slider Slides (JSON)", type: "list", value: "", valueEn: "" },
  { key: "badge", label: "شارة الهيرو", labelEn: "Hero Badge", type: "text", value: "حلول تقنية رائدة", valueEn: "Leading Technical Solutions" },
  { key: "title", label: "عنوان الهيرو الرئيسي", labelEn: "Hero Main Title", type: "text", value: "نتيجة ربط الأنظمة", valueEn: "Connecting Systems, Delivering Results" },
  { key: "description", label: "وصف الهيرو", labelEn: "Hero Description", type: "textarea", value: "نوفر لك منصات مراسلة احترافية عبر الرسائل النصية وواتساب أعمال وحلول الموارد البشرية وبوابات المراسلة الحكومية.", valueEn: "We provide professional messaging platforms via SMS, WhatsApp Business, HR solutions, and government messaging gateways." },
  { key: "cta1_text", label: "نص الزر الرئيسي", labelEn: "Primary CTA Text", type: "text", value: "ابدأ مجاناً", valueEn: "Start Free" },
  { key: "cta1_url", label: "رابط الزر الرئيسي", labelEn: "Primary CTA URL", type: "url", value: "https://app.mobile.net.sa/reg", valueEn: "https://app.mobile.net.sa/reg" },
  { key: "cta2_text", label: "نص الزر الثانوي", labelEn: "Secondary CTA Text", type: "text", value: "تحدث مع المبيعات", valueEn: "Talk to Sales" },
  { key: "trust_text", label: "نص شارة الثقة", labelEn: "Trust Badge Text", type: "text", value: "موثوق من أكثر من 100 شركة", valueEn: "Trusted by 100+ companies" },
  { key: "cta_api_docs_url", label: "رابط زر تصفح ملفات API", labelEn: "Browse API Docs Button URL", type: "url", value: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view?usp=drive_link", valueEn: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view?usp=drive_link" },
  { key: "hero_image_url", label: "رابط صورة البطل", labelEn: "Hero Image URL", type: "image", value: "https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", valueEn: "https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  { key: "notification_title", label: "عنوان الإشعار", labelEn: "Notification Title", type: "text", value: "رسالة جديدة", valueEn: "New Message" },
  { key: "notification_desc", label: "وصف الإشعار", labelEn: "Notification Description", type: "text", value: "تم تأكيد طلبك بنجاح", valueEn: "Your order has been confirmed" },
];

const ensureHomeHeroFields = (pages: PageData[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "home" && page.path !== "/") {
      return page;
    }
    if (!Array.isArray(page.sections)) {
      return page;
    }

    const heroIndex = page.sections.findIndex((section) => section.id === "home-hero");
    if (heroIndex === -1) {
      return {
        ...page,
        sections: [
          { id: "home-hero", name: "الهيرو", nameEn: "Hero", visible: true, fields: homeHeroExtraFields.map((field) => ({ ...field })) },
          ...page.sections,
        ],
      };
    }

    const heroSection = page.sections[heroIndex];
    const safeFields = Array.isArray(heroSection.fields) ? heroSection.fields : [];
    const existingKeys = new Set(safeFields.map((field) => field.key));
    const missingFields = homeHeroExtraFields.filter((field) => !existingKeys.has(field.key));
    
    // Also ensure type is updated for hero_image_url
    const updatedFields = safeFields.map(f => {
       if (f.key === 'hero_image_url') return { ...f, type: 'image' as const };
       return f;
    });

    if (!missingFields.length && safeFields.length === updatedFields.length) {
      return page;
    }

    return {
      ...page,
      sections: page.sections.map((section, index) =>
        index === heroIndex
          ? { ...section, fields: [...updatedFields, ...missingFields] }
          : section
      ),
    };
  });
};

const ensureHomeSolutionsFields = (pages: PageData[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "home" && page.path !== "/") {
      return page;
    }
    if (!Array.isArray(page.sections)) {
      return page;
    }

    const solutionsIndex = page.sections.findIndex((section) => section.id === "home-solutions");
    if (solutionsIndex === -1) {
      return {
        ...page,
        sections: [
          ...page.sections,
          { id: "home-solutions", name: "الحلول الرئيسية", nameEn: "Key Solutions", visible: true, fields: homeSolutionsExtraFields.map((field) => ({ ...field })) },
        ],
      };
    }

    const solutionsSection = page.sections[solutionsIndex];
    const safeFields = Array.isArray(solutionsSection.fields) ? solutionsSection.fields : [];
    const existingKeys = new Set(safeFields.map((field) => field.key));
    const missingFields = homeSolutionsExtraFields.filter((field) => !existingKeys.has(field.key));
    if (!missingFields.length) {
      return page;
    }

    return {
      ...page,
      sections: page.sections.map((section, index) =>
        index === solutionsIndex
          ? { ...section, fields: [...safeFields, ...missingFields] }
          : section
      ),
    };
  });
};

const homePersonaTabsFields: SectionField[] = [
  { key: "section_title", label: "عنوان القسم", labelEn: "Section Title", type: "text", value: "منصة مصممة للجميع", valueEn: "A Platform Designed for Everyone" },
  { key: "section_subtitle", label: "وصف القسم", labelEn: "Section Subtitle", type: "text", value: "سواء كنت تاجراً تبحث عن السهولة، أو مطوراً يبحث عن المرونة.", valueEn: "Whether you are a merchant looking for simplicity, or a developer seeking flexibility." },
  { key: "merchants_tab_title", label: "عنوان تبويب المتاجر", labelEn: "Merchants Tab Title", type: "text", value: "للمتاجر والمسوقين", valueEn: "For Merchants & Marketers" },
  { key: "merchants_title", label: "عنوان المحتوى (تجار)", labelEn: "Merchants Content Title", type: "text", value: "أطلق حملاتك بدون تعقيد", valueEn: "Launch Campaigns Without Complexity" },
  { key: "merchants_description", label: "وصف المحتوى (تجار)", labelEn: "Merchants Description", type: "textarea", value: "لا تحتاج لخبرة تقنية. اربط متجرك في سلة أو زد بضغطة زر واحدة، وابدأ إرسال حملاتك التسويقية لآلاف العملاء فوراً.", valueEn: "No technical experience required. Connect your store in Salla or Zid with one click, and start sending your marketing campaigns to thousands of customers immediately." },
  { key: "merchants_step1", label: "الخطوة الأولى (تجار)", labelEn: "Merchants Step 1", type: "text", value: "استيراد جهات الاتصال تلقائياً", valueEn: "Automatically Import Contacts" },
  { key: "merchants_step2", label: "الخطوة الثانية (تجار)", labelEn: "Merchants Step 2", type: "text", value: "قوالب رسائل جاهزة ومعتمدة", valueEn: "Ready & Approved Message Templates" },
  { key: "merchants_step3", label: "الخطوة الثالثة (تجار)", labelEn: "Merchants Step 3", type: "text", value: "تقارير دقيقة للأداء (الفتح، النقر)", valueEn: "Accurate Performance Reports (Opens, Clicks)" },
  { key: "merchants_cta_text", label: "نص زر CTA (تجار)", labelEn: "Merchants CTA Text", type: "text", value: "ابدأ حملتك الأولى الآن", valueEn: "Start Your First Campaign Now" },
  { key: "merchants_image_url", label: "رابط صورة المتاجر", labelEn: "Merchants Image URL", type: "url", value: "https://images.unsplash.com/photo-1758611971897-baffb061fd9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", valueEn: "https://images.unsplash.com/photo-1758611971897-baffb061fd9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  { key: "developers_tab_title", label: "عنوان تبويب المطورين", labelEn: "Developers Tab Title", type: "text", value: "للمطورين والتقنيين", valueEn: "For Developers & Techies" },
  { key: "developers_badge", label: "شارة المطورين", labelEn: "Developer Badge", type: "text", value: "صديق للمطورين", valueEn: "Developer Friendly" },
  { key: "developers_title", label: "عنوان المحتوى (مطورين)", labelEn: "Developers Content Title", type: "text", value: "API قوي ومرن", valueEn: "Powerful & Flexible API" },
  { key: "developers_description", label: "وصف المحتوى (مطورين)", labelEn: "Developers Description", type: "textarea", value: "REST API مرن، توثيق كامل (Documentation)، ودعم فني من مطور لمطور. انسخ الكود وابدأ الإرسال في 5 دقائق.", valueEn: "REST API is flexible, features complete documentation, and offers developer-to-developer technical support. Copy the code and start sending in 5 minutes." },
  { key: "developers_uptime", label: "نسبة التشغيل", labelEn: "Uptime", type: "text", value: "99.99%", valueEn: "99.99%" },
  { key: "developers_latency", label: "زمن الاستجابة", labelEn: "Latency", type: "text", value: "50ms", valueEn: "50ms" },
  { key: "developers_tools", label: "أدوات التكامل (مفصولة بفواصل)", labelEn: "Integration Tools (comma separated)", type: "list", value: "دفترة,سلة,نظام نور,إتقان", valueEn: "Daftra,Salla,Noor,Itqan" },
  { key: "developers_cta_text", label: "نص زر التوثيق", labelEn: "Docs Button Text", type: "text", value: "تصفح ملفات الـ API", valueEn: "Browse API Docs" },
  { key: "developers_cta_url", label: "رابط التوثيق", labelEn: "Docs URL", type: "url", value: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view", valueEn: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view" },
];

const homeIntegrationsFields: SectionField[] = [
  { key: "title", label: "عنوان القسم", labelEn: "Section Title", type: "text", value: "نعمل مع أدواتك المفضلة", valueEn: "We Work with Your Favorite Tools" },
  { key: "subtitle", label: "وصف القسم", labelEn: "Section Subtitle", type: "text", value: "لن تضطر لتغيير نظام عملك الحالي، نحن نندمج معه بسهولة.", valueEn: "You won't have to change your current workflow; we integrate with it seamlessly." },
  { key: "integrations_json", label: "قائمة التكاملات (JSON)", labelEn: "Integrations List (JSON)", type: "list", value: "", valueEn: "" },
  { key: "integrations_list", label: "أسماء التكاملات (مفصولة بفواصل) - قديم", labelEn: "Integration Names (legacy)", type: "text", value: "سلة,دفترة,نور,اتقان,حضوري", valueEn: "Salla,Daftra,Noor,Itqan,Huddari" },
];

const ensureHomePersonaTabsFields = (pages: PageData[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "home" && page.path !== "/") {
      return page;
    }
    if (!Array.isArray(page.sections)) {
      return page;
    }

    const personaIndex = page.sections.findIndex((section) => section.id === "home-persona-tabs");
    if (personaIndex === -1) {
      return {
        ...page,
        sections: [
          ...page.sections,
          {
            id: "home-persona-tabs",
            name: "تبويبات الأشخاص",
            nameEn: "Persona Tabs",
            visible: true,
            fields: homePersonaTabsFields.map((field) => ({ ...field })),
          },
        ],
      };
    }

    const personaSection = page.sections[personaIndex];
    const safeFields = Array.isArray(personaSection.fields) ? personaSection.fields : [];
    const existingKeys = new Set(safeFields.map((field) => field.key));
    const missingFields = homePersonaTabsFields
      .filter((field) => !existingKeys.has(field.key))
      .map((field) => ({ ...field }));

    if (!missingFields.length) {
      return page;
    }

    return {
      ...page,
      sections: page.sections.map((section, index) =>
        index === personaIndex
          ? { ...section, fields: [...safeFields, ...missingFields] }
          : section
      ),
    };
  });
};

const ensureHomeIntegrationsFields = (pages: PageData[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "home" && page.path !== "/") {
      return page;
    }
    if (!Array.isArray(page.sections)) {
      return page;
    }

    const integrationsIndex = page.sections.findIndex((section) => section.id === "home-integrations");
    if (integrationsIndex === -1) {
      return {
        ...page,
        sections: [
          ...page.sections,
          {
            id: "home-integrations",
            name: "التكاملات",
            nameEn: "Integrations",
            visible: true,
            fields: homeIntegrationsFields.map((field) => ({ ...field })),
          },
        ],
      };
    }

    const integrationsSection = page.sections[integrationsIndex];
    const safeFields = Array.isArray(integrationsSection.fields) ? integrationsSection.fields : [];
    const existingKeys = new Set(safeFields.map((field) => field.key));
    const missingFields = homeIntegrationsFields
      .filter((field) => !existingKeys.has(field.key))
      .map((field) => ({ ...field }));

    if (!missingFields.length) {
      return page;
    }

    return {
      ...page,
      sections: page.sections.map((section, index) =>
        index === integrationsIndex
          ? { ...section, fields: [...safeFields, ...missingFields] }
          : section
      ),
    };
  });
};

const homeTrustFields: SectionField[] = [
  { key: "title", label: "عنوان قسم الثقة", labelEn: "Trust Section Title", type: "text", value: "شركاؤنا يثقون بنا", valueEn: "Our Trusted Partners" },
  { key: "subtitle", label: "وصف قسم الثقة", labelEn: "Trust Section Subtitle", type: "text", value: "نفتخر بشراكتنا مع أبرز المؤسسات والشركات في المنطقة", valueEn: "We are proud of our partnerships with leading institutions and companies in the region" },
];

const homeWhyUsFields: SectionField[] = [
  { key: "section_title", label: "عنوان القسم", labelEn: "Section Title", type: "text", value: "لماذا المدار؟", valueEn: "Why ORBIT?" },
  { key: "section_subtitle", label: "وصف القسم", labelEn: "Section Subtitle", type: "text", value: "نقدم لك مزايا فريدة تجعل تجربتك أفضل", valueEn: "We offer unique advantages that make your experience better" },
  { key: "support_title", label: "عنوان الدعم المحلي", labelEn: "Local Support Title", type: "text", value: "دعم فني محلي", valueEn: "Local Support" },
  { key: "support_desc", label: "وصف الدعم المحلي", labelEn: "Local Support Description", type: "text", value: "فريق سعودي يرد عليك واتساب/هاتف على مدار الساعة لخدمتك.", valueEn: "A Saudi team answering you via WhatsApp/phone 24/7." },
  { key: "security_title", label: "عنوان الأمان العالي", labelEn: "High Security Title", type: "text", value: "أمان عالي", valueEn: "High Security" },
  { key: "security_desc", label: "وصف الأمان العالي", labelEn: "High Security Description", type: "text", value: "بياناتك مشفرة ومحفوظة داخل السعودية (امتثال للأمن السيبراني).", valueEn: "Your data is encrypted and stored in Saudi Arabia (NCA compliant)." },
  { key: "payment_title", label: "عنوان الدفع المرن", labelEn: "Flexible Payment Title", type: "text", value: "الدفع المرن", valueEn: "Flexible Payment" },
  { key: "payment_desc", label: "وصف الدفع المرن", labelEn: "Flexible Payment Description", type: "text", value: "تحويل بنكي، مدى، فيزا، أو آجل (للشركات الكبرى).", valueEn: "Bank transfer, Mada, Visa, or Deferred (for large companies)." },
];

const ensureHomeTrustFields = (pages: PageData[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "home" && page.path !== "/") return page;
    if (!Array.isArray(page.sections)) return page;

    const idx = page.sections.findIndex((s) => s.id === "home-trust");
    if (idx === -1) {
      return {
        ...page,
        sections: [
          ...page.sections,
          { id: "home-trust", name: "شركاؤنا", nameEn: "Our Partners", visible: true, fields: homeTrustFields.map((f) => ({ ...f })) },
        ],
      };
    }

    const section = page.sections[idx];
    const safeFields = Array.isArray(section.fields) ? section.fields : [];
    const existingKeys = new Set(safeFields.map((f) => f.key));
    const missing = homeTrustFields.filter((f) => !existingKeys.has(f.key)).map((f) => ({ ...f }));
    if (!missing.length) return page;

    return {
      ...page,
      sections: page.sections.map((s, i) => (i === idx ? { ...s, fields: [...safeFields, ...missing] } : s)),
    };
  });
};

const ensureHomeWhyUsFields = (pages: PageData[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "home" && page.path !== "/") return page;
    if (!Array.isArray(page.sections)) return page;

    const idx = page.sections.findIndex((s) => s.id === "home-whyus");
    if (idx === -1) {
      return {
        ...page,
        sections: [
          ...page.sections,
          { id: "home-whyus", name: "لماذا نحن", nameEn: "Why Us", visible: true, fields: homeWhyUsFields.map((f) => ({ ...f })) },
        ],
      };
    }

    const section = page.sections[idx];
    const safeFields = Array.isArray(section.fields) ? section.fields : [];
    const existingKeys = new Set(safeFields.map((f) => f.key));
    const missing = homeWhyUsFields.filter((f) => !existingKeys.has(f.key)).map((f) => ({ ...f }));
    if (!missing.length) return page;

    return {
      ...page,
      sections: page.sections.map((s, i) => (i === idx ? { ...s, fields: [...safeFields, ...missing] } : s)),
    };
  });
};

const smsHeroFields: SectionField[] = [
  { key: "slides_json", label: "قائمة السلايدر (JSON)", labelEn: "Slider Slides (JSON)", type: "list", value: "", valueEn: "" },
  { key: "retail_title", label: "عنوان تبويب التجزئة", labelEn: "Retail Tab Title", type: "text", value: "التجزئة والتجارة", valueEn: "Retail & Commerce" },
  { key: "retail_description", label: "وصف تبويب التجزئة", labelEn: "Retail Tab Description", type: "textarea", value: "أرسل عروضك التسويقية لآلاف العملاء بضغطة زر.", valueEn: "Send your marketing offers to thousands of customers with one click." },
  { key: "retail_cta", label: "نص زر التجزئة", labelEn: "Retail CTA Text", type: "text", value: "ابدأ الآن", valueEn: "Start Now" },
  { key: "retail_label", label: "شارة التجزئة", labelEn: "Retail Badge", type: "text", value: "حملات تسويقية", valueEn: "Marketing Campaigns" },
  { key: "finance_title", label: "عنوان تبويب المالية", labelEn: "Finance Tab Title", type: "text", value: "القطاع المالي", valueEn: "Finance Sector" },
  { key: "finance_description", label: "وصف تبويب المالية", labelEn: "Finance Tab Description", type: "textarea", value: "توصيل آمن للإشعارات والتحقق عبر الرسائل النصية.", valueEn: "Secure delivery of notifications and verification via SMS." },
  { key: "finance_cta", label: "نص زر المالية", labelEn: "Finance CTA Text", type: "text", value: "تواصل معنا", valueEn: "Contact Us" },
  { key: "finance_label", label: "شارة المالية", labelEn: "Finance Badge", type: "text", value: "إشعارات آمنة", valueEn: "Secure Notifications" },
  { key: "education_title", label: "عنوان تبويب التعليم", labelEn: "Education Tab Title", type: "text", value: "القطاع التعليمي", valueEn: "Education Sector" },
  { key: "education_description", label: "وصف تبويب التعليم", labelEn: "Education Tab Description", type: "textarea", value: "تواصل مع الطلاب وأولياء الأمور بسهولة وفعالية.", valueEn: "Communicate with students and parents easily and effectively." },
  { key: "education_cta", label: "نص زر التعليم", labelEn: "Education CTA Text", type: "text", value: "جرّب مجاناً", valueEn: "Try Free" },
  { key: "education_label", label: "شارة التعليم", labelEn: "Education Badge", type: "text", value: "تواصل فعّال", valueEn: "Effective Communication" },
  { key: "logistics_title", label: "عنوان تبويب اللوجستيات", labelEn: "Logistics Tab Title", type: "text", value: "اللوجستيات والنقل", valueEn: "Logistics & Transport" },
  { key: "logistics_description", label: "وصف تبويب اللوجستيات", labelEn: "Logistics Tab Description", type: "textarea", value: "تنبيهات الشحن والتوصيل في الوقت المحدد.", valueEn: "Shipment and delivery alerts right on time." },
  { key: "logistics_cta", label: "نص زر اللوجستيات", labelEn: "Logistics CTA Text", type: "text", value: "ابدأ الآن", valueEn: "Get Started" },
  { key: "logistics_label", label: "شارة اللوجستيات", labelEn: "Logistics Badge", type: "text", value: "تتبع الشحنات", valueEn: "Shipment Tracking" },
  { key: "health_title", label: "عنوان تبويب الصحة", labelEn: "Health Tab Title", type: "text", value: "القطاع الصحي", valueEn: "Healthcare Sector" },
  { key: "health_description", label: "وصف تبويب الصحة", labelEn: "Health Tab Description", type: "textarea", value: "تذكيرات بالمواعيد وتأكيدات فورية للمرضى.", valueEn: "Appointment reminders and instant confirmations for patients." },
  { key: "health_cta", label: "نص زر الصحة", labelEn: "Health CTA Text", type: "text", value: "جرّب الآن", valueEn: "Try Now" },
  { key: "health_label", label: "شارة الصحة", labelEn: "Health Badge", type: "text", value: "تذكيرات ذكية", valueEn: "Smart Reminders" },
  { key: "general_badge_prefix", label: "بادئة الشارة العامة", labelEn: "General Badge Prefix", type: "text", value: "حلول", valueEn: "Solutions" },
  { key: "general_clients_count", label: "عدد العملاء", labelEn: "Clients Count", type: "text", value: "+20,000", valueEn: "+20,000" },
  { key: "general_clients_label", label: "نص ثقة العملاء", labelEn: "Clients Trust Label", type: "text", value: "عميل يثق بنا", valueEn: "clients trust us" },
  { key: "general_msg1_time", label: "وقت الرسالة الأولى", labelEn: "Message 1 Time", type: "text", value: "الآن", valueEn: "Now" },
  { key: "general_msg2_time", label: "وقت الرسالة الثانية", labelEn: "Message 2 Time", type: "text", value: "منذ دقيقة", valueEn: "1 min ago" },
  { key: "retail_msg1_sender", label: "مرسل رسالة التجزئة 1", labelEn: "Retail Message 1 Sender", type: "text", value: "متجر الأنوار", valueEn: "Al-Anwar Store" },
  { key: "retail_msg1_text", label: "نص رسالة التجزئة 1", labelEn: "Retail Message 1 Text", type: "text", value: "طلبك جاهز للتوصيل! 🚚", valueEn: "Your order is out for delivery! 🚚" },
  { key: "retail_msg2_sender", label: "مرسل رسالة التجزئة 2", labelEn: "Retail Message 2 Sender", type: "text", value: "سوق دوت كوم", valueEn: "Souq.com" },
  { key: "retail_msg2_text", label: "نص رسالة التجزئة 2", labelEn: "Retail Message 2 Text", type: "text", value: "خصم 30% على كل المنتجات! 🔥", valueEn: "30% off on all products! 🔥" },
  { key: "finance_msg1_sender", label: "مرسل رسالة المالية 1", labelEn: "Finance Message 1 Sender", type: "text", value: "البنك العربي", valueEn: "Arab Bank" },
  { key: "finance_msg1_text", label: "نص رسالة المالية 1", labelEn: "Finance Message 1 Text", type: "text", value: "تم تحويل 5,000 ر.س لحسابك ✔️", valueEn: "5,000 SAR transferred to your account ✔️" },
  { key: "finance_msg2_sender", label: "مرسل رسالة المالية 2", labelEn: "Finance Message 2 Sender", type: "text", value: "مدى", valueEn: "Mada" },
  { key: "finance_msg2_text", label: "نص رسالة المالية 2", labelEn: "Finance Message 2 Text", type: "text", value: "عملية الشراء مؤكدة. شكراً لك!", valueEn: "Purchase confirmed. Thank you!" },
  { key: "education_msg1_sender", label: "مرسل رسالة التعليم 1", labelEn: "Education Message 1 Sender", type: "text", value: "جامعة الملك سعود", valueEn: "King Saud University" },
  { key: "education_msg1_text", label: "نص رسالة التعليم 1", labelEn: "Education Message 1 Text", type: "text", value: "موعد محاضرة الغد الساعة 9 صباحاً 📚", valueEn: "Tomorrow's lecture at 9 AM 📚" },
  { key: "education_msg2_sender", label: "مرسل رسالة التعليم 2", labelEn: "Education Message 2 Sender", type: "text", value: "مدرسة النور", valueEn: "Al-Noor School" },
  { key: "education_msg2_text", label: "نص رسالة التعليم 2", labelEn: "Education Message 2 Text", type: "text", value: "اجتماع أولياء الأمور يوم الخميس", valueEn: "Parents meeting on Thursday" },
  { key: "logistics_msg1_sender", label: "مرسل رسالة اللوجستيات 1", labelEn: "Logistics Message 1 Sender", type: "text", value: "أرامكس", valueEn: "Aramex" },
  { key: "logistics_msg1_text", label: "نص رسالة اللوجستيات 1", labelEn: "Logistics Message 1 Text", type: "text", value: "شحنتك في الطريق، الوصل خلال ساعة 📦", valueEn: "Your shipment is on the way, arriving within an hour 📦" },
  { key: "logistics_msg2_sender", label: "مرسل رسالة اللوجستيات 2", labelEn: "Logistics Message 2 Sender", type: "text", value: "سمسا", valueEn: "SMSA Express" },
  { key: "logistics_msg2_text", label: "نص رسالة اللوجستيات 2", labelEn: "Logistics Message 2 Text", type: "text", value: "تم تسليم شحنتك بنجاح ✅", valueEn: "Your shipment has been delivered successfully ✅" },
  { key: "health_msg1_sender", label: "مرسل رسالة الصحة 1", labelEn: "Health Message 1 Sender", type: "text", value: "مستشفى الملك فهد", valueEn: "King Fahd Hospital" },
  { key: "health_msg1_text", label: "نص رسالة الصحة 1", labelEn: "Health Message 1 Text", type: "text", value: "تذكير: موعدك الطبي غداً الساعة 10 صباحاً", valueEn: "Reminder: Your appointment is tomorrow at 10 AM" },
  { key: "health_msg2_sender", label: "مرسل رسالة الصحة 2", labelEn: "Health Message 2 Sender", type: "text", value: "صحة", valueEn: "Sehha" },
  { key: "health_msg2_text", label: "نص رسالة الصحة 2", labelEn: "Health Message 2 Text", type: "text", value: "تم تأكيد حجزك بنجاح ✅", valueEn: "Your booking has been confirmed ✅" },
];

const smsValueFields: SectionField[] = [
  { key: "title", label: "عنوان قسم المميزات", labelEn: "Value Props Title", type: "text", value: "لماذا الرسائل النصية مع المدار؟", valueEn: "Why SMS with ORBIT?" },
  { key: "features_json", label: "قائمة المميزات (JSON)", labelEn: "Features List (JSON)", type: "list", value: "", valueEn: "" },
  { key: "feature1_title", label: "عنوان الميزة 1 (قديم)", labelEn: "Feature 1 Title", type: "text", value: "سرعة فورية", valueEn: "Zero Latency" },
  { key: "feature1_desc", label: "وصف الميزة 1 (قديم)", labelEn: "Feature 1 Description", type: "textarea", value: "رسائلك تصل في ثوانٍ معدودة، حتى في أوقات الذروة.", valueEn: "Your messages arrive in seconds, even during peak times." },
  { key: "feature2_title", label: "عنوان الميزة 2 (قديم)", labelEn: "Feature 2 Title", type: "text", value: "معرف مرسل خاص", valueEn: "Your Own Sender ID" },
  { key: "feature2_desc", label: "وصف الميزة 2 (قديم)", labelEn: "Feature 2 Description", type: "textarea", value: "أرسل باسم شركتك وعزز هويتك التجارية مع كل رسالة.", valueEn: "Send with your company name and reinforce your brand with every message." },
  { key: "feature3_title", label: "عنوان الميزة 3 (قديم)", labelEn: "Feature 3 Title", type: "text", value: "دعم فني سريع", valueEn: "Fast Tech Support" },
  { key: "feature3_desc", label: "وصف الميزة 3 (قديم)", labelEn: "Feature 3 Description", type: "textarea", value: "فريق الدعم الفني السعودي متاح على مدار الساعة لمساعدتك.", valueEn: "Our Saudi tech support team is available 24/7 to help you." },
];

const smsSpecialOfferFields: SectionField[] = [
  { key: "badge", label: "شارة العرض", labelEn: "Offer Badge", type: "text", value: "عرض محدود", valueEn: "Limited Offer" },
  { key: "title_part1", label: "العنوان - الجزء الأول", labelEn: "Title Part 1", type: "text", value: "ابدأ مجاناً واحصل على", valueEn: "Start free and get" },
  { key: "title_part2", label: "العنوان - الجزء المميز", labelEn: "Title Highlight", type: "text", value: "100 رسالة مجانية", valueEn: "100 free messages" },
  { key: "cta_text", label: "نص الزر", labelEn: "CTA Text", type: "text", value: "احصل على العرض الآن", valueEn: "Get the Offer Now" },
  { key: "cta_url", label: "رابط الزر", labelEn: "CTA URL", type: "url", value: "https://app.mobile.net.sa/reg", valueEn: "https://app.mobile.net.sa/reg" },
  { key: "disclaimer", label: "ملاحظة", labelEn: "Disclaimer", type: "text", value: "العرض ساري لفترة محدودة", valueEn: "Offer valid for a limited time" },
];

const smsUseCasesFields: SectionField[] = [
  { key: "title", label: "عنوان حالات الاستخدام", labelEn: "Use Cases Title", type: "text", value: "حالات الاستخدام", valueEn: "Use Cases" },
  { key: "usecases_json", label: "حالات الاستخدام (JSON)", labelEn: "Use Cases (JSON)", type: "list", value: "", valueEn: "" },
  { key: "otp_title", label: "عنوان OTP (قديم)", labelEn: "OTP Title", type: "text", value: "التحقق بخطوة واحدة", valueEn: "One-Step Verification" },
  { key: "otp_desc", label: "وصف OTP (قديم)", labelEn: "OTP Description", type: "textarea", value: "أكواد تحقق فورية تصل في ثوانٍ لحماية حسابات مستخدميك.", valueEn: "Instant verification codes delivered in seconds to protect user accounts." },
  { key: "api_title", label: "عنوان API (قديم)", labelEn: "API Title", type: "text", value: "تكامل API مرن", valueEn: "Flexible API Integration" },
  { key: "api_desc", label: "وصف API (قديم)", labelEn: "API Description", type: "textarea", value: "ربط سهل مع أنظمتك الحالية عبر REST API مرن وموثق بالكامل.", valueEn: "Easy integration with your existing systems through a well-documented, flexible REST API." },
  { key: "marketing_title", label: "عنوان التسويق (قديم)", labelEn: "Marketing Title", type: "text", value: "حملات تسويقية ذكية", valueEn: "Smart Marketing Campaigns" },
  { key: "marketing_desc", label: "وصف التسويق (قديم)", labelEn: "Marketing Description", type: "textarea", value: "أرسل حملات مخصصة لشرائح مختلفة من عملائك مع تقارير أداء مفصلة.", valueEn: "Send personalized campaigns to different customer segments with detailed performance reports." },
];

const smsDevelopersFields: SectionField[] = [
  { key: "badge", label: "شارة المطورين", labelEn: "Developer Badge", type: "text", value: "مطورين", valueEn: "Developers" },
  { key: "title", label: "عنوان قسم المطورين", labelEn: "Developer Section Title", type: "text", value: "مصمم للمطورين", valueEn: "Built for Developers" },
  { key: "description", label: "وصف قسم المطورين", labelEn: "Developer Description", type: "textarea", value: "REST API مرن مع توثيق شامل ودعم فني مخصص. انسخ الكود وابدأ الإرسال في 5 دقائق.", valueEn: "Flexible REST API with complete documentation and dedicated support. Copy the code and start sending in 5 minutes." },
  { key: "cta_text", label: "نص زر التوثيق", labelEn: "Docs Button Text", type: "text", value: "تصفح ملفات الـ API", valueEn: "Browse API Docs" },
  { key: "cta_url", label: "رابط التوثيق", labelEn: "Docs URL", type: "url", value: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view", valueEn: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view" },
  { key: "platforms_json", label: "منصات التكامل (JSON)", labelEn: "Platforms List (JSON)", type: "list", value: "", valueEn: "" },
  { key: "platform_1", label: "منصة تكامل 1 (قديم)", labelEn: "Integration Platform 1", type: "text", value: "دفترة", valueEn: "Daftra" },
  { key: "platform_2", label: "منصة تكامل 2 (قديم)", labelEn: "Integration Platform 2", type: "text", value: "سلة", valueEn: "Salla" },
  { key: "platform_3", label: "منصة تكامل 3 (قديم)", labelEn: "Integration Platform 3", type: "text", value: "نظام نور", valueEn: "Noor System" },
  { key: "platform_4", label: "منصة تكامل 4 (قديم)", labelEn: "Integration Platform 4", type: "text", value: "إتقان", valueEn: "Itqan" },
];

const smsFinalCtaFields: SectionField[] = [
  { key: "title", label: "عنوان CTA النهائي", labelEn: "Final CTA Title", type: "text", value: "جاهز لبدء رحلتك مع الرسائل النصية؟", valueEn: "Ready to start your SMS journey?" },
  { key: "subtitle", label: "وصف CTA النهائي", labelEn: "Final CTA Subtitle", type: "text", value: "انضم لآلاف الشركات التي تثق بنا يومياً", valueEn: "Join thousands of companies that trust us daily" },
  { key: "cta_text", label: "نص الزر", labelEn: "CTA Text", type: "text", value: "ابدأ مجاناً", valueEn: "Start Free" },
  { key: "cta_url", label: "رابط الزر", labelEn: "CTA URL", type: "url", value: "https://app.mobile.net.sa/reg", valueEn: "https://app.mobile.net.sa/reg" },
];

const ensureSmsSection = (pages: PageData[], sectionId: string, sectionName: string, sectionNameEn: string, fields: SectionField[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "sms" && page.path !== "/products/sms") return page;
    if (!Array.isArray(page.sections)) return page;

    const idx = page.sections.findIndex((s) => s.id === sectionId);
    if (idx === -1) {
      return {
        ...page,
        sections: [...page.sections, { id: sectionId, name: sectionName, nameEn: sectionNameEn, visible: true, fields: fields.map((f) => ({ ...f })) }],
      };
    }

    const section = page.sections[idx];
    const safeFields = Array.isArray(section.fields) ? section.fields : [];
    const existingKeys = new Set(safeFields.map((f) => f.key));
    const missing = fields.filter((f) => !existingKeys.has(f.key)).map((f) => ({ ...f }));
    if (!missing.length) return page;

    return {
      ...page,
      sections: page.sections.map((s, i) => (i === idx ? { ...s, fields: [...safeFields, ...missing] } : s)),
    };
  });
};

const smsPricingFields: SectionField[] = [
  { key: "title", label: "عنوان قسم الأسعار", labelEn: "Pricing Title", type: "text", value: "اختر الباقة التي تناسبك، واضمن راحة بالك", valueEn: "Choose the package that suits you, and ensure your peace of mind" },
  { key: "subtitle", label: "وصف قسم الأسعار", labelEn: "Pricing Subtitle", type: "textarea", value: "أسعار شاملة الضريبة، بدون رسوم خفية، ومعك خطوة بخطوة حتى الإرسال.", valueEn: "Prices include tax, no hidden fees, and we are with you step by step until sending." },
  { key: "benefit1_label", label: "ميزة 1 - العنوان", labelEn: "Benefit 1 Label", type: "text", value: "صلاحية سنة كاملة", valueEn: "Full year validity" },
  { key: "benefit1_desc", label: "ميزة 1 - الوصف", labelEn: "Benefit 1 Desc", type: "text", value: "رصيدك متاح لمدة 365 يوم", valueEn: "Your balance is available for 365 days" },
  { key: "benefit2_label", label: "ميزة 2 - العنوان", labelEn: "Benefit 2 Label", type: "text", value: "دعم تفعيل الاسم", valueEn: "Name activation support" },
  { key: "benefit2_desc", label: "ميزة 2 - الوصف", labelEn: "Benefit 2 Desc", type: "text", value: "نساعدك في اعتماد اسم المرسل", valueEn: "We help you approve the sender name" },
  { key: "benefit3_label", label: "ميزة 3 - العنوان", labelEn: "Benefit 3 Label", type: "text", value: "تفعيل فوري", valueEn: "Instant activation" },
  { key: "benefit3_desc", label: "ميزة 3 - الوصف", labelEn: "Benefit 3 Desc", type: "text", value: "اشحن وابدأ الإرسال مباشرة", valueEn: "Top up and start sending directly" },
  { key: "plans_list", label: "قائمة الباقات", labelEn: "Plans List", type: "list", value: "", valueEn: "" },
];

const ensureSmsFields = (pages: PageData[]): PageData[] => {
  let result = ensureSmsSection(pages, "sms-hero", "هيرو SMS", "SMS Hero", smsHeroFields);
  result = ensureSmsSection(result, "sms-value", "مميزات SMS", "SMS Value Props", smsValueFields);
  result = ensureSmsSection(result, "sms-special-offer", "عرض خاص", "Special Offer", smsSpecialOfferFields);
  result = ensureSmsSection(result, "sms-usecases", "حالات الاستخدام", "Use Cases", smsUseCasesFields);
  result = ensureSmsSection(result, "sms-developers", "المطورين", "Developers", smsDevelopersFields);
  result = ensureSmsSection(result, "sms-pricing", "أسعار SMS", "SMS Pricing", smsPricingFields);
  result = ensureSmsSection(result, "sms-final-cta", "CTA نهائي", "Final CTA", smsFinalCtaFields);
  return result;
};

const schoolbitHeroFields: SectionField[] = [
  { key: "eyebrow", label: "شارة أعلى العنوان", labelEn: "Eyebrow Badge", type: "text", value: "منصة إدارة المدارس الذكية", valueEn: "Smart School Management Platform" },
  { key: "title", label: "العنوان الرئيسي", labelEn: "Main Title", type: "text", value: "إدارة مدرستك بالكامل من منصة واحدة", valueEn: "Manage Your Entire School from One Platform" },
  { key: "description", label: "الوصف", labelEn: "Description", type: "textarea", value: "SchoolBit تجمع الحضور، الطلاب، الكادر، الجداول، الاختبارات، الرسائل، والتقارير في نظام ذكي يساعدك على تقليل العمل اليدوي، رفع الانضباط، واتخاذ قرارات أسرع.", valueEn: "SchoolBit brings together attendance, students, staff, schedules, exams, messaging, and reports in a smart system that helps you reduce manual work, improve discipline, and make faster decisions." },
  { key: "cta1_text", label: "نص الزر الأول", labelEn: "Primary CTA Text", type: "text", value: "اطلب عرضاً توضيحياً", valueEn: "Request a Demo" },
  { key: "cta1_url", label: "رابط الزر الأول", labelEn: "Primary CTA URL", type: "url", value: "#contact", valueEn: "#contact" },
  { key: "cta2_text", label: "نص الزر الثاني", labelEn: "Secondary CTA Text", type: "text", value: "اكتشف المميزات", valueEn: "Explore Features" },
  { key: "cta2_url", label: "رابط الزر الثاني", labelEn: "Secondary CTA URL", type: "url", value: "#features", valueEn: "#features" },
  { key: "chip_noor", label: "شارة تكامل نور", labelEn: "Noor Integration Chip", type: "text", value: "تكامل مع نظام نور", valueEn: "Noor Integration" },
  { key: "chip_biotime", label: "شارة ربط البصمة", labelEn: "BioTime Chip", type: "text", value: "ربط أجهزة البصمة", valueEn: "BioTime Devices" },
  { key: "chip_messages", label: "شارة الرسائل", labelEn: "Messages Chip", type: "text", value: "رسائل SMS و WhatsApp", valueEn: "SMS & WhatsApp" },
  { key: "chip_reports", label: "شارة التقارير", labelEn: "Reports Chip", type: "text", value: "تقارير تلقائية", valueEn: "Auto Reports" },
  { key: "hero_image", label: "صورة الهيرو", labelEn: "Hero Image", type: "image", value: "", valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "pt-24 pb-16 md:pt-32 md:pb-24", valueEn: "pt-24 pb-16 md:pt-32 md:pb-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitTrustFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "كل ما تحتاجه المدرسة لتعمل بكفاءة أعلى:", valueEn: "Everything your school needs to run more efficiently:" },
  { key: "dashboard_label", label: "لوحة تحكم - العنوان", labelEn: "Dashboard Label", type: "text", value: "لوحة تحكم", valueEn: "Live Monitoring" },
  { key: "dashboard_desc", label: "لوحة تحكم - الوصف", labelEn: "Dashboard Desc", type: "text", value: "متابعة لحظية", valueEn: "Real-time overview" },
  { key: "attendance_label", label: "حضور - العنوان", labelEn: "Attendance Label", type: "text", value: "حضور", valueEn: "Attendance" },
  { key: "attendance_desc", label: "حضور - الوصف", labelEn: "Attendance Desc", type: "text", value: "غياب وتأخر وانصراف", valueEn: "Absence, late, departure" },
  { key: "messages_label", label: "رسائل - العنوان", labelEn: "Messages Label", type: "text", value: "رسائل", valueEn: "Messaging" },
  { key: "messages_desc", label: "رسائل - الوصف", labelEn: "Messages Desc", type: "text", value: "تواصل مباشر مع ولي الأمر", valueEn: "Direct parent contact" },
  { key: "reports_label", label: "تقارير - العنوان", labelEn: "Reports Label", type: "text", value: "تقارير", valueEn: "Reports" },
  { key: "reports_desc", label: "تقارير - الوصف", labelEn: "Reports Desc", type: "text", value: "مؤشرات جاهزة للإدارة", valueEn: "Ready-made indicators" },
  { key: "integrations_label", label: "تكاملات - العنوان", labelEn: "Integrations Label", type: "text", value: "تكاملات", valueEn: "Integrations" },
  { key: "integrations_desc", label: "تكاملات - الوصف", labelEn: "Integrations Desc", type: "text", value: "نور، BioTime، Excel", valueEn: "Noor, BioTime, Excel" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-10 md:py-14", valueEn: "py-10 md:py-14" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitProblemFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "هل ما زالت إدارة المدرسة موزعة بين ملفات ورسائل وأنظمة متفرقة؟", valueEn: "Is your school management still scattered across files, messages, and disconnected systems?" },
  { key: "p1_title", label: "مشكلة 1 - العنوان", labelEn: "Problem 1 Title", type: "text", value: "أعمال يدوية متكررة", valueEn: "Repetitive Manual Work" },
  { key: "p1_desc", label: "مشكلة 1 - الوصف", labelEn: "Problem 1 Desc", type: "textarea", value: "متابعة الغياب، تجهيز التقارير، وتنظيم الاختبارات يدويًا.", valueEn: "Tracking absence, preparing reports, and organizing exams manually." },
  { key: "p2_title", label: "مشكلة 2 - العنوان", labelEn: "Problem 2 Title", type: "text", value: "صعوبة في رؤية المشكلات مبكرًا", valueEn: "Hard to Spot Problems Early" },
  { key: "p2_desc", label: "مشكلة 2 - الوصف", labelEn: "Problem 2 Desc", type: "textarea", value: "الطالب المتعثر أو كثير الغياب لا يظهر إلا بعد أن تتفاقم الحالة.", valueEn: "A struggling or frequently absent student only appears after the situation worsens." },
  { key: "p3_title", label: "مشكلة 3 - العنوان", labelEn: "Problem 3 Title", type: "text", value: "تواصل بطيء مع أولياء الأمور", valueEn: "Slow Parent Communication" },
  { key: "p3_desc", label: "مشكلة 3 - الوصف", labelEn: "Problem 3 Desc", type: "textarea", value: "الإشعارات المهمة تتأخر أو تعتمد على اجتهادات فردية.", valueEn: "Important notifications are delayed or rely on individual efforts." },
  { key: "solution_text", label: "نص الحل", labelEn: "Solution Text", type: "textarea", value: "SchoolBit تحول إدارة المدرسة إلى عملية موحدة، سريعة، وذكية.", valueEn: "SchoolBit transforms school management into a unified, fast, and smart operation." },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitBenefitsFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "لماذا SchoolBit؟", valueEn: "Why SchoolBit?" },
  { key: "benefits_json", label: "قائمة المميزات", labelEn: "Benefits List", type: "list", value: JSON.stringify([
    { icon: "LayoutDashboard", title: "منصة واحدة لإدارة المدرسة", titleEn: "One Platform for School Management", desc: "إدارة الطلاب، الحضور، الكادر، الجداول، الاختبارات، الرسائل، والتقارير ضمن نظام واحد بدل التنقل بين أدوات متعددة.", descEn: "Manage students, attendance, staff, schedules, exams, messaging, and reports in one system instead of multiple tools." },
    { icon: "Eye", title: "متابعة لحظية لما يحتاج تدخلك", titleEn: "Instant Monitoring of What Matters", desc: "لوحة تحكم تعرض الغياب، الطلاب في خطر، المخالفات، ومؤشرات المدرسة بشكل مباشر.", descEn: "A dashboard showing absence, at-risk students, violations, and school indicators at a glance." },
    { icon: "MessageCircle", title: "تواصل أسرع مع ولي الأمر", titleEn: "Faster Parent Communication", desc: "أرسل رسائل الغياب، الاستدعاءات، التذكيرات، والتقارير عبر SMS أو WhatsApp من داخل المنصة.", descEn: "Send absence notifications, summons, reminders, and reports via SMS or WhatsApp from within the platform." },
    { icon: "FileSpreadsheet", title: "تقارير جاهزة بدل إعدادها يدويًا", titleEn: "Ready Reports Instead of Manual Preparation", desc: "أنشئ وجدول تقارير الحضور، التأخر، المخالفات، الكادر، والرسائل بصيغ PDF وExcel.", descEn: "Create and schedule attendance, tardiness, violations, staff, and messaging reports in PDF and Excel." },
    { icon: "Zap", title: "أتمتة تقلل الأخطاء وتوفر الوقت", titleEn: "Automation That Reduces Errors and Saves Time", desc: "توزيع ذكي للجداول، توزيع تلقائي للاختبارات، كشف تعارضات، وتنبيهات ذكية.", descEn: "Smart schedule distribution, automatic exam room assignment, conflict detection, and smart alerts." },
    { icon: "Globe", title: "تكامل مع بيئة المدرسة", titleEn: "Integration with Your School Environment", desc: "ربط مع نظام نور، أجهزة BioTime، ملفات Excel، وWebhooks للتكاملات المستقبلية.", descEn: "Connect with Noor system, BioTime devices, Excel files, and Webhooks for future integrations." },
  ]), valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
  { key: "display", label: "إعدادات العرض", labelEn: "Display Settings", type: "display", value: '{"columns":{"mobile":1,"tablet":2,"desktop":3}}', valueEn: '{"columns":{"mobile":1,"tablet":2,"desktop":3}}' },
];
const schoolbitRolesFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "كيف تساعد كل إدارة داخل المدرسة؟", valueEn: "How does it help each department in the school?" },
  { key: "roles_json", label: "قائمة الأدوار", labelEn: "Roles List", type: "list", value: JSON.stringify([
    { key: "admin", name: "الإدارة", nameEn: "Administration", icon: "LayoutDashboard", bullets: ["ترى مؤشرات المدرسة من لوحة واحدة", "تستقبل تقارير دورية تلقائيًا", "تراقب الحضور والانضباط والكادر", "تمنح صلاحيات دقيقة لكل مستخدم"], bulletsEn: ["See school indicators from a single dashboard", "Receive automatic periodic reports", "Monitor attendance, discipline, and staff", "Grant precise permissions to each user"] },
    { key: "studentsAffairs", name: "شؤون الطلاب", nameEn: "Student Affairs", icon: "Users", bullets: ["ملف متكامل لكل طالب", "تسجيل المخالفات والاستدعاءات والتكريمات", "متابعة الحضور والغياب والتأخر", "التواصل الفوري مع ولي الأمر"], bulletsEn: ["Complete profile for each student", "Record violations, summons, and commendations", "Track attendance, absence, and tardiness", "Instant communication with parents"] },
    { key: "vicePrincipal", name: "الوكيل", nameEn: "Vice Principal", icon: "CalendarDays", bullets: ["إدارة الجداول والحصص اليومية", "متابعة الانصراف والبصمة", "تجهيز الاختبارات وتوزيع القاعات", "اكتشاف التعارضات مبكرًا"], bulletsEn: ["Manage daily schedules and classes", "Track departure and biometric attendance", "Prepare exams and assign rooms", "Detect conflicts early"] },
    { key: "teacher", name: "المعلم", nameEn: "Teacher", icon: "BookOpen", bullets: ["الوصول للطلاب والفصول المرتبطة به", "متابعة الحضور والسلوك", "رفع ملفات الإنجاز", "استقبال التذكيرات والمتطلبات"], bulletsEn: ["Access assigned students and classes", "Track attendance and behavior", "Upload achievement files", "Receive reminders and requirements"] },
    { key: "counselor", name: "المرشد الطلابي", nameEn: "Counselor", icon: "AlertTriangle", bullets: ["رؤية الطلاب في خطر", "تتبع السجل السلوكي", "متابعة الغياب المتكرر", "تنفيذ تدخلات أسرع وأكثر دقة"], bulletsEn: ["See at-risk students", "Track behavioral records", "Monitor frequent absence", "Execute faster, more accurate interventions"] },
  ]), valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
  { key: "display", label: "إعدادات العرض", labelEn: "Display Settings", type: "display", value: '{"columns":{"mobile":1,"tablet":2,"desktop":3}}', valueEn: '{"columns":{"mobile":1,"tablet":2,"desktop":3}}' },
];
const schoolbitModulesFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "الوحدات الرئيسية", valueEn: "Core Modules" },
  { key: "modules_json", label: "قائمة الوحدات", labelEn: "Modules List", type: "list", value: JSON.stringify([
    { key: "dashboard", label: "لوحة تحكم", labelEn: "Dashboard", title: "لوحة التحكم الذكية", titleEn: "Smart Control Panel", subtitle: "كل مؤشرات مدرستك أمامك منذ لحظة الدخول", subtitleEn: "All your school indicators at a glance from the moment you log in", icon: "LayoutDashboard", bullets: ["إجمالي الطلاب والكادر", "معدل الحضور", "الطلاب في خطر", "الغائبون اليوم", "المخالفات الأسبوعية", "إرسال إشعار جماعي مباشرة"], bulletsEn: ["Total students and staff", "Attendance rate", "Students at risk", "Absent today", "Weekly violations", "Send bulk notification instantly"] },
    { key: "attendance", label: "حضور", labelEn: "Attendance", title: "الحضور والانصراف", titleEn: "Attendance & Departure", subtitle: "سجل حضور أدق، وتدخل أسرع", subtitleEn: "More accurate attendance, faster intervention", icon: "Clock", bullets: ["حضور يومي وحضور لكل حصة", "تكامل مع أجهزة البصمة BioTime", "حساب الغياب والتأخر تلقائيًا", "متابعة الطلاب الذين لم ينصرفوا", "تقارير الحضور والتأخر"], bulletsEn: ["Daily and per-period attendance", "BioTime device integration", "Automatic absence and tardiness calculation", "Track students who haven't departed", "Attendance and tardiness reports"] },
    { key: "studentProfile", label: "ملف طالب", labelEn: "Student Profile", title: "ملف الطالب", titleEn: "Student Profile", subtitle: "الصورة الكاملة لكل طالب في مكان واحد", subtitleEn: "The complete picture of each student in one place", icon: "Users", bullets: ["بيانات شخصية وأكاديمية", "سجل حضور وسلوك", "استدعاءات وملاحظات", "مخالفات وتكريمات", "رسائل مباشرة لولي الأمر"], bulletsEn: ["Personal and academic data", "Attendance and behavior record", "Summons and notes", "Violations and commendations", "Direct messaging to parent"] },
    { key: "messaging", label: "رسائل", labelEn: "Messaging", title: "الرسائل والتواصل", titleEn: "Messaging & Communication", subtitle: "التواصل المهم يصل في وقته", subtitleEn: "Important communication arrives on time", icon: "MessageCircle", bullets: ["SMS و WhatsApp", "قوالب جاهزة للغياب والاختبارات والاستدعاءات", "رسائل مجدولة ومسودات", "متغيرات ديناميكية باسم الطالب والصف والتاريخ", "أرشيف وتقارير إرسال"], bulletsEn: ["SMS & WhatsApp", "Ready templates for absence, exams, and summons", "Scheduled and draft messages", "Dynamic variables for student name, class, and date", "Sending archive and reports"] },
    { key: "schedules", label: "جداول", labelEn: "Schedules", title: "الجداول والاختبارات", titleEn: "Schedules & Exams", subtitle: "تنظيم أكاديمي أقل تعقيدًا وأكثر دقة", subtitleEn: "Less complex, more accurate academic organization", icon: "CalendarDays", bullets: ["توزيع ذكي للحصص", "كشف التعارضات", "إدارة نصاب المعلمين", "توزيع الطلاب على قاعات الاختبارات", "تخطيط المقاعد وأرقام الجلوس"], bulletsEn: ["Smart class distribution", "Conflict detection", "Teacher workload management", "Student exam room distribution", "Seating plan and exam numbers"] },
    { key: "reports", label: "تقارير", labelEn: "Reports", title: "التقارير والتحليلات", titleEn: "Reports & Analytics", subtitle: "قرارات الإدارة تبدأ من بيانات واضحة", subtitleEn: "Administrative decisions start with clear data", icon: "BarChart3", bullets: ["تقارير حضور وتأخر", "تقارير الكادر", "تقارير المخالفات والاستدعاءات", "جدولة أسبوعية وشهرية", "إرسال تلقائي بالبريد", "تصدير PDF و Excel"], bulletsEn: ["Attendance and tardiness reports", "Staff reports", "Violation and summons reports", "Weekly and monthly scheduling", "Automatic email delivery", "PDF & Excel export"] },
  ]), valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitAutomationFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "دع المهام المتكررة تعمل تلقائيًا", valueEn: "Let repetitive tasks work automatically" },
  { key: "highlight_text", label: "نص بارز", labelEn: "Highlight Text", type: "textarea", value: "SchoolBit لا تحفظ البيانات فقط، بل تساعد المدرسة على التصرف بناءً عليها.", valueEn: "SchoolBit doesn't just store data — it helps the school act on it." },
  { key: "automation_json", label: "قائمة عناصر الأتمتة", labelEn: "Automation Items", type: "list", value: JSON.stringify([
    { icon: "Bell", title: "إشعار أولياء أمور الغائبين", titleEn: "Absence Parent Notification", desc: "إرسال تلقائي فور تسجيل الغياب", descEn: "Automatic notification upon absence registration" },
    { icon: "CalendarDays", title: "جدولة التقارير", titleEn: "Report Scheduling", desc: "تقارير دورية تصل للإدارة في موعدها", descEn: "Periodic reports delivered to administration on time" },
    { icon: "ClipboardCheck", title: "كشف تعارضات الجداول", titleEn: "Schedule Conflict Detection", desc: "تنبيه فوري عند أي تعارض في الحصص", descEn: "Immediate alert for any class conflict" },
    { icon: "GraduationCap", title: "توزيع قاعات الاختبارات", titleEn: "Exam Room Distribution", desc: "توزيع تلقائي للطلاب على القاعات", descEn: "Automatic student distribution across exam rooms" },
    { icon: "ScanLine", title: "مزامنة البصمة", titleEn: "Biometric Sync", desc: "ربط مباشر مع أجهزة BioTime", descEn: "Direct connection with BioTime devices" },
    { icon: "AlertTriangle", title: "تنبيه الطلاب في خطر", titleEn: "At-Risk Student Alert", desc: "إشعار تلقائي عند تجاوز حد الغياب", descEn: "Automatic notification when absence threshold is exceeded" },
  ]), valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitIntegrationsFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "يتكامل مع الأنظمة التي تعتمد عليها المدرسة", valueEn: "Integrates with the systems your school relies on" },
  { key: "description", label: "الوصف", labelEn: "Description", type: "textarea", value: "تقليل إدخال البيانات يدويًا، وتسهيل انتقال المدرسة إلى إدارة أكثر تكاملًا.", valueEn: "Reduce manual data entry and make the transition to more integrated school management easier." },
  { key: "integrations_json", label: "قائمة التكاملات", labelEn: "Integrations List", type: "list", value: JSON.stringify([
    { name: "نظام نور", nameEn: "Noor System" },
    { name: "BioTime", nameEn: "BioTime" },
    { name: "مزودو SMS", nameEn: "SMS Providers" },
    { name: "واتساب / WAHA", nameEn: "WhatsApp / WAHA" },
    { name: "Excel", nameEn: "Excel" },
    { name: "Webhooks", nameEn: "Webhooks" },
  ]), valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitSecurityFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "تحكم دقيق، وأمان أعلى", valueEn: "Precise Control, Higher Security" },
  { key: "description", label: "الوصف", labelEn: "Description", type: "textarea", value: "كل مستخدم يعمل ضمن ما يحتاجه فقط، والإدارة تحتفظ بالسيطرة.", valueEn: "Every user works within only what they need, and administration retains full control." },
  { key: "highlight_text", label: "نص بارز", labelEn: "Highlight Text", type: "textarea", value: "كل مستخدم يعمل ضمن ما يحتاجه فقط، والإدارة تحتفظ بالسيطرة.", valueEn: "Every user works within only what they need, and administration retains full control." },
  { key: "features_json", label: "قائمة ميزات الأمان", labelEn: "Security Features", type: "list", value: JSON.stringify([
    { text: "أدوار جاهزة للمدير والوكيل والمعلم والمرشد", textEn: "Ready roles for Principal, Vice Principal, Teacher, and Counselor" },
    { text: "أدوار مخصصة", textEn: "Custom roles" },
    { text: "37 صلاحية قابلة للتحكم", textEn: "37 controllable permissions" },
    { text: "مصادقة ثنائية", textEn: "Two-factor authentication" },
    { text: "سجل دخول والأجهزة المتصلة", textEn: "Login log and connected devices" },
    { text: "إنهاء الجلسات من مكان واحد", textEn: "End sessions from one place" },
  ]), valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitPricingFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "باقات تناسب كل مدرسة", valueEn: "Packages for Every School" },
  { key: "subtitle", label: "العنوان الفرعي", labelEn: "Subtitle", type: "text", value: "اختر الباقة المناسبة لحجم مدرستك واحتياجاتك", valueEn: "Choose the package that fits your school size and needs" },
  { key: "monthly_label", label: "نص شهري", labelEn: "Monthly Label", type: "text", value: "شهري", valueEn: "Monthly" },
  { key: "_3months_label", label: "نص 3 أشهر", labelEn: "3 Months Label", type: "text", value: "3 أشهر", valueEn: "3 Months" },
  { key: "yearly_label", label: "نص سنوي", labelEn: "Yearly Label", type: "text", value: "سنوي", valueEn: "Yearly" },
  { key: "save_label", label: "نص وفر", labelEn: "Save Label", type: "text", value: "وفر", valueEn: "Save" },
  { key: "perYear", label: "نص /سنة", labelEn: "Per Year", type: "text", value: "/سنة", valueEn: "/year" },
  { key: "custom_label", label: "نص سعر مخصص", labelEn: "Custom Price Label", type: "text", value: "مخصص", valueEn: "Custom" },
  { key: "all_features_label", label: "نص كل المميزات", labelEn: "All Features Label", type: "text", value: "كل مميزات", valueEn: "All features of" },
  { key: "popular_label", label: "نص الأكثر طلباً", labelEn: "Popular Badge", type: "text", value: "الأكثر طلباً", valueEn: "Most Popular" },
  { key: "plans_list", label: "قائمة الباقات", labelEn: "Plans List", type: "list", value: serializeSchoolBitPlans(getDefaultSchoolBitPlans(true)), valueEn: serializeSchoolBitPlans(getDefaultSchoolBitPlans(false)) },
  { key: "biotime_title", label: "عنوان جهاز BioTime", labelEn: "BioTime Title", type: "text", value: "جهاز BioTime للبصمة", valueEn: "BioTime Biometric Device" },
  { key: "biotime_price", label: "سعر جهاز BioTime", labelEn: "BioTime Price", type: "text", value: "60 ر.س / شهرياً", valueEn: "60 SAR / month" },
  { key: "biotime_additional", label: "سعر الجهاز الإضافي", labelEn: "Additional Device Price", type: "text", value: "+ 45 ر.س لكل جهاز إضافي", valueEn: "+ 45 SAR per additional device" },
  { key: "sms_title", label: "عنوان باقات الرسائل", labelEn: "SMS Plans Title", type: "text", value: "باقات الرسائل النصية", valueEn: "SMS Plans" },
  { key: "sms_subtitle", label: "عنوان فرعي للرسائل", labelEn: "SMS Plans Subtitle", type: "text", value: "تواصل مع أولياء الأمور بسهولة وفعالية", valueEn: "Communicate with parents easily and effectively" },
  { key: "sms_per_message", label: "نص لكل رسالة", labelEn: "Per Message", type: "text", value: "ر.س/رسالة", valueEn: "SAR/msg" },
  { key: "sms_plans_json", label: "باقات الرسائل", labelEn: "SMS Plans", type: "list", value: JSON.stringify(getDefaultSchoolBitSmsPlans(true)), valueEn: JSON.stringify(getDefaultSchoolBitSmsPlans(false)) },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-24", valueEn: "py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitOutcomesFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "ماذا تكسب المدرسة مع SchoolBit؟", valueEn: "What does the school gain with SchoolBit?" },
  { key: "outcomes_json", label: "قائمة النتائج", labelEn: "Outcomes List", type: "list", value: JSON.stringify([
    { icon: "Clock", title: "وقت أقل", titleEn: "Less Time", desc: "في المهام التشغيلية المتكررة", descEn: "On repetitive operational tasks" },
    { icon: "Eye", title: "وضوح أعلى", titleEn: "More Clarity", desc: "في متابعة الطلاب والكادر", descEn: "In tracking students and staff" },
    { icon: "Zap", title: "استجابة أسرع", titleEn: "Faster Response", desc: "للغياب والمخالفات", descEn: "To absence and violations" },
    { icon: "MessageCircle", title: "تواصل أفضل", titleEn: "Better Communication", desc: "مع أولياء الأمور", descEn: "With parents" },
  ]), valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitCtaFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "ابدأ بإدارة مدرستك بطريقة أكثر ذكاءً", valueEn: "Start Managing Your School Smarter" },
  { key: "description", label: "الوصف", labelEn: "Description", type: "textarea", value: "احصل على عرض توضيحي لمنصة SchoolBit، واكتشف كيف يمكن تحويل العمليات اليومية إلى نظام أكثر سرعة، دقة، وتنظيمًا.", valueEn: "Get a demo of the SchoolBit platform and discover how daily operations can become a faster, more accurate, and organized system." },
  { key: "button_text", label: "نص الزر الرئيسي", labelEn: "Primary Button Text", type: "text", value: "اطلب عرضاً توضيحياً", valueEn: "Request a Demo" },
  { key: "button_url", label: "رابط الزر الرئيسي", labelEn: "Primary Button URL", type: "url", value: "https://app.mobile.net.sa/reg", valueEn: "https://app.mobile.net.sa/reg" },
  { key: "secondary_text", label: "نص الزر الثانوي", labelEn: "Secondary Button Text", type: "text", value: "أو تواصل معنا", valueEn: "Contact Us" },
  { key: "secondary_url", label: "رابط الزر الثانوي", labelEn: "Secondary Button URL", type: "url", value: "/contact", valueEn: "/contact" },
  { key: "disclaimer", label: "نص إخلاء المسؤولية", labelEn: "Disclaimer", type: "text", value: "لا حاجة لبطاقة ائتمانية — تفعيل فوري", valueEn: "No credit card required — Instant activation" },
  { key: "logo_image", label: "صورة الشعار", labelEn: "Logo Image", type: "image", value: "", valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];
const schoolbitFaqFields: SectionField[] = [
  { key: "title", label: "العنوان", labelEn: "Title", type: "text", value: "الأسئلة الشائعة", valueEn: "Frequently Asked Questions" },
  { key: "faq_json", label: "قائمة الأسئلة", labelEn: "FAQ List", type: "list", value: JSON.stringify([
    { q: "هل SchoolBit مناسبة للمدارس الأهلية والحكومية؟", qEn: "Is SchoolBit suitable for private and government schools?", a: "نعم، المنصة قابلة للتخصيص بحسب هيكل المدرسة وصلاحيات المستخدمين.", aEn: "Yes, the platform can be customized according to the school structure and user permissions." },
    { q: "هل تدعم المنصة إرسال رسائل لأولياء الأمور؟", qEn: "Does the platform support sending messages to parents?", a: "نعم، عبر SMS و WhatsApp، مع قوالب ورسائل مجدولة وتلقائية.", aEn: "Yes, via SMS and WhatsApp, with templates, scheduled, and automatic messages." },
    { q: "هل يمكن ربطها بأجهزة البصمة؟", qEn: "Can it be linked to biometric devices?", a: "نعم، تدعم التكامل مع BioTime للحضور والانصراف.", aEn: "Yes, it supports integration with BioTime for attendance and departure." },
    { q: "هل توفر تقارير جاهزة؟", qEn: "Does it provide ready-made reports?", a: "نعم، مع إمكان التصدير والجدولة والإرسال التلقائي.", aEn: "Yes, with the ability to export, schedule, and automatically send them." },
    { q: "هل يوجد تكامل مع نظام نور؟", qEn: "Is there integration with the Noor system?", a: "نعم، المنصة تتضمن مركز تكامل ومزامنة مع نظام نور.", aEn: "Yes, the platform includes an integration and synchronization center with the Noor system." },
  ]), valueEn: "" },
  { key: "spacing", label: "تباعد القسم", labelEn: "Section Spacing", type: "spacing", value: "py-20 md:py-24", valueEn: "py-20 md:py-24" },
  { key: "margin_before", label: "هامش أعلى القسم", labelEn: "Margin Before Section", type: "margin", value: "", valueEn: "" },
  { key: "margin_after", label: "هامش أسفل القسم", labelEn: "Margin After Section", type: "margin", value: "", valueEn: "" },
];

const ensureSchoolBitFields = (pages: PageData[]): PageData[] => {
  const pid = "schoolbit";
  const pp = "/products/schoolbit";
  let result = ensurePageSection(pages, pid, pp, "schoolbit-hero", "SchoolBit الرئيسي", "SchoolBit Hero", schoolbitHeroFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-trust", "شريط الثقة", "Trust Bar", schoolbitTrustFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-problem", "المشكلة والحل", "Problem & Value", schoolbitProblemFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-benefits", "المميزات", "Benefits", schoolbitBenefitsFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-roles", "الأدوار", "Roles", schoolbitRolesFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-modules", "الوحدات", "Modules", schoolbitModulesFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-automation", "الأتمتة", "Automation", schoolbitAutomationFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-integrations", "التكاملات", "Integrations", schoolbitIntegrationsFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-security", "الأمان", "Security", schoolbitSecurityFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-pricing", "الأسعار", "Pricing", schoolbitPricingFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-outcomes", "النتائج", "Outcomes", schoolbitOutcomesFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-cta", "دعوة للإجراء", "Call to Action", schoolbitCtaFields);
  result = ensurePageSection(result, pid, pp, "schoolbit-faq", "الأسئلة الشائعة", "FAQ", schoolbitFaqFields);
  return result;
};

const defaultWhatsAppPricingFields: SectionField[] = [
  {
    key: "title",
    label: "عنوان قسم الباقات",
    labelEn: "Packages Section Title",
    type: "text",
    value: "اختر الباقة المناسبة لنمو أعمالك",
    valueEn: "Choose the right package for your business growth",
  },
  {
    key: "subtitle",
    label: "وصف قسم الباقات",
    labelEn: "Packages Section Subtitle",
    type: "textarea",
    value: "باقات مرنة تناسب جميع أحجام الأعمال من الشركات الناشئة إلى المؤسسات الكبرى",
    valueEn: "Flexible packages suitable for all business sizes from startups to large enterprises",
  },
  {
    key: "plans_note",
    label: "عنوان ملاحظة الباقات",
    labelEn: "Plans Note Title",
    type: "text",
    value: "ملاحظة مهمة",
    valueEn: "Important Note",
  },
  {
    key: "contact_note",
    label: "نص ملاحظة الباقات",
    labelEn: "Plans Note Text",
    type: "textarea",
    value: "الأسعار الموضحة تشمل 3 شرائح لكل باقة. تتوفر خصومات خاصة للشركات الكبرى والجهات الحكومية.",
    valueEn: "The stated prices include 3 tiers for each package. Special discounts are available for large companies and government entities.",
  },
  {
    key: "plans_list",
    label: "تفاصيل الباقات والشرائح",
    labelEn: "Packages and Tiers Details",
    type: "list",
    value: serializeWhatsAppPlans(getDefaultWhatsAppPlans(true)),
    valueEn: serializeWhatsAppPlans(getDefaultWhatsAppPlans(false)),
  },
  {
    key: "api_title",
    label: "عنوان أسعار محادثات API",
    labelEn: "API Pricing Title",
    type: "text",
    value: "أسعار محادثات واتساب API",
    valueEn: "WhatsApp API Conversation Prices",
  },
  {
    key: "api_subtitle",
    label: "وصف أسعار محادثات API",
    labelEn: "API Pricing Subtitle",
    type: "textarea",
    value: "الأسعار التالية محددة من واتساب (Meta) للسوق السعودي",
    valueEn: "The following prices are standardized by WhatsApp (Meta) for the Saudi Market",
  },
  {
    key: "api_prices_list",
    label: "قائمة أسعار محادثات API",
    labelEn: "API Conversation Pricing List",
    type: "list",
    value: serializeWhatsAppConversationPrices(getDefaultWhatsAppConversationPrices(true)),
    valueEn: serializeWhatsAppConversationPrices(getDefaultWhatsAppConversationPrices(false)),
  },
  {
    key: "api_tip_title",
    label: "عنوان النصيحة",
    labelEn: "Tip Title",
    type: "text",
    value: "نصيحة احترافية",
    valueEn: "Pro Tip",
  },
  {
    key: "api_tip_description",
    label: "وصف النصيحة",
    labelEn: "Tip Description",
    type: "textarea",
    value: "محادثات خدمة العملاء مجانية تماماً خلال 24 ساعة من آخر رسالة! استفد من هذه الميزة للرد على استفسارات عملائك دون أي تكلفة إضافية.",
    valueEn: "Customer service conversations are completely free within 24 hours of the last message. Use this to answer customer questions with no extra cost.",
  },
];

const ensureWhatsAppPricingFields = (pages: PageData[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "whatsapp" && page.path !== "/products/whatsapp") {
      return page;
    }
    if (!Array.isArray(page.sections)) {
      return page;
    }

    const pricingSectionIndex = page.sections.findIndex((section) => section.id === "wa-pricing");
    if (pricingSectionIndex === -1) {
      return {
        ...page,
        sections: [
          ...page.sections,
          {
            id: "wa-pricing",
            name: "تسعير واتساب",
            nameEn: "WhatsApp Pricing",
            visible: true,
            fields: defaultWhatsAppPricingFields.map((field) => ({ ...field })),
          },
        ],
      };
    }

    const pricingSection = page.sections[pricingSectionIndex];
    const safeFields = Array.isArray(pricingSection.fields) ? pricingSection.fields : [];
    const existingKeys = new Set(safeFields.map((field) => field.key));
    const missingFields = defaultWhatsAppPricingFields
      .filter((field) => !existingKeys.has(field.key))
      .map((field) => ({ ...field }));

    if (!missingFields.length) {
      return page;
    }

    return {
      ...page,
      sections: page.sections.map((section, index) =>
        index === pricingSectionIndex
          ? { ...section, fields: [...safeFields, ...missingFields] }
          : section
      ),
    };
  });
};

const defaultWhatsAppRequestFormFields: SectionField[] = [
  {
    key: "industry_options",
    label: "خيارات الصناعة (كل خيار في سطر)",
    labelEn: "Industry Options (one per line)",
    type: "textarea",
    value: "تجزئة ومبيعات\nمطاعم وكافيهات\nصحة وعناية صحية\nتعليم\nعقارات\nلوجستيات ونقل\nبنوك ومالية\nحكومي\nسيارات\nتكنولوجيا\nتصنيع\nأخرى",
    valueEn: "Retail & Sales\nRestaurants & Cafes\nHealthcare\nEducation\nReal Estate\nLogistics & Transport\nBanking & Finance\nGovernment\nAutomotive\nTechnology\nManufacturing\nOther",
  },
  {
    key: "employee_count_options",
    label: "خيارات عدد الموظفين (كل خيار في سطر)",
    labelEn: "Employee Count Options (one per line)",
    type: "textarea",
    value: "1-10:1 - 10 موظفين\n11-50:11 - 50 موظف\n51-100:51 - 100 موظف\n101-500:101 - 500 موظف\n500+:أكثر من 500",
    valueEn: "1-10:1 - 10 employees\n11-50:11 - 50 employees\n51-100:51 - 100 employees\n101-500:101 - 500 employees\n500+:500+ employees",
  },
  {
    key: "service_goals",
    label: "أهداف الخدمة (كل هدف في سطر)",
    labelEn: "Service Goals (one per line)",
    type: "textarea",
    value: "customer-support:دعم العملاء\nsales:مبيعات وتسويق\nnotifications:إشعارات آلية\ninternal-communication:تواصل داخلي",
    valueEn: "customer-support:Customer Support\nsales:Sales & Marketing\nnotifications:Automated Notifications\ninternal-communication:Internal Communication",
  },
  {
    key: "notification_email",
    label: "بريد الإشعارات",
    labelEn: "Notification Email",
    type: "text",
    value: "marketing@corbit.sa",
    valueEn: "marketing@corbit.sa",
  },
];

const ensureWhatsAppRequestFormFields = (pages: PageData[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "whatsapp" && page.path !== "/products/whatsapp") {
      return page;
    }
    if (!Array.isArray(page.sections)) {
      return page;
    }

    const formSectionIndex = page.sections.findIndex((section) => section.id === "wa-request-form");
    if (formSectionIndex === -1) {
      return {
        ...page,
        sections: [
          ...page.sections,
          {
            id: "wa-request-form",
            name: "فورم طلب واتساب",
            nameEn: "WhatsApp Request Form",
            visible: true,
            fields: defaultWhatsAppRequestFormFields.map((field) => ({ ...field })),
          },
        ],
      };
    }

    const formSection = page.sections[formSectionIndex];
    const safeFields = Array.isArray(formSection.fields) ? formSection.fields : [];
    const existingKeys = new Set(safeFields.map((field) => field.key));
    const missingFields = defaultWhatsAppRequestFormFields
      .filter((field) => !existingKeys.has(field.key))
      .map((field) => ({ ...field }));

    if (!missingFields.length) {
      return page;
    }

    return {
      ...page,
      sections: page.sections.map((section, index) =>
        index === formSectionIndex
          ? { ...section, fields: [...safeFields, ...missingFields] }
          : section
      ),
    };
  });
};

const waHeroFields: SectionField[] = [
  { key: "slides_json", label: "قائمة السلايدر (JSON)", labelEn: "Slider Slides (JSON)", type: "list", value: "", valueEn: "" },
  { key: "badge", label: "شارة الهيرو", labelEn: "Hero Badge", type: "text", value: "واتساب أعمال API المعتمد", valueEn: "Official WhatsApp Business API" },
  { key: "title", label: "العنوان الرئيسي", labelEn: "Main Title", type: "text", value: "تواصل إحترافي مع عملائك", valueEn: "Professional Communication" },
  { key: "subtitle", label: "العنوان الفرعي", labelEn: "Subtitle", type: "text", value: "عبر واتساب أعمال API", valueEn: "via WhatsApp Business API" },
  { key: "description", label: "الوصف", labelEn: "Description", type: "textarea", value: "كن أقرب لعملائك. نوفر لك ربطاً رسمياً ومعتمداً بخدمة واتساب مع أدوات متقدمة لإدارة المحادثات، الشات بوت، والحملات التسويقية.", valueEn: "Get closer to your customers. We provide you with an official and certified WhatsApp connection with advanced tools for managing conversations, chatbots, and marketing campaigns." },
  { key: "cta_primary_text", label: "نص الزر الرئيسي", labelEn: "Primary CTA Text", type: "text", value: "اطلب الخدمة الآن", valueEn: "Order Service Now" },
  { key: "cta_primary_type", label: "نوع الزر الرئيسي", labelEn: "Primary CTA Type", type: "select", value: "form", valueEn: "form", options: [{ value: "form", label: "فورم طلب الخدمة", labelEn: "Request Form" }, { value: "external", label: "رابط خارجي", labelEn: "External URL" }] },
  { key: "cta_primary_url", label: "رابط الزر الرئيسي (إذا كان خارجي)", labelEn: "Primary CTA URL (if external)", type: "url", value: "https://wapp.mobile.net.sa/billing-subscription", valueEn: "https://wapp.mobile.net.sa/billing-subscription" },
  { key: "cta_secondary_text", label: "نص الزر الثانوي", labelEn: "Secondary CTA Text", type: "text", value: "استعرض الباقات", valueEn: "View Packages" },
  { key: "cta_secondary_type", label: "نوع الزر الثانوي", labelEn: "Secondary CTA Type", type: "select", value: "external", valueEn: "external", options: [{ value: "form", label: "فورم طلب الخدمة", labelEn: "Request Form" }, { value: "external", label: "رابط خارجي", labelEn: "External URL" }] },
  { key: "cta_secondary_url", label: "رابط الزر الثانوي", labelEn: "Secondary CTA URL", type: "url", value: "https://wa.me/966920006900", valueEn: "https://wa.me/966920006900" },
];

const waFeaturesFields: SectionField[] = [
  { key: "title", label: "عنوان قسم المميزات", labelEn: "Features Section Title", type: "text", value: "واتساب أعمال API", valueEn: "WhatsApp Business API" },
  { key: "subtitle", label: "وصف قسم المميزات", labelEn: "Features Section Subtitle", type: "textarea", value: "كل ما تحتاجه لتحويل واتساب إلى قناة تواصل احترافية مع عملائك", valueEn: "Everything you need to turn WhatsApp into a professional communication channel with your customers" },
  { key: "solutions_json", label: "قائمة الحلول (JSON)", labelEn: "Solutions List (JSON)", type: "list", value: JSON.stringify([
    { iconName: "Users", titleAr: "رقم موحد للفريق", titleEn: "Unified Team Number", descAr: "لا مزيد من تشتت المحادثات، رقم واحد يديره فريق كامل بكفاءة عالية", descEn: "No more scattered conversations, one number managed efficiently by the whole team" },
    { iconName: "Shield", titleAr: "إدارة الصلاحيات", titleEn: "Permissions Management", descAr: "تحويل المحادثات بين المبيعات والدعم الفني بسلاسة واحترافية", descEn: "Seamlessly transfer conversations between sales and technical support" },
    { iconName: "Bot", titleAr: "الردود الآلية (Chatbot)", titleEn: "Automated Replies (Chatbot)", descAr: "خدمة عملاء 24/7 دون تدخل بشري، أجب على الأسئلة الشائعة تلقائياً", descEn: "24/7 customer service without human intervention, automatically answer FAQs" },
    { iconName: "MessageCirclePlus", titleAr: "صندوق وارد مشترك", titleEn: "Shared Inbox", descAr: "فلترة الرسائل (مقروءة، غير مقروءة، لم يتم الرد) في واجهة واحدة", descEn: "Filter messages (read, unread, unanswered) in a single interface" },
    { iconName: "Clock", titleAr: "جدولة الرسائل", titleEn: "Message Scheduling", descAr: "حدد وقت إرسال رسائلك مسبقاً للوصول في الوقت المثالي", descEn: "Pre-schedule your messages to be sent at the optimal time" },
    { iconName: "BarChart3", titleAr: "تقارير تفصيلية", titleEn: "Detailed Reports", descAr: "تتبع أداء الحملات ومعدلات القراءة والاستجابة لحظياً", descEn: "Track campaign performance, read rates, and instant responses" },
  ]), valueEn: "" },
  { key: "solutions_title", label: "عنوان الحلول المتقدمة", labelEn: "Solutions Title", type: "text", value: "أدوات احترافية لإدارة محادثاتك", valueEn: "Professional Tools to Manage Conversations" },
  { key: "campaigns_json", label: "قائمة الحملات (JSON)", labelEn: "Campaigns List (JSON)", type: "list", value: JSON.stringify([
    { iconName: "Target", titleAr: "استهداف دقيق", titleEn: "Precise Targeting", descAr: "حدد جمهورك بناءً على الموقع، الاهتمامات، والسلوك", descEn: "Target your audience based on location, interests, and behavior" },
    { iconName: "Clock", titleAr: "جدولة ذكية", titleEn: "Smart Scheduling", descAr: "أرسل في الوقت الأمثل لزيادة معدلات التفاعل", descEn: "Send at the optimal time to increase interaction rates" },
    { iconName: "Sparkles", titleAr: "قوالب جاهزة", titleEn: "Ready Templates", descAr: "رسائل احترافية مع أزرار تفاعلية وصور ومقاطع", descEn: "Professional messages with interactive buttons, images, and videos" },
    { iconName: "TrendingUp", titleAr: "تحليل الأداء", titleEn: "Performance Analysis", descAr: "تقارير شاملة عن معدلات الفتح والنقر والتحويل", descEn: "Comprehensive reports on open rates, clicks, and conversions" },
  ]), valueEn: "" },
  { key: "campaigns_title", label: "عنوان حملات التسويق", labelEn: "Campaigns Title", type: "text", value: "أطلق حملاتك التسويقية بذكاء", valueEn: "Launch Your Campaigns Smartly" },
  { key: "api_pricing_title", label: "عنوان أسعار API", labelEn: "API Pricing Title", type: "text", value: "أسعار محادثات واتساب API", valueEn: "WhatsApp API Conversation Prices" },
];

const waWhyFields: SectionField[] = [
  { key: "badge", label: "شارة القسم", labelEn: "Section Badge", type: "text", value: "المميزات الرئيسية", valueEn: "Key Features" },
  { key: "title", label: "عنوان القسم", labelEn: "Section Title", type: "text", value: "لماذا واتساب الأعمال؟", valueEn: "Why WhatsApp Business?" },
  { key: "subtitle", label: "وصف القسم", labelEn: "Section Subtitle", type: "textarea", value: "المنصة الأكثر ثقة وانتشاراً للتواصل مع عملائك في المملكة", valueEn: "The most trusted and widespread platform for communicating with your customers in the Kingdom" },
  { key: "features_json", label: "قائمة المميزات (JSON)", labelEn: "Features List (JSON)", type: "list", value: JSON.stringify([
    { iconName: "Globe", titleAr: "المنصة رقم 1 في المملكة", titleEn: "The #1 Platform in the Kingdom", descAr: "الأكثر انتشاراً واستخداماً في السعودية", descEn: "The most widespread and used in Saudi Arabia" },
    { iconName: "CheckCircle2", titleAr: "معدل فتح 98%", titleEn: "98% Open Rate", descAr: "يتم فتح وقراءة معظم الرسائل فوراً", descEn: "Most messages are opened and read immediately" },
    { iconName: "Shield", titleAr: "آمن وموثوق", titleEn: "Secure & Reliable", descAr: "تشفير كامل من طرف لطرف للبيانات", descEn: "End-to-end encryption for all data" },
    { iconName: "Smartphone", titleAr: "سهل الاستخدام", titleEn: "Easy to Use", descAr: "تطبيق مألوف للجميع بدون تعقيد", descEn: "Familiar app for everyone without complexity" },
  ]), valueEn: "" },
];

const waSolutionsFields: SectionField[] = [
  { key: "badge", label: "شارة القسم", labelEn: "Section Badge", type: "text", value: "الحلول المتقدمة", valueEn: "Advanced Solutions" },
  { key: "solutions_json", label: "قائمة الحلول (JSON)", labelEn: "Solutions List (JSON)", type: "list", value: "", valueEn: "" },
];

const waMarketingFields: SectionField[] = [
  { key: "badge", label: "شارة القسم", labelEn: "Section Badge", type: "text", value: "التسويق الذكي", valueEn: "Smart Marketing" },
  { key: "subtitle", label: "وصف القسم", labelEn: "Section Subtitle", type: "textarea", value: "استهدف عملاءك بدقة، حدد جدولة زمنية للحملات، واستخدم قوالب رسائل جاهزة مع أزرار تفاعلية لزيادة معدلات التحويل.", valueEn: "Target your customers accurately, schedule campaigns, and use ready-made message templates with interactive buttons to increase conversion rates." },
  { key: "campaigns_json", label: "قائمة الحملات (JSON)", labelEn: "Campaigns List (JSON)", type: "list", value: JSON.stringify([
    { iconName: "Target", titleAr: "استهداف دقيق", titleEn: "Precise Targeting", descAr: "حدد جمهورك بناءً على الموقع، الاهتمامات، والسلوك", descEn: "Target your audience based on location, interests, and behavior" },
    { iconName: "Clock", titleAr: "جدولة ذكية", titleEn: "Smart Scheduling", descAr: "أرسل في الوقت الأمثل لزيادة معدلات التفاعل", descEn: "Send at the optimal time to increase interaction rates" },
    { iconName: "Sparkles", titleAr: "قوالب جاهزة", titleEn: "Ready Templates", descAr: "رسائل احترافية مع أزرار تفاعلية وصور ومقاطع", descEn: "Professional messages with interactive buttons, images, and videos" },
    { iconName: "TrendingUp", titleAr: "تحليل الأداء", titleEn: "Performance Analysis", descAr: "تقارير شاملة عن معدلات الفتح والنقر والتحويل", descEn: "Comprehensive reports on open rates, clicks, and conversions" },
  ]), valueEn: "" },
];

const waGreenTickFields: SectionField[] = [
  { key: "title", label: "عنوان الشارة الخضراء", labelEn: "Green Tick Title", type: "text", value: "احصل على الشارة الخضراء (Green Tick)", valueEn: "Get the Green Tick" },
  { key: "subtitle", label: "وصف الشارة الخضراء", labelEn: "Green Tick Subtitle", type: "text", value: "عزز ثقة عملائك وتميز عن المنافسين بحساب موثوق رسمياً من واتساب", valueEn: "Boost your customers' trust and stand out from competitors with an officially verified WhatsApp account" },
  { key: "comparison_json", label: "جدول مقارنة الشارة", labelEn: "Comparison Table (JSON)", type: "list", value: JSON.stringify([
    { featureAr: "ظهور اسم الشركة", featureEn: "Company Name Visibility", unverified: false, business: true, verified: true },
    { featureAr: "الشارة الخضراء الرسمية", featureEn: "Official Green Badge", unverified: false, business: false, verified: true },
    { featureAr: "ثقة أعلى من العملاء", featureEn: "Higher Customer Trust", unverified: false, business: true, verified: true },
    { featureAr: "رسائل غير محدودة", featureEn: "Unlimited Messages", unverified: false, business: false, verified: true },
  ]), valueEn: "" },
  { key: "competitive_json", label: "مميزات تنافسية", labelEn: "Competitive Edge (JSON)", type: "list", value: JSON.stringify([
    { iconName: "BadgeCheck", titleAr: "ظهور اسم الشركة", titleEn: "Company Name Visibility", descAr: "يظهر اسم شركتك بجانب رقم الهاتف في واتساب", descEn: "Your company name appears next to the phone number in WhatsApp" },
    { iconName: "BadgeCheck", titleAr: "الشارة الخضراء الرسمية", titleEn: "Official Green Badge", descAr: "احصل على الشارة الخضراء التي تمنح ثقة عملائك", descEn: "Get the official green badge that gives your customers confidence" },
    { iconName: "CheckCircle2", titleAr: "ثقة أعلى من العملاء", titleEn: "Higher Customer Trust", descAr: "العملاء يثقون أكثر بالحسابات المعتمدة والموثقة", descEn: "Customers trust verified and authenticated accounts more" },
    { iconName: "Send", titleAr: "رسائل غير محدودة", titleEn: "Unlimited Messages", descAr: "أرسل رسائل غير محدودة لعملائك بدون قيود", descEn: "Send unlimited messages to your customers without restrictions" },
  ]), valueEn: "" },
];

const waFooterCtaFields: SectionField[] = [
  { key: "title", label: "عنوان CTA النهائي", labelEn: "Final CTA Title", type: "text", value: "جاهز لنقل خدمة عملائك لمستوى آخر؟", valueEn: "Ready to take your customer service to the next level?" },
  { key: "subtitle", label: "وصف CTA النهائي", labelEn: "Final CTA Subtitle", type: "textarea", value: "فريقنا جاهز لمساعدتك في الحصول على الشارة الخضراء وربط الـ API بكل سهولة واحترافية", valueEn: "Our team is ready to help you get the Green Badge and integrate the API easily and professionally" },
  { key: "cta_primary", label: "نص الزر الرئيسي", labelEn: "Primary CTA Text", type: "text", value: "اطلب الخدمة الآن", valueEn: "Order Service Now" },
  { key: "cta_secondary", label: "نص الزر الثانوي", labelEn: "Secondary CTA Text", type: "text", value: "تحدث مع المبيعات", valueEn: "Talk to Sales" },
];

const waIntegrationsFields: SectionField[] = [
  { key: "title", label: "عنوان قسم التكاملات", labelEn: "Integrations Section Title", type: "text", value: "نتكامل مع أدواتك المفضلة", valueEn: "Seamless Integrations" },
  { key: "integrations_json", label: "قائمة التكاملات", labelEn: "Integrations List", type: "list", value: JSON.stringify([
    { nameAr: "سلة", nameEn: "Salla", icon: "/integrations/salla.svg", link: "https://salla.sa" },
    { nameAr: "دفترة", nameEn: "Daftra", icon: "/integrations/daftra.svg", link: "https://daftra.com" },
    { nameAr: "نظام نور", nameEn: "Noor System", icon: "/integrations/noor.svg", link: "https://noor.moe.gov.sa" },
    { nameAr: "إتقان", nameEn: "Itqan", icon: "/integrations/itqan.svg", link: "https://itqanapps.com" },
    { nameAr: "حضوري", nameEn: "Haddari", icon: "/integrations/haddari.svg", link: "https://haddari.com" },
  ]), valueEn: "" },
];

const waStatsFields: SectionField[] = [
  { key: "stats_json", label: "قائمة الإحصائيات", labelEn: "Stats List", type: "list", value: JSON.stringify([
    { suffix: "%+", end: 98, labelAr: "نسبة فتح الرسائل على واتساب", labelEn: "WhatsApp message open rate" },
    { suffix: "x", end: 5, labelAr: "أعلى من البريد الإلكتروني", labelEn: "Higher than email" },
    { suffix: "+", end: 2, labelAr: "مليار مستخدم واتساب عالمياً", labelEn: "Billion WhatsApp users globally" },
    { suffix: "%+", end: 40, labelAr: "زيادة في المبيعات عبر واتساب", labelEn: "Increase in sales via WhatsApp" },
  ]), valueEn: "" },
];

const waPartnersFields: SectionField[] = [
  { key: "title", label: "عنوان شركاء النجاح", labelEn: "Partners Title", type: "text", value: "شركاء النجاح", valueEn: "Trusted Partners" },
  { key: "subtitle", label: "وصف شركاء النجاح", labelEn: "Partners Subtitle", type: "text", value: "يثق بنا أكثر من 20,000 جهة حكومية وخاصة في المملكة", valueEn: "Trusted by over 20,000 government and private entities in the Kingdom" },
  { key: "partners_json", label: "قائمة شركاء النجاح (صور)", labelEn: "Partners Logos (JSON)", type: "list", value: JSON.stringify([
    { image: "/TrustedLogos/حرس الحدود.png" },
    { image: "/TrustedLogos/إمارة منطقة الرياض.png" },
    { image: "/TrustedLogos/مستشفى الملك فهد بجدة.png" },
    { image: "/TrustedLogos/جامعة الملك سعود.png" },
    { image: "/TrustedLogos/وزارة التعليم.png" },
  ]), valueEn: "" },
];

const waPersonaFields: SectionField[] = [
  { key: "title", label: "عنوان مسارات المستخدم", labelEn: "Persona Title", type: "text", value: "اختر مسارك", valueEn: "Choose Your Path" },
  { key: "merchant_title_ar", label: "عنوان المسار التجاري (عربي)", labelEn: "Merchant Path Title (AR)", type: "text", value: "للمتاجر والمسوقين", valueEn: "For Merchants & Marketers" },
  { key: "merchant_title_en", label: "عنوان المسار التجاري (إنجليزي)", labelEn: "Merchant Path Title (EN)", type: "text", value: "للمتاجر والمسوقين" },
  { key: "merchant_steps_json", label: "خطوات المسار التجاري", labelEn: "Merchant Steps", type: "list", value: JSON.stringify([
    { stepAr: "أنشئ قالب واتساب", stepEn: "Create WhatsApp Template", descAr: "صمّم قالب رسالتك المعتمدة من واتساب بنقرة واحدة", descEn: "Design your WhatsApp-approved message template with one click" },
    { stepAr: "أدر محادثاتك", stepEn: "Manage Conversations", descAr: "رد على عملائك من لوحة تحكم مركزية مع ردود سريعة", descEn: "Reply to customers from a central dashboard with quick replies" },
    { stepAr: "حلّل أداءك", stepEn: "Analyze Performance", descAr: "تتبع نسب الفتح والنقر والتحويل بتقارير واتساب التفصيلية", descEn: "Track open, click & conversion rates with detailed WhatsApp reports" },
  ]), valueEn: "" },
  { key: "developer_title_ar", label: "عنوان مسار المطورين (عربي)", labelEn: "Developer Path Title (AR)", type: "text", value: "للمطورين والتقنيين", valueEn: "For Developers & Engineers" },
  { key: "developer_title_en", label: "عنوان مسار المطورين (إنجليزي)", labelEn: "Developer Path Title (EN)", type: "text", value: "للمطورين والتقنيين" },
  { key: "developer_tools_json", label: "أدوات المطورين", labelEn: "Developer Tools", type: "list", value: JSON.stringify([
    { icon: "🔗", titleAr: "REST API", titleEn: "REST API", descAr: "واجهة برمجة تطبيقات شاملة للتكامل مع أنظمتك", descEn: "Comprehensive API for integrating with your systems" },
    { icon: "⚡", titleAr: "Webhooks", titleEn: "Webhooks", descAr: "إشعارات فورية للأحداث في الوقت الحقيقي", descEn: "Real-time event notifications via webhooks" },
    { icon: "🧪", titleAr: "Sandbox", titleEn: "Sandbox", descAr: "بيئة اختبار كاملة قبل النشر على الإنتاج", descEn: "Full sandbox environment before production deployment" },
  ]), valueEn: "" },
];

const waChatbotFields: SectionField[] = [
  { key: "badge_ar", label: "شارة البوت (عربي)", labelEn: "Bot Badge (AR)", type: "text", value: "واتساب أعمال API المعتمد", valueEn: "Official WhatsApp Business API" },
  { key: "badge_en", label: "شارة البوت (إنجليزي)", labelEn: "Bot Badge (EN)", type: "text", value: "واتساب أعمال API المعتمد" },
  { key: "hero_title_ar", label: "عنوان الهيرو (عربي)", labelEn: "Hero Title (AR)", type: "text", value: "تواصل احترافي مع عملائك عبر واتساب أعمال", valueEn: "Professional Communication via WhatsApp Business" },
  { key: "hero_title_en", label: "عنوان الهيرو (إنجليزي)", labelEn: "Hero Title (EN)", type: "text", value: "تواصل احترافي مع عملائك عبر واتساب أعمال" },
  { key: "hero_subtitle_ar", label: "وصف الهيرو (عربي)", labelEn: "Hero Subtitle (AR)", type: "textarea", value: "كن أقرب لعملائك على واتساب — رسائل تسويقية معتمدة، ردود آلية ذكية، وإدارة محادثات مركزية من لوحة تحكم واحدة", valueEn: "Get closer to your customers on WhatsApp — approved marketing messages, smart auto-replies, and centralized conversation management" },
  { key: "hero_subtitle_en", label: "وصف الهيرو (إنجليزي)", labelEn: "Hero Subtitle (EN)", type: "textarea", value: "كن أقرب لعملائك على واتساب — رسائل تسويقية معتمدة، ردود آلية ذكية، وإدارة محادثات مركزية من لوحة تحكم واحدة" },
  { key: "cta_primary_text_ar", label: "نص الزر الرئيسي (عربي)", labelEn: "Primary CTA (AR)", type: "text", value: "ابدأ الآن — تجربة مجانية", valueEn: "Start Now — Free Trial" },
  { key: "cta_primary_text_en", label: "نص الزر الرئيسي (إنجليزي)", labelEn: "Primary CTA (EN)", type: "text", value: "ابدأ الآن — تجربة مجانية" },
  { key: "cta_secondary_text_ar", label: "نص الزر الثانوي (عربي)", labelEn: "Secondary CTA (AR)", type: "text", value: "تحدث مع المبيعات", valueEn: "Talk to Sales" },
  { key: "cta_secondary_text_en", label: "نص الزر الثانوي (إنجليزي)", labelEn: "Secondary CTA (EN)", type: "text", value: "تحدث مع المبيعات" },
  { key: "social_proof_ar", label: "نص الإثبات الاجتماعي (عربي)", labelEn: "Social Proof (AR)", type: "text", value: "+20,000 جهة تستخدم واتساب أعمال معنا", valueEn: "+20,000 entities use WhatsApp Business with us" },
  { key: "social_proof_en", label: "نص الإثبات الاجتماعي (إنجليزي)", labelEn: "Social Proof (EN)", type: "text", value: "+20,000 جهة تستخدم واتساب أعمال معنا" },
];

const ensureWhatsAppSection = (pages: PageData[], sectionId: string, sectionName: string, sectionNameEn: string, fields: SectionField[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "whatsapp" && page.path !== "/products/whatsapp") return page;
    if (!Array.isArray(page.sections)) return page;

    const idx = page.sections.findIndex((s) => s.id === sectionId);
    if (idx === -1) {
      return {
        ...page,
        sections: [...page.sections, { id: sectionId, name: sectionName, nameEn: sectionNameEn, visible: true, fields: fields.map((f) => ({ ...f })) }],
      };
    }

    const section = page.sections[idx];
    const safeFields = Array.isArray(section.fields) ? section.fields : [];
    const existingKeys = new Set(safeFields.map((f) => f.key));
    const missing = fields.filter((f) => !existingKeys.has(f.key)).map((f) => ({ ...f }));
    if (!missing.length) return page;

    return {
      ...page,
      sections: page.sections.map((s, i) => (i === idx ? { ...s, fields: [...safeFields, ...missing] } : s)),
    };
  });
};

const ensureWhatsAppFields = (pages: PageData[]): PageData[] => {
  let result = ensureWhatsAppSection(pages, "wa-hero", "هيرو واتساب", "WhatsApp Hero", waHeroFields);
  result = ensureWhatsAppSection(result, "wa-features", "مميزات واتساب", "WhatsApp Features", waFeaturesFields);
  result = ensureWhatsAppSection(result, "wa-why", "لماذا واتساب", "Why WhatsApp", waWhyFields);
  result = ensureWhatsAppSection(result, "wa-solutions", "حلول واتساب", "WhatsApp Solutions", waSolutionsFields);
  result = ensureWhatsAppSection(result, "wa-marketing", "تسويق واتساب", "WhatsApp Marketing", waMarketingFields);
  result = ensureWhatsAppSection(result, "wa-green-tick", "الشارة الخضراء", "Green Tick", waGreenTickFields);
  result = ensureWhatsAppSection(result, "wa-footer-cta", "CTA نهائي واتساب", "WhatsApp Footer CTA", waFooterCtaFields);
  result = ensureWhatsAppSection(result, "wa-integrations", "التكاملات", "Integrations", waIntegrationsFields);
  result = ensureWhatsAppSection(result, "wa-stats", "الإحصائيات", "Stats", waStatsFields);
  result = ensureWhatsAppSection(result, "wa-partners", "شركاء النجاح", "Partners", waPartnersFields);
  result = ensureWhatsAppSection(result, "wa-persona", "مسارات المستخدم", "Persona Paths", waPersonaFields);
  result = ensureWhatsAppSection(result, "wa-chatbot", "بوت المحادثة والهيرو", "Chatbot & Hero", waChatbotFields);
  result = ensureWhatsAppPricingFields(result);
  result = ensureWhatsAppRequestFormFields(result);
  return result;
};

const otHeroFields: SectionField[] = [
  { key: "slides_json", label: "قائمة السلايدر (JSON)", labelEn: "Slider Slides (JSON)", type: "list", value: "", valueEn: "" },
  { key: "badge", label: "شارة الهيرو", labelEn: "Hero Badge", type: "text", value: "نظام الموارد البشرية السحابي المتكامل", valueEn: "Integrated Cloud HR System" },
  { key: "title", label: "العنوان الرئيسي", labelEn: "Main Title", type: "text", value: "مركز قيادة متكامل", valueEn: "Comprehensive Command Center" },
  { key: "description", label: "الوصف", labelEn: "Description", type: "textarea", value: "من التوظيف إلى التقاعد، O-Time يمنحك السيطرة الكاملة على الرواتب، الحضور، الأداء، والتوظيف في منصة سحابية واحدة آمنة وقابلة للتوسع.", valueEn: "From recruitment to retirement, O-Time gives you full control over payroll, attendance, performance, and recruitment in a single, secure, and scalable cloud platform." },
  { key: "highlight", label: "النص المميز", labelEn: "Highlight Text", type: "text", value: "لإدارة الموارد البشرية", valueEn: "For Human Resources Management" },
  { key: "cta_primary_text", label: "نص الزر الرئيسي", labelEn: "Primary CTA Text", type: "text", value: "احجز ديمو الآن", valueEn: "Book a Demo Now" },
  { key: "cta_primary_type", label: "نوع الزر الرئيسي", labelEn: "Primary CTA Type", type: "select", value: "external", valueEn: "external", options: [{ value: "form", label: "فورم طلب الخدمة", labelEn: "Request Form" }, { value: "external", label: "رابط خارجي", labelEn: "External URL" }] },
  { key: "cta_primary_url", label: "رابط الزر الرئيسي", labelEn: "Primary CTA URL", type: "url", value: "https://wa.me/966920006900", valueEn: "https://wa.me/966920006900" },
  { key: "cta_secondary_text", label: "نص الزر الثانوي", labelEn: "Secondary CTA Text", type: "text", value: "جرب النظام مجاناً", valueEn: "Try the System for Free" },
  { key: "cta_secondary_type", label: "نوع الزر الثانوي", labelEn: "Secondary CTA Type", type: "select", value: "external", valueEn: "external", options: [{ value: "form", label: "فورم طلب الخدمة", labelEn: "Request Form" }, { value: "external", label: "رابط خارجي", labelEn: "External URL" }] },
  { key: "cta_secondary_url", label: "رابط الزر الثانوي", labelEn: "Secondary CTA URL", type: "url", value: "https://otime.mobile.sa/register", valueEn: "https://otime.mobile.sa/register" },
];

const otFeaturesFields: SectionField[] = [
  { key: "title", label: "عنوان قسم القيمة", labelEn: "Value Section Title", type: "text", value: "لماذا O-Time؟", valueEn: "Why O-Time?" },
  { key: "subtitle", label: "وصف قسم القيمة", labelEn: "Value Section Subtitle", type: "textarea", value: "منصة موحدة تجمع كل ما تحتاجه لإدارة الموارد البشرية بكفاءة عالية.", valueEn: "A unified platform covering everything you need to manage HR efficiently." },
  { key: "value_props_json", label: "قيم O-Time (JSON)", labelEn: "Value Props (JSON)", type: "list", value: "", valueEn: "" },
  { key: "modules_json", label: "وحدات النظام (JSON)", labelEn: "System Modules (JSON)", type: "list", value: "", valueEn: "" },
  { key: "ux_features_json", label: "مميزات تجربة المستخدم (JSON)", labelEn: "UX Features (JSON)", type: "list", value: "", valueEn: "" },
  { key: "screenshots_json", label: "لقطات النظام (JSON)", labelEn: "System Screenshots (JSON)", type: "list", value: "", valueEn: "" },
  { key: "value_title", label: "عنوان القيمة الاستراتيجية", labelEn: "Strategic Value Title", type: "text", value: "القيمة الاستراتيجية التي تحتاجها", valueEn: "The Strategic Value You Need" },
  { key: "modules_title", label: "عنوان الوحدات", labelEn: "Modules Title", type: "text", value: "وحدات متكاملة لإدارة الموارد البشرية", valueEn: "Integrated HR Management Modules" },
  { key: "modules_subtitle", label: "وصف الوحدات", labelEn: "Modules Subtitle", type: "textarea", value: "من التوظيف إلى التقاعد - إدارة دورة حياة الموظف الكاملة في منصة واحدة متكاملة", valueEn: "From recruitment to retirement - Manage the full employee lifecycle in a single integrated platform" },
  { key: "ux_title", label: "عنوان تجربة المستخدم", labelEn: "UX Title", type: "text", value: "تجربة مستخدم لا تضاهى", valueEn: "Unmatched User Experience" },
  { key: "ux_subtitle", label: "وصف تجربة المستخدم", labelEn: "UX Subtitle", type: "textarea", value: "واجهة بديهية مصممة بعناية لتوفير أفضل تجربة لجميع المستخدمين", valueEn: "An intuitive interface carefully designed to provide the best experience for all users" },
  { key: "screenshots_title", label: "عنوان لقطات النظام", labelEn: "Screenshots Title", type: "text", value: "شاهد O-Time في العمل", valueEn: "See O-Time in Action" },
  { key: "tech_title", label: "عنوان المواصفات التقنية", labelEn: "Tech Title", type: "text", value: "بنية تحتية قوية وآمنة", valueEn: "Robust & Secure Infrastructure" },
  { key: "tech_subtitle", label: "وصف المواصفات التقنية", labelEn: "Tech Subtitle", type: "text", value: "تقنية حديثة مع أعلى معايير الأمان والتوافق", valueEn: "Modern technology with the highest standards of security and compatibility" },
  { key: "local_title", label: "عنوان التوافق المحلي", labelEn: "Local Compliance Title", type: "text", value: "متوافق 100% مع الأنظمة المحلية", valueEn: "100% Compatible with Local Regulations" },
  { key: "local_subtitle", label: "وصف التوافق المحلي", labelEn: "Local Compliance Subtitle", type: "text", value: "دعم كامل للأنظمة واللوائح السعودية مع تحديثات مستمرة", valueEn: "Full support for Saudi regulations and policies with continuous updates" },
  { key: "footer_cta_title", label: "عنوان CTA النهائي", labelEn: "Footer CTA Title", type: "text", value: "هل أنت مستعد لنقل إدارة الموارد البشرية إلى مستوى جديد؟", valueEn: "Are you ready to take your HR management to a new level?" },
  { key: "footer_cta_subtitle", label: "وصف CTA النهائي", labelEn: "Footer CTA Subtitle", type: "textarea", value: "انضم إلى الشركات التي تعتمد على O-Time لتحقيق الكفاءة والامتثال", valueEn: "Join the companies relying on O-Time to achieve efficiency and compliance" },
];

const ggHeroFields: SectionField[] = [
  { key: "slides_json", label: "قائمة السلايدر (JSON)", labelEn: "Slider Slides (JSON)", type: "list", value: "", valueEn: "" },
  { key: "badge", label: "شارة الهيرو", labelEn: "Hero Badge", type: "text", value: "بوابة حكومية آمنة", valueEn: "Secure Government Gateway" },
  { key: "title", label: "العنوان الرئيسي", labelEn: "Main Title", type: "text", value: "بوابتك الآمنة للتواصل الحكومي", valueEn: "Your Secure Gateway for Government Communications" },
  { key: "subtitle", label: "العنوان الفرعي المميز", labelEn: "Highlight Subtitle", type: "text", value: "بموثوقية عالية", valueEn: "with High Reliability" },
  { key: "description", label: "الوصف", labelEn: "Description", type: "textarea", value: "حل مراسلة مؤسسي متكامل يوفر اتصالاً آمناً وموثوقاً للجهات الحكومية مع ضمان الامتثال والشفافية", valueEn: "An integrated enterprise messaging solution providing secure and reliable communication for government entities with compliance and transparency" },
];

const ggAboutFields: SectionField[] = [
  { key: "title", label: "عنوان من نحن", labelEn: "About Title", type: "text", value: "ما هي Gov Gate؟", valueEn: "What is Gov Gate?" },
  { key: "description", label: "وصف من نحن", labelEn: "About Description", type: "textarea", value: "منصة مراسلة مؤسسية متكاملة مصممة خصيصاً لتلبية احتياجات القطاع الحكومي، توفر بنية تحتية آمنة وموثوقة للتواصل الداخلي والخارجي مع الامتثال الكامل للأنظمة واللوائح", valueEn: "An integrated enterprise messaging platform designed specifically for government sector needs, providing secure and reliable infrastructure for internal and external communication with full regulatory compliance" },
];

const ggFeaturesFields: SectionField[] = [
  { key: "features_json", label: "قائمة المميزات (JSON)", labelEn: "Features List (JSON)", type: "list", value: "", valueEn: "" },
  { key: "feature1_title", label: "ميزة 1 - العنوان (قديم)", labelEn: "Feature 1 Title", type: "text", value: "استقلالية تامة", valueEn: "Full Independence" },
  { key: "feature1_desc", label: "ميزة 1 - الوصف (قديم)", labelEn: "Feature 1 Description", type: "textarea", value: "بنية تحتية خاصة لا تعتمد على أطراف ثالثة، مما يضمن سيطرة كاملة على بياناتك وعملياتك", valueEn: "Private infrastructure independent of third parties, ensuring full control over your data and operations" },
  { key: "feature2_title", label: "ميزة 2 - العنوان (قديم)", labelEn: "Feature 2 Title", type: "text", value: "أمان متقدم", valueEn: "Advanced Security" },
  { key: "feature2_desc", label: "ميزة 2 - الوصف (قديم)", labelEn: "Feature 2 Description", type: "textarea", value: "تشفير شامل من طرف لطرف مع صلاحيات دقيقة ومراقبة مستمرة لجميع العمليات", valueEn: "Comprehensive end-to-end encryption with granular permissions and continuous monitoring of all operations" },
  { key: "feature3_title", label: "ميزة 3 - العنوان (قديم)", labelEn: "Feature 3 Title", type: "text", value: "موثوقية عالية", valueEn: "High Reliability" },
  { key: "feature3_desc", label: "ميزة 3 - الوصف (قديم)", labelEn: "Feature 3 Description", type: "textarea", value: "ضمان وقت تشغيل 99.9% مع نسخ احتياطي تلقائي واسترداد فوري للخدمات", valueEn: "99.9% uptime guarantee with automatic backups and instant service recovery" },
];

const ggCtaFields: SectionField[] = [
  { key: "cta_text", label: "نص الزر", labelEn: "CTA Text", type: "text", value: "تواصل معنا الآن", valueEn: "Contact Us Now" },
  { key: "cta_type", label: "نوع الزر", labelEn: "CTA Type", type: "select", value: "external", valueEn: "external", options: [{ value: "form", label: "فورم طلب الخدمة", labelEn: "Request Form" }, { value: "external", label: "رابط خارجي", labelEn: "External URL" }] },
  { key: "cta_url", label: "رابط الزر (إذا كان خارجي)", labelEn: "CTA URL (if external)", type: "url", value: "https://wa.me/966920006900", valueEn: "https://wa.me/966920006900" },
  { key: "final_cta_title", label: "عنوان CTA النهائي", labelEn: "Final CTA Title", type: "text", value: "جاهز لتأمين اتصالاتكم الحكومية؟", valueEn: "Ready to Secure Your Government Communications?" },
  { key: "final_cta_description", label: "وصف CTA النهائي", labelEn: "Final CTA Description", type: "textarea", value: "انضم إلى الجهات الحكومية التي تثق في Gov Gate لتوفير اتصالات آمنة وموثوقة", valueEn: "Join government entities that trust Gov Gate for secure and reliable communications" },
];

const ensurePageSection = (pages: PageData[], pageId: string, pagePath: string, sectionId: string, sectionName: string, sectionNameEn: string, fields: SectionField[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== pageId && page.path !== pagePath) return page;
    if (!Array.isArray(page.sections)) return page;
    const idx = page.sections.findIndex((s) => s.id === sectionId);
    if (idx === -1) {
      return { ...page, sections: [...page.sections, { id: sectionId, name: sectionName, nameEn: sectionNameEn, visible: true, fields: fields.map((f) => ({ ...f })) }] };
    }
    const section = page.sections[idx];
    const safeFields = Array.isArray(section.fields) ? section.fields : [];
    const existingKeys = new Set(safeFields.map((f) => f.key));
    const missing = fields.filter((f) => !existingKeys.has(f.key)).map((f) => ({ ...f }));
    if (!missing.length) return page;
    return { ...page, sections: page.sections.map((s, i) => (i === idx ? { ...s, fields: [...safeFields, ...missing] } : s)) };
  });
};

const ensureOTimeFields = (pages: PageData[]): PageData[] => {
  let result = ensurePageSection(pages, "otime", "/products/o-time", "ot-hero", "هيرو O-Time", "O-Time Hero", otHeroFields);
  result = ensurePageSection(result, "otime", "/products/o-time", "ot-features", "مميزات O-Time", "O-Time Features", otFeaturesFields);
  return result;
};

const ensureGovGateFields = (pages: PageData[]): PageData[] => {
  let result = ensurePageSection(pages, "govgate", "/products/gov-gate", "gg-hero", "هيرو Gov Gate", "Gov Gate Hero", ggHeroFields);
  result = ensurePageSection(result, "govgate", "/products/gov-gate", "gg-about", "عن Gov Gate", "About Gov Gate", ggAboutFields);
  result = ensurePageSection(result, "govgate", "/products/gov-gate", "gg-features", "مميزات Gov Gate", "Gov Gate Features", ggFeaturesFields);
  result = ensurePageSection(result, "govgate", "/products/gov-gate", "gg-cta", "CTA Gov Gate", "Gov Gate CTA", ggCtaFields);
  return result;
};

const defaultContactSections: PageSection[] = [
  {
    id: "contact-hero",
    name: "مقدمة الصفحة",
    nameEn: "Page Intro",
    visible: true,
    fields: [
      {
        key: "title",
        label: "العنوان الرئيسي",
        labelEn: "Main Title",
        type: "text",
        value: "تواصل معنا",
        valueEn: "Contact Us",
      },
      {
        key: "description",
        label: "الوصف",
        labelEn: "Description",
        type: "textarea",
        value: "نحن هنا للإجابة على استفساراتك ومساعدتك في العثور على الحل المناسب.",
        valueEn: "We are here to answer your questions and help you find the right solution.",
      },
    ],
  },
  {
    id: "contact-info",
    name: "بطاقات التواصل",
    nameEn: "Contact Info Cards",
    visible: true,
    fields: [
      {
        key: "phone",
        label: "رقم الهاتف",
        labelEn: "Phone Number",
        type: "text",
        value: "920006900",
        valueEn: "920006900",
      },
      {
        key: "phone_note",
        label: "ملاحظة الهاتف",
        labelEn: "Phone Note",
        type: "text",
        value: "من الأحد للخميس، 8ص - 6م",
        valueEn: "Sunday to Thursday, 8 AM - 6 PM",
      },
      {
        key: "email",
        label: "البريد الإلكتروني",
        labelEn: "Email Address",
        type: "text",
        value: "sales@orbit.sa",
        valueEn: "sales@orbit.sa",
      },
      {
        key: "email_note",
        label: "ملاحظة البريد",
        labelEn: "Email Note",
        type: "text",
        value: "نرد خلال 24 ساعة كحد أقصى",
        valueEn: "We reply within 24 hours",
      },
      {
        key: "address",
        label: "العنوان",
        labelEn: "Address",
        type: "text",
        value: "المملكة العربية السعودية، الرياض",
        valueEn: "Riyadh, Saudi Arabia",
      },
      {
        key: "address_note",
        label: "تفاصيل العنوان",
        labelEn: "Address Details",
        type: "text",
        value: "طريق الملك فهد",
        valueEn: "King Fahd Road",
      },
      {
        key: "whatsapp_title",
        label: "عنوان بطاقة واتساب",
        labelEn: "WhatsApp Card Title",
        type: "text",
        value: "تحدث معنا عبر واتساب",
        valueEn: "Chat with us on WhatsApp",
      },
      {
        key: "whatsapp_url",
        label: "رابط واتساب",
        labelEn: "WhatsApp URL",
        type: "url",
        value: "https://wa.me/966920006900",
        valueEn: "https://wa.me/966920006900",
      },
    ],
  },
  {
    id: "contact-form",
    name: "نموذج التواصل",
    nameEn: "Contact Form",
    visible: true,
    fields: [
      {
        key: "service_label",
        label: "تسمية حقل الخدمة",
        labelEn: "Service Field Label",
        type: "text",
        value: "الخدمة المطلوبة",
        valueEn: "Requested Service",
      },
      {
        key: "service_placeholder",
        label: "نص افتراضي للخدمة",
        labelEn: "Service Placeholder",
        type: "text",
        value: "اختر الخدمة...",
        valueEn: "Select a service...",
      },
      {
        key: "service_options",
        label: "خيارات الخدمة (صيغة: value|AR|EN)",
        labelEn: "Service Options (format: value|AR|EN)",
        type: "list",
        value:
          "sms|الرسائل النصية SMS|SMS Messaging\nwhatsapp|واتساب أعمال API|WhatsApp Business API\no-time|O-Time نظام الموارد البشرية|O-Time HR System\ngov-gate|Gov Gate بوابة حكومية|Gov Gate\nother|استفسار عام|General Inquiry",
        valueEn:
          "sms|SMS Messaging|SMS Messaging\nwhatsapp|WhatsApp Business API|WhatsApp Business API\no-time|O-Time HR System|O-Time HR System\ngov-gate|Gov Gate|Gov Gate\nother|General Inquiry|General Inquiry",
      },
      {
        key: "submit_text",
        label: "نص زر الإرسال",
        labelEn: "Submit Button Text",
        type: "text",
        value: "إرسال الرسالة",
        valueEn: "Send Message",
      },
      {
        key: "privacy_note",
        label: "نص شروط المستخدم",
        labelEn: "Terms Note",
        type: "text",
        value: "بإرسال النموذج، أنت توافق على شروط المستخدم.",
        valueEn: "By sending this form, you agree to the Terms of Use.",
      },
    ],
  },
];

const MIN_EXPECTED_PAGES = 4;

const DEFAULT_SEO: Record<string, { title: string; titleEn: string; description: string; descriptionEn: string; keywords: string; keywordsEn: string }> = {
  home: {
    title: 'ORBIT | المدار - حلول تقنية رائدة',
    titleEn: 'ORBIT - Leading Technical Solutions',
    description: 'ORBIT المدار - مزود حلول تقنية رائد في المملكة العربية السعودية. خدمات الرسائل النصية SMS وواتساب أعمال API وبرامج الموارد البشرية وبوابات المراسلة الحكومية.',
    descriptionEn: 'ORBIT - Leading technical solutions provider in Saudi Arabia. SMS messaging, WhatsApp Business API, HR software, and government messaging gateways.',
    keywords: 'ORBIT, المدار, حلول تقنية, SMS, واتساب, السعودية, رسائل نصية',
    keywordsEn: 'ORBIT, technical solutions, SMS, WhatsApp, Saudi Arabia, messaging, API',
  },
  sms: {
    title: 'خدمة الرسائل النصية SMS | المدار',
    titleEn: 'SMS Messaging Service | ORBIT',
    description: 'خدمة الرسائل النصية SMS من المدار - حلول مراسلة موثوقة وفعالة للشركات والمؤسسات في السعودية.',
    descriptionEn: 'SMS Messaging Service by ORBIT - Reliable and efficient messaging solutions for businesses in Saudi Arabia.',
    keywords: 'SMS, رسائل نصية, خدمة رسائل, المدار, السعودية, أطفال رسائل',
    keywordsEn: 'SMS, messaging, text messages, ORBIT, Saudi Arabia, bulk SMS',
  },
  whatsapp: {
    title: 'واتساب أعمال API | المدار',
    titleEn: 'WhatsApp Business API | ORBIT',
    description: 'واتساب أعمال API من المدار - تواصل مع عملائك عبر واتساب بشكل احترافي وآمن.',
    descriptionEn: 'WhatsApp Business API by ORBIT - Connect with your customers professionally and securely via WhatsApp.',
    keywords: 'واتساب, WhatsApp, واتساب أعمال, API, المدار, تسويق',
    keywordsEn: 'WhatsApp, WhatsApp Business, API, ORBIT, marketing, messaging',
  },
  otime: {
    title: 'O-Time برنامج الموارد البشرية | المدار',
    titleEn: 'O-Time HR Software | ORBIT',
    description: 'برنامج O-Time لإدارة الموارد البشرية - منصة متكاملة للحضور والرواتب ودورة حياة الموظف.',
    descriptionEn: 'O-Time HR Software - Complete platform for attendance, payroll, and employee lifecycle management.',
    keywords: 'O-Time, موارد بشرية, إدارة حضور, رواتب, المدار',
    keywordsEn: 'O-Time, HR, attendance, payroll, ORBIT, employee management',
  },
  govgate: {
    title: 'Gov Gate بوابة حكومية | المدار',
    titleEn: 'Gov Gate | ORBIT',
    description: 'بوابة Gov Gate للحوسبة المؤسسية - منصة مراسلة آمنة ومتخصصة للجهات الحكومية.',
    descriptionEn: 'Gov Gate - Secure enterprise messaging gateway for government entities.',
    keywords: 'Gov Gate, بوابة حكومية, مراسلة, حكومة, المدار',
    keywordsEn: 'Gov Gate, government gateway, messaging, ORBIT, secure',
  },
  contact: {
    title: 'تواصل معنا | المدار',
    titleEn: 'Contact Us | ORBIT',
    description: 'تواصل معنا - المدار لحلول التقنية. نحن هنا لمساعدتك في جميع استفساراتك.',
    descriptionEn: 'Contact ORBIT - We are here to help with all your inquiries.',
    keywords: 'تواصل معنا, المدار, اتصل بنا, دعم فني',
    keywordsEn: 'contact us, ORBIT, support, inquiry',
  },
  blog: {
    title: 'المدونة | المدار',
    titleEn: 'Blog | ORBIT',
    description: 'مدونة المدار - أحدث الأخبار والمقالات عن الحلول التقنية والاتصالات.',
    descriptionEn: 'ORBIT Blog - Latest news and articles about technology solutions and communications.',
    keywords: 'مدونة, المدار, أخبار تقنية, مقالات',
    keywordsEn: 'blog, ORBIT, tech news, articles',
  },
};

const PAGE_BLUEPRINTS: { id: string; path: string; title: string; titleEn: string }[] = [
  { id: 'home', path: '/', title: 'الصفحة الرئيسية', titleEn: 'Home' },
  { id: 'sms', path: '/products/sms', title: 'خدمة الرسائل النصية SMS', titleEn: 'SMS Service' },
  { id: 'whatsapp', path: '/products/whatsapp', title: 'واتساب أعمال API', titleEn: 'WhatsApp Business API' },
  { id: 'schoolbit', path: '/products/schoolbit', title: 'SchoolBit إدارة المدارس', titleEn: 'SchoolBit School Management' },
  { id: 'otime', path: '/products/o-time', title: 'O-Time برنامج الموارد البشرية', titleEn: 'O-Time HR Software' },
  { id: 'govgate', path: '/products/gov-gate', title: 'Gov Gate', titleEn: 'Gov Gate' },
  { id: 'contact', path: '/contact', title: 'تواصل معنا', titleEn: 'Contact Us' },
  { id: 'blog', path: '/blog', title: 'المدونة', titleEn: 'Blog' },
];

const ensureMissingPages = (pages: PageData[]): PageData[] => {
  const existingIds = new Set(pages.map((p) => p.id));
  const missingBlueprints = PAGE_BLUEPRINTS.filter((bp) => !existingIds.has(bp.id));
  if (!missingBlueprints.length) return pages;

  const today = new Date().toISOString().split("T")[0];
  const newPages = missingBlueprints.map((bp) => ({
    id: bp.id,
    title: bp.title,
    titleEn: bp.titleEn,
    path: bp.path,
    visible: true,
    lastEdited: today,
    sections: [],
    seo: DEFAULT_SEO[bp.id] ? {
      title: DEFAULT_SEO[bp.id].title,
      titleEn: DEFAULT_SEO[bp.id].titleEn,
      description: DEFAULT_SEO[bp.id].description,
      descriptionEn: DEFAULT_SEO[bp.id].descriptionEn,
      keywords: DEFAULT_SEO[bp.id].keywords,
      keywordsEn: DEFAULT_SEO[bp.id].keywordsEn,
      canonical: `https://orbit.sa${bp.path}`,
      noIndex: false,
      ogImage: '',
    } : undefined,
  }));

  return [...pages, ...newPages];
};
const cloneField = (field: SectionField): SectionField => ({ ...field });
const cloneSection = (section: PageSection): PageSection => ({ ...section, fields: section.fields.map(cloneField) });

const buildDefaultContactPage = (): PageData => ({
  id: "contact",
  title: "تواصل معنا",
  titleEn: "Contact Us",
  path: "/contact",
  visible: true,
  lastEdited: new Date().toISOString().split("T")[0],
  sections: defaultContactSections.map(cloneSection),
});

const ensureContactPageFields = (pages: PageData[]): PageData[] => {
  const contactIndex = pages.findIndex((page) => page.id === "contact" || page.path === "/contact");
  const contactTemplate = buildDefaultContactPage();

  if (contactIndex === -1) {
    return [...pages, contactTemplate];
  }

  const current = pages[contactIndex];
  const currentSections = Array.isArray(current.sections) ? current.sections : [];
  const templateBySectionId = new Map(contactTemplate.sections.map((section) => [section.id, section]));
  const currentBySectionId = new Map(currentSections.map((section) => [section.id, section]));

  let pageChanged = false;

  const mergedSections = contactTemplate.sections.map((templateSection) => {
    const existingSection = currentBySectionId.get(templateSection.id);
    if (!existingSection) {
      pageChanged = true;
      return cloneSection(templateSection);
    }

    const existingFields = Array.isArray(existingSection.fields) ? existingSection.fields : [];
    const fieldKeys = new Set(existingFields.map((field) => field.key));
    const missingFields = templateSection.fields.filter((field) => !fieldKeys.has(field.key)).map(cloneField);
    if (!missingFields.length) {
      return existingSection;
    }

    pageChanged = true;
    return {
      ...existingSection,
      fields: [...existingFields, ...missingFields],
    };
  });

  const extraSections = currentSections.filter((section) => !templateBySectionId.has(section.id));
  const normalizedId = current.id || "contact";
  const normalizedPath = current.path || "/contact";
  const normalizedTitle = current.title || contactTemplate.title;
  const normalizedTitleEn = current.titleEn || contactTemplate.titleEn;
  const normalizedLastEdited = current.lastEdited || contactTemplate.lastEdited;

  if (normalizedId !== "contact" || normalizedPath !== "/contact") {
    pageChanged = true;
  }
  if (!current.title || !current.titleEn || !current.lastEdited) {
    pageChanged = true;
  }

  const updatedPage: PageData = {
    ...current,
    id: "contact",
    path: "/contact",
    title: normalizedTitle,
    titleEn: normalizedTitleEn,
    lastEdited: normalizedLastEdited,
    sections: [...mergedSections, ...extraSections],
  };

  if (!pageChanged) {
    return pages;
  }

  return pages.map((page, index) => (index === contactIndex ? updatedPage : page));
};

const defaultFooterData: FooterData = {
  logoDefault: canonicalFooterLogo,
  logoDark: canonicalFooterLogo,
  logoWhatsApp: canonicalFooterLogo,
  licensedByAr: "مرخصة من هيئة الاتصالات والفضاء والتقنية",
  licensedByEn: "Licensed by CST",
  madeInSaudiAr: "صنع في السعودية",
  madeInSaudiEn: "Made in Saudi",
  quickLinks: [
    { id: "ql-home", labelAr: "الرئيسية", labelEn: "Home", href: "/" },
    { id: "ql-about", labelAr: "من نحن", labelEn: "About", href: "/about-us" },
    { id: "ql-products", labelAr: "المنتجات", labelEn: "Products", href: "#footer-products" },
    { id: "ql-blog", labelAr: "المدونة", labelEn: "Blog", href: "/blog" },
    { id: "ql-contact", labelAr: "تواصل", labelEn: "Contact", href: "/contact" },
  ],
  solutions: [
    { id: "sl-sms", labelAr: "خدمة الرسائل النصية SMS", labelEn: "SMS Service", href: "/products/sms" },
    { id: "sl-whatsapp", labelAr: "واتساب للأعمال", labelEn: "WhatsApp Business", href: "/products/whatsapp" },
    { id: "sl-otime", labelAr: "O-Time", labelEn: "O-Time", href: "/products/o-time" },
    { id: "sl-govgate", labelAr: "Gov Gate", labelEn: "Gov Gate", href: "/products/gov-gate" },
  ],
  phoneLabelAr: "الهاتف",
  phoneLabelEn: "Phone",
  phoneNumber: "920006900",
  emailLabelAr: "البريد الإلكتروني",
  emailLabelEn: "Email",
  emailAddress: "marketing@corbit.sa",
  addressLabelAr: "العنوان",
  addressLabelEn: "Address",
  addressDetailAr: "المملكة العربية السعودية",
  addressDetailEn: "Saudi Arabia",
  socialItems: [
    {
      id: "social-instagram",
      platform: "Instagram",
      icon: "instagram",
      url: "https://www.instagram.com/orbittec_sa?igsh=MXFqZmluMWhrbXk0dg==",
      active: true,
      openInNewTab: true,
    },
    {
      id: "social-x",
      platform: "X",
      icon: "twitter",
      url: "https://x.com/orbittec_sa",
      active: true,
      openInNewTab: true,
    },
  ],
  copyrightAr: "جميع الحقوق محفوظة لشركة المدار",
  copyrightEn: "All rights reserved to Orbit",
  countryAr: "المملكة العربية السعودية",
  countryEn: "Saudi Arabia",
  commercialRegistryAr: "السجل التجاري: 1010956877",
  commercialRegistryEn: "CR: 1010956877",
  licenseAr: "رقم الترخيص: 16-01-001098",
  licenseEn: "License: 16-01-001098",
};

const mergeFooterData = (value: unknown): FooterData => {
  const raw = value && typeof value === "object" ? (value as Partial<FooterData>) : {};
  const legacyRaw = value && typeof value === "object" ? (value as { socialInstagram?: unknown; socialX?: unknown }) : {};
  const migratedSocials: FooterSocialItem[] = [];
  if (typeof legacyRaw.socialInstagram === "string" && legacyRaw.socialInstagram.trim()) {
    migratedSocials.push({
      id: "social-instagram",
      platform: "Instagram",
      icon: "instagram",
      url: legacyRaw.socialInstagram,
      active: true,
      openInNewTab: true,
    });
  }
  if (typeof legacyRaw.socialX === "string" && legacyRaw.socialX.trim()) {
    migratedSocials.push({
      id: "social-x",
      platform: "X",
      icon: "twitter",
      url: legacyRaw.socialX,
      active: true,
      openInNewTab: true,
    });
  }

  const normalizedQuickLinks = normalizeQuickLinks(raw.quickLinks);

  return {
    ...defaultFooterData,
    ...raw,
    logoDefault: normalizeFooterLogo(raw.logoDefault),
    logoDark: normalizeFooterLogo(raw.logoDark),
    logoWhatsApp: normalizeFooterLogo(raw.logoWhatsApp),
    quickLinks: normalizedQuickLinks.length ? normalizedQuickLinks : defaultFooterData.quickLinks,
    solutions: Array.isArray(raw.solutions) ? raw.solutions : defaultFooterData.solutions,
    socialItems: Array.isArray(raw.socialItems) && raw.socialItems.length
      ? (raw.socialItems as FooterSocialItem[])
      : (migratedSocials.length ? migratedSocials : defaultFooterData.socialItems),
  };
};

const SiteDataContext = createContext<SiteDataContextType | null>(null);

export const useSiteData = () => {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within SiteDataProvider");
  return ctx;
};

export const SiteDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [whatsAppRequests, setWhatsAppRequests] = useState<WhatsAppServiceRequest[]>([]);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);
  const [hydrated, setHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextAutosaveRef = useRef(true);

  // Refs to hold latest state values for stable callbacks
  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const partnersRef = useRef(partners);
  partnersRef.current = partners;
  const socialLinksRef = useRef(socialLinks);
  socialLinksRef.current = socialLinks;
  const contactSubmissionsRef = useRef(contactSubmissions);
  contactSubmissionsRef.current = contactSubmissions;
  const notificationEmailRef = useRef(notificationEmail);
  notificationEmailRef.current = notificationEmail;
  const footerDataRef = useRef(footerData);
  footerDataRef.current = footerData;

  const fetchWhatsAppRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp-request");
      if (res.ok) {
        const data = await res.json();
        setWhatsAppRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch WhatsApp requests:", error);
    }
  }, []);

  const updateWhatsAppRequestStatus = useCallback(async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/whatsapp-request/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setWhatsAppRequests(prev => 
          prev.map(req => req.id === id ? { ...req, status } : req)
        );
      }
    } catch (error) {
      console.error("Failed to update WhatsApp request status:", error);
    }
  }, []);

  const deleteWhatsAppRequest = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/whatsapp-request/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setWhatsAppRequests(prev => prev.filter(req => req.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete WhatsApp request:", error);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch("/api/cms/site");
      if (!res.ok) return;
      const data = await res.json();
      const site = data?.site;
      if (!site) return;

const loadedPages = Array.isArray(site.pages) ? (site.pages as PageData[]) : [];
      const enhancedPages = ensureMissingPages(
        ensureSchoolBitFields(
          ensureContactPageFields(
            ensureGovGateFields(
              ensureOTimeFields(
                ensureWhatsAppFields(
                  ensureHomePersonaTabsFields(
                    ensureHomeIntegrationsFields(
                      ensureHomeWhyUsFields(
                        ensureHomeTrustFields(
                          ensureSmsFields(
                            ensureHomeHeroFields(ensureHomeSolutionsFields(loadedPages))
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );

      setPages(enhancedPages);
      setPartners(Array.isArray(site.partners) ? site.partners : []);
      setSocialLinks(Array.isArray(site.socialLinks) ? site.socialLinks : []);
      setContactSubmissions(Array.isArray(site.contactSubmissions) ? site.contactSubmissions : []);
      setNotificationEmail(typeof site.notificationEmail === "string" ? site.notificationEmail : "");
      setFooterData(mergeFooterData(site.footerData));

      skipNextAutosaveRef.current = true;
    } catch (error) {
      console.error("Failed to refresh CMS data:", error);
    }
  }, []);

  const saveSiteData = useCallback(async (overridePages?: PageData[]): Promise<boolean> => {
    try {
      setIsSyncing(true);
      const currentPages = overridePages || pagesRef.current;

      const res = await fetch("/api/cms/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: currentPages,
          partners: partnersRef.current,
          socialLinks: socialLinksRef.current,
          contactSubmissions: contactSubmissionsRef.current,
          notificationEmail: notificationEmailRef.current,
          footerData: footerDataRef.current,
        }),
      });

      if (!res.ok) {
        const details = await res.text().catch(() => "");
        console.error("CMS save failed:", res.status, details);
      }

      if (res.ok && typeof window !== "undefined") {
        const stamp = new Date().toISOString();
        window.localStorage.setItem("orbit_cms_site_updated_at", stamp);
        window.dispatchEvent(new CustomEvent("orbit-cms-updated", { detail: stamp }));
      }

      return res.ok;
    } catch (error) {
      console.error("Failed to save CMS site data:", error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once on mount; saveSiteData uses refs
  useEffect(() => {
    let mounted = true;

    const loadSiteData = async () => {
      let normalizedDataChanged = false;
      try {
        const res = await fetch("/api/cms/site");
        if (!res.ok) {
          setHydrated(true);
          return;
        }

        const data = await res.json();
        const site = data?.site;
        if (!site || !mounted) {
          setHydrated(true);
          return;
        }

        const loadedPages = Array.isArray(site.pages) ? (site.pages as PageData[]) : [];
        console.log('API loaded pages:', loadedPages);
        const ensuredPages = ensureMissingPages(loadedPages);
        console.log('Ensured pages:', ensuredPages);
        
        let enhancedPages = ensuredPages;
        try {
          enhancedPages = ensureSchoolBitFields(
            ensureContactPageFields(
              ensureGovGateFields(
                ensureOTimeFields(
                  ensureWhatsAppFields(
                    ensureHomePersonaTabsFields(
                      ensureHomeIntegrationsFields(
                        ensureHomeWhyUsFields(
                          ensureHomeTrustFields(
                            ensureSmsFields(
                              ensureHomeHeroFields(ensureHomeSolutionsFields(ensuredPages))
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          );
        } catch (e) {
          console.error('Enhancement error:', e);
        }
        console.log('Enhanced pages:', enhancedPages);
        const mergedFooterData = mergeFooterData(site.footerData);
        normalizedDataChanged =
          JSON.stringify(loadedPages) !== JSON.stringify(enhancedPages) ||
          JSON.stringify(site.footerData ?? {}) !== JSON.stringify(mergedFooterData);

        setPages(enhancedPages);
        setPartners(Array.isArray(site.partners) ? site.partners : []);
        setSocialLinks(Array.isArray(site.socialLinks) ? site.socialLinks : []);
        setContactSubmissions(Array.isArray(site.contactSubmissions) ? site.contactSubmissions : []);
        setNotificationEmail(typeof site.notificationEmail === "string" ? site.notificationEmail : "");
        setFooterData(mergedFooterData);

        if (normalizedDataChanged) {
          await saveSiteData(enhancedPages);
        }
      } catch (error) {
        console.error("Failed to load CMS site data:", error);
      } finally {
        if (mounted) {
          setHydrated(true);
          // Auto-persist only when normalization adds/migrates CMS structure.
          skipNextAutosaveRef.current = !normalizedDataChanged;
        }
      }
    };

    loadSiteData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }

    if (pages.length < MIN_EXPECTED_PAGES) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void saveSiteData();
    }, 900);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- saveSiteData uses refs so it's stable and doesn't need to be a dependency
  }, [hydrated, pages, partners, socialLinks, contactSubmissions, notificationEmail, footerData]);

  const addPartner = useCallback((name: string, logo: string) => {
    const id = `p${Date.now()}`;
    setPartners(prev => [...prev, { id, name, logo, active: true }]);
  }, []);

  const removePartner = useCallback((id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
  }, []);

  const togglePartner = useCallback((id: string) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }, []);

  const updatePartnerName = useCallback((id: string, name: string) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }, []);

  const updateSectionField = useCallback((pageId: string, sectionId: string, fieldKey: string, value: string, lang: "ar" | "en") => {
    setPages(prev => prev.map(page => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        lastEdited: new Date().toISOString().split("T")[0],
        sections: page.sections.map(section => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            fields: section.fields.map(field => {
              if (field.key !== fieldKey) return field;
              if (lang === "en") return { ...field, valueEn: value };
              return { ...field, value };
            })
          };
        })
      };
    }));
  }, []);

  const toggleSectionVisibility = useCallback((pageId: string, sectionId: string) => {
    setPages(prev => prev.map(page => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        sections: page.sections.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s)
      };
    }));
  }, []);

  const getField = useCallback((pageId: string, sectionId: string, fieldKey: string): string => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return "";
    const section = page.sections.find(s => s.id === sectionId);
    if (!section) return "";
    const field = section.fields.find(f => f.key === fieldKey);
    return field?.value || "";
  }, [pages]);

  const isSectionVisible = useCallback((pageId: string, sectionId: string): boolean => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return true;
    const section = page.sections.find(s => s.id === sectionId);
    return section?.visible ?? true;
  }, [pages]);

  const updatePageSeo = useCallback((pageId: string, seo: any) => {
    setPages(prev => prev.map(page => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        seo: {
          title: seo.title ?? '',
          titleEn: seo.titleEn ?? '',
          description: seo.description ?? '',
          descriptionEn: seo.descriptionEn ?? '',
          keywords: seo.keywords ?? '',
          keywordsEn: seo.keywordsEn ?? '',
          canonical: seo.canonical ?? '',
          noIndex: seo.noIndex ?? false,
          ogImage: seo.ogImage ?? '',
        },
      };
    }));
  }, []);

  const addSocialLink = useCallback((platform: string, icon: string, url: string) => {
    const id = `s${Date.now()}`;
    setSocialLinks(prev => [...prev, { id, platform, icon, url, active: true }]);
  }, []);

  const updateSocialLink = useCallback((id: string, updates: Partial<SocialLink>) => {
    setSocialLinks(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const removeSocialLink = useCallback((id: string) => {
    setSocialLinks(prev => prev.filter(s => s.id !== id));
  }, []);

  const addContactSubmission = useCallback((submission: Omit<ContactSubmission, "id" | "date" | "read">) => {
    const newSub: ContactSubmission = {
      ...submission,
      id: `cs${Date.now()}`,
      date: new Date().toISOString(),
      read: false,
    };
    setContactSubmissions(prev => [newSub, ...prev]);
  }, []);

  const markSubmissionRead = useCallback((id: string) => {
    setContactSubmissions(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  }, []);

  const deleteSubmission = useCallback((id: string) => {
    setContactSubmissions(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <SiteDataContext.Provider value={{
      partners, setPartners, addPartner, removePartner, togglePartner, updatePartnerName,
      pages, setPages, updateSectionField, toggleSectionVisibility, getField, isSectionVisible, updatePageSeo,
      socialLinks, setSocialLinks, addSocialLink, updateSocialLink, removeSocialLink,
      contactSubmissions, addContactSubmission, markSubmissionRead, deleteSubmission,
      whatsAppRequests, fetchWhatsAppRequests, updateWhatsAppRequestStatus, deleteWhatsAppRequest,
      notificationEmail, setNotificationEmail, footerData, setFooterData, saveSiteData, refreshData, isSyncing,
    }}>
      {children}
    </SiteDataContext.Provider>
  );
};
