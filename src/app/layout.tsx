import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleTagManager from "@/components/GoogleTagManager";
import ClarityAnalytics from "@/components/ClarityAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import PrivacyConsent from "@/components/PrivacyConsent";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { getCachedSeoSettings, generateOrganizationJsonLd, generateWebsiteJsonLd } from "@/lib/seo";
import { WebsiteJsonLd } from "@/components/JsonLd";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-ibm-plex-arabic',
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.sa';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSeoSettings();
  
  return {
    title: settings?.siteName?.ar || settings?.siteName?.en || "ORBIT | المدار",
    applicationName: settings?.siteName?.ar || "ORBIT | المدار",
    description: settings?.defaultSeo?.description?.ar || "حلول تقنية رائدة في المملكة العربية السعودية",
    keywords: settings?.defaultSeo?.keywords?.ar || "ORBIT, المدار, حلول تقنية, SMS, واتساب, السعودية",
    icons: {
      icon: '/logo/شعار المدار-03.svg',
      apple: '/logo/شعار المدار-03.svg',
    },
    openGraph: {
      title: settings?.siteName?.ar || "ORBIT | المدار",
      description: settings?.defaultSeo?.description?.ar || "حلول تقنية رائدة في المملكة العربية السعودية",
      siteName: settings?.siteName?.ar || "ORBIT | المدار",
      type: "website",
      locale: "ar_SA",
      alternateLocale: "en_US",
      url: baseUrl,
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        'ar': baseUrl,
        'en': `${baseUrl}/en`,
      },
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getCachedSeoSettings();
  const organizationJsonLd = generateOrganizationJsonLd(settings);
  const websiteJsonLd = generateWebsiteJsonLd(settings);

  const gscVerification = settings?.analytics?.gscVerification || '';
  const gtmIdFromSettings = settings?.analytics?.gtmId || process.env.NEXT_PUBLIC_GTM_ID?.trim() || '';
  const facebookPixelIdFromSettings = settings?.analytics?.facebookPixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID?.trim() || '';
  const clarityProjectIdFromSettings = settings?.analytics?.clarityProjectId || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() || '';

  const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false';
  const hasGtm = Boolean(gtmIdFromSettings);
  const hasPixel = Boolean(facebookPixelIdFromSettings);
  const hasClarity = Boolean(clarityProjectIdFromSettings);

  return (
    <html lang="ar" className={`scroll-smooth overflow-x-hidden ${ibmPlexSans.variable} ${ibmPlexSansArabic.variable}`}>
      <head>
        {gscVerification && (
          <meta name="google-site-verification" content={gscVerification} />
        )}
        <OrganizationJsonLd data={organizationJsonLd} />
        <WebsiteJsonLd data={websiteJsonLd} />
      </head>
      <body className="antialiased transition-colors duration-300 overflow-x-hidden" style={{ width: '100%', maxWidth: '100vw' }} suppressHydrationWarning>
        {analyticsEnabled && hasGtm ? <GoogleTagManager gtmId={gtmIdFromSettings} /> : null}
        {analyticsEnabled && hasPixel ? (
          <MetaPixel pixelId={facebookPixelIdFromSettings} />
        ) : null}
        {analyticsEnabled && hasClarity ? (
          <ClarityAnalytics 
            projectId={clarityProjectIdFromSettings}
            enabled={true}
            respectPrivacy={true}
          />
        ) : null}
        <ThemeProvider>
          <LanguageProvider>
            {(analyticsEnabled && (hasGtm || hasPixel || hasClarity)) ? <PrivacyConsent /> : null}

            {children}
          </LanguageProvider>
        </ThemeProvider>
        {analyticsEnabled ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}