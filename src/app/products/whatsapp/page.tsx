import { WhatsAppPage } from '@/components/business/products/WhatsAppPage';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo, getCmsField, getCmsJson } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import { parseWhatsAppPlans, getDefaultWhatsAppPlans } from '@/lib/cms/whatsappPricing';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WA_FAQ_DEFAULTS } from '@/lib/cms/waFaq';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa').replace(/\/$/, '');

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

// Service JSON-LD لمنتج واتساب بزنس API مع عروض الأسعار (الباقات) — يستهدف «سعر/تكاليف واتساب api».
function buildWaServiceJsonLd(page: CmsPage | null) {
  const rawPlans = getCmsJson(page, 'wa-pricing', 'plans_list', '');
  const plans = parseWhatsAppPlans(rawPlans, getDefaultWhatsAppPlans(true));
  const toNum = (s: string): number | null => {
    const n = parseFloat(String(s).replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : null;
  };
  const offers = plans
    .map((p) => {
      const prices = p.tiers.map((t) => toNum(t.price)).filter((n): n is number => n != null);
      if (!prices.length) return null;
      return {
        '@type': 'Offer',
        name: p.name,
        price: String(Math.min(...prices)),
        priceCurrency: 'SAR',
        url: `${SITE_URL}/products/whatsapp`,
      };
    })
    .filter((o): o is NonNullable<typeof o> => o != null);

  const allPrices = plans
    .flatMap((p) => p.tiers.map((t) => toNum(t.price)))
    .filter((n): n is number => n != null);

  const seo = extractPageSeo(page, '/products/whatsapp');
  const description =
    seo.description.ar ||
    'واتساب بزنس API (واجهة واتساب الأعمال الرسمية) من المدار في السعودية: تفعيل واشتراك، أسعار واضحة، قوالب معتمدة، شات بوت، الشارة الخضراء، وتكامل مع سلة ودفترة.';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'WhatsApp Business API',
    name: 'واتساب بزنس API — المدار',
    alternateName: 'WhatsApp Business API',
    description,
    url: `${SITE_URL}/products/whatsapp`,
    areaServed: { '@type': 'Country', name: 'SA' },
    provider: {
      '@type': 'Organization',
      name: 'CORBIT',
      alternateName: 'المدار',
      url: SITE_URL,
    },
    ...(offers.length && allPrices.length
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'SAR',
            lowPrice: String(Math.min(...allPrices)),
            highPrice: String(Math.max(...allPrices)),
            offerCount: offers.length,
            offers,
          },
        }
      : {}),
  };
}

// BreadcrumbList JSON-LD (مفقود سابقاً من صفحات المنتجات).
function buildWaBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'واتساب بزنس API', item: `${SITE_URL}/products/whatsapp` },
    ],
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
  const serviceJsonLd = buildWaServiceJsonLd(cmsPage);
  const breadcrumbJsonLd = buildWaBreadcrumbJsonLd();

  return (
    <>
      {serviceJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
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