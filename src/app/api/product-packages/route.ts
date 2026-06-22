import { NextRequest, NextResponse } from 'next/server';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById, getCmsField } from '@/lib/cms/helpers';
import {
  parseWhatsAppPlans,
  getDefaultWhatsAppPlans,
} from '@/lib/cms/whatsappPricing';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// خرائط معرّف المنتج → معرّف صفحة الـ CMS التي تحوي الباقات.
// حالياً الواتساب فقط يملك باقات مهيكلة قابلة للتحرير من اللوحة.
const PRODUCT_TO_PAGE_ID: Record<string, string> = {
  whatsapp: 'whatsapp',
};

interface PackageTierDTO {
  tierName: string;
  price: string;
  priceWithTax: string;
  setupFee: string;
}

interface PackageDTO {
  planId: string;
  planName: string;
  period: string;
  popular: boolean;
  badge: string;
  currency: string;
  tiers: PackageTierDTO[];
}

/**
 * يُرجع باقات المنتج بشكل موحّد ليستهلكها حقل «الباقة» في النموذج الديناميكي.
 * المصدر هو نفس مصدر قسم الأسعار (CMS: wa-pricing/plans_list) فتبقى متزامنة.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product = (searchParams.get('product') || '').trim();
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'ar';
    const isRTL = lang !== 'en';

    const pageId = PRODUCT_TO_PAGE_ID[product];
    if (!pageId) {
      return NextResponse.json({ packages: [] });
    }

    const snapshot = await getSiteCmsSnapshot();
    const page = getCmsPageById(snapshot, pageId);

    if (pageId === 'whatsapp') {
      const plansJson = getCmsField(page, 'wa-pricing', 'plans_list', isRTL, '');
      const currency = getCmsField(page, 'wa-pricing', 'plans_currency', isRTL, isRTL ? 'ر.س' : 'SAR');
      const periodFallback = getCmsField(page, 'wa-pricing', 'plans_period_label', isRTL, isRTL ? 'شهرياً' : 'Monthly');
      const plans = plansJson
        ? parseWhatsAppPlans(plansJson, getDefaultWhatsAppPlans(isRTL))
        : getDefaultWhatsAppPlans(isRTL);

      const packages: PackageDTO[] = plans.map((plan) => ({
        planId: plan.id,
        planName: plan.name,
        period: plan.period || periodFallback,
        popular: plan.popular,
        badge: plan.badge,
        currency,
        tiers: plan.tiers.map((tier) => ({
          tierName: tier.name,
          price: tier.price,
          priceWithTax: tier.priceWithTax,
          setupFee: tier.setupFee,
        })),
      }));

      return NextResponse.json({ packages, currency });
    }

    return NextResponse.json({ packages: [] });
  } catch (error) {
    console.error('Error fetching product packages:', error);
    return NextResponse.json({ packages: [] });
  }
}
