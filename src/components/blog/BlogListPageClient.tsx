'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock3, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';
import { encodeImagePath } from '@/utils/imagePath';
import type { BlogPostRecord } from '@/lib/blog/server';

interface BlogListPageClientProps {
  posts: BlogPostRecord[];
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
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const resolveImageSrc = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://') ? value : encodeImagePath(value);
const isRemoteImage = (value: string) => value.startsWith('http://') || value.startsWith('https://');

export default function BlogListPageClient({ posts }: BlogListPageClientProps) {
  const { isRTL } = useLanguage();
  const featuredPost = posts.find((post) => post.featured) || posts[0];
  const regularPosts = featuredPost ? posts.filter((post) => post._id !== featuredPost._id) : posts;

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <Navbar />

      <section id="blog" className="relative py-32 lg:py-40 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
        <OrbitSectionBackground alignment="both" density="medium" />

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-2xl opacity-20 dark:opacity-10"
              style={{
                width: `${250 + i * 200}px`,
                height: `${250 + i * 200}px`,
                background: i % 2 === 0
                  ? 'radial-gradient(circle, rgba(122, 30, 46, 0.35) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(232, 220, 203, 0.35) 0%, transparent 70%)',
                left: `${15 + i * 35}%`,
                top: `${25 + i * 25}%`,
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.12, 0.25, 0.12],
                x: [0, 20, 0],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 10 + i * 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-heading text-gray-900 dark:text-white mb-5 uppercase tracking-tighter"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? 'المدونة' : 'Blog'}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary via-secondary to-primary rounded-full mx-auto mb-6" />
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
              {isRTL
                ? 'تابع آخر مقالات وتحديثات أوربيت'
                : 'Stay updated with the latest blog articles and product updates from ORBIT'}
            </p>
          </div>

          {posts.length === 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white/90 p-12 text-center">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-heading text-gray-900 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                {isRTL ? 'لا توجد مقالات بعد' : 'No posts yet'}
              </h2>
              <p className="text-gray-600" dir={isRTL ? 'rtl' : 'ltr'}>
                {isRTL ? 'سيتم نشر محتوى المدونة هنا تلقائياً من لوحة الإدارة.' : 'Blog content will appear here automatically from the admin dashboard.'}
              </p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="space-y-10">
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="block">
                  <motion.article whileHover={{ y: -4 }} className="rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-white to-primary/5 shadow-xl overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                      <div className="relative min-h-[260px] lg:min-h-[360px]">
                        {featuredPost.image ? (
                          isRemoteImage(featuredPost.image) ? (
                            <img
                              src={resolveImageSrc(featuredPost.image)}
                              alt={isRTL ? (featuredPost.titleAr || featuredPost.title) : featuredPost.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={resolveImageSrc(featuredPost.image)}
                              alt={isRTL ? (featuredPost.titleAr || featuredPost.title) : featuredPost.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                          )
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-primary/25 to-secondary/25" />
                        )}
                        <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                          {isRTL ? 'مقال مميز' : 'Featured'}
                        </span>
                      </div>
                      <div className="p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary">{featuredPost.category}</span>
                          <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(featuredPost.publishedAt, isRTL ? 'ar-SA' : 'en-US')}</span>
                          <span className="inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" />{estimateReadTime(isRTL ? (featuredPost.contentAr || featuredPost.content || '') : (featuredPost.content || featuredPost.contentAr || ''))} {isRTL ? 'د' : 'min'}</span>
                        </div>
                        <h2 className="text-2xl lg:text-4xl text-gray-900 mb-3 leading-tight" dir={isRTL ? 'rtl' : 'ltr'}>
                          {isRTL ? (featuredPost.titleAr || featuredPost.title) : featuredPost.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed line-clamp-3" dir={isRTL ? 'rtl' : 'ltr'}>
                          {isRTL ? (featuredPost.descriptionAr || featuredPost.description) : featuredPost.description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-primary mt-5 text-sm">
                          {isRTL ? 'قراءة المقال الكامل' : 'Read full article'}
                          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              )}

              {regularPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                  {regularPosts.map((post, index) => (
                    <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                      <Link href={`/blog/${post.slug}`} className="block h-full">
                        <article className="group h-full rounded-3xl border border-gray-200 bg-white/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                          <div className="relative h-52 overflow-hidden">
                            {post.image ? (
                              isRemoteImage(post.image) ? (
                                <img
                                  src={resolveImageSrc(post.image)}
                                  alt={isRTL ? (post.titleAr || post.title) : post.title}
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <Image
                                  src={resolveImageSrc(post.image)}
                                  alt={isRTL ? (post.titleAr || post.title) : post.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                />
                              )
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-primary/25 to-secondary/25" />
                            )}
                          </div>
                          <div className="p-5">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                              <span className="px-2 py-1 rounded-full bg-gray-100">{post.category}</span>
                              <span>{formatDate(post.publishedAt, isRTL ? 'ar-SA' : 'en-US')}</span>
                            </div>
                            <h3 className="text-xl text-gray-900 mb-2 line-clamp-2" dir={isRTL ? 'rtl' : 'ltr'}>
                              {isRTL ? (post.titleAr || post.title) : post.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-3" dir={isRTL ? 'rtl' : 'ltr'}>
                              {isRTL ? (post.descriptionAr || post.description) : post.description}
                            </p>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
