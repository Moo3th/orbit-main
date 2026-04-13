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
  
  const seo = page.seo;
  
  return {
    id: page.id,
    path: page.path,
    seo: {
      title: {
        ar: typeof seo?.title === 'string' ? seo.title : (seo?.title as any)?.ar || '',
        en: typeof seo?.title === 'object' ? (seo?.title as any)?.en || '' : (page as any).titleEn || '',
      },
      description: {
        ar: typeof seo?.description === 'string' ? seo.description : (seo?.description as any)?.ar || '',
        en: typeof seo?.description === 'object' ? (seo?.description as any)?.en || '' : '',
      },
      keywords: {
        ar: typeof seo?.keywords === 'string' ? seo.keywords : (seo?.keywords as any)?.ar || '',
        en: typeof seo?.keywords === 'object' ? (seo?.keywords as any)?.en || '' : '',
      },
      canonical: seo?.canonical || '',
      noIndex: seo?.noIndex || false,
      ogImage: seo?.ogImage || '',
    },
    social: page.social,
    sections: page.sections,
  };
}

async function readSiteCmsInternal(): Promise<SiteCmsSnapshot | null> {
  await connectDB();
  const doc = (await SiteCms.findOne({ key: 'primary', isActive: true }).lean()) as {
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
    revalidate: 300,
    tags: ['site-cms'],
  }
);
