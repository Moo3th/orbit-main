'use client';

import React from "react";
import Link from "next/link";
import { MessageCircle, MessageSquare, Users, ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2, Rocket, Zap, Headphones, Globe, Send } from "lucide-react";
import { Button } from "@/components/business/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/business/ui/card";

import { useLanguage } from '@/contexts/LanguageContext';
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface SolutionsProps {
  pageData?: CmsPage | null;
}

interface SolutionItem {
  titleAr?: string;
  titleEn?: string;
  descAr?: string;
  descEn?: string;
  featuresAr?: string;
  featuresEn?: string;
  link?: string;
  icon?: string;
  color?: string;
  visible?: boolean;
  ctaAr?: string;
  ctaEn?: string;
  productId?: string; // whatsapp | sms | otime | govgate (for default cards linked to product-page visibility)
}

// خرائط الأيقونات والألوان — تُختار من اللوحة بالاسم.
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  message: MessageCircle,
  sms: MessageSquare,
  users: Users,
  shield: ShieldCheck,
  rocket: Rocket,
  zap: Zap,
  support: Headphones,
  globe: Globe,
  send: Send,
};

const COLOR_MAP: Record<string, { iconBg: string; iconText: string; circle: string; hoverBorder: string; btnHover: string }> = {
  green:   { iconBg: 'bg-green-100',  iconText: 'text-green-600',  circle: 'bg-green-50',    hoverBorder: 'hover:border-green-500/20',  btnHover: 'hover:bg-green-600' },
  primary: { iconBg: 'bg-primary/10', iconText: 'text-primary',    circle: 'bg-primary/5',   hoverBorder: 'hover:border-primary/20',    btnHover: 'hover:bg-primary' },
  blue:    { iconBg: 'bg-blue-100',   iconText: 'text-blue-600',   circle: 'bg-blue-50',     hoverBorder: 'hover:border-blue-500/20',   btnHover: 'hover:bg-blue-600' },
  amber:   { iconBg: 'bg-amber-100',  iconText: 'text-amber-600',  circle: 'bg-amber-50',    hoverBorder: 'hover:border-amber-500/20',  btnHover: 'hover:bg-amber-600' },
};

export const Solutions = ({ pageData = null }: SolutionsProps) => {
  const { t, isRTL } = useLanguage();
  const [productVisibility, setProductVisibility] = React.useState<Record<string, boolean>>({
    whatsapp: true, sms: true, otime: true, govgate: true,
  });

  React.useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const res = await fetch('/api/cms/site');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.site?.pages) {
            const pages = data.site.pages;
            setProductVisibility({
              whatsapp: pages.find((p: { id: string }) => p.id === 'whatsapp')?.visible !== false,
              sms: pages.find((p: { id: string }) => p.id === 'sms')?.visible !== false,
              otime: pages.find((p: { id: string }) => p.id === 'otime')?.visible !== false,
              govgate: pages.find((p: { id: string }) => p.id === 'govgate')?.visible !== false,
            });
          }
        }
      } catch (e) { console.error(e); }
    };
    fetchVisibility();
  }, []);

  const getLocalizedField = (fieldKey: string, fallback: string): string => {
    return getCmsField(pageData, 'home-solutions', fieldKey, isRTL, fallback);
  };

  const title = getLocalizedField('title', t.landing.keySolutions.title);
  const subtitle = getLocalizedField('subtitle', t.landing.keySolutions.description);

  // البطاقات الافتراضية (تُستخدم حين تكون قائمة solutions_json فارغة) — مبنية من حقول الـ CMS الحالية.
  const defaultItems: SolutionItem[] = React.useMemo(() => [
    {
      titleAr: getCmsField(pageData, 'home-solutions', 'wa_title', true, t.landing.keySolutions.whatsapp.title),
      titleEn: getCmsField(pageData, 'home-solutions', 'wa_title', false, t.landing.keySolutions.whatsapp.title),
      descAr: getCmsField(pageData, 'home-solutions', 'wa_desc', true, t.landing.keySolutions.whatsapp.description),
      descEn: getCmsField(pageData, 'home-solutions', 'wa_desc', false, t.landing.keySolutions.whatsapp.description),
      featuresAr: getCmsField(pageData, 'home-solutions', 'wa_features', true, t.landing.keySolutions.whatsapp.items.join(',')),
      featuresEn: getCmsField(pageData, 'home-solutions', 'wa_features', false, t.landing.keySolutions.whatsapp.items.join(',')),
      link: '/products/whatsapp', icon: 'message', color: 'green', productId: 'whatsapp', visible: true,
    },
    {
      titleAr: getCmsField(pageData, 'home-solutions', 'sms_title', true, t.landing.keySolutions.sms.title),
      titleEn: getCmsField(pageData, 'home-solutions', 'sms_title', false, t.landing.keySolutions.sms.title),
      descAr: getCmsField(pageData, 'home-solutions', 'sms_desc', true, t.landing.keySolutions.sms.description),
      descEn: getCmsField(pageData, 'home-solutions', 'sms_desc', false, t.landing.keySolutions.sms.description),
      featuresAr: getCmsField(pageData, 'home-solutions', 'sms_features', true, t.landing.keySolutions.sms.items.join(',')),
      featuresEn: getCmsField(pageData, 'home-solutions', 'sms_features', false, t.landing.keySolutions.sms.items.join(',')),
      link: '/products/sms', icon: 'sms', color: 'primary', productId: 'sms', visible: true,
    },
    {
      titleAr: getCmsField(pageData, 'home-solutions', 'otime_title', true, t.landing.keySolutions.otime.title),
      titleEn: getCmsField(pageData, 'home-solutions', 'otime_title', false, t.landing.keySolutions.otime.title),
      descAr: getCmsField(pageData, 'home-solutions', 'otime_desc', true, t.landing.keySolutions.otime.description),
      descEn: getCmsField(pageData, 'home-solutions', 'otime_desc', false, t.landing.keySolutions.otime.description),
      featuresAr: getCmsField(pageData, 'home-solutions', 'otime_features', true, t.landing.keySolutions.otime.items.join(',')),
      featuresEn: getCmsField(pageData, 'home-solutions', 'otime_features', false, t.landing.keySolutions.otime.items.join(',')),
      link: '/products/o-time', icon: 'users', color: 'blue', productId: 'otime', visible: true,
    },
    {
      titleAr: getCmsField(pageData, 'home-solutions', 'govgate_title', true, t.landing.keySolutions.govgate.title),
      titleEn: getCmsField(pageData, 'home-solutions', 'govgate_title', false, t.landing.keySolutions.govgate.title),
      descAr: getCmsField(pageData, 'home-solutions', 'govgate_desc', true, t.landing.keySolutions.govgate.description),
      descEn: getCmsField(pageData, 'home-solutions', 'govgate_desc', false, t.landing.keySolutions.govgate.description),
      featuresAr: getCmsField(pageData, 'home-solutions', 'govgate_features', true, t.landing.keySolutions.govgate.items.join(',')),
      featuresEn: getCmsField(pageData, 'home-solutions', 'govgate_features', false, t.landing.keySolutions.govgate.items.join(',')),
      link: '/products/gov-gate', icon: 'shield', color: 'amber', productId: 'govgate', visible: true,
    },
  ], [pageData, t]);

  const solutionsJson = getCmsField(pageData, 'home-solutions', 'solutions_json', isRTL, '');
  const items: SolutionItem[] = React.useMemo(() => {
    try {
      if (solutionsJson) {
        const parsed = JSON.parse(solutionsJson);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) {
      console.error('Error parsing solutions json', e);
    }
    return defaultItems;
  }, [solutionsJson, defaultItems]);

  const visibleItems = items.filter((it) =>
    it.visible !== false && (!it.productId || productVisibility[it.productId] !== false)
  );

  const getName = (it: SolutionItem) => (isRTL ? it.titleAr || it.titleEn : it.titleEn || it.titleAr) || '';
  const getDesc = (it: SolutionItem) => (isRTL ? it.descAr || it.descEn : it.descEn || it.descAr) || '';
  const getFeatures = (it: SolutionItem) =>
    ((isRTL ? it.featuresAr || it.featuresEn : it.featuresEn || it.featuresAr) || '')
      .split(',').map((s) => s.trim()).filter(Boolean);
  const getCta = (it: SolutionItem) =>
    (isRTL ? it.ctaAr || it.ctaEn : it.ctaEn || it.ctaAr) || (isRTL ? 'اكتشف المزيد' : 'Learn More');

  return (
    <section
      className="py-20 bg-slate-50"
      id="products"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <div className="container mx-auto px-4 md:px-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-slate-600 text-lg">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {visibleItems.map((item, index) => {
            const color = COLOR_MAP[item.color || 'primary'] || COLOR_MAP.primary;
            const Icon = ICON_MAP[item.icon || 'message'] || MessageCircle;
            const features = getFeatures(item);
            const link = item.link || '#';
            return (
              <Card key={index} className={`h-full border-2 border-transparent ${color.hoverBorder} shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative flex flex-col`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${color.circle} rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />

                <CardHeader className="relative pb-2">
                  <div className={`h-14 w-14 ${color.iconBg} rounded-2xl flex items-center justify-center mb-6 ${color.iconText} group-hover:rotate-6 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{getName(item)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative flex-1">
                  <p className="text-slate-600 mb-4">{getDesc(item)}</p>
                  <ul className="space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700">
                        <CheckCircle2 className={`h-5 w-5 ${color.iconText} flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6 relative mt-auto">
                  <Button className={`w-full bg-slate-900 ${color.btnHover} text-white transition-colors group-hover:shadow-lg`} asChild>
                    <Link href={link}>
                      {getCta(item)}
                      {isRTL ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
