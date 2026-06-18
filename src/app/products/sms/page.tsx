import { SMSPage } from '@/components/business/products/SMSPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo, getCmsField } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SMS_FAQ_DEFAULTS } from '@/lib/cms/smsFaq';

function buildSmsFaqJsonLd(page: CmsPage | null) {
  let items: { q: string; a: string }[] = SMS_FAQ_DEFAULTS.map((it) => ({ q: it.qAr, a: it.aAr }));
  const raw = getCmsField(page, 'sms-faq', 'faq_json', true, '');
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
  
  const page = getCmsPageById(snapshot, 'sms');
  if (page && page.visible === false) return {};

  const seo = extractPageSeo(page, page?.path || '/products/sms');
  
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

export default async function SMSProductPage() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage: CmsPage | null = getCmsPageById(snapshot, 'sms') || null;
  
  if (cmsPage && cmsPage.visible === false) {
    notFound();
  }

  const partners = snapshot?.partners ?? [];
  const faqJsonLd = buildSmsFaqJsonLd(cmsPage);

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Navbar />
      <SMSPage cmsPage={cmsPage} partners={partners} />
      <Footer />
    </>
  );
}