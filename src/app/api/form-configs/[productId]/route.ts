import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FormConfig from '@/models/FormConfig';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectDB();
    const { productId } = await params;
    const config = await FormConfig.findOne({ productId }).lean() as any;
    if (!config) {
      // Try by slug
      const bySlug = await FormConfig.findOne({ slug: productId }).lean() as any;
      if (!bySlug) {
        return NextResponse.json({ error: 'Form config not found' }, { status: 404 });
      }
      // Re-assign to config if found by slug
      const enrichedConfig = {
        titleAr: bySlug.productName || '',
        titleEn: bySlug.productNameEn || '',
        thankYouMessageAr: 'تم إرسال طلبك بنجاح!',
        thankYouMessageEn: 'Request submitted successfully!',
        formType: 'service',
        ...bySlug
      };
      return NextResponse.json({ config: enrichedConfig });
    }

    // Ensure all new fields have defaults for frontend
    const enrichedConfig = {
      titleAr: config.productName || '',
      titleEn: config.productNameEn || '',
      thankYouMessageAr: 'تم إرسال طلبك بنجاح!',
      thankYouMessageEn: 'Request submitted successfully!',
      formType: 'service',
      ...config
    };

    return NextResponse.json({ config: enrichedConfig });
  } catch (error) {
    console.error('Error fetching form config:', error);
    return NextResponse.json({ error: 'Failed to fetch form config' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectDB();
    const { productId } = await params;
    const data = await request.json();

    const updateData: Record<string, unknown> = {
      productName: data.productName,
      productNameEn: data.productNameEn,
      fields: data.fields || [],
    };
    if (data.slug !== undefined) updateData.slug = data.slug.startsWith('/') ? data.slug.substring(1) : data.slug;
    if (data.customDomain !== undefined) updateData.customDomain = data.customDomain;
    if (data.notificationEmails !== undefined) updateData.notificationEmails = data.notificationEmails;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.titleAr !== undefined) updateData.titleAr = data.titleAr;
    if (data.titleEn !== undefined) updateData.titleEn = data.titleEn;
    if (data.thankYouMessageAr !== undefined) updateData.thankYouMessageAr = data.thankYouMessageAr;
    if (data.thankYouMessageEn !== undefined) updateData.thankYouMessageEn = data.thankYouMessageEn;
    if (data.formType !== undefined) updateData.formType = data.formType;

    const config = await FormConfig.findOneAndUpdate(
      { productId },
      { $set: updateData },
      { upsert: true, new: true }
    );

    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error updating form config:', error);
    return NextResponse.json({ error: 'Failed to update form config' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectDB();
    const { productId } = await params;
    await FormConfig.deleteOne({ productId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting form config:', error);
    return NextResponse.json({ error: 'Failed to delete form config' }, { status: 500 });
  }
}