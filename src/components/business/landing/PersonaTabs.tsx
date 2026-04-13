'use client';

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/business/ui/tabs";
import { ShoppingBag, Code2, Terminal, FileText, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/business/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from "@/lib/cms/types";
import { getCmsField } from "@/lib/cms/helpers";

interface PersonaTabsProps {
  pageData?: CmsPage | null;
}

export const PersonaTabs = ({ pageData = null }: PersonaTabsProps) => {
  const { isRTL } = useLanguage();

  const sectionTitle = getCmsField(pageData, 'home-persona-tabs', 'section_title', isRTL, 'منصة مصممة للجميع');
  const sectionSubtitle = getCmsField(pageData, 'home-persona-tabs', 'section_subtitle', isRTL, 'سواء كنت تاجراً تبحث عن السهولة، أو مطوراً يبحث عن المرونة.');

  const merchantsTabTitle = getCmsField(pageData, 'home-persona-tabs', 'merchants_tab_title', isRTL, 'للمتاجر والمسوقين');
  const merchantsTitle = getCmsField(pageData, 'home-persona-tabs', 'merchants_title', isRTL, 'أطلق حملاتك بدون تعقيد');
  const merchantsDescription = getCmsField(pageData, 'home-persona-tabs', 'merchants_description', isRTL, 'لا تحتاج لخبرة تقنية. اربط متجرك في سلة أو زد بضغطة زر واحدة، وابدأ إرسال حملاتك التسويقية لآلاف العملاء فوراً.');
  const merchantsStep1 = getCmsField(pageData, 'home-persona-tabs', 'merchants_step1', isRTL, 'استيراد جهات الاتصال تلقائياً');
  const merchantsStep2 = getCmsField(pageData, 'home-persona-tabs', 'merchants_step2', isRTL, 'قوالب رسائل جاهزة ومعتمدة');
  const merchantsStep3 = getCmsField(pageData, 'home-persona-tabs', 'merchants_step3', isRTL, 'تقارير دقيقة للأداء (الفتح، النقر)');
  const merchantsCtaText = getCmsField(pageData, 'home-persona-tabs', 'merchants_cta_text', isRTL, 'ابدأ حملتك الأولى الآن');
  const merchantsImageUrl = getCmsField(pageData, 'home-persona-tabs', 'merchants_image_url', isRTL, 'https://images.unsplash.com/photo-1758611971897-baffb061fd9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080');

  const developersTabTitle = getCmsField(pageData, 'home-persona-tabs', 'developers_tab_title', isRTL, 'للمطورين والتقنيين');
  const developersBadge = getCmsField(pageData, 'home-persona-tabs', 'developers_badge', isRTL, 'صديق للمطورين');
  const developersTitle = getCmsField(pageData, 'home-persona-tabs', 'developers_title', isRTL, 'API قوي ومرن');
  const developersDescription = getCmsField(pageData, 'home-persona-tabs', 'developers_description', isRTL, 'REST API مرن، توثيق كامل (Documentation)، ودعم فني من مطور لمطور. انسخ الكود وابدأ الإرسال في 5 دقائق.');
  const developersUptime = getCmsField(pageData, 'home-persona-tabs', 'developers_uptime', isRTL, '99.99%');
  const developersLatency = getCmsField(pageData, 'home-persona-tabs', 'developers_latency', isRTL, '50ms');
  const developersToolsRaw = getCmsField(pageData, 'home-persona-tabs', 'developers_tools', isRTL, isRTL ? 'دفعة,سلة,نظام نور,إتقان' : 'Daftra,Salla,Noor,Itqan');
  const developersTools = developersToolsRaw.split(',').map(t => t.trim()).filter(Boolean);
  const developersCtaText = getCmsField(pageData, 'home-persona-tabs', 'developers_cta_text', isRTL, 'تصفح ملفات الـ API');
  const developersCtaUrl = getCmsField(pageData, 'home-persona-tabs', 'developers_cta_url', isRTL, 'https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view');

  return (
    <section 
      className="py-20 bg-white" 
      id="developers"
      style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
    >
      <div className={`container mx-auto px-4 md:px-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{sectionTitle}</h2>
          <p className="text-slate-600">{sectionSubtitle}</p>
        </div>

        <Tabs defaultValue="merchants" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-slate-100 rounded-2xl mb-12">
            <TabsTrigger 
              value="merchants" 
              className="py-4 rounded-xl text-lg font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {merchantsTabTitle}
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="developers" 
              className="py-4 rounded-xl text-lg font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                {developersTabTitle}
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="merchants" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                 <div className="absolute inset-0 bg-primary/10 transform rotate-2 rounded-3xl" />
                 <img 
                    src={merchantsImageUrl} 
                    alt="Merchant using phone"
                    className="relative rounded-3xl shadow-xl border-4 border-white"
                 />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <h3 className="text-3xl font-bold text-slate-900">{merchantsTitle}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{merchantsDescription}</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">1</span>
                    <span className="font-medium text-slate-800">{merchantsStep1}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">2</span>
                    <span className="font-medium text-slate-800">{merchantsStep2}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">3</span>
                    <span className="font-medium text-slate-800">{merchantsStep3}</span>
                  </li>
                </ul>
                <Button 
                  className="mt-4 group gap-2 px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-2xl bg-primary hover:bg-primary/90 text-white border-0" 
                  size="lg"
                  onClick={() => {
                    const hero = document.getElementById('hero');
                    if (hero) {
                      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  {merchantsCtaText}
                  {isRTL ? (
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="developers" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 font-mono text-sm relative overflow-hidden text-left" dir="ltr">
                <div className="flex gap-1.5 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <p className="text-slate-400 mb-2">{`// Send SMS Example`}</p>
                <p className="mb-1"><span className="text-purple-400">await</span> orbit.send({`{`}</p>
                <p className="pl-4"><span className="text-blue-400">to</span>: <span className="text-green-400">&quot;96650xxxxxxx&quot;</span>,</p>
                <p className="pl-4"><span className="text-blue-400">body</span>: <span className="text-green-400">&quot;Your OTP is 1234&quot;</span>,</p>
                <p className="pl-4"><span className="text-blue-400">sender</span>: <span className="text-green-400">&quot;MyStore&quot;</span></p>
                <p className="mb-1">{`}`});</p>
                <p className="mt-2 text-green-500">{`// Result: Message Sent ✅`}</p>
              </div>

              <div className="space-y-6 order-1 md:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                  <Terminal className="h-4 w-4" />
                  {developersBadge}
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{developersTitle}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{developersDescription}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h5 className="font-bold text-slate-900 mb-1">{developersUptime}</h5>
                        <p className="text-sm text-slate-500">Uptime SLA</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h5 className="font-bold text-slate-900 mb-1">{developersLatency}</h5>
                        <p className="text-sm text-slate-500">Latency</p>
                    </div>
                </div>
                <h4 className="text-xl font-bold text-[#7A1E2E] mb-4">{isRTL ? 'جاهز للربط مع أدواتك المفضلة' : 'Ready to Connect with Your Favorite Tools'}</h4>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {developersTools.map((tool, index) => (
                    <span key={index} className="bg-white border px-3 py-1 rounded text-sm font-bold text-slate-600">{tool}</span>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="gap-2.5 w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-0"
                  asChild
                >
                  <a
                    href={developersCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5"
                  >
                    <FileText className={`h-5 w-5 shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} aria-hidden />
                    {developersCtaText}
                    <ExternalLink className={`h-4 w-4 shrink-0 opacity-90 ${isRTL ? 'mr-2' : 'ml-2'}`} aria-hidden />
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
