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
    let config = await FormConfig.findOne({ productId }).lean();
    if (!config) {
      config = await FormConfig.findOne({ slug: productId }).lean();
    }
    if (!config) {
      return NextResponse.json({ error: 'Form config not found' }, { status: 404 });
    }
    return NextResponse.json({ config });
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
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.notificationEmails !== undefined) updateData.notificationEmails = data.notificationEmails;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

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