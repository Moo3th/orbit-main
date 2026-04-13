import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { SeoSettings, ISeoSettings } from '@/models/SeoSettings';
import type { Metadata } from 'next';

interface PageSeoData {
  title: { ar?: string; en?: string };
  description: { ar?: string; en?: string };
  keywords: { ar?: string; en?: string };
  canonical?: string;
  noIndex?: boolean;
}

interface PageSocialData {
  ogImage?: string;
  ogTitle?: { ar?: string; en?: string };
  ogDescription?: { ar?: string; en?: string };
}

interface PageMetadataInput {
  seo?: PageSeoData;
  social?: PageSocialData;
  path?: string;
}

const normalizeSeoSettings = (doc: unknown): ISeoSettings | null => {
  if (!doc || typeof doc !== 'object') return null;
  const settings = doc as Record<string, unknown>;
  
  if (!settings.key) return null;
  
  const orgData = (settings.organization || {}) as Record<string, unknown>;
  const analyticsData = (settings.analytics || {}) as Record<string, string>;
  const defaultSeoData = (settings.defaultSeo || {}) as Record<string, Record<string, string>>;
  const siteNameData = (settings.siteName || {}) as Record<string, string>;
  const emailConfigData = (settings.emailConfig || {}) as Record<string, unknown>;

  return {
    key: String(settings.key),
    siteName: {
      en: String(siteNameData.en || 'ORBIT'),
      ar: String(siteNameData.ar || 'المدار'),
    },
    siteUrl: String(settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.sa'),
    notificationEmail: String((settings.notificationEmail as string) || 'sales@orbit.sa'),
    emailConfig: {
      provider: (emailConfigData.provider as 'emailjs' | 'smtp' | 'none') || 'none',
      emailjsServiceId: String(emailConfigData.emailjsServiceId || ''),
      emailjsTemplateId: String(emailConfigData.emailjsTemplateId || ''),
      emailjsPublicKey: String(emailConfigData.emailjsPublicKey || ''),
      smtpHost: String(emailConfigData.smtpHost || ''),
      smtpPort: Number(emailConfigData.smtpPort) || 587,
      smtpUser: String(emailConfigData.smtpUser || ''),
      smtpPassword: String(emailConfigData.smtpPassword || ''),
    },
    defaultSeo: {
      title: {
        en: String(defaultSeoData.title?.en || ''),
        ar: String(defaultSeoData.title?.ar || ''),
      },
      description: {
        en: String(defaultSeoData.description?.en || ''),
        ar: String(defaultSeoData.description?.ar || ''),
      },
      keywords: {
        en: String(defaultSeoData.keywords?.en || ''),
        ar: String(defaultSeoData.keywords?.ar || ''),
      },
    },
    organization: {
      name: String(orgData.name || 'ORBIT'),
      logo: String(orgData.logo || '/logo/شعار المدار-03.svg'),
      description: {
        en: String((orgData.description as Record<string, string>)?.en || ''),
        ar: String((orgData.description as Record<string, string>)?.ar || ''),
      },
      address: {
        street: String((orgData.address as Record<string, string>)?.street || ''),
        city: String((orgData.address as Record<string, string>)?.city || 'Riyadh'),
        country: String((orgData.address as Record<string, string>)?.country || 'SA'),
      },
      phone: String(orgData.phone || ''),
      email: String(orgData.email || 'info@orbit.sa'),
      socialLinks: {
        twitter: String((orgData.socialLinks as Record<string, string>)?.twitter || ''),
        linkedin: String((orgData.socialLinks as Record<string, string>)?.linkedin || ''),
        instagram: String((orgData.socialLinks as Record<string, string>)?.instagram || ''),
        facebook: String((orgData.socialLinks as Record<string, string>)?.facebook || ''),
      },
    },
    analytics: {
      gtmId: String(analyticsData.gtmId || ''),
      gscVerification: String(analyticsData.gscVerification || ''),
      facebookPixelId: String(analyticsData.facebookPixelId || ''),
      facebookAccessToken: String(analyticsData.facebookAccessToken || ''),
      clarityProjectId: String(analyticsData.clarityProjectId || ''),
    },
    robotsTxt: String(settings.robotsTxt || ''),
    isActive: Boolean(settings.isActive),
    createdAt: settings.createdAt ? new Date(settings.createdAt as string) : new Date(),
    updatedAt: settings.updatedAt ? new Date(settings.updatedAt as string) : new Date(),
  };
};

export async function getSeoSettings(): Promise<ISeoSettings | null> {
  await connectDB();
  const doc = await SeoSettings.findOne({ key: 'primary', isActive: true }).lean();
  return normalizeSeoSettings(doc);
}

export const getCachedSeoSettings = unstable_cache(
  async () => {
    return getSeoSettings();
  },
  ['seo-settings'],
  { revalidate: 300, tags: ['seo-settings'] }
);

export function generatePageMetadata(page: PageMetadataInput | null, settings: ISeoSettings | null) {
  const baseUrl = settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.sa';
  
  const title = page?.seo?.title?.ar || page?.seo?.title?.en || settings?.defaultSeo?.title?.ar || settings?.siteName?.ar || 'ORBIT';
  const description = page?.seo?.description?.ar || page?.seo?.description?.en || settings?.defaultSeo?.description?.ar || '';
  const keywords = page?.seo?.keywords?.ar || page?.seo?.keywords?.en || settings?.defaultSeo?.keywords?.ar || '';
  const canonical = page?.seo?.canonical || `${baseUrl}${page?.path || ''}`;
  const noIndex = page?.seo?.noIndex || false;
  
  const ogTitle = page?.social?.ogTitle?.ar || page?.social?.ogTitle?.en || title;
  const ogDescription = page?.social?.ogDescription?.ar || page?.social?.ogDescription?.en || description;
  const ogImage = page?.social?.ogImage || `${baseUrl}/og-image.png`;
  
  const metadata: Metadata = {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: canonical,
      languages: {
        'ar': `${baseUrl}/ar${page?.path || '/'}`,
        'en': `${baseUrl}/en${page?.path || '/'}`,
      },
    },
    robots: noIndex ? 'noindex, nofollow' : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: settings?.siteName?.ar || settings?.siteName?.en || 'ORBIT',
      locale: 'ar_SA',
      alternateLocale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };

  return metadata;
}

export function generateOrganizationJsonLd(settings: ISeoSettings | null) {
  if (!settings) return null;

  const org = settings.organization;
  const baseUrl = settings.siteUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: baseUrl,
    logo: `${baseUrl}${org.logo}`,
    description: org.description.ar || org.description.en,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: org.phone,
      contactType: 'sales',
      email: org.email,
      availableLanguage: ['Arabic', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: org.address.street,
      addressLocality: org.address.city,
      addressCountry: org.address.country,
    },
    sameAs: [
      org.socialLinks.twitter,
      org.socialLinks.linkedin,
      org.socialLinks.instagram,
      org.socialLinks.facebook,
    ].filter(Boolean),
  };
}

export function generateWebsiteJsonLd(settings: ISeoSettings | null) {
  if (!settings) return null;

  const baseUrl = settings.siteUrl;
  const name = settings.siteName.ar || settings.siteName.en || 'ORBIT';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
