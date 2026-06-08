'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';
import { useLanguage } from '@/contexts/LanguageContext';

export interface LegalPageData {
  title: { en: string; ar: string };
  content: { en: string; ar: string };
  updatedAt?: string;
}

export default function LegalPageClient({ page }: { page: LegalPageData }) {
  const { isRTL } = useLanguage();

  const title = isRTL ? page.title.ar : page.title.en;
  const content = isRTL ? page.content.ar : page.content.en;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white overflow-hidden">
        <OrbitSectionBackground alignment="both" density="low" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-heading tracking-tight"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-primary prose-headings:mt-8 leading-8"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            dir={isRTL ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
