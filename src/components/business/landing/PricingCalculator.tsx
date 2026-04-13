'use client';

import React, { useState } from "react";
import { Slider } from "@/components/business/ui/slider";
import { Check } from "lucide-react";

export const PricingCalculator = () => {
  const [messages, setMessages] = useState([10000]);
  
  // Simple pricing logic for demo
  // Base rate starts at 0.15 SAR and decreases as volume increases
  const calculateCost = (count: number) => {
    let rate = 0.15;
    if (count > 50000) rate = 0.12;
    if (count > 100000) rate = 0.10;
    
    return (count * rate).toLocaleString();
  };
  
  const calculateRate = (count: number) => {
    let rate = 0.15;
    if (count > 50000) rate = 0.12;
    if (count > 100000) rate = 0.10;
    
    return rate.toFixed(3);
  };

  return (
    <section className="py-20 bg-white" id="pricing">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">حاسبة الأسعار التقديرية</h2>
            <p className="text-lg text-slate-600">
                ادفع فقط مقابل ما تستخدمه. باقاتنا مرنة، بدون رسوم تأسيس، ولا تنتهي صلاحية الرصيد أبداً.
            </p>
            
            <div className="space-y-4">
                {["رصيد لا تنتهي صلاحيته", "لا توجد رسوم خفية", "خصم للكميات الكبيرة", "دعم فني مجاني"].map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Check className="h-3 w-3" />
                        </div>
                        <span className="text-slate-700 font-medium">{feat}</span>
                    </div>
                ))}
            </div>
          </div>

          <div className="bg-primary rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
             {/* Background glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -mr-20 -mt-20" />
             
             <div className="relative z-10 space-y-8">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-slate-200 font-medium">عدد الرسائل شهرياً</label>
                        <span className="text-2xl font-bold text-white">{messages[0].toLocaleString()}</span>
                    </div>
                    <Slider 
                        value={messages} 
                        onValueChange={setMessages} 
                        max={200000} 
                        step={1000} 
                        min={1000}
                        className="py-4"
                    />
                    <div className="flex justify-between text-xs text-slate-300">
                        <span>1,000</span>
                        <span>200,000+</span>
                    </div>
                </div>

                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                    <p className="text-slate-200 mb-1">التكلفة التقديرية</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{calculateCost(messages[0])}</span>
                        <span className="text-lg text-slate-300">ريال</span>
                    </div>
                    <p className="text-sm text-slate-200 mt-3 font-medium">
                        سعر الرسالة: {calculateRate(messages[0])} ريال
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                        كلما زاد العدد، قل سعر الرسالة الواحدة.
                    </p>
                </div>
                
                <button className="w-full bg-white hover:bg-white/90 text-primary font-bold py-4 rounded-xl transition-colors shadow-lg">
                    اشحن رصيدك الآن
                </button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};


