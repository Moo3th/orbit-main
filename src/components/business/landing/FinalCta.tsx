'use client';

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/business/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface FinalCtaProps {
  pageData?: CmsPage | null;
}

export const FinalCta = ({ pageData = null }: FinalCtaProps) => {
  const { isRTL } = useLanguage();

  const title = getCmsField(pageData, 'home-cta', 'title', isRTL, isRTL ? 'جاهز لتطوير تواصلك مع عملائك؟' : 'Ready to elevate how you reach your customers?');
  const subtitle = getCmsField(pageData, 'home-cta', 'subtitle', isRTL, isRTL ? 'ابدأ اليوم مع المدار، أو تحدّث مع فريق المبيعات لاختيار الحل الأنسب لأعمالك.' : 'Start today with CORBIT, or talk to our sales team to find the right solution for your business.');
  const primaryText = getCmsField(pageData, 'home-cta', 'primary_text', isRTL, isRTL ? 'ابدأ مجاناً' : 'Start Free');
  const primaryUrl = getCmsField(pageData, 'home-cta', 'primary_url', isRTL, 'https://app.mobile.net.sa/reg');
  const secondaryText = getCmsField(pageData, 'home-cta', 'secondary_text', isRTL, isRTL ? 'تواصل مع المبيعات' : 'Talk to Sales');
  const secondaryUrl = getCmsField(pageData, 'home-cta', 'secondary_url', isRTL, '/contact');

  const isSecondaryInternal = secondaryUrl.startsWith('/');

  return (
    <section
      className="py-20 bg-slate-50"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#7A1E2E] to-[#5a1421] px-6 py-14 md:px-16 md:py-20 text-center shadow-2xl shadow-primary/20"
        >
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-5">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="group w-full sm:w-auto bg-white hover:bg-white/90 text-[#7A1E2E] font-bold min-h-14 h-auto px-10 py-4 text-lg rounded-2xl shadow-xl transition-all hover:scale-105"
                asChild
              >
                <a href={primaryUrl} target="_blank" rel="noopener noreferrer">
                  <span>{primaryText}</span>
                  {isRTL ? <ArrowLeft className="mr-2 h-5 w-5 shrink-0 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-14 h-auto px-8 py-4 text-lg border-2 border-white/30 bg-transparent hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
                asChild
              >
                {isSecondaryInternal ? (
                  <Link href={secondaryUrl}>
                    <MessageCircle className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 shrink-0`} />
                    {secondaryText}
                  </Link>
                ) : (
                  <a href={secondaryUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5 shrink-0`} />
                    {secondaryText}
                  </a>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
