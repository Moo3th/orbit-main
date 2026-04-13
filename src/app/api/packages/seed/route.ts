import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Package } from '@/models/Package';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    await requireAdmin();
    await connectDB();

    // Delete existing packages and recreate with actual ORBIT packages
    await Package.deleteMany({});

    // SMS Packages (from TechnicalPackages.tsx)
    const smsPackages = [
      {
        id: 'sms-1000',
        name: '1000 Messages Package',
        nameAr: 'باقة 1000 رسالة',
        description: 'Perfect for small businesses',
        descriptionAr: 'مناسبة للشركات الصغيرة',
        duration: 'One-time',
        durationAr: 'مرة واحدة',
        icon: '📱',
        highlighted: false,
        order: 1,
        features: [
          'Technical Support',
          'Integration',
          'API',
          'Instant Balance Recharge',
        ],
        featuresAr: [
          'دعم فني',
          'ربط',
          'API',
          'شحن رصيد فوري',
        ],
      },
      {
        id: 'sms-3000',
        name: '3000 Messages Package',
        nameAr: 'باقة 3000 رسالة',
        description: 'Ideal for growing businesses',
        descriptionAr: 'مناسبة للشركات النامية',
        duration: 'One-time',
        durationAr: 'مرة واحدة',
        icon: '📱',
        highlighted: false,
        order: 2,
        features: [
          'Technical Support',
          'Integration',
          'API',
          'Instant Balance Recharge',
        ],
        featuresAr: [
          'دعم فني',
          'ربط',
          'API',
          'شحن رصيد فوري',
        ],
      },
      {
        id: 'sms-5000',
        name: '5000 Messages Package',
        nameAr: 'باقة 5000 رسالة',
        description: 'Great for medium businesses',
        descriptionAr: 'مثالية للشركات المتوسطة',
        duration: 'One-time',
        durationAr: 'مرة واحدة',
        icon: '📱',
        highlighted: false,
        order: 3,
        features: [
          'Technical Support',
          'Integration',
          'API',
          'Instant Balance Recharge',
        ],
        featuresAr: [
          'دعم فني',
          'ربط',
          'API',
          'شحن رصيد فوري',
        ],
      },
      {
        id: 'sms-10000',
        name: '10000 Messages Package',
        nameAr: 'باقة 10000 رسالة',
        description: 'Perfect for larger operations',
        descriptionAr: 'مناسبة للعمليات الأكبر',
        duration: 'One-time',
        durationAr: 'مرة واحدة',
        icon: '📱',
        highlighted: false,
        order: 4,
        features: [
          'Technical Support',
          'Integration',
          'API',
          'Instant Balance Recharge',
        ],
        featuresAr: [
          'دعم فني',
          'ربط',
          'API',
          'شحن رصيد فوري',
        ],
      },
      {
        id: 'sms-20000',
        name: '20000 Messages Package',
        nameAr: 'باقة 20000 رسالة',
        description: 'For high-volume messaging',
        descriptionAr: 'للرسائل عالية الحجم',
        duration: 'One-time',
        durationAr: 'مرة واحدة',
        icon: '📱',
        highlighted: false,
        order: 5,
        features: [
          'Technical Support',
          'Integration',
          'API',
          'Instant Balance Recharge',
        ],
        featuresAr: [
          'دعم فني',
          'ربط',
          'API',
          'شحن رصيد فوري',
        ],
      },
      {
        id: 'sms-50000',
        name: '50000 Messages Package',
        nameAr: 'باقة 50000 رسالة',
        description: 'Enterprise-level messaging',
        descriptionAr: 'رسائل على مستوى المؤسسات',
        duration: 'One-time',
        durationAr: 'مرة واحدة',
        icon: '📱',
        highlighted: false,
        order: 6,
        features: [
          'Technical Support',
          'Integration',
          'API',
          'Instant Balance Recharge',
        ],
        featuresAr: [
          'دعم فني',
          'ربط',
          'API',
          'شحن رصيد فوري',
        ],
      },
      {
        id: 'sms-100000',
        name: '100000 Messages Package',
        nameAr: 'باقة 100000 رسالة',
        description: 'Premium package with technical consultant',
        descriptionAr: 'باقة مميزة مع مستشار فني',
        duration: 'One-time',
        durationAr: 'مرة واحدة',
        icon: '📱',
        highlighted: true,
        order: 7,
        features: [
          'Technical Support',
          'Integration',
          'API',
          'Instant Balance Recharge',
          'Technical Consultant',
        ],
        featuresAr: [
          'دعم فني',
          'ربط',
          'API',
          'شحن رصيد فوري',
          'مستشار فني',
        ],
      },
    ];

    // OTime Packages (from TechnicalPackages.tsx)
    const otimePackages = [
      {
        id: 'otime-basic',
        name: 'Basic Package',
        nameAr: 'الباقة الأساسية',
        description: 'Perfect for small teams',
        descriptionAr: 'مناسبة للفرق الصغيرة',
        duration: 'Monthly Subscription',
        durationAr: 'اشتراك شهري',
        icon: '⏰',
        highlighted: false,
        order: 8,
        features: [
          'Email Notifications',
          'SMS Notifications',
          'Basic Notifications',
          '24/7 Support',
          'Account Manager',
        ],
        featuresAr: [
          'إشعارات عبر البريد الإلكتروني',
          'إشعارات SMS',
          'إشعارات أساسية',
          'دعم 7/24',
          'مدير حساب',
        ],
      },
      {
        id: 'otime-advanced-monthly',
        name: 'Advanced Plus - Monthly',
        nameAr: 'الباقة المتقدمة بلس - الاشتراك الشهري',
        description: 'Most popular package',
        descriptionAr: 'الباقة الأكثر طلبًا',
        duration: 'Monthly Subscription',
        durationAr: 'اشتراك شهري',
        icon: '⏰',
        highlighted: true,
        order: 9,
        features: [
          '8 Administrative Users',
          '1,000 Employee Accounts (Fingerprint)',
          'Storage up to 3 GB',
          'Email Notifications',
          'SMS Notifications (Coming Soon)',
          'Technical Support (24/7)',
          'Account Manager for Account Setup',
        ],
        featuresAr: [
          '8 مستخدمين اداريين للحساب',
          '1,000 حساب موظف (بصمة)',
          'مساحة تخزين تصل الى 3 قيقا',
          'اشعارات بريد الكتروني',
          'اشعارات sms (قريبا)',
          'دعم فني (7/24)',
          'مدير حساب للمساعدة في تأسيس الحساب',
        ],
      },
      {
        id: 'otime-advanced-annual',
        name: 'Advanced Plus - Annual',
        nameAr: 'الباقة المتقدمة بلس - الاشتراك السنوي',
        description: 'Best value for annual commitment',
        descriptionAr: 'أفضل قيمة للالتزام السنوي',
        duration: 'Annual Subscription',
        durationAr: 'اشتراك سنوي',
        icon: '⏰',
        highlighted: false,
        order: 10,
        features: [
          '8 Administrative Users',
          '1,000 Employee Accounts (Fingerprint)',
          'Storage up to 3 GB',
          'Email Notifications',
          'SMS Notifications (Coming Soon)',
          'Technical Support (24/7)',
          'Account Manager for Account Setup',
        ],
        featuresAr: [
          '8 مستخدمين اداريين للحساب',
          '1,000 حساب موظف (بصمة)',
          'مساحة تخزين تصل الى 3 قيقا',
          'اشعارات بريد الكتروني',
          'اشعارات sms (قريبا)',
          'دعم فني (7/24)',
          'مدير حساب للمساعدة في تأسيس الحساب',
        ],
      },
    ];

    // Combine all packages
    const packagesToSeed = [...smsPackages, ...otimePackages];

    // Insert all packages
    const result = await Package.insertMany(packagesToSeed);

    return NextResponse.json({
      message: 'Packages seeded successfully',
      count: result.length,
      packages: result.map(p => ({
        _id: p._id,
        id: p.id,
        name: p.name,
        nameAr: p.nameAr,
      })),
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error seeding packages:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to seed packages', details: error.message },
      { status: 500 }
    );
  }
}
