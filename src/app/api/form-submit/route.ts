import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FormSubmission from '@/models/FormSubmission';
import FormConfig from '@/models/FormConfig';
import { SeoSettings } from '@/models/SeoSettings';
import { sendEmail, parseEmailRecipients } from '@/lib/email/service';

const buildDynamicFormEmailBody = (
  formName: string,
  formNameEn: string,
  fields: { id: string; labelAr: string; labelEn: string; type: string }[],
  data: Record<string, unknown>,
  isAr: boolean
) => {
  const rows = fields
    .map((field) => {
      const raw = data[field.id];
      const value = Array.isArray(raw) ? raw.join(', ') : raw != null ? String(raw) : '-';
      const label = isAr ? field.labelAr : field.labelEn;
      return `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;min-width:140px;">${label}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${value}</td></tr>`;
    })
    .join('');

  const html = `
    <div dir="${isAr ? 'rtl' : 'ltr'}" style="font-family:'IBM Plex Sans Arabic','IBM Plex Sans',sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#7A1E2E;">${isAr ? 'طلب خدمة جديد' : 'New Service Request'}</h2>
      <p>${isAr ? `تم استلام طلب جديد من <strong>${formName}</strong>` : `A new request has been received from <strong>${formNameEn}</strong>`}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">${rows}</table>
      <p style="color:#9ca3af;font-size:12px;margin-top:24px;">${isAr ? 'أرسل تلقائياً من نظام المدار' : 'Sent automatically from ORBIT system'}</p>
    </div>`;

  const text = fields
    .map((field) => {
      const raw = data[field.id];
      const value = Array.isArray(raw) ? raw.join(', ') : raw != null ? String(raw) : '-';
      return `${isAr ? field.labelAr : field.labelEn}: ${value}`;
    })
    .join('\n');

  return { html, text };
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (productId) filter.productId = productId;
    if (status) filter.status = status;

    const total = await FormSubmission.countDocuments(filter);
    const submissions = await FormSubmission.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ submissions, total, page, limit });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, data } = body as { productId: string; data: Record<string, unknown> };

    if (!productId || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const formConfig = await FormConfig.findOne({ productId }).lean() as any;

    if (!formConfig) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    if (!formConfig.isActive) {
      return NextResponse.json({ error: 'Form is not active' }, { status: 400 });
    }

    const configFields: { id: string; labelAr: string; labelEn: string; type: string; required: boolean }[] = formConfig.fields || [];
    const requiredFields = configFields.filter((f) => f.required);
    for (const field of requiredFields) {
      const val = data[field.id];
      if (!val || (typeof val === 'string' && !val.trim())) {
        const label = field.labelEn;
        return NextResponse.json({ error: `Missing required field: ${label}`, field: field.id }, { status: 400 });
      }
    }

    const submission = await FormSubmission.create({
      formId: formConfig._id,
      productId,
      data,
      status: 'new',
    });

    const notificationEmails: string = formConfig.notificationEmails || '';
    const seoSettings = await SeoSettings.findOne({ key: 'primary' }).lean() as any;
    const fallbackEmail: string = seoSettings?.notificationEmail || process.env.NOTIFICATION_EMAIL || 'sales@orbit.sa';
    const emailList = parseEmailRecipients(notificationEmails || fallbackEmail);

    if (emailList.length > 0) {
      try {
        const emailConfig = seoSettings?.emailConfig;
        if (emailConfig && emailConfig.provider !== 'none') {
          const emailBody = buildDynamicFormEmailBody(
            formConfig.productName,
            formConfig.productNameEn,
            configFields,
            data,
            true
          );
          await sendEmail(
            {
              to: emailList,
              subject: `طلب خدمة جديد من ${formConfig.productName} - المدار`,
              text: emailBody.text,
              html: emailBody.html,
            },
            {
              emailProvider: emailConfig.provider,
              emailjsServiceId: emailConfig.emailjsServiceId,
              emailjsTemplateId: emailConfig.emailjsTemplateId,
              emailjsPublicKey: emailConfig.emailjsPublicKey,
              smtpHost: emailConfig.smtpHost,
              smtpPort: emailConfig.smtpPort,
              smtpUser: emailConfig.smtpUser,
              smtpPassword: emailConfig.smtpPassword,
              notificationEmail: notificationEmails || fallbackEmail,
            }
          );
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }
    }

    return NextResponse.json({ message: 'Submission successful', submission }, { status: 201 });
  } catch (error) {
    console.error('Error creating form submission:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}