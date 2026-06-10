'use client';

import React from "react";
import { Hero } from "./Hero";
import { Stats } from "./Stats";
import { TrustSection } from "./TrustSection";
import { Solutions } from "./Solutions";
import { PersonaTabs } from "./PersonaTabs";
import { Integrations } from "./Integrations";
import { Testimonials } from "./Testimonials";
import { WhyUs } from "./WhyUs";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";
import type { CmsPage, CmsPartner } from '@/lib/cms/types';

interface LandingPageProps {
  pageData?: CmsPage | null;
  partners?: CmsPartner[];
}

// خريطة معرّف القسم → مكوّن العرض. الهيرو غير مُدرَج لأنه مثبّت دائمًا في الأعلى،
// و home-navbar غير مُدرَج لأنه يُعرض في الـ Navbar بالـ layout.
const SECTION_COMPONENTS: Record<string, React.ComponentType<{ pageData?: CmsPage | null; partners?: CmsPartner[] }>> = {
  'home-stats': Stats,
  'home-trust': TrustSection,
  'home-solutions': Solutions,
  'home-persona-tabs': PersonaTabs,
  'home-integrations': Integrations,
  'home-testimonials': Testimonials,
  'home-whyus': WhyUs,
  'home-faq': Faq,
  'home-cta': FinalCta,
};

// الأقسام التي تحتاج قائمة الشركاء.
const NEEDS_PARTNERS = new Set(['home-trust']);

// الترتيب البصري القانوني (شبكة أمان لقواعد لم تُضَف إليها كل الأقسام بعد).
const DEFAULT_ORDER = [
  'home-stats',
  'home-trust',
  'home-solutions',
  'home-persona-tabs',
  'home-integrations',
  'home-testimonials',
  'home-whyus',
  'home-faq',
  'home-cta',
];

export const LandingPage = ({ pageData = null, partners = [] }: LandingPageProps) => {
  // ترتيب الأقسام القابلة للعرض من بيانات الـ CMS، مع احترام الرؤية والترتيب،
  // ثم إلحاق أي قسم افتراضي غير موجود في البيانات.
  const sectionsToRender = React.useMemo(() => {
    const dbSections = pageData?.sections ?? [];
    const visibilityById = new Map(dbSections.map((s) => [s.id, s.visible !== false]));
    const ordered: string[] = [];

    // 1) الأقسام كما رتّبها الأدمن (المعروفة فقط، عدا الهيرو/النافبار).
    for (const section of dbSections) {
      if (section.id === 'home-hero' || section.id === 'home-navbar') continue;
      if (SECTION_COMPONENTS[section.id] && !ordered.includes(section.id)) {
        ordered.push(section.id);
      }
    }
    // 2) أي قسم افتراضي غير موجود في البيانات (قاعدة لم تُهاجَر).
    for (const id of DEFAULT_ORDER) {
      if (!ordered.includes(id)) ordered.push(id);
    }
    // 3) استبعاد المخفية (visible === false). القسم غير الموجود في البيانات يُعتبر ظاهرًا.
    return ordered.filter((id) => visibilityById.get(id) !== false);
  }, [pageData]);

  return (
    <>
      <Hero pageData={pageData} partners={partners} />
      {sectionsToRender.map((id) => {
        const Component = SECTION_COMPONENTS[id];
        if (!Component) return null;
        return (
          <Component
            key={id}
            pageData={pageData}
            {...(NEEDS_PARTNERS.has(id) ? { partners } : {})}
          />
        );
      })}
    </>
  );
};
