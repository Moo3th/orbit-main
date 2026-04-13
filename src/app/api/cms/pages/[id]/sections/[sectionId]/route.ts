import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CmsPageContent } from '@/models/CmsPageContent';
import type { ICmsField } from '@/lib/cms/pageContent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string; sectionId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id, sectionId } = await params;
    
    const page = await CmsPageContent.findOne({ pageId: id }).lean();
    
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    const section = page.sections.find((s: { id: string }) => s.id === sectionId);
    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      section,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch section';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id, sectionId } = await params;
    const body = await request.json();
    const { type, order, fields } = body as {
      type?: string;
      order?: number;
      fields?: ICmsField[];
    };

    const page = await CmsPageContent.findOne({ pageId: id });
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    const sectionIndex = page.sections.findIndex((s: { id: string }) => s.id === sectionId);
    if (sectionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      );
    }

    if (type !== undefined) {
      page.sections[sectionIndex].type = type as 'hero' | 'features' | 'pricing' | 'cta' | 'testimonials' | 'trust' | 'custom';
    }
    if (order !== undefined) {
      page.sections[sectionIndex].order = order;
    }
    if (fields !== undefined) {
      page.sections[sectionIndex].fields = fields;
    }

    await page.save();

    return NextResponse.json({
      success: true,
      section: page.sections[sectionIndex],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update section';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id, sectionId } = await params;

    const page = await CmsPageContent.findOne({ pageId: id });
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    const sectionIndex = page.sections.findIndex((s: { id: string }) => s.id === sectionId);
    if (sectionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      );
    }

    page.sections.splice(sectionIndex, 1);
    await page.save();

    return NextResponse.json({
      success: true,
      message: 'Section deleted successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete section';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
