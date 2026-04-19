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
