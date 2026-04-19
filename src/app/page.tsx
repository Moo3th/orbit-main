import { LandingPage } from '@/components/business/landing/LandingPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WhatsAppButton } from '@/components/business/landing/WhatsAppButton';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, extractPageSeo } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';

const SHOW_WHATSAPP_BUTTON = false;

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

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#7A1E2E]/20 overflow-x-hidden">
      <Navbar />
      <main>
        <LandingPage pageData={homePage} partners={partners} />
      </main>
      <Footer />
      {SHOW_WHATSAPP_BUTTON && <WhatsAppButton />}
    </div>
  );
}