'use client';

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface TestimonialsProps {
  pageData?: CmsPage | null;
}

interface TestimonialItem {
  nameAr?: string;
  nameEn?: string;
  roleAr?: string;
  roleEn?: string;
  quoteAr?: string;
  quoteEn?: string;
  avatar?: string;
  rating?: number;
}

export const Testimonials = ({ pageData = null }: TestimonialsProps) => {
  const { isRTL } = useLanguage();

  const title = getCmsField(pageData, 'home-testimonials', 'title', isRTL, isRTL ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say');
  const subtitle = getCmsField(pageData, 'home-testimonials', 'subtitle', isRTL, isRTL ? 'قصص نجاح حقيقية من شركاء يثقون بمنصات المدار' : 'Real success stories from partners who trust CORBIT platforms');

  const json = getCmsField(pageData, 'home-testimonials', 'testimonials_json', isRTL, '');

  const items: TestimonialItem[] = React.useMemo(() => {
    try {
      if (json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) {
      console.error("Error parsing testimonials json", e);
    }
    return isRTL
      ? [
          { nameAr: 'أحمد العتيبي', roleAr: 'مدير تقنية المعلومات', quoteAr: 'منصة المدار سهّلت علينا إرسال آلاف الرسائل لعملائنا بكل احترافية، والدعم الفني سريع ومحلي.', rating: 5 },
          { nameAr: 'نورة القحطاني', roleAr: 'مديرة التسويق', quoteAr: 'ربطنا متجرنا بسلة في دقائق وبدأنا حملات واتساب فوراً. النتائج فاقت توقعاتنا.', rating: 5 },
          { nameAr: 'خالد الشهري', roleAr: 'مدير الموارد البشرية', quoteAr: 'نظام O-Time غيّر طريقة إدارتنا للحضور والرواتب بالكامل. توفير حقيقي في الوقت.', rating: 5 },
        ]
      : [
          { nameEn: 'Ahmad Al-Otaibi', roleEn: 'IT Manager', quoteEn: 'CORBIT made it effortless to send thousands of professional messages to our clients, with fast local support.', rating: 5 },
          { nameEn: 'Noura Al-Qahtani', roleEn: 'Marketing Manager', quoteEn: 'We connected our Salla store in minutes and launched WhatsApp campaigns instantly. Results exceeded expectations.', rating: 5 },
          { nameEn: 'Khalid Al-Shahri', roleEn: 'HR Director', quoteEn: 'O-Time completely changed how we manage attendance and payroll. A real time-saver.', rating: 5 },
        ];
  }, [json, isRTL]);

  const getName = (t: TestimonialItem) => (isRTL ? t.nameAr || t.nameEn : t.nameEn || t.nameAr) || '';
  const getRole = (t: TestimonialItem) => (isRTL ? t.roleAr || t.roleEn : t.roleEn || t.roleAr) || '';
  const getQuote = (t: TestimonialItem) => (isRTL ? t.quoteAr || t.quoteEn : t.quoteEn || t.quoteAr) || '';

  return (
    <section
      className="py-20 bg-white"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-sm font-bold text-primary bg-primary/5 px-4 py-1.5 rounded-full mb-4">
            {isRTL ? 'آراء العملاء' : 'Testimonials'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-lg text-slate-600">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((t, idx) => {
            const name = getName(t);
            const rating = Math.max(0, Math.min(5, Number(t.rating) || 5));
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <Quote className={`h-9 w-9 text-primary/15 absolute top-6 ${isRTL ? 'left-6' : 'right-6'}`} />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed flex-1 relative z-10">{getQuote(t)}</p>
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-primary font-bold text-lg">{name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{name}</div>
                    <div className="text-xs text-slate-500">{getRole(t)}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
