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
