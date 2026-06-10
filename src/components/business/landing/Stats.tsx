'use client';

import React from "react";
import { motion } from "framer-motion";
import { Building2, Send, ShieldCheck, Headphones } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface StatsProps {
  pageData?: CmsPage | null;
}

const ICONS = [Building2, Send, ShieldCheck, Headphones];

export const Stats = ({ pageData = null }: StatsProps) => {
  const { isRTL } = useLanguage();

  const items = [1, 2, 3, 4].map((n) => ({
    value: getCmsField(pageData, 'home-stats', `stat${n}_value`, isRTL, ''),
    label: getCmsField(pageData, 'home-stats', `stat${n}_label`, isRTL, ''),
  }));

  const fallbacks = isRTL
    ? [
        { value: '+100', label: 'شركة تثق بنا' },
        { value: 'ملايين', label: 'رسالة شهرياً' },
        { value: '99.99%', label: 'نسبة التشغيل' },
        { value: '24/7', label: 'دعم فني محلي' },
      ]
    : [
        { value: '100+', label: 'Companies Trust Us' },
        { value: 'Millions', label: 'Messages / Month' },
        { value: '99.99%', label: 'Uptime' },
        { value: '24/7', label: 'Local Support' },
      ];

  const stats = items.map((item, i) => ({
    value: item.value || fallbacks[i].value,
    label: item.label || fallbacks[i].label,
    Icon: ICONS[i],
  }));

  return (
    <section
      className="relative bg-[#7A1E2E] overflow-hidden"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 divide-y-0">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center ring-1 ring-white/15">
                <stat.Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                {stat.value}
              </div>
              <div className="mt-2 text-sm md:text-base text-white/70 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
