import { MetadataRoute } from 'next';
import { getCachedSeoSettings } from '@/lib/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.sa';
  
  let robotsRules: MetadataRoute.Robots['rules'] = {
    userAgent: '*',
    allow: '/',
    disallow: ['/admin/', '/api/', '/_next/'],
  };

  try {
    const settings = await getCachedSeoSettings();
    if (settings?.robotsTxt) {
      const lines = settings.robotsTxt.split('\n');
      const allowDirs: string[] = [];
      const disallowDirs: string[] = [];
      let currentUserAgent = '*';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().startsWith('user-agent:')) {
          currentUserAgent = trimmed.substring(11).trim();
        } else if (trimmed.toLowerCase().startsWith('allow:')) {
          allowDirs.push(trimmed.substring(6).trim());
        } else if (trimmed.toLowerCase().startsWith('disallow:')) {
          disallowDirs.push(trimmed.substring(9).trim());
        }
      }

      if (allowDirs.length > 0 || disallowDirs.length > 0) {
        robotsRules = {
          userAgent: currentUserAgent,
          allow: allowDirs.length > 0 ? allowDirs : '/',
          disallow: disallowDirs.length > 0 ? disallowDirs : ['/admin/', '/api/'],
        };
      }
    }
  } catch (error) {
    console.error('Failed to load custom robots.txt settings:', error);
  }

  return {
    rules: robotsRules,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
