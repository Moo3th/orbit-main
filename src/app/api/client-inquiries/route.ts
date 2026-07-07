import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { sendServerLeadEvent } from '@/lib/analytics/serverConversions';
import ClientInquiry from '@/models/ClientInquiry';
import { SeoSettings } from '@/models/SeoSettings';
import { sendEmail, buildContactEmailBody, parseEmailRecipients } from '@/lib/email/service';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const typeFilter = request.nextUrl.searchParams.get('type');
    const query = typeFilter ? { type: typeFilter } : {};
    const inquiries = await ClientInquiry.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('Error fetching client inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// Notify the configured email about a new quote/price request (mirrors /api/contact).
async function notifyQuoteRequest(inquiry: Record<string, unknown>) {
  try {
    const seoSettings = await SeoSettings.findOne({ key: 'primary' }).lean();
    const rawNotificationEmail = (seoSettings as any)?.notificationEmail || process.env.NOTIFICATION_EMAIL || 'info@corbit.sa';
    const notificationEmails = parseEmailRecipients(rawNotificationEmail);
    const emailConfig = (seoSettings as any)?.emailConfig;

    if (!emailConfig || emailConfig.provider === 'none' || notificationEmails.length === 0) {
      console.log('Quote email notifications disabled. Would have sent to:', notificationEmails.join(', '));
      return;
    }

    const name = String(inquiry.name || '');
    const detailsLines = [
      inquiry.serviceType ? `نوع الحل: ${inquiry.serviceType}` : '',
      inquiry.budget ? `الميزانية: ${inquiry.budget}` : '',
      inquiry.packageName ? `الباقة: ${inquiry.packageName}${inquiry.packagePrice ? ` (${inquiry.packagePrice})` : ''}` : '',
    ].filter(Boolean).join('\n');
    const composedMessage = [String(inquiry.message || ''), detailsLines].filter(Boolean).join('\n\n');

    const emailBody = buildContactEmailBody({
      name,
      email: String(inquiry.email || ''),
      phone: String(inquiry.phone || ''),
      company: String(inquiry.company || ''),
      product: String(inquiry.serviceType || ''),
      subject: String(inquiry.subject || ''),
      message: composedMessage,
      source: String(inquiry.source || 'request-quote'),
    });

    const emailResult = await sendEmail(
      {
        to: notificationEmails,
        subject: `طلب عرض سعر جديد من ${name} - المدار`,
        text: emailBody.text,
        html: emailBody.html,
        replyTo: String(inquiry.email || '') || undefined,
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
        notificationEmail: rawNotificationEmail,
      }
    );

    if (emailResult.success) {
      console.log('Quote request notification email sent successfully');
    } else {
      console.error('Failed to send quote notification:', emailResult.message);
    }
  } catch (emailError) {
    console.error('Quote email notification error:', emailError);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    // Add type if not provided
    if (!data.type) {
      data.type = 'quote'; // Default to quote for request-quote forms
    }

    const inquiry = await ClientInquiry.create(data);

    // Send notification email (non-blocking failure)
    await notifyQuoteRequest(inquiry.toObject ? inquiry.toObject() : data);

    // حدث تحويل خادمي (Meta/X/LinkedIn CAPI) بعد إرسال الرد — لا يؤخر ولا يُفشل الطلب.
    if (data.email || data.phone) {
      after(() =>
        sendServerLeadEvent({
          eventId: `lead_${String(inquiry._id)}`,
          email: typeof data.email === 'string' ? data.email : undefined,
          phone: typeof data.phone === 'string' ? data.phone : undefined,
          firstName: typeof data.name === 'string' ? data.name : undefined,
          sourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa'}/request-quote`,
          customData: { serviceType: data.serviceType || 'other', source: data.source || 'request-quote' },
        })
      );
    }

    return NextResponse.json(
      { message: 'Inquiry submitted successfully', inquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating client inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

