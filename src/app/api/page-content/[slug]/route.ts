import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PageContent } from '@/models/PageContent';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET single page content by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const pageContent = await PageContent.findOne({ pageSlug: slug, isActive: true });
    
    if (!pageContent) {
      return NextResponse.json(
        { error: 'Page content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ pageContent });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update page content (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin();
    const { slug } = await params;
    await connectDB();

    const body = await request.json();
    const pageContent = await PageContent.findOneAndUpdate(
      { pageSlug: slug },
      body,
      { new: true, upsert: true }
    );

    return NextResponse.json({ pageContent });
  } catch (error: any) {
    console.error('Error updating page content:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update page content', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE page content (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin();
    const { slug } = await params;
    await connectDB();

    const pageContent = await PageContent.findOneAndDelete({ pageSlug: slug });

    if (!pageContent) {
      return NextResponse.json(
        { error: 'Page content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Page content deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting page content:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete page content', details: error.message },
      { status: 500 }
    );
  }
}







