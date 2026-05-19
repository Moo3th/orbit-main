import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { CmsPageContent, ICmsPageContent, ICmsSection, ICmsField } from '@/models/CmsPageContent';
import type { Metadata } from 'next';

export type { ICmsPageContent, ICmsSection, ICmsField };

const PAGE_DEFAULTS: Partial<ICmsPageContent> = {
  seo: {
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    keywords: { en: '', ar: '' },
    canonical: '',
    noIndex: false,
  },
  social: {
    ogImage: '',
    ogTitle: { en: '', ar: '' },
    ogDescription: { en: '', ar: '' },
  },
  sections: [],
  isActive: true,
  order: 0,
};

const normalizePage = (doc: unknown): ICmsPageContent | null => {
  if (!doc || typeof doc !== 'object') return null;
  const page = doc as Record<string, unknown>;
  
  if (!page.pageId || !page.path) return null;

  const seoData = (page.seo || {}) as Record<string, Record<string, string>>;
  const socialData = (page.social || {}) as Record<string, Record<string, string>>;
  
  return {
    pageId: String(page.pageId),
    path: String(page.path),
    order: typeof page.order === 'number' ? page.order : 0,
    seo: {
      title: {
        en: String(seoData.title?.en || ''),
        ar: String(seoData.title?.ar || ''),
      },
      description: {
        en: String(seoData.description?.en || ''),
        ar: String(seoData.description?.ar || ''),
      },
      keywords: {
        en: String(seoData.keywords?.en || ''),
        ar: String(seoData.keywords?.ar || ''),
      },
      canonical: String(seoData.canonical || ''),
      noIndex: Boolean(seoData.noIndex),
    },
    social: {
      ogImage: String(socialData.ogImage || ''),
      ogTitle: {
        en: String(socialData.ogTitle?.en || ''),
        ar: String(socialData.ogTitle?.ar || ''),
      },
      ogDescription: {
        en: String(socialData.ogDescription?.en || ''),
        ar: String(socialData.ogDescription?.ar || ''),
      },
    },
    sections: normalizeSections(Array.isArray(page.sections) ? page.sections : []),
    isActive: Boolean(page.isActive),
    createdAt: page.createdAt ? new Date(page.createdAt as string) : new Date(),
    updatedAt: page.updatedAt ? new Date(page.updatedAt as string) : new Date(),
  };
};

const normalizeSections = (sections: unknown[]): ICmsSection[] => {
  return sections
    .map((section) => {
      if (!section || typeof section !== 'object') return null;
      const s = section as Record<string, unknown>;
      if (!s.id || !s.type) return null;

      return {
        id: String(s.id),
        type: s.type as ICmsSection['type'],
        order: typeof s.order === 'number' ? s.order : 0,
        fields: normalizeFields(Array.isArray(s.fields) ? s.fields : []),
      };
    })
    .filter((s): s is ICmsSection => s !== null)
    .sort((a, b) => a.order - b.order);
};

const normalizeFields = (fields: unknown[]): ICmsField[] => {
  return fields
    .map((field): ICmsField | null => {
      if (!field || typeof field !== 'object') return null;
      const f = field as Record<string, unknown>;
      if (!f.key) return null;

      return {
        key: String(f.key),
        value: String(f.value || ''),
        valueEn: f.valueEn ? String(f.valueEn) : undefined,
        richText: Boolean(f.richText),
      };
    })
    .filter((f): f is ICmsField => f !== null);
};

export async function getCmsPageById(pageId: string): Promise<ICmsPageContent | null> {
  await connectDB();
  const doc = await CmsPageContent.findOne({ pageId, isActive: true }).lean();
  return normalizePage(doc);
}

export async function getCmsPageByPath(path: string): Promise<ICmsPageContent | null> {
  await connectDB();
  const doc = await CmsPageContent.findOne({ path, isActive: true }).lean();
  return normalizePage(doc);
}

export async function getAllCmsPages(): Promise<ICmsPageContent[]> {
  await connectDB();
  const docs = await CmsPageContent.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return docs.map(normalizePage).filter((p): p is ICmsPageContent => p !== null);
}

export async function getAllCmsPagesForSitemap(): Promise<ICmsPageContent[]> {
  await connectDB();
  const docs = await CmsPageContent.find({ isActive: true })
    .select('pageId path updatedAt seo')
    .lean();
  return docs.map(normalizePage).filter((p): p is ICmsPageContent => p !== null);
}

export async function getCmsSection(
  pageId: string,
  sectionId: string
): Promise<ICmsSection | null> {
  const page = await getCmsPageById(pageId);
  if (!page) return null;
  return page.sections.find((s) => s.id === sectionId) || null;
}

export async function getCmsField(
  pageId: string,
  sectionId: string,
  fieldKey: string
): Promise<ICmsField | null> {
  const section = await getCmsSection(pageId, sectionId);
  if (!section) return null;
  return section.fields.find((f) => f.key === fieldKey) || null;
}

export function getFieldValue(
  page: ICmsPageContent | null,
  sectionId: string,
  fieldKey: string,
  isRTL: boolean,
  fallback: string
): string {
  if (!page) return fallback;
  
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) return fallback;
  
  const field = section.fields.find((f) => f.key === fieldKey);
  if (!field) return fallback;
  
  const value = isRTL ? field.value : (field.valueEn ?? field.value);
  return value?.trim() ? value : fallback;
}

export function getSectionFields(
  page: ICmsPageContent | null,
  sectionId: string
): Record<string, { value: string; valueEn?: string }> {
  if (!page) return {};
  
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) return {};
  
  const result: Record<string, { value: string; valueEn?: string }> = {};
  section.fields.forEach((field) => {
    result[field.key] = {
      value: field.value,
      valueEn: field.valueEn,
    };
  });
  
  return result;
}

export const getCachedCmsPageById = unstable_cache(
  async (pageId: string) => {
    return getCmsPageById(pageId);
  },
  ['cms-page-by-id'],
  { revalidate: 300, tags: ['cms-pages'] }
);

export const getCachedAllCmsPages = unstable_cache(
  async () => {
    return getAllCmsPages();
  },
  ['cms-all-pages'],
  { revalidate: 300, tags: ['cms-pages'] }
);

export const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Section', labelAr: 'قسم البطل' },
  { value: 'features', label: 'Features Section', labelAr: 'قسم المميزات' },
  { value: 'pricing', label: 'Pricing Section', labelAr: 'قسم الأسعار' },
  { value: 'cta', label: 'Call to Action', labelAr: 'دعوة للإجراء' },
  { value: 'testimonials', label: 'Testimonials', labelAr: 'شهادات العملاء' },
  { value: 'trust', label: 'Trust / Partners', labelAr: 'الثقة / الشركاء' },
  { value: 'custom', label: 'Custom Content', labelAr: 'محتوى مخصص' },
  { value: 'schoolbit-trust', label: 'SchoolBit Trust Bar', labelAr: 'شريط الثقة - سكول بت' },
  { value: 'schoolbit-problem', label: 'SchoolBit Problem/Value', labelAr: 'المشكلة والحل - سكول بت' },
  { value: 'schoolbit-benefits', label: 'SchoolBit Benefits', labelAr: 'المميزات - سكول بت' },
  { value: 'schoolbit-roles', label: 'SchoolBit Roles', labelAr: 'الأدوار - سكول بت' },
  { value: 'schoolbit-modules', label: 'SchoolBit Modules', labelAr: 'الوحدات - سكول بت' },
  { value: 'schoolbit-automation', label: 'SchoolBit Automation', labelAr: 'الأتمتة - سكول بت' },
  { value: 'schoolbit-integrations', label: 'SchoolBit Integrations', labelAr: 'التكاملات - سكول بت' },
  { value: 'schoolbit-security', label: 'SchoolBit Security', labelAr: 'الأمان - سكول بت' },
  { value: 'schoolbit-outcomes', label: 'SchoolBit Outcomes', labelAr: 'النتائج - سكول بت' },
  { value: 'schoolbit-faq', label: 'SchoolBit FAQ', labelAr: 'الأسئلة الشائعة - سكول بت' },
] as const;

export type SectionType = typeof SECTION_TYPES[number]['value'];

const schoolbitTrustFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'items_json', value: '', richText: true },
  { key: 'items_json_en', value: '', richText: true },
];

const schoolbitProblemFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'problems_json', value: '', richText: true },
  { key: 'problems_json_en', value: '', richText: true },
  { key: 'solution_text', value: '', richText: true },
  { key: 'solution_text_en', value: '', richText: true },
];

const schoolbitBenefitsFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'items_json', value: '', richText: true },
  { key: 'items_json_en', value: '', richText: true },
];

const schoolbitRolesFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'roles_json', value: '', richText: true },
];

const schoolbitModulesFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'modules_json', value: '', richText: true },
];

const schoolbitAutomationFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'items_json', value: '', richText: true },
  { key: 'items_json_en', value: '', richText: true },
  { key: 'highlight_text', value: '', richText: true },
  { key: 'highlight_text_en', value: '', richText: true },
];

const schoolbitIntegrationsFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'description', value: '', richText: true },
  { key: 'description_en', value: '', richText: true },
  { key: 'items_json', value: '', richText: true },
];

const schoolbitSecurityFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'description', value: '', richText: true },
  { key: 'description_en', value: '', richText: true },
  { key: 'features_json', value: '', richText: true },
  { key: 'highlight_text', value: '', richText: true },
  { key: 'highlight_text_en', value: '', richText: true },
];

const schoolbitOutcomesFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'items_json', value: '', richText: true },
  { key: 'items_json_en', value: '', richText: true },
];

const schoolbitFaqFields: ICmsField[] = [
  { key: 'title', value: '', richText: false },
  { key: 'title_en', value: '', richText: false },
  { key: 'faq_json', value: '', richText: true },
];

export function generateSectionId(): string {
  return `section_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createEmptySection(type: SectionType, order: number): ICmsSection {
  const templates: Record<SectionType, Partial<ICmsSection>> = {
    hero: {
      fields: [
        { key: 'badge', value: '', richText: false },
        { key: 'badge_en', value: '', richText: false },
        { key: 'title', value: '', richText: false },
        { key: 'title_en', value: '', richText: false },
        { key: 'description', value: '', richText: true },
        { key: 'description_en', value: '', richText: true },
        { key: 'cta1_text', value: '', richText: false },
        { key: 'cta1_text_en', value: '', richText: false },
        { key: 'cta1_url', value: '', richText: false },
        { key: 'cta2_text', value: '', richText: false },
        { key: 'cta2_text_en', value: '', richText: false },
        { key: 'cta2_url', value: '', richText: false },
        { key: 'image', value: '', richText: false },
      ],
    },
    features: {
      fields: [
        { key: 'title', value: '', richText: false },
        { key: 'title_en', value: '', richText: false },
        { key: 'subtitle', value: '', richText: false },
        { key: 'subtitle_en', value: '', richText: false },
        { key: 'items', value: '', richText: true },
        { key: 'items_en', value: '', richText: true },
      ],
    },
    pricing: {
      fields: [
        { key: 'title', value: '', richText: false },
        { key: 'title_en', value: '', richText: false },
        { key: 'subtitle', value: '', richText: false },
        { key: 'subtitle_en', value: '', richText: false },
        { key: 'plans', value: '', richText: true },
        { key: 'plans_en', value: '', richText: true },
      ],
    },
    cta: {
      fields: [
        { key: 'title', value: '', richText: false },
        { key: 'title_en', value: '', richText: false },
        { key: 'description', value: '', richText: true },
        { key: 'description_en', value: '', richText: true },
        { key: 'button_text', value: '', richText: false },
        { key: 'button_text_en', value: '', richText: false },
        { key: 'button_url', value: '', richText: false },
      ],
    },
    testimonials: {
      fields: [
        { key: 'title', value: '', richText: false },
        { key: 'title_en', value: '', richText: false },
        { key: 'items', value: '', richText: true },
        { key: 'items_en', value: '', richText: true },
      ],
    },
    trust: {
      fields: [
        { key: 'title', value: '', richText: false },
        { key: 'title_en', value: '', richText: false },
        { key: 'logos', value: '', richText: false },
      ],
    },
    custom: {
      fields: [
        { key: 'content', value: '', richText: true },
        { key: 'content_en', value: '', richText: true },
      ],
    },
    'schoolbit-trust': { fields: schoolbitTrustFields },
    'schoolbit-problem': { fields: schoolbitProblemFields },
    'schoolbit-benefits': { fields: schoolbitBenefitsFields },
    'schoolbit-roles': { fields: schoolbitRolesFields },
    'schoolbit-modules': { fields: schoolbitModulesFields },
    'schoolbit-automation': { fields: schoolbitAutomationFields },
    'schoolbit-integrations': { fields: schoolbitIntegrationsFields },
    'schoolbit-security': { fields: schoolbitSecurityFields },
    'schoolbit-outcomes': { fields: schoolbitOutcomesFields },
    'schoolbit-faq': { fields: schoolbitFaqFields },
  };

  return {
    id: generateSectionId(),
    type,
    order,
    fields: (templates[type]?.fields || []).map((f) => ({
      key: f.key || '',
      value: f.value || '',
      valueEn: f.valueEn,
      richText: f.richText || false,
    })),
  };
}
