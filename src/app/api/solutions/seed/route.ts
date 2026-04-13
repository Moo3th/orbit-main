import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Solution } from '@/models/Solution';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    await requireAdmin();
    await connectDB();

    const solutionsData = [
      {
        slug: 'sms-platform',
        title: {
          en: 'SMS Platform',
          ar: 'الرسائل النصية',
        },
        description: {
          en: 'An intelligent messaging platform that ensures your messages reach the right time with the highest delivery rate, full campaign control, precise performance tracking, and seamless integration with your internal systems.',
          ar: 'منصة رسائل ذكية تضمن وصول رسائلك في الوقت المناسب وبأعلى نسبة تسليم، مع تحكم كامل بالحملات، تتبع دقيق للأداء، وإمكانية ربط مباشرة مع أنظمتك الداخلية بكل سهولة',
        },
        features: [
          {
            en: 'Instant alerts and notifications',
            ar: 'تنبيهات وإشعارات فورية',
            icon: '⚡',
          },
          {
            en: 'Targeted marketing campaigns',
            ar: 'حملات تسويقية موجهة',
            icon: '🎯',
          },
          {
            en: 'OTP verification and transaction confirmations',
            ar: 'رسائل تحقق وتأكيد العمليات OTP',
            icon: '🔐',
          },
        ],
        benefits: {
          en: [
            'High delivery rate',
            'Full campaign control',
            'Precise performance tracking',
            'Seamless system integration',
          ],
          ar: [
            'نسبة تسليم عالية',
            'تحكم كامل بالحملات',
            'تتبع دقيق للأداء',
            'تكامل سلس مع الأنظمة',
          ],
        },
        isActive: true,
        order: 1,
      },
      {
        slug: 'whatsapp-business-api',
        title: {
          en: 'WhatsApp Business API',
          ar: 'واتساب اعمال API',
        },
        description: {
          en: 'An integrated solution for official customer communication via WhatsApp, enabling message automation, professional conversation management, and secure, trusted communication that enhances customer confidence.',
          ar: 'حل متكامل للتواصل الرسمي مع العملاء عبر واتساب، يتيح أتمتة الرسائل، إدارة المحادثات باحترافية، وتقديم تجربة تواصل آمنة ومعتمدة تعزز ثقة العملاء',
        },
        features: [
          {
            en: 'Automated responses and customer service',
            ar: 'ردود تلقائية وخدمة عملاء',
            icon: '🤖',
          },
          {
            en: 'Order and service notifications',
            ar: 'إشعارات الطلبات والخدمات',
            icon: '📦',
          },
          {
            en: 'Official trusted communication campaigns',
            ar: 'حملات تواصل رسمية معتمدة',
            icon: '✅',
          },
        ],
        benefits: {
          en: [
            'Official and trusted communication',
            'Message automation',
            'Professional conversation management',
            'Enhanced customer confidence',
          ],
          ar: [
            'تواصل رسمي وموثوق',
            'أتمتة الرسائل',
            'إدارة محادثات احترافية',
            'تعزيز ثقة العملاء',
          ],
        },
        isActive: true,
        order: 2,
      },
      {
        slug: 'otime',
        title: {
          en: 'OTime - Attendance & HR',
          ar: 'اوتايم OTime',
        },
        description: {
          en: 'A smart attendance and departure system that helps you manage work hours accurately, monitor employee compliance in real-time, and analyze data to support HR decisions efficiently.',
          ar: 'نظام حضور وانصراف ذكي يساعدك على إدارة أوقات العمل بدقة، مراقبة الالتزام الوظيفي لحظيًا، وتحليل البيانات لدعم قرارات الموارد البشرية بكفاءة',
        },
        features: [
          {
            en: 'Employee attendance and departure tracking',
            ar: 'تسجيل حضور وانصراف الموظفين',
            icon: '⏰',
          },
          {
            en: 'Compliance and work hours monitoring',
            ar: 'متابعة الالتزام وساعات العمل',
            icon: '📊',
          },
          {
            en: 'Real-time reports',
            ar: 'تقارير فورية',
            icon: '📈',
          },
          {
            en: 'Payroll calculation',
            ar: 'حساب الرواتب',
            icon: '💰',
          },
        ],
        benefits: {
          en: [
            'Accurate work hours management',
            'Real-time compliance monitoring',
            'Efficient HR decision support',
            'Integrated HR system',
          ],
          ar: [
            'إدارة دقيقة لأوقات العمل',
            'مراقبة الالتزام لحظيًا',
            'دعم قرارات الموارد البشرية بكفاءة',
            'نظام موارد بشرية متكامل',
          ],
        },
        isActive: true,
        order: 3,
      },
      {
        slug: 'gov-gate',
        title: {
          en: 'Gov Gate - Government Portal',
          ar: 'البوابة الحكومية Gov Gate',
        },
        description: {
          en: 'An official messaging portal designed for government entities, ensuring the delivery of certified messages with the highest levels of security and reliability, with full internal management and complete compliance with regulatory requirements.',
          ar: 'بوابة مراسلات رسمية مصممة للجهات الحكومية، تضمن إرسال الرسائل المعتمدة بأعلى مستويات الأمان والموثوقية، مع إدارة داخلية كاملة وتوافق تام مع المتطلبات التنظيمية',
        },
        features: [
          {
            en: 'Sending official certified messages',
            ar: 'إرسال رسائل رسمية معتمدة',
            icon: '📋',
          },
          {
            en: 'Government notifications and alerts',
            ar: 'إشعارات وتنبيهات حكومية',
            icon: '🔔',
          },
          {
            en: 'Secure and trusted communication with beneficiaries',
            ar: 'تواصل آمن وموثوق مع المستفيدين',
            icon: '🔒',
          },
        ],
        benefits: {
          en: [
            'Highest security levels',
            'Full reliability',
            'Complete internal management',
            'Full regulatory compliance',
          ],
          ar: [
            'أعلى مستويات الأمان',
            'موثوقية كاملة',
            'إدارة داخلية كاملة',
            'توافق تام مع المتطلبات التنظيمية',
          ],
        },
        isActive: true,
        order: 4,
      },
    ];

    // Delete existing solutions and recreate them
    await Solution.deleteMany({});
    
    // Insert solutions
    const solutions = await Solution.insertMany(solutionsData);

    return NextResponse.json({
      message: 'Solutions seeded successfully',
      count: solutions.length,
      solutions: solutions.map(s => ({
        _id: s._id,
        slug: s.slug,
        title: s.title,
      })),
    });
  } catch (error: any) {
    console.error('Error seeding solutions:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to seed solutions', details: error.message },
      { status: 500 }
    );
  }
}




