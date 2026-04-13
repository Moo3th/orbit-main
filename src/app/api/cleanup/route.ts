import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteCms from '@/models/SiteCms';
import { cleanupLegacyCollections } from '@/lib/db/legacyCleanup';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const wipeCms = url.searchParams.get('wipeCms') === 'true';

    const legacy = await cleanupLegacyCollections();
    const staleSiteDocs = await SiteCms.deleteMany({ key: { $ne: 'primary' } });
    let primaryCmsReset = false;

    if (wipeCms) {
      await SiteCms.findOneAndUpdate(
        { key: 'primary' },
        {
          key: 'primary',
          isActive: true,
          pages: [],
          partners: [],
          socialLinks: [],
          contactSubmissions: [],
          notificationEmail: 'sales@orbit.sa',
          footerData: {},
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      primaryCmsReset = true;
    }

    return NextResponse.json({
      success: true,
      message: wipeCms
        ? 'Legacy collections cleaned and primary Site CMS reset'
        : 'Legacy collections cleaned',
      legacy,
      siteCms: {
        removedNonPrimaryDocs: staleSiteDocs.deletedCount ?? 0,
        primaryCmsReset,
      },
      nextStep: 'Call POST /api/seed to normalize/seed active CMS pages',
    });
  } catch (error) {
    console.error('Error cleaning up data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cleanup data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
