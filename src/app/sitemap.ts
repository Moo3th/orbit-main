import { MetadataRoute } from 'next';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCachedSeoSettings } from '@/lib/seo';
import { getActiveLegalPages } from '@/lib/cms/legal';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa';

  const [snapshot, settings, legalPages] = await Promise.all([
    getSiteCmsSnapshot(),
    getCachedSeoSettings(),
    getActiveLegalPages(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/products/whatsapp`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products/sms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products/o-time`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products/gov-gate`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // الصفحات القانونية (ديناميكية من قاعدة البيانات)
  const legalEntries: MetadataRoute.Sitemap = legalPages.map((p) => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));
  staticPages.push(...legalEntries);

  const pages = snapshot?.pages || [];
  const dynamicPages: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page.path === '/' ? 1 : 0.8,
    alternates: {
      languages: {
        ar: `${baseUrl}/ar${page.path}`,
        en: `${baseUrl}/en${page.path}`,
      },
    },
  }));

  return [...staticPages, ...dynamicPages];
}