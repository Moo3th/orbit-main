import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { News } from '@/models/News';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Internal server error';

// GET all news
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';
    
    const query = admin ? {} : { isActive: true };
    const news = await News.find(query).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new news (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    await connectDB();
    
    const news = await News.create(body);
    return NextResponse.json({ news }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: errorMessage(error) },
      { status: 500 }
    );
  }
}







