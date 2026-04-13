import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CmsPageContent } from '@/models/CmsPageContent';
import { generateSectionId } from '@/lib/cms/pageContent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const pages = await CmsPageContent.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      pages: pages.map((page) => ({
        _id: page._id.toString(),
        pageId: page.pageId,
        path: page.path,
        order: page.order,
        seo: page.seo,
        social: page.social,
        sections: page.sections,
        isActive: page.isActive,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch pages';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { pageId, path, order = 0, seo, social, sections = [] } = body;

    if (!pageId || !path) {
      return NextResponse.json(
        { success: false, error: 'pageId and path are required' },
        { status: 400 }
      );
    }

    const existing = await CmsPageContent.findOne({
      $or: [{ pageId }, { path }],
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Page with this ID or path already exists' },
        { status: 400 }
      );
    }

    const page = await CmsPageContent.create({
      pageId,
      path,
      order,
      seo: seo || {
        title: { en: '', ar: '' },
        description: { en: '', ar: '' },
        keywords: { en: '', ar: '' },
        canonical: '',
        noIndex: false,
      },
      social: social || {
        ogImage: '',
        ogTitle: { en: '', ar: '' },
        ogDescription: { en: '', ar: '' },
      },
      sections: sections.map((section: { type: string; order?: number }, index: number) => ({
        id: generateSectionId(),
        type: section.type,
        order: section.order ?? index,
        fields: [],
      })),
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      page: {
        _id: page._id.toString(),
        pageId: page.pageId,
        path: page.path,
        order: page.order,
        seo: page.seo,
        social: page.social,
        sections: page.sections,
        isActive: page.isActive,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create page';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
