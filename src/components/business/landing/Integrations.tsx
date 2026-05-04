'use client';

import React from "react";
import { motion } from "framer-motion";
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
  
  const integrationsJson = getCmsField(pageData, 'home-integrations', 'integrations_json', isRTL, '');
  
  const integrations: IntegrationItem[] = React.useMemo(() => {
    try {
      if (integrationsJson) {
        const parsed = JSON.parse(integrationsJson);
        return parsed.map((item: any) => ({
          key: normalizeIntegrationKey(isRTL ? item.nameAr : item.nameEn),
          name: isRTL ? item.nameAr : item.nameEn,
          icon: item.icon,
        }));
      }
    } catch (e) {
      console.error("Error parsing integrations json", e);
    }

    // Fallback to legacy field logic
    const namesRaw = getCmsField(pageData, 'home-integrations', 'integrations_list', isRTL, '');
    if (!namesRaw) return defaultIntegrations.map(i => ({ ...i, name: isRTL ? i.name : (i.key.charAt(0).toUpperCase() + i.key.slice(1)) }));
    
    const names = namesRaw.split(',').map(n => n.trim()).filter(Boolean);
    return names.map(name => {
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
  }, [integrationsJson, pageData, isRTL]);

  return (
    <section 
      className="py-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <div className="container mx-auto px-4 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            {title}
          </h3>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto font-medium opacity-80">
            {subtitle}
          </p>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {integrations.map((item, index) => (
            <motion.div 
              key={`integration-${index}-${item.key}`} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-3xl shadow-sm border border-slate-100 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {item.icon ? (
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-12 w-12 sm:h-16 sm:w-16 object-contain group-hover:scale-110 transition-transform relative z-10"
                />
              ) : (
                <div className="h-12 w-12 sm:h-16 sm:w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-primary/10 group-hover:text-primary transition-all relative z-10">
                  {item.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <span className="mt-3 text-xs sm:text-sm font-bold text-slate-700 relative z-10 group-hover:text-primary transition-colors tracking-wide">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
