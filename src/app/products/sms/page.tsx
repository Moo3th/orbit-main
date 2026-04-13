import { SMSPage } from '@/components/business/products/SMSPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById } from '@/lib/cms/helpers';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';
import type { CmsPage } from '@/lib/cms/types';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const [snapshot, settings] = await Promise.all([
    getSiteCmsSnapshot(),
    getCachedSeoSettings(),
  ]);
  
  const page = getCmsPageById(snapshot, 'sms');
  
  const normalizedPage = page ? {
    pageId: page.id,
    path: page.path,
    seo: {
      title: { 
        ar: (page.seo as any)?.title || '', 
        en: (page.seo as any)?.titleEn || '' 
      },
      description: { 
        ar: (page.seo as any)?.description || '', 
        en: (page.seo as any)?.descriptionEn || '' 
      },
      keywords: { 
        ar: (page.seo as any)?.keywords || '', 
        en: (page.seo as any)?.keywordsEn || '' 
      },
      canonical: (page.seo as any)?.canonical || '',
      noIndex: (page.seo as any)?.noIndex || false,
    },
    social: {
      ogImage: (page.seo as any)?.ogImage || '',
      ogTitle: { ar: '', en: '' },
      ogDescription: { ar: '', en: '' },
    },
    sections: [],
    order: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } : null;
  
  return generatePageMetadata(normalizedPage, settings);
}

export default async function SMSProductPage() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage: CmsPage | null = getCmsPageById(snapshot, 'sms') || null;
  const partners = snapshot?.partners ?? [];

  return (
    <>
      <Navbar />
      <SMSPage cmsPage={cmsPage} partners={partners} />
      <Footer />
    </>
  );
}