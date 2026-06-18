import { WhatsAppPage } from '@/components/business/products/WhatsAppPage';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo, getCmsField } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WA_FAQ_DEFAULTS } from '@/lib/cms/waFaq';

function buildWaFaqJsonLd(page: CmsPage | null) {
  let items: { q: string; a: string }[] = WA_FAQ_DEFAULTS.map((it) => ({ q: it.qAr, a: it.aAr }));
  const raw = getCmsField(page, 'wa-faq', 'faq_json', true, '');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        items = parsed
          .map((it: { qAr?: string; qEn?: string; titleAr?: string; aAr?: string; aEn?: string; descAr?: string }) => ({
            q: it.qAr || it.titleAr || it.qEn || '',
            a: it.aAr || it.descAr || it.aEn || '',
          }))
          .filter((it) => it.q && it.a);
      }
    } catch {
      // keep defaults
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

export async function generateMetadata(): Promise<Metadata> {
  const [snapshot, settings] = await Promise.all([
    getSiteCmsSnapshot(),
    getCachedSeoSettings(),
  ]);
  
  const page = getCmsPageById(snapshot, 'whatsapp');
  if (page && page.visible === false) return {};

  const seo = extractPageSeo(page, page?.path || '/products/whatsapp');
  
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

export default async function WhatsAppProductPage() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage: CmsPage | null = getCmsPageById(snapshot, 'whatsapp') || null;

  if (cmsPage && cmsPage.visible === false) {
    notFound();
  }

  const faqJsonLd = buildWaFaqJsonLd(cmsPage);

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <WhatsAppPage cmsPage={cmsPage} />
    </>
  );
}