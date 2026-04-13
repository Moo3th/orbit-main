'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  getDefaultWhatsAppConversationPrices,
  getDefaultWhatsAppPlans,
  serializeWhatsAppConversationPrices,
  serializeWhatsAppPlans,
} from "@/lib/cms/whatsappPricing";

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
  type: "text" | "textarea" | "url" | "list";
  value: string;
  valueEn?: string;
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
  saveSiteData: () => Promise<boolean>;
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
  {
    key: "otime_title",
    label: "عنوان بطاقة O-Time",
    labelEn: "O-Time Card Title",
    type: "text",
    value: "O-Time برنامج الموارد البشرية",
    valueEn: "O-Time HR Software",
  },
  {
    key: "otime_desc",
    label: "وصف بطاقة O-Time",
    labelEn: "O-Time Card Description",
    type: "textarea",
    value: "منصة متكاملة لإدارة الموارد البشرية تشمل الحضور والرواتب ودورة حياة الموظف بالكامل.",
    valueEn: "A complete HR operations platform for attendance, payroll, and employee lifecycle management.",
  },
  {
    key: "otime_features",
    label: "مزايا O-Time (مفصولة بفواصل)",
    labelEn: "O-Time Features (comma separated)",
    type: "list",
    value: "إدارة الحضور والإجازات,أتمتة مسيرات الرواتب,بوابة الخدمة الذاتية للموظف,لوحات تحكم وتحليلات فورية",
    valueEn: "Attendance and leave management,Automated payroll workflows,Employee self-service portal,Real-time HR analytics dashboards",
  },
  {
    key: "govgate_title",
    label: "عنوان بطاقة Gov Gate",
    labelEn: "Gov Gate Card Title",
    type: "text",
    value: "Gov Gate",
    valueEn: "Gov Gate",
  },
  {
    key: "govgate_desc",
    label: "وصف بطاقة Gov Gate",
    labelEn: "Gov Gate Card Description",
    type: "textarea",
    value: "بوابة مراسلة مؤسسية آمنة ببنية مخصصة وامتثال كامل وتحكم متقدم.",
    valueEn: "Secure enterprise messaging gateway with dedicated infrastructure, compliance, and advanced controls.",
  },
  {
    key: "govgate_features",
    label: "مزايا Gov Gate (مفصولة بفواصل)",
    labelEn: "Gov Gate Features (comma separated)",
    type: "list",
    value: "بوابة مراسلة خاصة وآمنة,صلاحيات دقيقة بحسب الأدوار,أمان مؤسسي وامتثال تشريعي,تقارير تشغيلية وسجل تدقيق مفصل",
    valueEn: "Private secure messaging portal,Granular role-based permissions,Enterprise-grade security and compliance,Detailed operational audit reporting",
  },
];

const homeHeroExtraFields: SectionField[] = [
  {
    key: "cta_api_docs_url",
    label: "رابط زر تصفح ملفات API",
    labelEn: "Browse API Docs Button URL",
    type: "url",
    value: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view?usp=drive_link",
    valueEn: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view?usp=drive_link",
  },
  {
    key: "hero_image_url",
    label: "رابط صورة البطل",
    labelEn: "Hero Image URL",
    type: "url",
    value: "https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    valueEn: "https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    key: "notification_title",
    label: "عنوان الإشعار",
    labelEn: "Notification Title",
    type: "text",
    value: "رسالة جديدة",
    valueEn: "New Message",
  },
  {
    key: "notification_desc",
    label: "وصف الإشعار",
    labelEn: "Notification Description",
    type: "text",
    value: "تم تأكيد طلبك بنجاح",
    valueEn: "Your order has been confirmed",
  },
];

const ensureHomeHeroFields = (pages: PageData[]): PageData[] => {
  return pages.map((page) => {
    if (page.id !== "home" && page.path !== "/") {
      return page;
    }
    if (!Array.isArray(page.sections)) {
      return page;
    }

    let pageChanged = false;
    const sections = page.sections.map((section) => {
      if (section.id !== "home-hero") {
        return section;
      }

      const safeFields = Array.isArray(section.fields) ? section.fields : [];
      const existingKeys = new Set(safeFields.map((field) => field.key));
      const missingFields = homeHeroExtraFields.filter((field) => !existingKeys.has(field.key));
      if (!missingFields.length) {
        return section;
      }

      pageChanged = true;
      return {
        ...section,
        fields: [...safeFields, ...missingFields],
      };
    });

    return pageChanged ? { ...page, sections } : page;
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

    let pageChanged = false;
    const sections = page.sections.map((section) => {
      if (section.id !== "home-solutions") {
        return section;
      }

      const safeFields = Array.isArray(section.fields) ? section.fields : [];
      const existingKeys = new Set(safeFields.map((field) => field.key));
      const missingFields = homeSolutionsExtraFields.filter((field) => !existingKeys.has(field.key));
      if (!missingFields.length) {
        return section;
      }

      pageChanged = true;
      return {
        ...section,
        fields: [...safeFields, ...missingFields],
      };
    });

    return pageChanged ? { ...page, sections } : page;
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
  { key: "integrations_list", label: "أسماء التكاملات (مفصولة بفواصل)", labelEn: "Integration Names (comma separated)", type: "list", value: "سلة,دفترة,نور,اتقان,حضوري", valueEn: "Salla,Daftra,Noor,Itqan,Huddari" },
  { key: "integration_salla_icon", label: "أيقونة سلة", labelEn: "Salla Icon", type: "url", value: "/1/salla.svg", valueEn: "/1/salla.svg" },
  { key: "integration_daftra_icon", label: "أيقونة دفترة", labelEn: "Daftra Icon", type: "url", value: "/1/daftra.png", valueEn: "/1/daftra.png" },
  { key: "integration_noor_icon", label: "أيقونة نور", labelEn: "Noor Icon", type: "url", value: "/1/noor.png", valueEn: "/1/noor.png" },
  { key: "integration_itqan_icon", label: "أيقونة إتقان", labelEn: "Itqan Icon", type: "url", value: "/1/etqan.jpeg", valueEn: "/1/etqan.jpeg" },
  { key: "integration_huddari_icon", label: "أيقونة حضوري", labelEn: "Huddari Icon", type: "url", value: "/1/huddari.png", valueEn: "/1/huddari.png" },
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
        label: "نص سياسة الخصوصية",
        labelEn: "Privacy Note",
        type: "text",
        value: "بإرسال النموذج، أنت توافق على سياسة الخصوصية.",
        valueEn: "By sending this form, you agree to the privacy policy.",
      },
    ],
  },
];

const cloneField = (field: SectionField): SectionField => ({ ...field });
const cloneSection = (section: PageSection): PageSection => ({ ...section, fields: section.fields.map(cloneField) });

const buildDefaultContactPage = (): PageData => ({
  id: "contact",
  title: "تواصل معنا",
  titleEn: "Contact Us",
  path: "/contact",
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

  const saveSiteData = useCallback(async (): Promise<boolean> => {
    try {
      setIsSyncing(true);
      const currentPages = pages;
      const homepageSeo = currentPages.find(p => p.id === 'home')?.seo;
      console.log("Saving CMS site data...");
      console.log("Homepage SEO:", JSON.stringify(homepageSeo, null, 2));
      console.log("Total pages:", currentPages.length);
      
      const res = await fetch("/api/cms/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: currentPages,
          partners,
          socialLinks,
          contactSubmissions,
          notificationEmail,
          footerData,
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
  }, [pages, partners, socialLinks, contactSubmissions, notificationEmail, footerData]);

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
        const enhancedPages = ensureContactPageFields(
          ensureWhatsAppRequestFormFields(
            ensureWhatsAppPricingFields(
              ensureHomePersonaTabsFields(
                ensureHomeIntegrationsFields(
                  ensureHomeHeroFields(ensureHomeSolutionsFields(loadedPages))
                )
              )
            )
          )
        );
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
  }, [hydrated, pages, partners, socialLinks, contactSubmissions, notificationEmail, footerData, saveSiteData]);

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
          title: seo.title || '',
          titleEn: seo.titleEn || '',
          description: seo.description || '',
          descriptionEn: seo.descriptionEn || '',
          keywords: seo.keywords || '',
          keywordsEn: seo.keywordsEn || '',
          canonical: seo.canonical || '',
          noIndex: seo.noIndex || false,
          ogImage: seo.ogImage || '',
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
      notificationEmail, setNotificationEmail, footerData, setFooterData, saveSiteData, isSyncing,
    }}>
      {children}
    </SiteDataContext.Provider>
  );
};
