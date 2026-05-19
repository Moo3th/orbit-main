import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CmsPageContent } from '@/models/CmsPageContent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SCHOOLBIT_SECTIONS = [
  {
    id: 'schoolbit-hero',
    type: 'hero',
    order: 0,
    fields: [
      { key: 'eyebrow', value: 'منصة إدارة المدارس الذكية', valueEn: 'Smart School Management Platform', richText: false },
      { key: 'title', value: 'إدارة مدرستك بالكامل من منصة واحدة', valueEn: 'Manage Your Entire School from One Platform', richText: false },
      { key: 'description', value: 'SchoolBit تجمع الحضور، الطلاب، الكادر، الجداول، الاختبارات، الرسائل، والتقارير في نظام ذكي يساعدك على تقليل العمل اليدوي، رفع الانضباط، واتخاذ قرارات أسرع.', valueEn: 'SchoolBit brings together attendance, students, staff, schedules, exams, messaging, and reports in a smart system that helps you reduce manual work, improve discipline, and make faster decisions.', richText: true },
      { key: 'cta1_text', value: 'اطلب عرضاً توضيحياً', valueEn: 'Request a Demo', richText: false },
      { key: 'cta1_url', value: '#contact', richText: false },
      { key: 'cta2_text', value: 'اكتشف المميزات', valueEn: 'Explore Features', richText: false },
      { key: 'cta2_url', value: '#features', richText: false },
      { key: 'chip_noor', value: 'تكامل مع نظام نور', valueEn: 'Noor Integration', richText: false },
      { key: 'chip_biotime', value: 'ربط أجهزة البصمة', valueEn: 'BioTime Devices', richText: false },
      { key: 'chip_messages', value: 'رسائل SMS و WhatsApp', valueEn: 'SMS & WhatsApp', richText: false },
      { key: 'chip_reports', value: 'تقارير تلقائية', valueEn: 'Auto Reports', richText: false },
    ],
  },
  {
    id: 'schoolbit-trust',
    type: 'trust',
    order: 1,
    fields: [
      { key: 'title', value: 'كل ما تحتاجه المدرسة لتعمل بكفاءة أعلى:', valueEn: 'Everything your school needs to run more efficiently:', richText: false },
    ],
  },
  {
    id: 'schoolbit-problem',
    type: 'custom',
    order: 2,
    fields: [
      { key: 'title', value: 'هل ما زالت إدارة المدرسة موزعة بين ملفات ورسائل وأنظمة متفرقة؟', valueEn: 'Is your school management still scattered across files, messages, and disconnected systems?', richText: false },
      { key: 'solution_text', value: 'SchoolBit تحول إدارة المدرسة إلى عملية موحدة، سريعة، وذكية.', valueEn: 'SchoolBit transforms school management into a unified, fast, and smart operation.', richText: true },
    ],
  },
  {
    id: 'schoolbit-benefits',
    type: 'features',
    order: 3,
    fields: [
      { key: 'title', value: 'لماذا SchoolBit؟', valueEn: 'Why SchoolBit?', richText: false },
    ],
  },
  {
    id: 'schoolbit-roles',
    type: 'custom',
    order: 4,
    fields: [
      { key: 'title', value: 'كيف تساعد كل إدارة داخل المدرسة؟', valueEn: 'How does it help each department in the school?', richText: false },
    ],
  },
  {
    id: 'schoolbit-modules',
    type: 'custom',
    order: 5,
    fields: [
      { key: 'title', value: 'الوحدات الرئيسية', valueEn: 'Core Modules', richText: false },
    ],
  },
  {
    id: 'schoolbit-automation',
    type: 'custom',
    order: 6,
    fields: [
      { key: 'title', value: 'دع المهام المتكررة تعمل تلقائيًا', valueEn: 'Let repetitive tasks work automatically', richText: false },
      { key: 'highlight_text', value: 'SchoolBit لا تحفظ البيانات فقط، بل تساعد المدرسة على التصرف بناءً عليها.', valueEn: "SchoolBit doesn't just store data — it helps the school act on it.", richText: true },
    ],
  },
  {
    id: 'schoolbit-integrations',
    type: 'custom',
    order: 7,
    fields: [
      { key: 'title', value: 'يتكامل مع الأنظمة التي تعتمد عليها المدرسة', valueEn: 'Integrates with the systems your school relies on', richText: false },
      { key: 'description', value: 'تقليل إدخال البيانات يدويًا، وتسهيل انتقال المدرسة إلى إدارة أكثر تكاملًا.', valueEn: 'Reduce manual data entry and make the transition to more integrated school management easier.', richText: true },
    ],
  },
  {
    id: 'schoolbit-security',
    type: 'custom',
    order: 8,
    fields: [
      { key: 'title', value: 'تحكم دقيق، وأمان أعلى', valueEn: 'Precise Control, Higher Security', richText: false },
      { key: 'description', value: 'كل مستخدم يعمل ضمن ما يحتاجه فقط، والإدارة تحتفظ بالسيطرة.', valueEn: 'Every user works within only what they need, and administration retains full control.', richText: true },
      { key: 'highlight_text', value: 'كل مستخدم يعمل ضمن ما يحتاجه فقط، والإدارة تحتفظ بالسيطرة.', valueEn: 'Every user works within only what they need, and administration retains full control.', richText: true },
    ],
  },
  {
    id: 'schoolbit-pricing',
    type: 'pricing',
    order: 9,
    fields: [
      { key: 'title', value: 'باقات تناسب كل مدرسة', valueEn: 'Packages for Every School', richText: false },
      { key: 'subtitle', value: 'اختر الباقة المناسبة لحجم مدرستك واحتياجاتك', valueEn: 'Choose the package that fits your school size and needs', richText: false },
    ],
  },
  {
    id: 'schoolbit-outcomes',
    type: 'custom',
    order: 10,
    fields: [
      { key: 'title', value: 'ماذا تكسب المدرسة مع SchoolBit؟', valueEn: 'What does the school gain with SchoolBit?', richText: false },
    ],
  },
  {
    id: 'schoolbit-cta',
    type: 'cta',
    order: 11,
    fields: [
      { key: 'title', value: 'ابدأ بإدارة مدرستك بطريقة أكثر ذكاءً', valueEn: 'Start Managing Your School Smarter', richText: false },
      { key: 'description', value: 'احصل على عرض توضيحي لمنصة SchoolBit، واكتشف كيف يمكن تحويل العمليات اليومية إلى نظام أكثر سرعة، دقة، وتنظيمًا.', valueEn: 'Get a demo of the SchoolBit platform and discover how daily operations can become a faster, more accurate, and organized system.', richText: true },
      { key: 'button_text', value: 'اطلب عرضاً توضيحياً', valueEn: 'Request a Demo', richText: false },
      { key: 'button_url', value: 'https://app.mobile.net.sa/reg', richText: false },
    ],
  },
  {
    id: 'schoolbit-faq',
    type: 'custom',
    order: 12,
    fields: [
      { key: 'title', value: 'الأسئلة الشائعة', valueEn: 'Frequently Asked Questions', richText: false },
    ],
  },
];

export async function POST() {
  try {
    await connectDB();

    await CmsPageContent.findOneAndUpdate(
      { pageId: 'schoolbit' },
      {
        pageId: 'schoolbit',
        path: '/products/schoolbit',
        order: 0,
        seo: {
          title: { en: 'SchoolBit | Smart School Management Platform', ar: 'SchoolBit | منصة إدارة المدارس الذكية' },
          description: { en: 'A smart school management platform that brings together students, attendance, staff, schedules, exams, messaging, and reports in one integrated system.', ar: 'منصة ذكية لإدارة المدارس تجمع الطلاب، الحضور، الكادر، الجداول، الاختبارات، الرسائل، والتقارير في نظام واحد متكامل.' },
          keywords: { en: 'school management, attendance, student tracking, SchoolBit, education platform', ar: 'إدارة مدارس, حضور, متابعة طلاب, سكول بت, منصة تعليمية' },
          canonical: '/products/schoolbit',
          noIndex: false,
        },
        social: {
          ogImage: '',
          ogTitle: { en: 'SchoolBit | Smart School Management Platform', ar: 'SchoolBit | منصة إدارة المدارس الذكية' },
          ogDescription: { en: 'A smart school management platform that brings together students, attendance, staff, schedules, exams, messaging, and reports.', ar: 'منصة ذكية لإدارة المدارس تجمع الطلاب، الحضور، الكادر، الجداول، الاختبارات، الرسائل، والتقارير.' },
        },
        sections: SCHOOLBIT_SECTIONS,
        isActive: true,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'SchoolBit CMS page seeded successfully',
      pageId: 'schoolbit',
      path: '/products/schoolbit',
      sectionsCount: SCHOOLBIT_SECTIONS.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to seed SchoolBit page';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SchoolBit seed endpoint. Send POST request to seed the CMS page.',
    endpoint: '/api/seed/schoolbit',
  });
}