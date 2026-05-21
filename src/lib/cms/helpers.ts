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
