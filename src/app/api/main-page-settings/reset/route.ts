import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MainPageSettings from '@/models/MainPageSettings';
import { createMainPageSettingsDefaults, normalizeMainPageSettings } from '@/lib/mainPageSettings';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    
    // Delete existing settings
    await MainPageSettings.deleteMany({});
    
    // Create fresh default settings with all content
    const settings = await MainPageSettings.create(createMainPageSettingsDefaults());
    const normalizedSettings = normalizeMainPageSettings(settings.toObject());
    
    return NextResponse.json({ 
      success: true, 
      message: 'Main page settings reset to defaults successfully! All 4 promises, 6 features, and 4 stats created.',
      settings: normalizedSettings,
      details: {
        promises: normalizedSettings.about.promises.length,
        features: normalizedSettings.whyOrbit.features.length,
        stats: normalizedSettings.whyOrbit.stats.length
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    console.error('Reset error:', error);
    return NextResponse.json(
      { success: false, error: message, stack },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Support both GET and POST
  return GET();
}

