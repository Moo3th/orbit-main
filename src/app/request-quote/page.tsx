import RequestQuoteForm from '@/components/business/RequestQuoteForm';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const [snapshot, settings] = await Promise.all([
    getSiteCmsSnapshot(),
    getCachedSeoSettings(),
  ]);

  const page = getCmsPageById(snapshot, 'request-quote');
  const seo = extractPageSeo(page, page?.path || '/request-quote');

  const normalizedPage = page ? {
    seo: {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      canonical: seo.canonical,
      noIndex: seo.noIndex,
    },
    social: { ogImage: seo.ogImage },
    path: page.path,
  } : null;

  return generatePageMetadata(normalizedPage, settings);
}

export default async function RequestQuotePage() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage: CmsPage | null = getCmsPageById(snapshot, 'request-quote') || null;

  return <RequestQuoteForm cmsPage={cmsPage} />;
}
