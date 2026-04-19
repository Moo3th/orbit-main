'use client';

import React from "react";
import { Headphones, Shield, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

interface WhyUsProps {
  pageData?: CmsPage | null;
}

export const WhyUs = ({ pageData = null }: WhyUsProps) => {
  const { isRTL } = useLanguage();
  const sectionTitle = getCmsField(pageData, 'home-whyus', 'section_title', isRTL, isRTL ? 'لماذا المدار؟' : 'Why ORBIT?');
  const sectionSubtitle = getCmsField(pageData, 'home-whyus', 'section_subtitle', isRTL, isRTL ? 'نقدم لك مزايا فريدة تجعل تجربتك أفضل' : 'We offer unique advantages that make your experience better');
  const features = [
    {
      icon: <Headphones className="h-8 w-8 text-white" />,
      titleEn: getCmsField(pageData, 'home-whyus', 'support_title', false, "Local Support"),
      titleAr: getCmsField(pageData, 'home-whyus', 'support_title', true, "دعم فني محلي"),
      descriptionEn: getCmsField(pageData, 'home-whyus', 'support_desc', false, "A Saudi team answering you via WhatsApp/phone 24/7 to serve you."),
      descriptionAr: getCmsField(pageData, 'home-whyus', 'support_desc', true, "فريق سعودي يرد عليك واتساب/هاتف على مدار الساعة لخدمتك."),
      color: "bg-primary",
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      titleEn: getCmsField(pageData, 'home-whyus', 'security_title', false, "High Security"),
      titleAr: getCmsField(pageData, 'home-whyus', 'security_title', true, "أمان عالي"),
      descriptionEn: getCmsField(pageData, 'home-whyus', 'security_desc', false, "Your data is encrypted and stored in Saudi Arabia (Compliance with NCA)."),
      descriptionAr: getCmsField(pageData, 'home-whyus', 'security_desc', true, "بياناتك مشفرة ومحفوظة داخل السعودية (امتثال للأمن السيبراني)."),
      color: "bg-green-600",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-white" />,
      titleEn: getCmsField(pageData, 'home-whyus', 'payment_title', false, "Flexible Payment"),
      titleAr: getCmsField(pageData, 'home-whyus', 'payment_title', true, "الدفع المرن"),
      descriptionEn: getCmsField(pageData, 'home-whyus', 'payment_desc', false, "Bank transfer, Mada, Visa, or Deferred (for large companies)."),
      descriptionAr: getCmsField(pageData, 'home-whyus', 'payment_desc', true, "تحويل بنكي، مدى، فيزا، أو آجل (للشركات الكبرى)."),
      color: "bg-blue-600",
    },
  ];

  return (
    <section 
      className="py-20 bg-slate-50"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{sectionTitle}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{sectionSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:translate-y-[-5px] transition-transform duration-300">
              <div className={`h-16 w-16 mx-auto ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/10`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{isRTL ? feature.titleAr : feature.titleEn}</h3>
              <p className="text-slate-600 leading-relaxed">{isRTL ? feature.descriptionAr : feature.descriptionEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

