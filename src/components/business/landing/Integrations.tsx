'use client';

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface IntegrationsProps {
  pageData?: CmsPage | null;
}

interface IntegrationItem {
  name: string;
  icon: string;
  key: string;
}

const defaultIntegrations: IntegrationItem[] = [
  { key: "salla", name: "سلة", icon: "/1/salla.svg" },
  { key: "daftra", name: "دفعة", icon: "/1/daftra.png" },
  { key: "noor", name: "نور", icon: "/1/noor.png" },
  { key: "itqan", name: "إتقان", icon: "/1/etqan.jpeg" },
  { key: "huddari", name: "حضوري", icon: "/1/huddari.png" },
];

const normalizeIntegrationKey = (name: string): string => {
  const normalized = name.trim().toLowerCase();
  if (normalized.includes('سلة') || normalized.includes('salla')) return 'salla';
  if (normalized.includes('دفتر') || normalized.includes('daftra')) return 'daftra';
  if (normalized.includes('نور') || normalized.includes('noor')) return 'noor';
  if (normalized.includes('اتقان') || normalized.includes('itqan')) return 'itqan';
  if (normalized.includes('حضوري') || normalized.includes('huddari')) return 'huddari';
  return normalized.replace(/\s+/g, '_');
};

export const Integrations = ({ pageData = null }: IntegrationsProps) => {
  const { isRTL } = useLanguage();
  
  const title = getCmsField(pageData, 'home-integrations', 'title', isRTL, isRTL ? 'نعمل مع أدواتك المفضلة' : 'We Work with Your Favorite Tools');
  const subtitle = getCmsField(pageData, 'home-integrations', 'subtitle', isRTL, isRTL ? 'لن تضطر لتغيير نظام عملك الحالي، نحن نندمج معه بسهولة.' : 'You won\'t have to change your current workflow; we integrate with it seamlessly.');
  
  const namesRaw = getCmsField(pageData, 'home-integrations', 'integrations_list', isRTL, '');
  const names = namesRaw.split(',').map(n => n.trim()).filter(Boolean);

  const integrations: IntegrationItem[] = names.map(name => {
    const key = normalizeIntegrationKey(name);
    const iconFieldKey = `integration_${key}_icon`;
    const icon = getCmsField(pageData, 'home-integrations', iconFieldKey, isRTL, '');
    const defaultItem = defaultIntegrations.find(i => i.key === key);
    return {
      key,
      name,
      icon: icon || defaultItem?.icon || '',
    };
  });

  return (
    <section 
      className="py-16 bg-slate-50 border-t border-slate-200"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <div className="container mx-auto px-4 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-slate-500 mb-10">
          {subtitle}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          {integrations.map((item, index) => (
            <div 
              key={`integration-${index}-${item.key}`} 
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
            >
              {item.icon ? (
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-16 w-16 object-contain group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {item.name.substring(0, 2)}
                </div>
              )}
              <span className="mt-2 text-sm font-medium text-slate-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
