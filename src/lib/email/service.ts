import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
  templateId?: string;
  templateParams?: Record<string, unknown>;
}

export interface EmailConfig {
  emailProvider: 'emailjs' | 'smtp' | 'none';
  emailjsServiceId?: string;
  emailjsTemplateId?: string;
  emailjsPublicKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  notificationEmail: string;
}

async function sendViaEmailJS(
  options: EmailOptions,
  config: EmailConfig
): Promise<boolean> {
  const serviceId = config.emailjsServiceId;
  const templateId = config.emailjsTemplateId;
  const publicKey = config.emailjsPublicKey;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS not configured properly');
    return false;
  }

  try {
    const toEmails = Array.isArray(options.to) ? options.to.join(',') : options.to;
    
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: options.templateId || templateId,
        user_id: publicKey,
        template_params: {
          to_email: toEmails,
          to_name: toEmails,
          from_name: options.from || 'ORBIT',
          from_email: options.replyTo || 'noreply@orbit.sa',
          reply_to: options.replyTo || options.from,
          subject: options.subject,
          message: options.text || '',
          html: options.html || '',
          ...options.templateParams,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('EmailJS error:', error);
      return false;
    }

    console.log('Email sent successfully via EmailJS to:', toEmails);
    return true;
  } catch (error) {
    console.error('Failed to send email via EmailJS:', error);
    return false;
  }
}

async function sendViaSMTP(
  options: EmailOptions,
  config: EmailConfig
): Promise<boolean> {
  const { smtpHost, smtpPort, smtpUser, smtpPassword } = config;

  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.warn('SMTP not configured properly');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort || 587,
      secure: (smtpPort || 587) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const toEmails = Array.isArray(options.to) ? options.to : [options.to];
    
    const mailOptions = {
      from: `"${options.from || 'ORBIT'}" <${smtpUser}>`,
      to: toEmails.join(', '),
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via SMTP:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email via SMTP:', error);
    return false;
  }
}

export async function sendEmail(
  options: EmailOptions,
  config: EmailConfig
): Promise<{ success: boolean; message: string }> {
  const provider = config.emailProvider || 'none';

  if (provider === 'none') {
    console.log('Email provider disabled. Logging email:');
    console.log(`  To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    console.log(`  Subject: ${options.subject}`);
    console.log(`  Body: ${options.text || options.html || '(no content)'}`);
    return {
      success: true,
      message: 'Email logged (provider disabled)',
    };
  }

  let sent = false;

  if (provider === 'emailjs') {
    sent = await sendViaEmailJS(options, config);
  } else if (provider === 'smtp') {
    sent = await sendViaSMTP(options, config);
  }

  if (sent) {
    return {
      success: true,
      message: 'Email sent successfully',
    };
  }

  console.log('Failed to send email. Logging:');
  console.log(`  To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
  console.log(`  Subject: ${options.subject}`);

  return {
    success: false,
    message: 'Failed to send email. Please check email configuration.',
  };
}

export function parseEmailRecipients(emails: string): string[] {
  return emails
    .split(/[,;]/)
    .map(e => e.trim())
    .filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
}

export function buildContactEmailBody(data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  product?: string;
  subject?: string;
  message: string;
  source?: string;
}): { text: string; html: string } {
  const { name, email, phone, company, product, subject, message, source } = data;

  const text = `
تم استلام طلب اتصال جديد من موقع المدار (ORBIT)

═══════════════════════════════════════
معلومات المرسل:
═══════════════════════════════════════
الاسم: ${name}
البريد الإلكتروني: ${email}
رقم الجوال: ${phone}
${company ? `الشركة: ${company}` : ''}
${product ? `المنتج المطلوب: ${product}` : ''}
${source ? `مصدر الطلب: ${source}` : ''}
═══════════════════════════════════════
${subject ? `الموضوع: ${subject}` : ''}
═══════════════════════════════════════
الرسالة:
${message}
═══════════════════════════════════════
تاريخ الإرسال: ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}
`.trim();

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طلب اتصال جديد - المدار</title>
  <style>
    body { font-family: 'IBM Plex Sans Arabic', Arial, sans-serif; direction: rtl; background-color: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 2px solid #7A1E2E; padding-bottom: 20px; margin-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #7A1E2E; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; font-size: 14px; }
    .value { color: #333; font-size: 16px; margin-top: 5px; }
    .message-box { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🚀 المدار (ORBIT)</div>
      <p>طلب اتصال جديد</p>
    </div>
    
    <div class="field">
      <div class="label">الاسم</div>
      <div class="value">${name}</div>
    </div>
    
    <div class="field">
      <div class="label">البريد الإلكتروني</div>
      <div class="value"><a href="mailto:${email}">${email}</a></div>
    </div>
    
    <div class="field">
      <div class="label">رقم الجوال</div>
      <div class="value"><a href="tel:${phone}">${phone}</a></div>
    </div>
    
    ${company ? `<div class="field"><div class="label">الشركة</div><div class="value">${company}</div></div>` : ''}
    ${product ? `<div class="field"><div class="label">المنتج المطلوب</div><div class="value">${product}</div></div>` : ''}
    ${subject ? `<div class="field"><div class="label">الموضوع</div><div class="value">${subject}</div></div>` : ''}
    
    <div class="message-box">
      <div class="label">الرسالة</div>
      <div class="value" style="white-space: pre-wrap;">${message}</div>
    </div>
    
    <div class="footer">
      تم الإرسال من موقع المدار (ORBIT)<br>
      ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}
    </div>
  </div>
</body>
</html>
`.trim();

  return { text, html };
}

export function buildWhatsAppRequestEmailBody(data: {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  planId: string;
  tierId: string;
  industry?: string;
  goal?: string;
  employeeCount?: string;
  notes?: string;
}): { text: string; html: string } {
  const { name, email, phone, companyName, planId, tierId, industry, goal, employeeCount, notes } = data;

  const text = `
تم استلام طلب خدمة واتساب جديد من موقع المدار (ORBIT)

═══════════════════════════════════════
معلومات العميل:
═══════════════════════════════════════
الاسم: ${name}
البريد الإلكتروني: ${email}
رقم الجوال: ${phone}
${companyName ? `الشركة: ${companyName}` : ''}
═══════════════════════════════════════
تفاصيل الطلب:
═══════════════════════════════════════
الباقة المختارة: ${planId}
الشريحة: ${tierId}
${industry ? `القطاع: ${industry}` : ''}
${employeeCount ? `عدد الموظفين: ${employeeCount}` : ''}
${goal ? `الهدف: ${goal}` : ''}
${notes ? `ملاحظات: ${notes}` : ''}
═══════════════════════════════════════
تاريخ الإرسال: ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}
`.trim();

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طلب خدمة واتساب - المدار</title>
  <style>
    body { font-family: 'IBM Plex Sans Arabic', Arial, sans-serif; direction: rtl; background-color: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 2px solid #25D366; padding-bottom: 20px; margin-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #25D366; }
    .section { margin-bottom: 20px; }
    .section-title { background-color: #f0f0f0; padding: 10px; border-radius: 4px; font-weight: bold; margin-bottom: 10px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; color: #666; font-size: 14px; }
    .value { color: #333; font-size: 16px; margin-top: 5px; }
    .plan-badge { display: inline-block; background-color: #25D366; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">📱 طلب خدمة واتساب</div>
      <p>المدار (ORBIT)</p>
    </div>
    
    <div class="section">
      <div class="section-title">📋 معلومات العميل</div>
      <div class="field"><div class="label">الاسم</div><div class="value">${name}</div></div>
      <div class="field"><div class="label">البريد الإلكتروني</div><div class="value"><a href="mailto:${email}">${email}</a></div></div>
      <div class="field"><div class="label">رقم الجوال</div><div class="value"><a href="tel:${phone}">${phone}</a></div></div>
      ${companyName ? `<div class="field"><div class="label">الشركة</div><div class="value">${companyName}</div></div>` : ''}
    </div>
    
    <div class="section">
      <div class="section-title">📦 تفاصيل الطلب</div>
      <div class="field">
        <div class="label">الباقة</div>
        <div class="value"><span class="plan-badge">${planId}</span></div>
      </div>
      <div class="field">
        <div class="label">الشريحة</div>
        <div class="value">${tierId}</div>
      </div>
      ${industry ? `<div class="field"><div class="label">القطاع</div><div class="value">${industry}</div></div>` : ''}
      ${employeeCount ? `<div class="field"><div class="label">عدد الموظفين</div><div class="value">${employeeCount}</div></div>` : ''}
      ${goal ? `<div class="field"><div class="label">الهدف</div><div class="value">${goal}</div></div>` : ''}
      ${notes ? `<div class="field"><div class="label">ملاحظات</div><div class="value">${notes}</div></div>` : ''}
    </div>
    
    <div class="footer">
      تم الإرسال من موقع المدار (ORBIT)<br>
      ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}
    </div>
  </div>
</body>
</html>
`.trim();

  return { text, html };
}