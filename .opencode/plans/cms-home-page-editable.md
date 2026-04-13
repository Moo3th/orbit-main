# CMS Home Page - Make All Content Editable

## Overview
This plan details how to make all content on the home page editable through the CMS admin panel.

## Current Status
- Home page has partial CMS integration
- Hero, Trust, Solutions, WhyUs sections have some fields
- PersonaTabs and Integrations have hardcoded content

## Files to Modify

### 1. SiteDataContext.tsx
**Path:** `src/app/admin/newAdmin/SiteDataContext.tsx`

#### 1.1 Add Hero Fields
Add to `homeHeroExtraFields` array after line 290:

```typescript
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
```

#### 1.2 Add Persona Tabs Section
Add new array after `homeHeroExtraFields` definition (around line 290):

```typescript
const homePersonaTabsFields: SectionField[] = [
  // Section Header
  { key: "section_title", label: "عنوان القسم", labelEn: "Section Title", type: "text", value: "منصة مصممة للجميع", valueEn: "A Platform Designed for Everyone" },
  { key: "section_subtitle", label: "وصف القسم", labelEn: "Section Subtitle", type: "text", value: "سواء كنت تاجراً تبحث عن السهولة، أو مطوراً يبحث عن المرونة.", valueEn: "Whether you are a merchant looking for simplicity, or a developer seeking flexibility." },
  
  // Merchants Tab
  { key: "merchants_tab_title", label: "عنوان تبويب المتاجر", labelEn: "Merchants Tab Title", type: "text", value: "للمتاجر والمسوقين", valueEn: "For Merchants & Marketers" },
  { key: "merchants_title", label: "عنوان المحتوى (تجار)", labelEn: "Merchants Content Title", type: "text", value: "أطلق حملاتك بدون تعقيد", valueEn: "Launch Campaigns Without Complexity" },
  { key: "merchants_description", label: "وصف المحتوى (تجار)", labelEn: "Merchants Description", type: "textarea", value: "لا تحتاج لخبرة تقنية. اربط متجرك في سلة أو زد بضغطة زر واحدة، وابدأ إرسال حملاتك التسويقية لآلاف العملاء فوراً.", valueEn: "No technical experience required. Connect your store in Salla or Zid with one click, and start sending your marketing campaigns to thousands of customers immediately." },
  { key: "merchants_step1", label: "الخطوة الأولى (تجار)", labelEn: "Merchants Step 1", type: "text", value: "استيراد جهات الاتصال تلقائياً", valueEn: "Automatically Import Contacts" },
  { key: "merchants_step2", label: "الخطوة الثانية (تجار)", labelEn: "Merchants Step 2", type: "text", value: "قوالب رسائل جاهزة ومعتمدة", valueEn: "Ready & Approved Message Templates" },
  { key: "merchants_step3", label: "الخطوة الثالثة (تجار)", labelEn: "Merchants Step 3", type: "text", value: "تقارير دقيقة للأداء (الفتح، النقر)", valueEn: "Accurate Performance Reports (Opens, Clicks)" },
  { key: "merchants_cta_text", label: "نص زر CTA (تجار)", labelEn: "Merchants CTA Text", type: "text", value: "ابدأ حملتك الأولى الآن", valueEn: "Start Your First Campaign Now" },
  { key: "merchants_image_url", label: "رابط صورة المتاجر", labelEn: "Merchants Image URL", type: "url", value: "https://images.unsplash.com/photo-1758611971897-baffb061fd9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", valueEn: "https://images.unsplash.com/photo-1758611971897-baffb061fd9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  
  // Developers Tab
  { key: "developers_tab_title", label: "عنوان تبويب المطورين", labelEn: "Developers Tab Title", type: "text", value: "للمطورين والتقنيين", valueEn: "For Developers & Techies" },
  { key: "developers_badge", label: "شارة المطورين", labelEn: "Developer Badge", type: "text", value: "صديق للمطورين", valueEn: "Developer Friendly" },
  { key: "developers_title", label: "عنوان المحتوى (مطورين)", labelEn: "Developers Content Title", type: "text", value: "API قوي ومرن", valueEn: "Powerful & Flexible API" },
  { key: "developers_description", label: "وصف المحتوى (مطورين)", labelEn: "Developers Description", type: "textarea", value: "REST API مرن، توثيق كامل (Documentation)، ودعم فني من مطور لمطور. انسخ الكود وابدأ الإرسال في 5 دقائق.", valueEn: "REST API is flexible, features complete documentation, and offers developer-to-developer technical support. Copy the code and start sending in 5 minutes." },
  { key: "developers_uptime", label: "نسبة التشغيل", labelEn: "Uptime", type: "text", value: "99.99%", valueEn: "99.99%" },
  { key: "developers_latency", label: "زمن الاستجابة", labelEn: "Latency", type: "text", value: "50ms", valueEn: "50ms" },
  { key: "developers_tools", label: "أدوات التكامل (سطر لكل أداة)", labelEn: "Integration Tools (one per line)", type: "list", value: "دفترة\nسلة\nنظام نور\nإتقان", valueEn: "Daftra\nSalla\nNoor\nItqan" },
  { key: "developers_cta_text", label: "نص زر التوثيق", labelEn: "Docs Button Text", type: "text", value: "تصفح ملفات الـ API", valueEn: "Browse API Docs" },
  { key: "developers_cta_url", label: "رابط التوثيق", labelEn: "Docs URL", type: "url", value: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view", valueEn: "https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view" },
];
```

#### 1.3 Add Integrations List Field
Add to `homeIntegrationsFields` array (create if doesn't exist):

```typescript
const homeIntegrationsFields: SectionField[] = [
  { key: "integrations_list", label: "قائمة التكاملات (اسم|رابط_الأيقونة)", labelEn: "Integrations List (name|icon_url)", type: "list", value: "سلة|/1/salla.svg\nدفترة|/1/daftra.png\nنور|/1/noor.png\nاتقان|/1/etqan.jpeg\nحضوري|/1/huddari.png", valueEn: "Salla|/1/salla.svg\nDaftra|/1/daftra.png\nNoor|/1/noor.png\nItqan|/1/etqan.jpeg\nHuddari|/1/huddari.png" },
];
```

#### 1.4 Add Ensure Functions
Add after the existing ensure functions:

```typescript
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
```

#### 1.5 Update loadSiteData
Find the `loadSiteData` function around line 1019 and update the `enhancedPages` assignment to include the new ensure functions:

```typescript
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
```

---

### 2. Hero.tsx
**Path:** `src/components/business/landing/Hero.tsx`

Update to use new CMS fields:

```typescript
// Add after line 28:
const heroImageUrl = getCmsField(pageData, 'home-hero', 'hero_image_url', isRTL, "https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080");
const notificationTitle = getCmsField(pageData, 'home-hero', 'notification_title', isRTL, t.landing.heroNew.notificationTitle);
const notificationDesc = getCmsField(pageData, 'home-hero', 'notification_desc', isRTL, t.landing.heroNew.notificationDesc);

// Replace line 142:
// OLD:
src="https://images.unsplash.com/photo-1669023414162-5bb06bbff0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
// NEW:
src={heroImageUrl}

// Replace lines 154-155:
// OLD:
<h4 className="font-semibold text-slate-900 text-sm">{t.landing.heroNew.notificationTitle}</h4>
<p className="text-xs text-slate-500 mt-1">{t.landing.heroNew.notificationDesc}</p>
// NEW:
<h4 className="font-semibold text-slate-900 text-sm">{notificationTitle}</h4>
<p className="text-xs text-slate-500 mt-1">{notificationDesc}</p>
```

---

### 3. PersonaTabs.tsx
**Path:** `src/components/business/landing/PersonaTabs.tsx`

Complete rewrite to use CMS fields:

```typescript
'use client';

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/business/ui/tabs";
import { ShoppingBag, Code2, Terminal, FileText, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/business/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from "@/lib/cms/types";
import { getCmsField } from "@/lib/cms/helpers";

interface PersonaTabsProps {
  pageData?: CmsPage | null;
}

export const PersonaTabs = ({ pageData = null }: PersonaTabsProps) => {
  const { isRTL } = useLanguage();

  // Section header
  const sectionTitle = getCmsField(pageData, 'home-persona-tabs', 'section_title', isRTL, 'منصة مصممة للجميع');
  const sectionSubtitle = getCmsField(pageData, 'home-persona-tabs', 'section_subtitle', isRTL, 'سواء كنت تاجراً تبحث عن السهولة، أو مطوراً يبحث عن المرونة.');

  // Merchants tab
  const merchantsTabTitle = getCmsField(pageData, 'home-persona-tabs', 'merchants_tab_title', isRTL, 'للمتاجر والمسوقين');
  const merchantsTitle = getCmsField(pageData, 'home-persona-tabs', 'merchants_title', isRTL, 'أطلق حملاتك بدون تعقيد');
  const merchantsDescription = getCmsField(pageData, 'home-persona-tabs', 'merchants_description', isRTL, 'لا تحتاج لخبرة تقنية. اربط متجرك في سلة أو زد بضغطة زر واحدة، وابدأ إرسال حملاتك التسويقية لآلاف العملاء فوراً.');
  const merchantsStep1 = getCmsField(pageData, 'home-persona-tabs', 'merchants_step1', isRTL, 'استيراد جهات الاتصال تلقائياً');
  const merchantsStep2 = getCmsField(pageData, 'home-persona-tabs', 'merchants_step2', isRTL, 'قوالب رسائل جاهزة ومعتمدة');
  const merchantsStep3 = getCmsField(pageData, 'home-persona-tabs', 'merchants_step3', isRTL, 'تقارير دقيقة للأداء (الفتح، النقر)');
  const merchantsCtaText = getCmsField(pageData, 'home-persona-tabs', 'merchants_cta_text', isRTL, 'ابدأ حملتك الأولى الآن');
  const merchantsImageUrl = getCmsField(pageData, 'home-persona-tabs', 'merchants_image_url', isRTL, 'https://images.unsplash.com/photo-1758611971897-baffb061fd9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080');

  // Developers tab
  const developersTabTitle = getCmsField(pageData, 'home-persona-tabs', 'developers_tab_title', isRTL, 'للمطورين والتقنيين');
  const developersBadge = getCmsField(pageData, 'home-persona-tabs', 'developers_badge', isRTL, 'صديق للمطورين');
  const developersTitle = getCmsField(pageData, 'home-persona-tabs', 'developers_title', isRTL, 'API قوي ومرن');
  const developersDescription = getCmsField(pageData, 'home-persona-tabs', 'developers_description', isRTL, 'REST API مرن، توثيق كامل (Documentation)، ودعم فني من مطور لمطور. انسخ الكود وابدأ الإرسال في 5 دقائق.');
  const developersUptime = getCmsField(pageData, 'home-persona-tabs', 'developers_uptime', isRTL, '99.99%');
  const developersLatency = getCmsField(pageData, 'home-persona-tabs', 'developers_latency', isRTL, '50ms');
  const developersToolsRaw = getCmsField(pageData, 'home-persona-tabs', 'developers_tools', isRTL, 'دفترة\nسلة\nنظام نور\nإتقان');
  const developersTools = developersToolsRaw.split('\n').map(t => t.trim()).filter(Boolean);
  const developersCtaText = getCmsField(pageData, 'home-persona-tabs', 'developers_cta_text', isRTL, 'تصفح ملفات الـ API');
  const developersCtaUrl = getCmsField(pageData, 'home-persona-tabs', 'developers_cta_url', isRTL, 'https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view');

  return (
    <section 
      className="py-20 bg-white" 
      id="developers"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <div className={`container mx-auto px-4 md:px-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{sectionTitle}</h2>
          <p className="text-slate-600">{sectionSubtitle}</p>
        </div>

        <Tabs defaultValue="merchants" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-slate-100 rounded-2xl mb-12">
            <TabsTrigger 
              value="merchants" 
              className="py-4 rounded-xl text-lg font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {merchantsTabTitle}
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="developers" 
              className="py-4 rounded-xl text-lg font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                {developersTabTitle}
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="merchants" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                 <div className="absolute inset-0 bg-primary/10 transform rotate-2 rounded-3xl" />
                 <img 
                    src={merchantsImageUrl} 
                    alt="Merchant using phone"
                    className="relative rounded-3xl shadow-xl border-4 border-white"
                 />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <h3 className="text-3xl font-bold text-slate-900">{merchantsTitle}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{merchantsDescription}</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">1</span>
                    <span className="font-medium text-slate-800">{merchantsStep1}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">2</span>
                    <span className="font-medium text-slate-800">{merchantsStep2}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">3</span>
                    <span className="font-medium text-slate-800">{merchantsStep3}</span>
                  </li>
                </ul>
                <Button 
                  className="mt-4 group gap-2 px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-2xl bg-primary hover:bg-primary/90 text-white border-0" 
                  size="lg"
                  onClick={() => {
                    const hero = document.getElementById('hero');
                    if (hero) {
                      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  {merchantsCtaText}
                  {isRTL ? (
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="developers" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 font-mono text-sm relative overflow-hidden text-left" dir="ltr">
                <div className="flex gap-1.5 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <p className="text-slate-400 mb-2">{`// Send SMS Example`}</p>
                <p className="mb-1"><span className="text-purple-400">await</span> orbit.send({`{`}</p>
                <p className="pl-4"><span className="text-blue-400">to</span>: <span className="text-green-400">&quot;96650xxxxxxx&quot;</span>,</p>
                <p className="pl-4"><span className="text-blue-400">body</span>: <span className="text-green-400">&quot;Your OTP is 1234&quot;</span>,</p>
                <p className="pl-4"><span className="text-blue-400">sender</span>: <span className="text-green-400">&quot;MyStore&quot;</span></p>
                <p className="mb-1">{`}`});</p>
                <p className="mt-2 text-green-500">{`// Result: Message Sent ✅`}</p>
              </div>

              <div className="space-y-6 order-1 md:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                  <Terminal className="h-4 w-4" />
                  {developersBadge}
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{developersTitle}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{developersDescription}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h5 className="font-bold text-slate-900 mb-1">{developersUptime}</h5>
                        <p className="text-sm text-slate-500">Uptime SLA</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h5 className="font-bold text-slate-900 mb-1">{developersLatency}</h5>
                        <p className="text-sm text-slate-500">Latency</p>
                    </div>
                </div>
                <h4 className="text-xl font-bold text-[#7A1E2E] mb-4">{isRTL ? 'جاهز للربط مع أدواتك المفضلة' : 'Ready to Connect with Your Favorite Tools'}</h4>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {developersTools.map((tool, index) => (
                    <span key={index} className="bg-white border px-3 py-1 rounded text-sm font-bold text-slate-600">{tool}</span>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="gap-2.5 w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-0"
                  asChild
                >
                  <a
                    href={developersCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5"
                  >
                    <FileText className={`h-5 w-5 shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} aria-hidden />
                    {developersCtaText}
                    <ExternalLink className={`h-4 w-4 shrink-0 opacity-90 ${isRTL ? 'mr-2' : 'ml-2'}`} aria-hidden />
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
```

---

### 4. Integrations.tsx
**Path:** `src/components/business/landing/Integrations.tsx`

Update to use integrations_list from CMS:

```typescript
'use client';

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface IntegrationsProps {
  pageData?: CmsPage | null;
}

interface IntegrationItem {
  name: string;
  icon: string;
}

const parseIntegrationsList = (raw: string, fallback: IntegrationItem[]): IntegrationItem[] => {
  const lines = raw.split('\n').map(line => line.trim()).filter(Boolean);
  if (!lines.length) return fallback;
  
  return lines.map(line => {
    const [name, icon] = line.split('|').map(s => s.trim());
    return { name: name || '', icon: icon || '' };
  }).filter(item => item.name);
};

const defaultIntegrations: IntegrationItem[] = [
  { name: "سلة", icon: "/1/salla.svg" },
  { name: "دفترة", icon: "/1/daftra.png" },
  { name: "نور", icon: "/1/noor.png" },
  { name: "اتقان", icon: "/1/etqan.jpeg" },
  { name: "حضوري", icon: "/1/huddari.png" },
];

export const Integrations = ({ pageData = null }: IntegrationsProps) => {
  const { isRTL } = useLanguage();
  
  const title = getCmsField(pageData, 'home-integrations', 'title', isRTL, isRTL ? 'نعمل مع أدواتك المفضلة' : 'We Work with Your Favorite Tools');
  const subtitle = getCmsField(pageData, 'home-integrations', 'subtitle', isRTL, isRTL ? 'لن تضطر لتغيير نظام عملك الحالي، نحن نندمج معه بسهولة.' : 'You won\'t have to change your current workflow; we integrate with it seamlessly.');
  
  const integrationsListRaw = getCmsField(pageData, 'home-integrations', 'integrations_list', isRTL, '');
  const integrations = parseIntegrationsList(integrationsListRaw, defaultIntegrations);

  return (
    <section 
      className="py-16 bg-slate-50 border-t border-slate-200"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <div className="container mx-auto px-4 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-slate-500 mb-10">
          {subtitle}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          {integrations.map((item, index) => (
            <div 
              key={`integration-${index}-${item.name}`} 
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
            >
              {item.icon.startsWith('/') ? (
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-16 w-16 object-contain group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {item.icon.substring(0, 2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

---

## Execution Order
1. Update `SiteDataContext.tsx` with all new fields and ensure functions
2. Update `Hero.tsx` to use new fields
3. Update `PersonaTabs.tsx` to use all CMS fields
4. Update `Integrations.tsx` to use integrations_list
5. Run `npm run build` to verify no errors
6. Test in admin panel

## Testing Checklist
- [ ] Hero section shows image from CMS
- [ ] Hero notification title/description editable
- [ ] PersonaTabs all text editable from CMS
- [ ] Integrations list editable from CMS
- [ ] Build passes without errors
- [ ] Admin panel shows new fields