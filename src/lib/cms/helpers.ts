import type { CmsPage, SiteCmsSnapshot } from '@/lib/cms/types';

export function getCmsPageById(snapshot: SiteCmsSnapshot | null, pageId: string): CmsPage | null {
  if (!snapshot) return null;
  return snapshot.pages.find((page) => page.id === pageId) ?? null;
}

export function getCmsField(
  page: CmsPage | null,
  sectionId: string,
  fieldKey: string,
  isRTL: boolean,
  fallback: string
): string {
  if (!page) return fallback;
  const section = page.sections?.find((s) => s.id === sectionId);
  if (!section) return fallback;
  const field = section.fields?.find((f) => f.key === fieldKey);
  if (!field) return fallback;

  const value = isRTL ? field.value : (field.valueEn ?? field.value);
  return value?.trim() ? value : fallback;
}

/**
 * يحلّل وجهة زر الدعوة (CTA) القابلة للضبط من اللوحة:
 *  - `<baseKey>_type` = 'form'      → فورم الخدمة الداخلي `/products/<productSlug>/form` (الافتراضي).
 *  - `<baseKey>_type` = 'external'  → الرابط المخصّص في `<baseKey>_url` (أو defaultUrl، وإلا الفورم).
 *
 * productSlug هو سلَج المسار: 'sms' | 'whatsapp' | 'o-time' | 'gov-gate' | 'schoolbit'.
 * يعمّم النمط الذي كان في OTimePage. defaultUrl يُمرَّر للحفاظ على الرابط الخارجي القديم عند اختيار 'external'
 * بلا قيمة محفوظة.
 */
export function resolveCtaLink(
  page: CmsPage | null,
  sectionId: string,
  baseKey: string,
  productSlug: string,
  isRTL: boolean,
  defaultUrl = ''
): string {
  const formPath = `/products/${productSlug}/form`;
  const type = getCmsField(page, sectionId, `${baseKey}_type`, isRTL, 'form');
  if (type === 'form') return formPath;
  const url = getCmsField(page, sectionId, `${baseKey}_url`, isRTL, '');
  return url || defaultUrl || formPath;
}

/**
 * قراءة حقل JSON ثنائي اللغة مخزّن كـ blob واحد في `value` (والمكوّن يختار اللغة لكل عنصر).
 * بخلاف getCmsField، لا يعتمد على isRTL — فالـ blob يحوي اللغتين معاً؛ يقرأ value ثم يحتاط بـ valueEn.
 * هذا يمنع اختفاء محتوى القوائم في الوضع الإنجليزي حين تكون valueEn فارغة.
 */
export function getCmsJson(
  page: CmsPage | null,
  sectionId: string,
  fieldKey: string,
  fallback: string = ''
): string {
  if (!page) return fallback;
  const section = page.sections?.find((s) => s.id === sectionId);
  if (!section) return fallback;
  const field = section.fields?.find((f) => f.key === fieldKey);
  if (!field) return fallback;
  if (field.value?.trim()) return field.value;
  if (field.valueEn?.trim()) return field.valueEn;
  return fallback;
}

export function getCmsSpacing(
  page: CmsPage | null,
  sectionId: string,
  fallback: string
): string {
  const raw = getCmsField(page, sectionId, 'spacing', false, '');
  return raw.trim() || fallback;
}

export function getCmsMarginBefore(
  page: CmsPage | null,
  sectionId: string,
  fallback: string
): string {
  const raw = getCmsField(page, sectionId, 'margin_before', false, '');
  return raw.trim() || fallback;
}

export function getCmsMarginAfter(
  page: CmsPage | null,
  sectionId: string,
  fallback: string
): string {
  const raw = getCmsField(page, sectionId, 'margin_after', false, '');
  return raw.trim() || fallback;
}

export function getCmsDisplayColumns(
  page: CmsPage | null,
  sectionId: string,
  breakpoint: 'mobile' | 'tablet' | 'desktop',
  fallback: number
): number {
  const raw = getCmsField(page, sectionId, 'display', false, '');
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.columns?.[breakpoint] ?? fallback;
  } catch {
    return fallback;
  }
}

export function getColumnClasses(
  page: CmsPage | null,
  sectionId: string,
  defaults: { mobile?: number; tablet?: number; desktop?: number } = { mobile: 1, tablet: 2, desktop: 3 }
): string {
  const mobile = getCmsDisplayColumns(page, sectionId, 'mobile', defaults.mobile ?? 1);
  const tablet = getCmsDisplayColumns(page, sectionId, 'tablet', defaults.tablet ?? 2);
  const desktop = getCmsDisplayColumns(page, sectionId, 'desktop', defaults.desktop ?? 3);

  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };
  const mdGridCols: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };
  const lgGridCols: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };

  return `${gridCols[mobile] || 'grid-cols-1'} ${mdGridCols[tablet] || 'md:grid-cols-2'} ${lgGridCols[desktop] || 'lg:grid-cols-3'}`;
}

/**
 * يبني دالة تُرجِع `style` (order + إظهار/إخفاء) لكل قسم بحسب ترتيب مصفوفة أقسام الصفحة في الـ CMS.
 * تُستخدم مع flexbox (`display:flex; flex-direction:column`) لإعادة ترتيب الأقسام من اللوحة دون نقل الكود.
 * canonical: الترتيب الافتراضي للأقسام (يُستخدم حين لا يوجد القسم في بيانات الـ CMS).
 */
export function makeSectionStyle(
  page: CmsPage | null,
  canonical: string[]
): (id: string) => { order: number; display?: 'none' } {
  const orderOf = new Map<string, number>();
  (page?.sections || []).forEach((s, i) => orderOf.set(s.id, i));
  const hidden = new Set(
    (page?.sections || []).filter((s) => (s as { visible?: boolean }).visible === false).map((s) => s.id)
  );
  return (id: string) => {
    const order = orderOf.has(id)
      ? (orderOf.get(id) as number)
      : (canonical.indexOf(id) >= 0 ? canonical.indexOf(id) + 100 : 999);
    return hidden.has(id) ? { order, display: 'none' as const } : { order };
  };
}

export interface PageSeoInput {
  seo?: Record<string, unknown> | null;
  title?: string;
  titleEn?: string;
  path?: string;
}

export function extractPageSeo(page: PageSeoInput | null, defaultPath: string = '') {
  if (!page) {
    return {
      title: { ar: '', en: '' },
      description: { ar: '', en: '' },
      keywords: { ar: '', en: '' },
      canonical: '',
      noIndex: false,
      ogImage: '',
    };
  }

  const seo = (page.seo as Record<string, unknown>) || {};

  const titleRaw = seo.title;
  const titleEnRaw = seo.titleEn;
  const descRaw = seo.description;
  const descEnRaw = seo.descriptionEn;
  const kwRaw = seo.keywords;
  const kwEnRaw = seo.keywordsEn;

  const titleAr = typeof titleRaw === 'string' ? titleRaw : ((titleRaw as Record<string, string>)?.ar || '');
  const titleEnStr = typeof titleEnRaw === 'string' ? titleEnRaw : ((titleRaw as Record<string, string>)?.en || '');
  const descAr = typeof descRaw === 'string' ? descRaw : ((descRaw as Record<string, string>)?.ar || '');
  const descEn = typeof descEnRaw === 'string' ? descEnRaw : ((descRaw as Record<string, string>)?.en || '');
  const kwAr = typeof kwRaw === 'string' ? kwRaw : ((kwRaw as Record<string, string>)?.ar || '');
  const kwEn = typeof kwEnRaw === 'string' ? kwEnRaw : ((kwRaw as Record<string, string>)?.en || '');

  const canonical = String(seo.canonical || '');
  const noIndex = Boolean(seo.noIndex);
  const ogImage = String(seo.ogImage || '');

  return {
    title: { ar: titleAr, en: titleEnStr },
    description: { ar: descAr, en: descEn },
    keywords: { ar: kwAr, en: kwEn },
    canonical,
    noIndex,
    ogImage,
  };
}
