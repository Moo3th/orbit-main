import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MainPageSettings from '@/models/MainPageSettings';
import { createMainPageSettingsDefaults, normalizeMainPageSettings } from '@/lib/mainPageSettings';

export async function GET() {
  try {
    await connectDB();
    
    let settings = await MainPageSettings.findOne();
    
    // If no settings exist, create default
    if (!settings) {
      settings = await MainPageSettings.create(createMainPageSettingsDefaults());
    }
    
    return NextResponse.json({ success: true, settings: normalizeMainPageSettings(settings.toObject()) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    let settings = await MainPageSettings.findOne();
    
    if (!settings) {
      settings = await MainPageSettings.create(body);
    } else {
      settings = await MainPageSettings.findOneAndUpdate(
        {},
        body,
        { new: true, runValidators: true }
      );
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

