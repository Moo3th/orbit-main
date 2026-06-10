import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { SeoSettings } from '@/models/SeoSettings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Recursively remove Mongo internal keys (_id, __v) so round-tripped sub-objects
// (which may carry a serialized ObjectId buffer) don't fail ObjectId casting on save.
function stripMongoKeys<T>(val: T): T {
  if (Array.isArray(val)) {
    return val.map((v) => stripMongoKeys(v)) as unknown as T;
  }
  if (val && typeof val === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(val as Record<string, unknown>)) {
      if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') continue;
      out[key] = stripMongoKeys((val as Record<string, unknown>)[key]);
    }
    return out as unknown as T;
  }
  return val;
}

export async function GET() {
  try {
    await connectDB();
    let settings = await SeoSettings.findOne({ key: 'primary' }).lean();

    if (!settings) {
      settings = await SeoSettings.create({
        key: 'primary',
        siteName: {
          en: 'CORBIT | المدار',
          ar: 'CORBIT | المدار',
        },
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa',
        notificationEmail: 'info@corbit.sa',
        emailConfig: {
          provider: 'none',
          emailjsServiceId: '',
          emailjsTemplateId: '',
          emailjsPublicKey: '',
          smtpHost: '',
          smtpPort: 587,
          smtpUser: '',
          smtpPassword: '',
        },
        defaultSeo: {
          title: { en: '', ar: '' },
          description: { en: '', ar: '' },
          keywords: { en: '', ar: '' },
        },
        organization: {
          name: 'CORBIT',
          logo: '/logo/شعار المدار-03.svg',
          description: {
            en: 'Leading technical solutions provider in Saudi Arabia',
            ar: 'مزود حلول تقنية رائد في المملكة العربية السعودية',
          },
          address: {
            street: '',
            city: 'Riyadh',
            country: 'SA',
          },
          phone: '',
          email: 'info@corbit.sa',
          socialLinks: {},
        },
        analytics: {
          gtmId: '',
          gscVerification: '',
          facebookPixelId: '',
          facebookAccessToken: '',
          clarityProjectId: '',
        },
        robotsTxt: `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /_next/

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa'}/sitemap.xml`,
        isActive: true,
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        _id: settings._id.toString(),
        key: settings.key,
        siteName: settings.siteName,
        siteUrl: settings.siteUrl,
        notificationEmail: (settings as any).notificationEmail || 'info@corbit.sa',
        emailConfig: (settings as any).emailConfig || {
          provider: 'none',
          emailjsServiceId: '',
          emailjsTemplateId: '',
          emailjsPublicKey: '',
          smtpHost: '',
          smtpPort: 587,
          smtpUser: '',
          smtpPassword: '',
        },
        defaultSeo: settings.defaultSeo,
        organization: settings.organization,
        analytics: settings.analytics,
        robotsTxt: settings.robotsTxt,
        isActive: settings.isActive,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch SEO settings';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    console.log('PUT body received:', JSON.stringify(body, null, 2));
    
    const {
      siteName,
      siteUrl,
      notificationEmail,
      emailConfig,
      defaultSeo,
      organization,
      analytics,
      robotsTxt,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (siteName !== undefined) updateData.siteName = stripMongoKeys(siteName);
    if (siteUrl !== undefined) updateData.siteUrl = siteUrl;
    if (notificationEmail !== undefined) updateData.notificationEmail = notificationEmail;
    if (emailConfig !== undefined) updateData.emailConfig = stripMongoKeys(emailConfig);
    if (defaultSeo !== undefined) updateData.defaultSeo = stripMongoKeys(defaultSeo);
    if (organization !== undefined) updateData.organization = stripMongoKeys(organization);
    if (analytics !== undefined) updateData.analytics = stripMongoKeys(analytics);
    if (robotsTxt !== undefined) updateData.robotsTxt = robotsTxt;

    console.log('Update data:', JSON.stringify(updateData, null, 2));

    const settings = await SeoSettings.findOneAndUpdate(
      { key: 'primary' },
      { $set: updateData },
      { new: true, runValidators: false, upsert: true }
    ).lean();

    console.log('Updated settings:', JSON.stringify(settings, null, 2));

    try {
      revalidateTag('seo-settings', 'default');
      revalidateTag('site-cms', 'default');

      const pathsToRevalidate = ['/', '/contact', '/about-us', '/products/sms', '/products/whatsapp', '/products/o-time', '/products/gov-gate'];
      for (const path of pathsToRevalidate) {
        revalidatePath(path, 'page');
        revalidatePath(path);
      }
    } catch (e) {
      console.error('SEO settings revalidation error:', e);
    }

    return NextResponse.json({
      success: true,
      settings: {
        _id: settings!._id.toString(),
        key: settings!.key,
        siteName: settings!.siteName,
        siteUrl: settings!.siteUrl,
        notificationEmail: (settings as any).notificationEmail || 'info@corbit.sa',
        emailConfig: (settings as any).emailConfig || {
          provider: 'none',
          emailjsServiceId: '',
          emailjsTemplateId: '',
          emailjsPublicKey: '',
          smtpHost: '',
          smtpPort: 587,
          smtpUser: '',
          smtpPassword: '',
        },
        defaultSeo: settings!.defaultSeo,
        organization: settings!.organization,
        analytics: settings!.analytics,
        robotsTxt: settings!.robotsTxt,
        isActive: settings!.isActive,
        createdAt: settings!.createdAt,
        updatedAt: settings!.updatedAt,
      },
    });
  } catch (error) {
    console.error('PUT error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update SEO settings';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
