import { GovGatePage } from '@/components/business/products/GovGatePage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa').replace(/\/$/, '');

// Service JSON-LD لمنتج Gov Gate (بوابة مراسلة حكومية آمنة).
function buildGovGateServiceJsonLd(page: CmsPage | null) {
  const seo = extractPageSeo(page, '/products/gov-gate');
  const description =
    seo.description.ar ||
    'بوابة Gov Gate: منصة مراسلات حكومية آمنة لإرسال الرسائل والإشعارات بصلاحيات حسب الأدوار، امتثال تشريعي، وسجل تدقيق.';
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Government Messaging Gateway',
    name: 'Gov Gate',
    alternateName: 'بوابة مراسلة حكومية',
    description,
    url: `${SITE_URL}/products/gov-gate`,
    areaServed: { '@type': 'Country', name: 'SA' },
    provider: { '@type': 'Organization', name: 'CORBIT', alternateName: 'المدار', url: SITE_URL },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const [snapshot, settings] = await Promise.all([
    getSiteCmsSnapshot(),
    getCachedSeoSettings(),
  ]);
  
  const page = getCmsPageById(snapshot, 'govgate');
  if (page && page.visible === false) return {};

  const seo = extractPageSeo(page, page?.path || '/products/gov-gate');
  
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

export default async function GovGateProductPage() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage: CmsPage | null = getCmsPageById(snapshot, 'govgate') || null;

  if (cmsPage && cmsPage.visible === false) {
    notFound();
  }

  const serviceJsonLd = buildGovGateServiceJsonLd(cmsPage);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Navbar />
      <GovGatePage cmsPage={cmsPage} />
      <Footer />
    </>
  );
}