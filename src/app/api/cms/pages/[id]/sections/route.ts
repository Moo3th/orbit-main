import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CmsPageContent } from '@/models/CmsPageContent';
import { createEmptySection, generateSectionId, type SectionType } from '@/lib/cms/pageContent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    
    const page = await CmsPageContent.findOne({ pageId: id }).lean();
    
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sections: page.sections,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sections';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { type, order } = body as { type: SectionType; order?: number };

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Section type is required' },
        { status: 400 }
      );
    }

    const page = await CmsPageContent.findOne({ pageId: id });
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    const newOrder = order ?? page.sections.length;
    const newSection = createEmptySection(type, newOrder);

    page.sections.push(newSection);
    await page.save();

    return NextResponse.json({
      success: true,
      section: newSection,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create section';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { sections } = body as { sections: Array<{ id: string; order: number }> };

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { success: false, error: 'Sections array is required' },
        { status: 400 }
      );
    }

    const page = await CmsPageContent.findOne({ pageId: id });
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    for (const { id: sectionId, order } of sections) {
      const section = page.sections.find((s: { id: string }) => s.id === sectionId);
      if (section) {
        section.order = order;
      }
    }

    page.sections.sort((a: { order: number }, b: { order: number }) => a.order - b.order);
    await page.save();

    return NextResponse.json({
      success: true,
      sections: page.sections,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reorder sections';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
