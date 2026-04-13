import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import SiteCms from '@/models/SiteCms';
import { SeoSettings } from '@/models/SeoSettings';
import { sendEmail, buildContactEmailBody, parseEmailRecipients } from '@/lib/email/service';

const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const normalizeProduct = (productValue: unknown, serviceTypeValue: unknown): string => {
  const raw = (normalizeText(productValue) || normalizeText(serviceTypeValue)).toLowerCase();
  const aliases: Record<string, string> = {
    sms: 'sms',
    'sms-platform': 'sms',
    whatsapp: 'whatsapp',
    'whatsapp-business-api': 'whatsapp',
    'o-time': 'o-time',
    otime: 'o-time',
    'gov-gate': 'gov-gate',
    govgate: 'gov-gate',
    other: 'other',
    'general-inquiry': 'other',
    general: 'other',
  };
  return aliases[raw] || 'other';
};

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = (await request.json()) as Record<string, unknown>;

    const name = normalizeText(data.name);
    const email = normalizeText(data.email);
    const phone = normalizeText(data.phone);
    const company = normalizeText(data.company);
    const subject = normalizeText(data.subject);
    const message = normalizeText(data.message);
    const source = normalizeText(data.source) || 'contact-page';
    const serviceType = normalizeText(data.serviceType) || 'general-inquiry';
    const product = normalizeProduct(data.product, serviceType);

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ClientInquiry = (await import('@/models/ClientInquiry')).default;
    const inquiry = await ClientInquiry.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
      source,
      type: 'contact',
      serviceType,
    });

    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      product,
      subject,
      message,
    });

    const submission = {
      id: `cs${Date.now()}`,
      name,
      email,
      phone,
      company,
      message,
      product,
      date: new Date().toISOString(),
      read: false,
    };

    await SiteCms.findOneAndUpdate(
      { key: 'primary' },
      {
        $setOnInsert: { key: 'primary', isActive: true },
        $push: { contactSubmissions: { $each: [submission], $position: 0 } },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    revalidateTag('site-cms', 'max');

    const seoSettings = await SeoSettings.findOne({ key: 'primary' }).lean();
    const rawNotificationEmail = (seoSettings as any)?.notificationEmail || process.env.NOTIFICATION_EMAIL || 'sales@orbit.sa';
    const notificationEmails = parseEmailRecipients(rawNotificationEmail);
    const emailConfig = (seoSettings as any)?.emailConfig;

    if (emailConfig && emailConfig.provider !== 'none' && notificationEmails.length > 0) {
      try {
        const emailBody = buildContactEmailBody({
          name,
          email,
          phone,
          company,
          product,
          subject,
          message,
          source,
        });

        const emailResult = await sendEmail(
          {
            to: notificationEmails,
            subject: subject || `طلب تواصل جديد من ${name} - المدار`,
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
          console.log('Contact form notification email sent successfully');
        } else {
          console.error('Failed to send contact notification:', emailResult.message);
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }
    } else {
      console.log('Email notifications disabled. Would have sent to:', notificationEmails.join(', '));
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully', contact, inquiry, submission },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
