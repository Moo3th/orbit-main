import { SchoolBitPage } from '@/components/business/products/SchoolBitPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const [snapshot, settings] = await Promise.all([
    getSiteCmsSnapshot(),
    getCachedSeoSettings(),
  ]);

  const page = getCmsPageById(snapshot, 'schoolbit');
  if (page && page.visible === false) return {};

  const seo = extractPageSeo(page, page?.path || '/products/schoolbit');

  const normalizedPage = page ? {
    seo: {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      canonical: seo.canonical,
      noIndex: seo.noIndex,
    },
    social: {
      ogImage: seo.ogImage,
    },
    path: page.path,
  } : null;

  return generatePageMetadata(normalizedPage, settings);
}

export default async function SchoolBitProductPage() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage: CmsPage | null = getCmsPageById(snapshot, 'schoolbit') || null;

  if (cmsPage && cmsPage.visible === false) {
    notFound();
  }

  const partners = snapshot?.partners ?? [];

  return (
    <>
      <Navbar />
      <SchoolBitPage cmsPage={cmsPage} partners={partners} />
      <Footer />
    </>
  );
}