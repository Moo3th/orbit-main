'use client';

import React from "react";
import Link from "next/link";
import { MessageCircle, MessageSquare, Users, ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/business/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/business/ui/card";

import { useLanguage } from '@/contexts/LanguageContext';
import type { CmsPage } from '@/lib/cms/types';

interface SolutionsProps {
  pageData?: CmsPage | null;
}

export const Solutions = ({ pageData = null }: SolutionsProps) => {
  const { t, isRTL } = useLanguage();
  const getLocalizedField = (fieldKey: string, fallback: string): string => {
    if (!pageData) return fallback;
    const section = pageData.sections?.find((s) => s.id === 'home-solutions');
    const field = section?.fields?.find((f) => f.key === fieldKey);
    if (!field) return fallback;

    const localizedValue = isRTL ? field.value : field.valueEn;
    return localizedValue?.trim() ? localizedValue : fallback;
  };

  const title = getLocalizedField('title', t.landing.keySolutions.title);
  const subtitle = getLocalizedField('subtitle', t.landing.keySolutions.description);
  const waTitle = getLocalizedField('wa_title', t.landing.keySolutions.whatsapp.title);
  const waDesc = getLocalizedField('wa_desc', t.landing.keySolutions.whatsapp.description);
  const smsTitle = getLocalizedField('sms_title', t.landing.keySolutions.sms.title);
  const smsDesc = getLocalizedField('sms_desc', t.landing.keySolutions.sms.description);
  const otimeTitle = getLocalizedField('otime_title', t.landing.keySolutions.otime.title);
  const otimeDesc = getLocalizedField('otime_desc', t.landing.keySolutions.otime.description);
  const govgateTitle = getLocalizedField('govgate_title', t.landing.keySolutions.govgate.title);
  const govgateDesc = getLocalizedField('govgate_desc', t.landing.keySolutions.govgate.description);
  const waItems = getLocalizedField('wa_features', t.landing.keySolutions.whatsapp.items.join(','))
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const smsItems = getLocalizedField('sms_features', t.landing.keySolutions.sms.items.join(','))
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const otimeItems = getLocalizedField('otime_features', t.landing.keySolutions.otime.items.join(','))
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const govgateItems = getLocalizedField('govgate_features', t.landing.keySolutions.govgate.items.join(','))
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

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
          {/* WhatsApp Card */}
          <Card className="h-full border-2 border-transparent hover:border-green-500/20 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

            <CardHeader className="relative pb-2">
              <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:rotate-6 transition-transform">
                <MessageCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">{waTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative flex-1">
              <p className="text-slate-600 mb-4">
                {waDesc}
              </p>
              <ul className="space-y-3">
                {waItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6 relative mt-auto">
              <Button className="w-full bg-slate-900 hover:bg-green-600 text-white transition-colors group-hover:shadow-lg" asChild>
                <Link href="/products/whatsapp">
                  {t.landing.keySolutions.whatsapp.cta}
                  {isRTL ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* SMS Card */}
          <Card className="h-full border-2 border-transparent hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

            <CardHeader className="relative pb-2">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:-rotate-6 transition-transform">
                <MessageSquare className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">{smsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative flex-1">
              <p className="text-slate-600 mb-4">
                {smsDesc}
              </p>
              <ul className="space-y-3">
                {smsItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6 relative mt-auto">
              <Button className="w-full bg-slate-900 hover:bg-primary text-white transition-colors group-hover:shadow-lg" asChild>
                <Link href="/products/sms">
                  {t.landing.keySolutions.sms.cta}
                  {isRTL ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* O-Time Card */}
          <Card className="h-full border-2 border-transparent hover:border-blue-500/20 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

            <CardHeader className="relative pb-2">
              <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:rotate-6 transition-transform">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">{otimeTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative flex-1">
              <p className="text-slate-600 mb-4">
                {otimeDesc}
              </p>
              <ul className="space-y-3">
                {otimeItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6 relative mt-auto">
              <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white transition-colors group-hover:shadow-lg" asChild>
                <Link href="/products/o-time">
                  {t.landing.keySolutions.otime.cta}
                  {isRTL ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Gov Gate Card */}
          <Card className="h-full border-2 border-transparent hover:border-amber-500/20 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

            <CardHeader className="relative pb-2">
              <div className="h-14 w-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600 group-hover:-rotate-6 transition-transform">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">{govgateTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative flex-1">
              <p className="text-slate-600 mb-4">
                {govgateDesc}
              </p>
              <ul className="space-y-3">
                {govgateItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6 relative mt-auto">
              <Button className="w-full bg-slate-900 hover:bg-amber-600 text-white transition-colors group-hover:shadow-lg" asChild>
                <Link href="/products/gov-gate">
                  {t.landing.keySolutions.govgate.cta}
                  {isRTL ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};
