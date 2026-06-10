'use client';

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface FaqProps {
  pageData?: CmsPage | null;
}

interface FaqItem {
  qAr?: string;
  qEn?: string;
  aAr?: string;
  aEn?: string;
  // backward/editor-compat aliases
  titleAr?: string;
  titleEn?: string;
  descAr?: string;
  descEn?: string;
}

export const getFaqDefaults = (isRTL: boolean): FaqItem[] =>
  isRTL
    ? [
        { qAr: 'ما هي خدمات المدار؟', aAr: 'نوفّر منصات مراسلة احترافية: الرسائل النصية SMS، واتساب أعمال API، نظام الموارد البشرية O-Time، وبوابة المراسلة الحكومية Gov Gate.' },
        { qAr: 'كم يستغرق تفعيل الخدمة؟', aAr: 'يمكنك البدء خلال دقائق عبر التسجيل، وفريقنا يساعدك في الربط والإعداد حسب احتياجك.' },
        { qAr: 'هل بياناتي آمنة؟', aAr: 'نعم، بياناتك مشفّرة ومحفوظة داخل السعودية بامتثال كامل لمتطلبات الأمن السيبراني.' },
        { qAr: 'ما وسائل الدفع المتاحة؟', aAr: 'نقبل التحويل البنكي، مدى، فيزا، بالإضافة إلى الدفع الآجل للشركات الكبرى.' },
      ]
    : [
        { qEn: 'What services does CORBIT offer?', aEn: 'We provide professional messaging platforms: SMS, WhatsApp Business API, the O-Time HR system, and the Gov Gate government messaging gateway.' },
        { qEn: 'How long does activation take?', aEn: 'You can start within minutes by signing up, and our team helps you integrate and set up based on your needs.' },
        { qEn: 'Is my data secure?', aEn: 'Yes, your data is encrypted and stored within Saudi Arabia in full compliance with national cybersecurity requirements.' },
        { qEn: 'What payment methods are available?', aEn: 'We accept bank transfer, Mada, Visa, plus deferred payment for large enterprises.' },
      ];

export const Faq = ({ pageData = null }: FaqProps) => {
  const { isRTL } = useLanguage();
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const title = getCmsField(pageData, 'home-faq', 'title', isRTL, isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions');
  const subtitle = getCmsField(pageData, 'home-faq', 'subtitle', isRTL, isRTL ? 'إجابات عن أكثر ما يسأل عنه عملاؤنا' : 'Answers to what our clients ask most');

  const json = getCmsField(pageData, 'home-faq', 'faq_json', isRTL, '');

  const items: FaqItem[] = React.useMemo(() => {
    try {
      if (json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) {
      console.error("Error parsing faq json", e);
    }
    return getFaqDefaults(isRTL);
  }, [json, isRTL]);

  const getQ = (it: FaqItem) => (isRTL ? it.qAr || it.titleAr || it.qEn : it.qEn || it.titleEn || it.qAr) || '';
  const getA = (it: FaqItem) => (isRTL ? it.aAr || it.descAr || it.aEn : it.aEn || it.descEn || it.aAr) || '';

  return (
    <section
      className="py-20 bg-white"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-sm font-bold text-primary bg-primary/5 px-4 py-1.5 rounded-full mb-4">
            {isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-lg text-slate-600">{subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((it, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen ? 'border-primary/20 bg-primary/[0.02] shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-start min-h-14"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900 text-base md:text-lg">{getQ(it)}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-slate-600 leading-relaxed">{getA(it)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
