import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FormSubmission from '@/models/FormSubmission';
import FormConfig from '@/models/FormConfig';
import WhatsAppRequest from '@/models/WhatsAppRequest';
import ClientInquiry from '@/models/ClientInquiry';
import { SeoSettings } from '@/models/SeoSettings';
import { sendEmail, parseEmailRecipients } from '@/lib/email/service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type ConfigField = { id: string; labelAr: string; labelEn: string; type: string; required?: boolean };

const toStr = (raw: unknown): string =>
  Array.isArray(raw)
    ? raw.map((v) => String(v)).filter(Boolean).join(', ')
    : raw != null
      ? String(raw).trim()
      : '';

// الحقول الشبيهة بالشركة — تُستبعد دائماً من التقاط حقل «الاسم» (فـ "companyName" يحوي "name").
const COMPANY_RE = /company|الشركة|المنشأة|الجهة/i;

const fieldText = (cf: ConfigField): string => `${cf.id} ${cf.labelEn || ''} ${cf.labelAr || ''}`;

// يلتقط حقلاً قياسياً (اسم/بريد/هاتف/شركة) من بيانات نموذج حقوله قابلة للتخصيص:
// أولاً بمعرّف معروف، ثم بمطابقة العنوان، ثم بنوع الحقل. يعيد القيمة ومعرّف الحقل المستخدم.
// excludeIds/excludeRegex تمنع التقاط حقل سبق استخدامه أو حقلاً من فئة أخرى (مثل الشركة عند البحث عن الاسم).
const resolveField = (
  data: Record<string, unknown>,
  configFields: ConfigField[],
  preferredIds: string[],
  type: string | null,
  labelRegex: RegExp | null,
  excludeIds: Set<string> = new Set(),
  excludeRegex: RegExp | null = null
): { id: string; value: string } => {
  for (const id of preferredIds) {
    const value = toStr(data[id]);
    if (value) return { id, value };
  }
  const eligible = configFields.filter(
    (cf) => !excludeIds.has(cf.id) && !(excludeRegex && excludeRegex.test(fieldText(cf)))
  );
  if (labelRegex) {
    const f = eligible.find((cf) => labelRegex.test(fieldText(cf)));
    if (f) return { id: f.id, value: toStr(data[f.id]) };
  }
  if (type) {
    const f = eligible.find((cf) => cf.type === type);
    if (f) return { id: f.id, value: toStr(data[f.id]) };
  }
  return { id: '', value: '' };
};

// نوع الحل في «طلبات الأسعار» (ClientInquiry.serviceType) — يطابق مفاتيح serviceLabels في لوحة الأدمن.
const SERVICE_TYPE_BY_PRODUCT: Record<string, string> = {
  sms: 'sms-platform',
  otime: 'otime',
  govgate: 'gov-gate',
};

// يعكس طلب النموذج (نوع service) إلى نموذج الـ CRM المناسب ليظهر في تبويب اللوحة الصحيح:
//  - واتساب → WhatsAppRequest (تبويب «طلبات واتساب»)
//  - بقية المنتجات → ClientInquiry نوع quote (تبويب «طلبات الأسعار»)
// الردود تبقى كاملة في FormSubmission؛ هذا انعكاس إضافي للمبيعات فقط ولا يُفشل الإرسال إن تعذّر.
const mirrorServiceSubmission = async (
  productId: string,
  configFields: ConfigField[],
  data: Record<string, unknown>
) => {
  // نحلّ الشركة أولاً ثم نستبعدها من بحث الاسم حتى لا يُلتقط حقل «اسم الشركة» كاسم العميل.
  const company = resolveField(data, configFields, ['companyName', 'company'], null, COMPANY_RE);
  const name = resolveField(
    data,
    configFields,
    ['name', 'fullName', 'full_name'],
    'text',
    /name|الاسم|اسم/i,
    new Set([company.id].filter(Boolean) as string[]),
    COMPANY_RE
  );
  const email = resolveField(data, configFields, ['email'], 'email', /e-?mail|البريد/i);
  const phone = resolveField(data, configFields, ['phone', 'mobile', 'tel'], 'tel', /phone|mobile|جوال|هاتف/i);

  // لا نعكس بلا بيانات تواصل أساسية (النماذج القياسية تجمعها إجبارياً).
  if (!name.value || !email.value || !phone.value) return;

  const packageField = configFields.find((cf) => cf.type === 'package');
  const packageValue = packageField ? toStr(data[packageField.id]) : toStr(data.package) || toStr(data.planId);

  if (productId === 'whatsapp') {
    await WhatsAppRequest.create({
      planId: packageValue,
      tierId: toStr(data.tierId),
      name: name.value,
      email: email.value,
      phone: phone.value,
      companyName: company.value,
      industry: toStr(data.industry),
      goal: toStr(data.goal),
      employeeCount: toStr(data.employeeCount),
      notes: toStr(data.notes),
      status: 'new',
    });
    return;
  }

  // بقية الفورمات → طلب سعر. نجمع بقية الحقول في الرسالة حتى لا تُفقد أي معلومة.
  const usedIds = new Set([name.id, email.id, phone.id, company.id, packageField?.id].filter(Boolean) as string[]);
  const extraLines = configFields
    .filter((cf) => !usedIds.has(cf.id) && !['richtext', 'spacing', 'divider'].includes(cf.type))
    .map((cf) => {
      const value = toStr(data[cf.id]);
      return value ? `${cf.labelAr || cf.labelEn || cf.id}: ${value}` : '';
    })
    .filter(Boolean);

  await ClientInquiry.create({
    type: 'quote',
    name: name.value,
    email: email.value,
    phone: phone.value,
    company: company.value,
    serviceType: SERVICE_TYPE_BY_PRODUCT[productId] || 'other',
    message: extraLines.join('\n') || '—',
    packageName: packageValue,
    source: `form:${productId}`,
    status: 'new',
  });
};

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
      <p style="color:#9ca3af;font-size:12px;margin-top:24px;">${isAr ? 'أرسل تلقائياً من نظام المدار' : 'Sent automatically from CORBIT system'}</p>
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

    // انعكاس طلبات الخدمة إلى تبويب اللوحة المناسب (واتساب / طلبات الأسعار).
    // فشل الانعكاس لا يُفشل الإرسال — الرد محفوظ في FormSubmission.
    if ((formConfig.formType || 'service') === 'service') {
      try {
        await mirrorServiceSubmission(productId, configFields, data);
      } catch (mirrorError) {
        console.error('Failed to mirror form submission to CRM:', mirrorError);
      }
    }

    const notificationEmails: string = formConfig.notificationEmails || '';
    const seoSettings = await SeoSettings.findOne({ key: 'primary' }).lean() as any;
    const fallbackEmail: string = seoSettings?.notificationEmail || process.env.NOTIFICATION_EMAIL || 'info@corbit.sa';
    
    // Combine form emails and general emails
    const combinedEmails = notificationEmails 
      ? `${notificationEmails},${fallbackEmail}` 
      : fallbackEmail;
    
    const emailList = parseEmailRecipients(combinedEmails);

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