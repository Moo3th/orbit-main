import { SchoolBitPage } from '@/components/business/products/SchoolBitPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo, getCmsJson } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import { parseSchoolBitPlans, getDefaultSchoolBitPlans } from '@/lib/cms/schoolbitPricing';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa').replace(/\/$/, '');

// FAQPage JSON-LD من قسم schoolbit-faq (شكل البيانات q/a الثنائي).
function buildSchoolBitFaqJsonLd(page: CmsPage | null) {
  let items: { q: string; a: string }[] = [];
  const raw = getCmsJson(page, 'schoolbit-faq', 'faq_json', '');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        items = parsed
          .map((it: { q?: string; qEn?: string; a?: string; aEn?: string }) => ({
            q: it.q || it.qEn || '',
            a: it.a || it.aEn || '',
          }))
          .filter((it) => it.q && it.a);
      }
    } catch {
      // ignore
    }
  }
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

// Service JSON-LD لمنتج SchoolBit مع عروض الأسعار (الباقات).
function buildSchoolBitServiceJsonLd(page: CmsPage | null) {
  const rawPlans = getCmsJson(page, 'schoolbit-pricing', 'plans_list', '');
  const plans = parseSchoolBitPlans(rawPlans, getDefaultSchoolBitPlans(true));
  const offers = plans
    .filter((p) => !p.isCustom && p.price != null)
    .map((p) => ({
      '@type': 'Offer',
      name: p.name,
      price: String(p.price ?? 0),
      priceCurrency: 'SAR',
      url: `${SITE_URL}/products/schoolbit`,
    }));

  const seo = extractPageSeo(page, '/products/schoolbit');
  const description =
    seo.description.ar ||
    'نظام حضور وانصراف ذكي وإدارة مدرسية عربي بالكامل — بصمة BioTime، تكامل نظام نور، إشعارات واتساب ورسائل للأهالي، تقارير وجداول واختبارات.';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'School Management System',
    name: 'SchoolBit',
    alternateName: 'سكول بت',
    description,
    url: `${SITE_URL}/products/schoolbit`,
    areaServed: { '@type': 'Country', name: 'SA' },
    provider: {
      '@type': 'Organization',
      name: 'CORBIT',
      alternateName: 'المدار',
      url: SITE_URL,
    },
    ...(offers.length
      ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'SAR', offers } }
      : {}),
  };
}

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
  const faqJsonLd = buildSchoolBitFaqJsonLd(cmsPage);
  const serviceJsonLd = buildSchoolBitServiceJsonLd(cmsPage);

  return (
    <>
      {serviceJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Navbar />
      <SchoolBitPage cmsPage={cmsPage} partners={partners} />
      <Footer />
    </>
  );
}
