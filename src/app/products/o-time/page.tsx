import { OTimePage } from '@/components/business/products/OTimePage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa').replace(/\/$/, '');

// Service JSON-LD لمنتج O-Time (نظام موارد بشرية).
function buildOTimeServiceJsonLd(page: CmsPage | null) {
  const seo = extractPageSeo(page, '/products/o-time');
  const description =
    seo.description.ar ||
    'أو-تايم نظام موارد بشرية سعودي: حضور وانصراف بالبصمة، إدارة الإجازات، أتمتة مسير الرواتب، خدمة ذاتية للموظف، وتقارير ولوحات تحليلية.';
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'HR Management System',
    name: 'O-Time',
    alternateName: 'أو-تايم',
    description,
    url: `${SITE_URL}/products/o-time`,
    areaServed: { '@type': 'Country', name: 'SA' },
    provider: { '@type': 'Organization', name: 'CORBIT', alternateName: 'المدار', url: SITE_URL },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const [snapshot, settings] = await Promise.all([
    getSiteCmsSnapshot(),
    getCachedSeoSettings(),
  ]);
  
  const page = getCmsPageById(snapshot, 'otime');
  if (page && page.visible === false) return {};

  const seo = extractPageSeo(page, page?.path || '/products/o-time');
  
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

export default async function OTimeProductPage() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage: CmsPage | null = getCmsPageById(snapshot, 'otime') || null;

  if (cmsPage && cmsPage.visible === false) {
    notFound();
  }

  const serviceJsonLd = buildOTimeServiceJsonLd(cmsPage);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Navbar />
      <OTimePage cmsPage={cmsPage} />
      <Footer />
    </>
  );
}