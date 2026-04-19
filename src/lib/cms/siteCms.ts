import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import SiteCms from '@/models/SiteCms';
import type { CmsFooterData, CmsPage, CmsPartner, SiteCmsSnapshot } from '@/lib/cms/types';
import { mergePartnersWithTrustedLogos } from '@/lib/cms/trustedLogos';

export interface NormalizedPageSeo {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  keywords: { ar: string; en: string };
  canonical: string;
  noIndex: boolean;
  ogImage: string;
}

export interface NormalizedPage {
  id: string;
  path: string;
  seo: NormalizedPageSeo;
  social?: {
    ogImage?: string;
    ogTitle?: { ar?: string; en?: string };
    ogDescription?: { ar?: string; en?: string };
  };
  sections: CmsPage['sections'];
}

export function normalizePageSeo(page: CmsPage | null): NormalizedPage | null {
  if (!page) return null;
  
  const seo = (page.seo as Record<string, unknown>) || {};
  
  const titleRaw = seo.title;
  const descRaw = seo.description;
  const kwRaw = seo.keywords;

  const titleAr = typeof titleRaw === 'string' ? titleRaw : ((titleRaw as Record<string, string>)?.ar || '');
  const titleEn = typeof seo.titleEn === 'string' ? seo.titleEn as string : ((titleRaw as Record<string, string>)?.en || '');
  const descAr = typeof descRaw === 'string' ? descRaw : ((descRaw as Record<string, string>)?.ar || '');
  const descEn = typeof seo.descriptionEn === 'string' ? seo.descriptionEn as string : ((descRaw as Record<string, string>)?.en || '');
  const kwAr = typeof kwRaw === 'string' ? kwRaw : ((kwRaw as Record<string, string>)?.ar || '');
  const kwEn = typeof seo.keywordsEn === 'string' ? seo.keywordsEn as string : ((kwRaw as Record<string, string>)?.en || '');
  
  return {
    id: page.id,
    path: page.path,
    seo: {
      title: { ar: titleAr, en: titleEn },
      description: { ar: descAr, en: descEn },
      keywords: { ar: kwAr, en: kwEn },
      canonical: String(seo.canonical || ''),
      noIndex: Boolean(seo.noIndex),
      ogImage: String(seo.ogImage || ''),
    },
    social: page.social,
    sections: page.sections,
  };
}

async function readSiteCmsInternal(): Promise<SiteCmsSnapshot | null> {
  await connectDB();
  const doc = (await SiteCms.findOne({ key: 'primary' }).lean()) as {
    pages?: CmsPage[];
    partners?: CmsPartner[];
    footerData?: CmsFooterData;
  } | null;
  if (!doc) {
    const partners = await mergePartnersWithTrustedLogos([]);
    return {
      pages: [],
      partners,
    };
  }

  const mergedPartners = await mergePartnersWithTrustedLogos(doc.partners);

  return {
    pages: Array.isArray(doc.pages) ? (doc.pages as CmsPage[]) : [],
    partners: mergedPartners,
    footerData: (doc.footerData && typeof doc.footerData === 'object')
      ? (doc.footerData as CmsFooterData)
      : undefined,
  };
}

export const getSiteCmsSnapshot = unstable_cache(
  async () => {
    try {
      return await readSiteCmsInternal();
    } catch (error) {
      console.error('Failed to load Site CMS snapshot:', error);
      return null;
    }
  },
  ['site-cms-snapshot-v2'],
  {
    revalidate: 60,
    tags: ['site-cms'],
  }
);
