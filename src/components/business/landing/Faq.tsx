'use client';

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface FaqProps {
  pageData?: CmsPage | null;
  sectionId?: string;
  defaults?: FaqItem[];
  dark?: boolean;
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

export const Faq = ({ pageData = null, sectionId = 'home-faq', defaults, dark = false }: FaqProps) => {
  const { isRTL } = useLanguage();
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const th = dark
    ? {
        section: 'bg-[#0b1f1c]',
        eyebrow: 'text-green-300 bg-green-500/10',
        title: 'text-white',
        subtitle: 'text-white/70',
        itemOpen: 'border-green-400/30 bg-green-500/[0.06] shadow-sm',
        itemClosed: 'border-white/10 bg-white/[0.04] hover:border-white/20',
        question: 'text-white',
        chevron: 'text-green-400',
        answer: 'text-white/70',
      }
    : {
        section: 'bg-white',
        eyebrow: 'text-primary bg-primary/5',
        title: 'text-slate-900',
        subtitle: 'text-slate-600',
        itemOpen: 'border-primary/20 bg-primary/[0.02] shadow-sm',
        itemClosed: 'border-slate-100 bg-white hover:border-slate-200',
        question: 'text-slate-900',
        chevron: 'text-primary',
        answer: 'text-slate-600',
      };

  const title = getCmsField(pageData, sectionId, 'title', isRTL, isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions');
  const subtitle = getCmsField(pageData, sectionId, 'subtitle', isRTL, isRTL ? 'إجابات عن أكثر ما يسأل عنه عملاؤنا' : 'Answers to what our clients ask most');

  const json = getCmsField(pageData, sectionId, 'faq_json', isRTL, '');

  const items: FaqItem[] = React.useMemo(() => {
    try {
      if (json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) {
      console.error("Error parsing faq json", e);
    }
    return defaults && defaults.length ? defaults : getFaqDefaults(isRTL);
  }, [json, isRTL, defaults]);

  const getQ = (it: FaqItem) => (isRTL ? it.qAr || it.titleAr || it.qEn : it.qEn || it.titleEn || it.qAr) || '';
  const getA = (it: FaqItem) => (isRTL ? it.aAr || it.descAr || it.aEn : it.aEn || it.descEn || it.aAr) || '';

  return (
    <section
      className={`py-20 ${th.section}`}
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full mb-4 ${th.eyebrow}`}>
            {isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${th.title}`}>{title}</h2>
          <p className={`text-lg ${th.subtitle}`}>{subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((it, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 ${isOpen ? th.itemOpen : th.itemClosed}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-start min-h-14"
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-base md:text-lg ${th.question}`}>{getQ(it)}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${th.chevron} ${isOpen ? 'rotate-180' : ''}`}
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
                      <p className={`px-5 md:px-6 pb-5 md:pb-6 leading-relaxed ${th.answer}`}>{getA(it)}</p>
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
