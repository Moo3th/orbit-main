import mongoose, { Schema, Model } from 'mongoose';

export interface ISeoOrganization {
  name: string;
  logo: string;
  description: { en: string; ar: string };
  address: {
    street: string;
    city: string;
    country: string;
  };
  phone: string;
  email: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface ISeoEmailConfig {
  provider: 'emailjs' | 'smtp' | 'none';
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
}

export interface ISeoAnalytics {
  gtmId: string;
  gscVerification: string;
  facebookPixelId: string;
  facebookAccessToken: string;
  clarityProjectId: string;
}

export interface ISeoAppearance {
  adminPrimaryColor: string;
  adminButtonTextColor: string;
  adminAccentColor: string;
  adminSidebarColor: string;
}

export interface ISeoSettings {
  key: string;
  siteName: { en: string; ar: string };
  siteUrl: string;
  notificationEmail: string;
  emailConfig: ISeoEmailConfig;
  defaultSeo: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    keywords: { en: string; ar: string };
  };
  organization: ISeoOrganization;
  analytics: ISeoAnalytics;
  appearance: ISeoAppearance;
  robotsTxt: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const seoOrganizationSchema = new Schema<ISeoOrganization>({
  name: { type: String, default: 'CORBIT | المدار' },
  logo: { type: String, default: '/logo/شعار المدار-03.svg' },
  description: {
    en: { type: String, default: 'Leading technical solutions provider in Saudi Arabia' },
    ar: { type: String, default: 'مزود حلول تقنية رائد في المملكة العربية السعودية' },
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: 'Riyadh' },
    country: { type: String, default: 'SA' },
  },
  phone: { type: String, default: '' },
  email: { type: String, default: 'info@corbit.sa' },
  socialLinks: {
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    facebook: { type: String },
  },
});

const seoAnalyticsSchema = new Schema<ISeoAnalytics>({
  gtmId: { type: String, default: '' },
  gscVerification: { type: String, default: '' },
  facebookPixelId: { type: String, default: '' },
  facebookAccessToken: { type: String, default: '' },
  clarityProjectId: { type: String, default: '' },
});

const seoEmailConfigSchema = new Schema<ISeoEmailConfig>({
  provider: { type: String, enum: ['emailjs', 'smtp', 'none'], default: 'none' },
  emailjsServiceId: { type: String, default: '' },
  emailjsTemplateId: { type: String, default: '' },
  emailjsPublicKey: { type: String, default: '' },
  smtpHost: { type: String, default: '' },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: '' },
  smtpPassword: { type: String, default: '' },
});

const seoAppearanceSchema = new Schema<ISeoAppearance>({
  adminPrimaryColor: { type: String, default: '#7A1E2E' },
  adminButtonTextColor: { type: String, default: '#FFFFFF' },
  adminAccentColor: { type: String, default: '#128C7E' },
  adminSidebarColor: { type: String, default: '#1f2937' },
});

const seoSettingsSchema = new Schema<ISeoSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'primary',
    },
    siteName: {
      en: { type: String, default: 'CORBIT | المدار' },
      ar: { type: String, default: 'CORBIT | المدار' },
    },
    siteUrl: {
      type: String,
      default: process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa',
    },
    notificationEmail: {
      type: String,
      default: 'info@corbit.sa',
    },
    emailConfig: {
      type: seoEmailConfigSchema,
      default: () => ({
        provider: 'none',
        emailjsServiceId: '',
        emailjsTemplateId: '',
        emailjsPublicKey: '',
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
      }),
    },
    defaultSeo: {
      title: {
        en: { type: String, default: 'CORBIT | Leading Technical Solutions' },
        ar: { type: String, default: 'CORBIT | حلول تقنية رائدة' },
      },
      description: {
        en: { type: String, default: '' },
        ar: { type: String, default: '' },
      },
      keywords: {
        en: { type: String, default: '' },
        ar: { type: String, default: '' },
      },
    },
    organization: {
      type: seoOrganizationSchema,
      default: () => ({}),
    },
    analytics: {
      type: seoAnalyticsSchema,
      default: () => ({
        gtmId: '',
        gscVerification: '',
        facebookPixelId: '',
        facebookAccessToken: '',
        clarityProjectId: '',
      }),
    },
    appearance: {
      type: seoAppearanceSchema,
      default: () => ({
        adminPrimaryColor: '#7A1E2E',
        adminButtonTextColor: '#FFFFFF',
        adminAccentColor: '#128C7E',
        adminSidebarColor: '#1f2937',
      }),
    },
    robotsTxt: {
      type: String,
      default: `# robots.txt generated by CORBIT CMS
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

# Sitemap
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa'}/sitemap.xml`,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const existingModel = mongoose.models.SeoSettings as Model<ISeoSettings> | undefined;

if (existingModel) {
  delete mongoose.models.SeoSettings;
}

export const SeoSettings = (mongoose.models.SeoSettings as Model<ISeoSettings>) ||
  mongoose.model<ISeoSettings>('SeoSettings', seoSettingsSchema);
