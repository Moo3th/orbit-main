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
  Key
} from "lucide-react";
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
  const g = t.products.govgate;
  const heroBadge = getCmsField(cmsPage, 'gg-hero', 'badge', isRTL, g.subtitle);
  const heroTitle = getCmsField(cmsPage, 'gg-hero', 'title', isRTL, g.heroTitle);
  const heroSubtitle = getCmsField(cmsPage, 'gg-hero', 'subtitle', isRTL, g.heroSubtitle);
  const heroDescription = getCmsField(cmsPage, 'gg-hero', 'description', isRTL, g.heroDescription);
  const ctaText = getCmsField(cmsPage, 'gg-cta', 'cta_text', isRTL, g.cta);
  const ctaUrl = getCmsField(cmsPage, 'gg-cta', 'cta_url', isRTL, `https://wa.me/966920006900?text=${encodeURIComponent(isRTL ? "مرحبا، أرغب أنا مهتم بـ GoveGate" : "Hello, I am interested in GoveGate")}`);
  const finalCtaTitle = getCmsField(cmsPage, 'gg-cta', 'final_cta_title', isRTL, g.finalCta.title);
  const finalCtaDescription = getCmsField(cmsPage, 'gg-cta', 'final_cta_description', isRTL, g.finalCta.description);

  return (
    <div 
      className={`min-h-screen ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'} bg-slate-50`} 
      style={{ fontFamily: isRTL ? '"IBM Plex Sans Arabic", sans-serif' : '"IBM Plex Sans", sans-serif' }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0A2647] text-white py-24 lg:py-32">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2647]/95 to-[#104E8B]/90 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1759661881353-5b9cc55e1cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGN5YmVyJTIwc2VjdXJpdHklMjBkYXJrJTIwYmx1ZSUyMG5ldHdvcmt8ZW58MXx8fHwxNzcyMzA2NjY1fDA&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Secure Technology Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-[#00BCD4]/10 text-[#00BCD4] text-sm font-semibold mb-6 border border-[#00BCD4]/20">
                {heroBadge}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {heroTitle} <br />
                <span className="text-[#00BCD4]">{heroSubtitle}</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {heroDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  className="bg-[#FFA502] hover:bg-[#E59400] text-[#0A2647] font-bold text-lg px-8 py-6 h-auto w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                    {ctaText}
                  </a>
                </Button>
              </div>
            </motion.div>
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
              {g.aboutTitle}
            </h2>
            <p className="text-lg text-slate-600 leading-loose max-w-3xl mx-auto">
              {g.aboutDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Building2 className="w-10 h-10 text-[#00BCD4]" />}
              title={g.features.independence.title}
              description={g.features.independence.description}
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-10 h-10 text-[#00BCD4]" />}
              title={g.features.security.title}
              description={g.features.security.description}
            />
            <FeatureCard 
              icon={<Zap className="w-10 h-10 text-[#00BCD4]" />}
              title={g.features.reliability.title}
              description={g.features.reliability.description}
            />
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
                  <div className="text-xs text-slate-400 font-mono">Secure Login</div>
                </div>
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#104E8B] rounded-lg mx-auto flex items-center justify-center mb-4">
                      <Lock className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#104E8B]">{g.portal.login.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">Gove Gate Portal</p>
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
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              {ctaText}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};
