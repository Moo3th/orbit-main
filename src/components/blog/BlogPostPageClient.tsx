'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock3, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { encodeImagePath } from '@/utils/imagePath';
import type { BlogPostRecord } from '@/lib/blog/server';

interface BlogPostPageClientProps {
  post: BlogPostRecord;
}

const estimateReadTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

const formatDate = (value: string | undefined, locale: 'ar-SA' | 'en-US') => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const resolveImageSrc = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://') ? value : encodeImagePath(value);
const isRemoteImage = (value: string) => value.startsWith('http://') || value.startsWith('https://');

export default function BlogPostPageClient({ post }: BlogPostPageClientProps) {
  const { isRTL } = useLanguage();
  const title = isRTL ? (post.titleAr || post.title || '') : (post.title || '');
  const description = isRTL ? (post.descriptionAr || post.description || '') : (post.description || '');
  const content = isRTL ? (post.contentAr || post.content || description) : (post.content || post.contentAr || description);
  const locale = isRTL ? 'ar-SA' : 'en-US';

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-8"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {isRTL ? 'العودة إلى المدونة' : 'Back to Blog'}
          </Link>

          <article dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{post.category}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(post.publishedAt, locale)}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="w-4 h-4" />{estimateReadTime(content)} {isRTL ? 'د' : 'min'}</span>
            </div>

            <h1 className="text-3xl md:text-5xl text-gray-900 dark:text-white leading-tight mb-4">
              {title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {description}
            </p>

            {post.image && (
              <div className="relative w-full h-[320px] md:h-[460px] rounded-3xl overflow-hidden mb-10 border border-gray-200">
                {isRemoteImage(post.image) ? (
                  <img
                    src={resolveImageSrc(post.image)}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={resolveImageSrc(post.image)}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1024px"
                    priority
                  />
                )}
              </div>
            )}

            <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-100 leading-8">
              {content
                .split('\n')
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
