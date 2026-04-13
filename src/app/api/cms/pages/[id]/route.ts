import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CmsPageContent } from '@/models/CmsPageContent';

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
    const message = error instanceof Error ? error.message : 'Failed to fetch page';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { pageId, path, order, seo, social, sections, isActive } = body;

    const existingPage = await CmsPageContent.findOne({ pageId: id });
    if (!existingPage) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    if (pageId && pageId !== id) {
      const duplicate = await CmsPageContent.findOne({ pageId, _id: { $ne: existingPage._id } });
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Page ID already exists' },
          { status: 400 }
        );
      }
    }

    if (path && path !== existingPage.path) {
      const duplicate = await CmsPageContent.findOne({ path, _id: { $ne: existingPage._id } });
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Page path already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (pageId !== undefined) updateData.pageId = pageId;
    if (path !== undefined) updateData.path = path;
    if (order !== undefined) updateData.order = order;
    if (seo !== undefined) updateData.seo = seo;
    if (social !== undefined) updateData.social = social;
    if (sections !== undefined) updateData.sections = sections;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedPage = await CmsPageContent.findOneAndUpdate(
      { pageId: id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      success: true,
      page: {
        _id: updatedPage!._id.toString(),
        pageId: updatedPage!.pageId,
        path: updatedPage!.path,
        order: updatedPage!.order,
        seo: updatedPage!.seo,
        social: updatedPage!.social,
        sections: updatedPage!.sections,
        isActive: updatedPage!.isActive,
        createdAt: updatedPage!.createdAt,
        updatedAt: updatedPage!.updatedAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update page';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    const page = await CmsPageContent.findOne({ pageId: id });
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    await CmsPageContent.deleteOne({ pageId: id });

    return NextResponse.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete page';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
