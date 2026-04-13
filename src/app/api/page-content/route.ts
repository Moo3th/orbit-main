import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PageContent } from '@/models/PageContent';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET all page content
export async function GET() {
  try {
    await connectDB();
    const pages = await PageContent.find({ isActive: true });
    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new page content (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();
    const pageContent = await PageContent.create(body);

    return NextResponse.json({ pageContent }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating page content:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create page content', details: error.message },
      { status: 500 }
    );
  }
}







