import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FormConfig from '@/models/FormConfig';
import FormSubmission from '@/models/FormSubmission';

export async function GET() {
  try {
    await connectDB();
    const configs = await FormConfig.find().sort({ productId: 1 }).lean() as any[];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enrichedConfigs = await Promise.all(configs.map(async (config) => {
      const totalSubmissions = await FormSubmission.countDocuments({ productId: config.productId });
      const todaySubmissions = await FormSubmission.countDocuments({
        productId: config.productId,
        createdAt: { $gte: today },
      });
      return {
        titleAr: config.productName || '',
        titleEn: config.productNameEn || '',
        thankYouMessageAr: config.thankYouMessageAr || 'تم إرسال طلبك بنجاح!',
        thankYouMessageEn: config.thankYouMessageEn || 'Request submitted successfully!',
        formType: config.formType || 'service',
        displayMode: config.displayMode || 'wizard',
        acceptingResponses: config.acceptingResponses !== false,
        primaryColor: config.primaryColor || (config.formType === 'survey' ? '#8B5CF6' : '#7A1E2E'),
        buttonTextColor: config.buttonTextColor || '#FFFFFF',
        buttonHoverColor: config.buttonHoverColor || (config.formType === 'survey' ? '#7C3AED' : '#601824'),
        ...config,
        totalSubmissions,
        todaySubmissions,
      };
    }));

    return NextResponse.json({ configs: enrichedConfigs });
  } catch (error) {
    console.error('Error fetching form configs:', error);
    return NextResponse.json({ error: 'Failed to fetch form configs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.productId || !data.productName || !data.productNameEn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!data.slug) {
      data.slug = data.productId;
    }

    const existing = await FormConfig.findOne({ productId: data.productId });
    if (existing) {
      return NextResponse.json({ error: 'Form config for this product already exists' }, { status: 409 });
    }

    const config = await FormConfig.create(data);
    return NextResponse.json({ config }, { status: 201 });
  } catch (error) {
    console.error('Error creating form config:', error);
    return NextResponse.json({ error: 'Failed to create form config' }, { status: 500 });
  }
}