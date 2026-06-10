import { LandingPage } from '@/components/business/landing/LandingPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WhatsAppButton } from '@/components/business/landing/WhatsAppButton';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo, getCmsField } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';

const SHOW_WHATSAPP_BUTTON = false;

// أسئلة افتراضية تُستخدم في JSON-LD حين لا توجد بيانات محفوظة بعد (مطابقة لمكوّن Faq)
const FAQ_DEFAULTS_AR: { q: string; a: string }[] = [
  { q: 'ما هي خدمات المدار؟', a: 'نوفّر منصات مراسلة احترافية: الرسائل النصية SMS، واتساب أعمال API، نظام الموارد البشرية O-Time، وبوابة المراسلة الحكومية Gov Gate.' },
  { q: 'كم يستغرق تفعيل الخدمة؟', a: 'يمكنك البدء خلال دقائق عبر التسجيل، وفريقنا يساعدك في الربط والإعداد حسب احتياجك.' },
  { q: 'هل بياناتي آمنة؟', a: 'نعم، بياناتك مشفّرة ومحفوظة داخل السعودية بامتثال كامل لمتطلبات الأمن السيبراني.' },
  { q: 'ما وسائل الدفع المتاحة؟', a: 'نقبل التحويل البنكي، مدى، فيزا، بالإضافة إلى الدفع الآجل للشركات الكبرى.' },
];

function buildFaqJsonLd(page: CmsPage | null) {
  let items: { q: string; a: string }[] = FAQ_DEFAULTS_AR;
  const raw = getCmsField(page, 'home-faq', 'faq_json', true, '');
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
  
  const page = getCmsPageById(snapshot, 'home');
  const seo = extractPageSeo(page, page?.path || '/');
  
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

function convertToCmsPage(pageData: { pageId: string; path: string; sections: { id: string; fields: { key: string; value: string; valueEn?: string }[] }[] } | null): CmsPage | null {
  if (!pageData) return null;
  return {
    id: pageData.pageId,
    path: pageData.path,
    sections: pageData.sections.map(s => ({
      id: s.id,
      fields: s.fields.map(f => ({
        key: f.key,
        value: f.value,
        valueEn: f.valueEn,
      })),
    })),
  };
}

export default async function Home() {
  const snapshot = await getSiteCmsSnapshot();
  const oldHomePage = getCmsPageById(snapshot, 'home');
  const homePage: CmsPage | null = oldHomePage || null;
  const partners = snapshot?.partners ?? [];
  const faqJsonLd = buildFaqJsonLd(homePage);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#7A1E2E]/20 overflow-x-hidden">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Navbar />
      <main>
        <LandingPage pageData={homePage} partners={partners} />
      </main>
      <Footer />
      {SHOW_WHATSAPP_BUTTON && <WhatsAppButton />}
    </div>
  );
}