import Navbar from '@/components/Navbar';
import About from '@/components/About';
import WhyOrbit from '@/components/WhyOrbit';
import Footer from '@/components/Footer';
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

  const page = getCmsPageById(snapshot, 'about');
  const seo = extractPageSeo(page, page?.path || '/about-us');

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

export default async function AboutUs() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage: CmsPage | null = getCmsPageById(snapshot, 'about') || null;

  return (
    <div className="min-h-screen" style={{ minHeight: '100dvh' }}>
      <Navbar />

      <About cmsPage={cmsPage} />

      <WhyOrbit cmsPage={cmsPage} />

      <Footer />
    </div>
  );
}
