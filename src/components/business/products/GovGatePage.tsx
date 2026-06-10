'use client';

import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  ShieldCheck, 
  Zap, 
  FileCheck, 
  Headphones, 
  BarChart3, 
  ArrowRight,
  Lock,
  User,
  Key,
  ArrowLeft
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/business/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
  >
    <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#104E8B] mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const WhyUsCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex flex-col items-center text-center p-6">
    <div className="w-16 h-16 bg-[#FFA502]/10 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#104E8B] mb-2">{title}</h3>
    <p className="text-slate-600">
      {description}
    </p>
  </div>
);

interface GovGatePageProps {
  cmsPage?: CmsPage | null;
}

export const GovGatePage = ({ cmsPage = null }: GovGatePageProps) => {
  const { t, isRTL } = useLanguage();
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const g = t.products.govgate;
  
  const slidesJson = getCmsField(cmsPage, 'gg-hero', 'slides_json', isRTL, '');
  const slides = React.useMemo(() => {
    try {
      if (slidesJson) {
        return JSON.parse(slidesJson);
      }
    } catch (e) {
      console.error("Error parsing gg slides", e);
    }
    // Fallback to single static slide
    return [{
      id: 'default',
      titleAr: getCmsField(cmsPage, 'gg-hero', 'title', true, g.heroTitle),
      titleEn: getCmsField(cmsPage, 'gg-hero', 'title', false, g.heroTitle),
      descAr: getCmsField(cmsPage, 'gg-hero', 'description', true, g.heroDescription),
      descEn: getCmsField(cmsPage, 'gg-hero', 'description', false, g.heroDescription),
      ctaTextAr: getCmsField(cmsPage, 'gg-cta', 'cta_text', true, g.cta),
      ctaTextEn: getCmsField(cmsPage, 'gg-cta', 'cta_text', false, g.cta),
      ctaUrl: getCmsField(cmsPage, 'gg-cta', 'cta_url', isRTL, "/products/gov-gate/form"),
      badgeAr: getCmsField(cmsPage, 'gg-hero', 'badge', true, g.subtitle),
      badgeEn: getCmsField(cmsPage, 'gg-hero', 'badge', false, g.subtitle),
      image: "https://images.unsplash.com/photo-1759661881353-5b9cc55e1cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    }];
  }, [slidesJson, cmsPage, isRTL, g]);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrentSlideIndex(p => (p + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentSlideIndex] || slides[0];
  const heroBadge = isRTL ? currentSlide.badgeAr : currentSlide.badgeEn;
  const heroTitle = isRTL ? currentSlide.titleAr : currentSlide.titleEn;
  const heroDescription = isRTL ? currentSlide.descAr : currentSlide.descEn;
  const ctaText = isRTL ? currentSlide.ctaTextAr : currentSlide.ctaTextEn;
  const ctaUrl = currentSlide.ctaUrl || "/products/gov-gate/form";

  const heroSubtitle = getCmsField(cmsPage, 'gg-hero', 'subtitle', isRTL, g.heroSubtitle);
  const finalCtaTitle = getCmsField(cmsPage, 'gg-cta', 'final_cta_title', isRTL, g.finalCta.title);
  const finalCtaDescription = getCmsField(cmsPage, 'gg-cta', 'final_cta_description', isRTL, g.finalCta.description);

  return (
    <div 
      className={`min-h-screen ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'} bg-slate-50`} 
      style={{ fontFamily: isRTL ? '"IBM Plex Sans Arabic", sans-serif' : '"IBM Plex Sans", sans-serif' }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0A2647] text-white min-h-[600px] flex items-center">
        {/* Background Overlay */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlideIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2647]/95 to-[#104E8B]/90 z-10" />
            <img 
              src={currentSlide.image || "https://images.unsplash.com/photo-1759661881353-5b9cc55e1cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"} 
              alt="Secure Technology Background" 
              className="w-full h-full object-cover opacity-30"
            />
          </motion.div>
        </AnimatePresence>

        <div className="container relative z-20 mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlideIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-[#00BCD4]/10 text-[#00BCD4] text-sm font-semibold mb-6 border border-[#00BCD4]/20">
                  {heroBadge}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  {heroTitle} {heroSubtitle && <><br /><span className="text-[#00BCD4]">{heroSubtitle}</span></>}
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {heroDescription}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    className="bg-[#FFA502] hover:bg-[#E59400] text-[#0A2647] font-bold text-lg px-10 py-6 h-auto w-full sm:w-auto shadow-lg hover:shadow-xl transition-all rounded-2xl"
                    asChild
                  >
                    <a href={ctaUrl} target={ctaUrl.startsWith('http') ? "_blank" : undefined} rel={ctaUrl.startsWith('http') ? "noopener noreferrer" : undefined}>
                      {ctaText}
                      {isRTL ? <ArrowLeft className="mr-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-5 w-5" />}
                    </a>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Abstract decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent z-20" />
      </section>

      {/* About Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#104E8B] mb-6">
              {getCmsField(cmsPage, 'gg-about', 'title', isRTL, g.aboutTitle)}
            </h2>
            <p className="text-lg text-slate-600 leading-loose max-w-3xl mx-auto">
              {getCmsField(cmsPage, 'gg-about', 'description', isRTL, g.aboutDescription)}
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {(() => {
               const json = getCmsField(cmsPage, 'gg-features', 'features_json', isRTL, '');
               try {
                 if (json) {
                   const items = JSON.parse(json);
                   const icons = [Building2, ShieldCheck, Zap];
                   return items.map((item: any, i: number) => (
                      <FeatureCard 
                        key={i}
                        icon={item.icon ? <img src={item.icon} className="w-10 h-10 object-contain" alt="" /> : React.createElement(icons[i % 3], { className: "w-10 h-10 text-[#00BCD4]" })}
                        title={isRTL ? item.titleAr : item.titleEn}
                        description={isRTL ? item.descAr : item.descEn}
                      />
                   ));
                 }
               } catch (e) {}

               return [
                  { title: getCmsField(cmsPage, 'gg-features', 'feature1_title', isRTL, g.features.independence.title), desc: getCmsField(cmsPage, 'gg-features', 'feature1_desc', isRTL, g.features.independence.description), icon: <Building2 className="w-10 h-10 text-[#00BCD4]" /> },
                  { title: getCmsField(cmsPage, 'gg-features', 'feature2_title', isRTL, g.features.security.title), desc: getCmsField(cmsPage, 'gg-features', 'feature2_desc', isRTL, g.features.security.description), icon: <ShieldCheck className="w-10 h-10 text-[#00BCD4]" /> },
                  { title: getCmsField(cmsPage, 'gg-features', 'feature3_title', isRTL, g.features.reliability.title), desc: getCmsField(cmsPage, 'gg-features', 'feature3_desc', isRTL, g.features.reliability.description), icon: <Zap className="w-10 h-10 text-[#00BCD4]" /> }
               ].map((item, i) => (
                 <FeatureCard 
                    key={i}
                    icon={item.icon}
                    title={item.title}
                    description={item.desc}
                  />
               ));
            })()}
          </div>
        </div>
      </section>

      {/* Login Widget Mockup Section */}
      <section className="py-24 bg-[#0A2647] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#104E8B] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#00BCD4] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className={`lg:w-1/2 text-white ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {g.portal.title} <br />
                <span className="text-[#FFA502]">{g.portal.subtitle}</span>
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                {g.portal.description}
              </p>
              
              <ul className="space-y-4">
                {g.portal.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-slate-200">
                    <div className="w-6 h-6 rounded-full bg-[#00BCD4]/20 flex items-center justify-center text-[#00BCD4]">
                      <ArrowRight size={14} className={isRTL ? "" : "rotate-180"} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">{getCmsField(cmsPage, 'gg-hero', 'portal_secure_login', isRTL, 'Secure Login')}</div>
                </div>
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#104E8B] rounded-lg mx-auto flex items-center justify-center mb-4">
                      <Lock className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#104E8B]">{g.portal.login.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{getCmsField(cmsPage, 'gg-hero', 'portal_name', isRTL, 'Gov Gate Portal')}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">{g.portal.login.username}</label>
                      <div className="relative">
                        <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 text-slate-400 w-5 h-5`} />
                        <input type="text" className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]`} placeholder="username@gov.sa" readOnly />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">{g.portal.login.password}</label>
                      <div className="relative">
                        <Key className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 text-slate-400 w-5 h-5`} />
                        <input type="password" className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]`} value="password123" readOnly />
                      </div>
                    </div>
                    <Button className="w-full bg-[#104E8B] hover:bg-[#0A2647] text-white py-6 mt-2">
                      {g.portal.login.button}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#104E8B] mb-4">{g.whyUs.title}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{g.whyUs.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <WhyUsCard 
              icon={<FileCheck className="w-8 h-8 text-[#FFA502]" />}
              title={g.whyUs.compliance.title}
              description={g.whyUs.compliance.description}
            />
            <WhyUsCard 
              icon={<Headphones className="w-8 h-8 text-[#FFA502]" />}
              title={g.whyUs.support.title}
              description={g.whyUs.support.description}
            />
            <WhyUsCard 
              icon={<BarChart3 className="w-8 h-8 text-[#FFA502]" />}
              title={g.whyUs.reporting.title}
              description={g.whyUs.reporting.description}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#104E8B] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{finalCtaTitle}</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            {finalCtaDescription}
          </p>
          <Button 
            className="bg-[#FFA502] hover:bg-[#E59400] text-[#0A2647] font-bold text-lg px-10 py-6 h-auto shadow-lg"
            asChild
          >
            <a href={ctaUrl} target={ctaUrl.startsWith('http') ? "_blank" : undefined} rel={ctaUrl.startsWith('http') ? "noopener noreferrer" : undefined}>
              {ctaText}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};
