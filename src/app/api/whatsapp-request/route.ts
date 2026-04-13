import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import WhatsAppRequest from '@/models/WhatsAppRequest';
import { SeoSettings } from '@/models/SeoSettings';
import { sendEmail, buildWhatsAppRequestEmailBody, parseEmailRecipients } from '@/lib/email/service';

const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export async function GET() {
  try {
    await connectDB();
    const requests = await WhatsAppRequest.find().sort({ createdAt: -1 });
    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching WhatsApp requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = (await request.json()) as Record<string, unknown>;

    const planId = normalizeText(data.planId);
    const tierId = normalizeText(data.tierId);
    const name = normalizeText(data.name);
    const email = normalizeText(data.email);
    const phone = normalizeText(data.phone);
    const companyName = normalizeText(data.companyName);
    const industry = normalizeText(data.industry);
    const goal = normalizeText(data.goal);
    const employeeCount = normalizeText(data.employeeCount);
    const notes = normalizeText(data.notes);

    if (!planId || !tierId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const whatsAppRequest = await WhatsAppRequest.create({
      planId,
      tierId,
      name,
      email,
      phone,
      companyName,
      industry,
      goal,
      employeeCount,
      notes,
      status: 'new',
    });

    const seoSettings = await SeoSettings.findOne({ key: 'primary' }).lean();
    const rawNotificationEmail = (seoSettings as any)?.notificationEmail || process.env.NOTIFICATION_EMAIL || 'sales@orbit.sa';
    const notificationEmails = parseEmailRecipients(rawNotificationEmail);
    const emailConfig = (seoSettings as any)?.emailConfig;

    if (emailConfig && emailConfig.provider !== 'none' && notificationEmails.length > 0) {
      try {
        const emailBody = buildWhatsAppRequestEmailBody({
          name,
          email,
          phone,
          companyName,
          planId,
          tierId,
          industry,
          goal,
          employeeCount,
          notes,
        });

        const emailResult = await sendEmail(
          {
            to: notificationEmails,
            subject: `طلب خدمة واتساب جديد من ${name} - المدار`,
            text: emailBody.text,
            html: emailBody.html,
            replyTo: email,
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
          console.log('WhatsApp request notification email sent successfully');
        } else {
          console.error('Failed to send WhatsApp request notification:', emailResult.message);
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }
    } else {
      console.log('Email notifications disabled. Would have sent to:', notificationEmails.join(', '));
    }

    return NextResponse.json(
      { message: 'Request submitted successfully', request: whatsAppRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating WhatsApp request:', error);
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    );
  }
}