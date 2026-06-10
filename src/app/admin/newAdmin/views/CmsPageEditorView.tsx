'use client';

import { useState, useEffect, useMemo } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Save, Plus, ChevronDown, ChevronUp, GripVertical, Pin, ExternalLink, FileText, Search, Image as ImageIcon, Globe, Shield, Lightbulb, Users, ArrowRight, Star, Mail, Newspaper, Zap, Palette, MessageSquare, LayoutGrid, Settings, Tag, Layers } from 'lucide-react';
import { Button } from '@/components/business/ui/button';
import { Card, CardContent } from '@/components/business/ui/card';
import { Badge } from '@/components/business/ui/badge';
import { Switch } from '@/components/business/ui/switch';
import { useSiteData, PageData, PageSection, SectionField, PageSeo } from '../SiteDataContext';
import { parseSmsPlanRows, stringifySmsPlanRows, type SmsPlanRow } from '@/lib/cms/smsPricing';
import {
  parseWhatsAppPlans,
  serializeWhatsAppPlans,
  parseWhatsAppConversationPrices,
  serializeWhatsAppConversationPrices,
  getDefaultWhatsAppPlans,
  getDefaultWhatsAppConversationPrices,
  type WhatsAppPlanConfig,
  type WhatsAppPlanTier,
  type WhatsAppConversationPrice,
} from '@/lib/cms/whatsappPricing';
import {
  parseSchoolBitPlans,
  serializeSchoolBitPlans,
  getDefaultSchoolBitPlans,
  type SchoolBitPlan,
  parseSchoolBitSmsPlans,
  getDefaultSchoolBitSmsPlans,
  type SchoolBitSmsPlan,
} from '@/lib/cms/schoolbitPricing';
import { ImageUploader } from '@/components/business/ImageUploader';

interface Props {
  isAr: boolean;
  pageId: string | null;
  onBack: () => void;
}

const SmsPlansListEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const rows = parseSmsPlanRows(value);

  const updateRow = (index: number, patch: Partial<SmsPlanRow>) => {
    const next = rows.map((row, i) => {
      if (i !== index) return row;
      const updated = { ...row, ...patch };
      if (updated.custom) {
        return { ...updated, messages: "custom", price: "" };
      }
      return updated;
    });
    onChange(stringifySmsPlanRows(next));
  };

  const removeRow = (index: number) => {
    onChange(stringifySmsPlanRows(rows.filter((_, i) => i !== index)));
  };

  const addRow = () => {
    const next = [...rows, { messages: "", price: "", feature: "", description: "", featured: false, custom: false }];
    onChange(stringifySmsPlanRows(next));
  };

  return (
    <div className="space-y-3">
      <label className="text-xs text-gray-500 font-medium block mb-2">{isAr ? "باقات الرسائل" : "SMS Plans"}</label>
      {rows.map((row, index) => (
        <div key={index} className="border border-gray-100 rounded-xl p-4 bg-white space-y-3 shadow-sm hover:border-gray-200 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={row.messages}
              onChange={(e) => updateRow(index, { messages: e.target.value })}
              disabled={row.custom}
              placeholder={isAr ? "عدد الرسائل (مثال: 1000)" : "Messages count (e.g. 1000)"}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all disabled:bg-gray-50 disabled:text-gray-400"
            />
            <input
              type="text"
              value={row.price}
              onChange={(e) => updateRow(index, { price: e.target.value })}
              disabled={row.custom}
              placeholder={isAr ? "السعر الجديد (مثال: 110)" : "Offer Price (e.g. 110)"}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all disabled:bg-gray-50 disabled:text-gray-400 font-bold text-primary"
            />
            <input
              type="text"
              value={row.originalPrice || ""}
              onChange={(e) => updateRow(index, { originalPrice: e.target.value })}
              disabled={row.custom}
              placeholder={isAr ? "السعر الأصلي (قبل الخصم)" : "Original Price (Strike)"}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all disabled:bg-gray-50 disabled:text-gray-400 italic text-gray-400"
            />
            <input
              type="text"
              value={row.feature}
              onChange={(e) => updateRow(index, { feature: e.target.value })}
              placeholder={isAr ? "عنوان الباقة" : "Plan feature/title"}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all"
            />
            <input
              type="text"
              value={row.description}
              onChange={(e) => updateRow(index, { description: e.target.value })}
              placeholder={isAr ? "وصف الباقة" : "Plan description"}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all md:col-span-2"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={row.featured}
                onChange={(e) => updateRow(index, { featured: e.target.checked })}
                className="w-3.5 h-3.5 text-[#104E8B] rounded border-gray-300"
              />
              {isAr ? "الباقة المميزة" : "Featured plan"}
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={row.custom}
                onChange={(e) => updateRow(index, { custom: e.target.checked })}
                className="w-3.5 h-3.5 text-[#104E8B] rounded border-gray-300"
              />
              {isAr ? "باقة مخصصة" : "Custom plan"}
            </label>
            <button
              onClick={() => removeRow(index)}
              className="text-xs text-red-500 hover:text-red-600 hover:underline transition-colors"
            >
              {isAr ? "حذف الباقة" : "Delete plan"}
            </button>
          </div>
        </div>
      ))}
      {rows.length === 0 && (
        <div className="text-center py-6 text-xs text-gray-400 italic border-2 border-dashed border-gray-200 rounded-xl">
          {isAr ? "لا توجد باقات مضافة" : "No plans added yet"}
        </div>
      )}
      <button
        onClick={addRow}
        className="flex items-center gap-1.5 text-xs font-medium text-[#104E8B] hover:text-[#0A2647] transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {isAr ? "إضافة باقة" : "Add plan"}
      </button>
    </div>
  );
};

const defaultWhatsAppPlanTier = (isAr: boolean): WhatsAppPlanTier => ({
  name: isAr ? "شريحة جديدة" : "New Tier",
  price: "",
  priceWithTax: "",
  setupFee: "",
  conversations: "",
  broadcastMessages: "",
  users: "",
});

const defaultWhatsAppPlan = (isAr: boolean): WhatsAppPlanConfig => ({
  id: `plan_${Date.now()}`,
  name: isAr ? "باقة جديدة" : "New Package",
  period: isAr ? "شهرياً" : "Monthly",
  popular: false,
  badge: isAr ? "الأكثر طلباً" : "Most Popular",
  subscribeLabel: isAr ? "اشترك الآن" : "Subscribe Now",
  subscribeUrl: "https://wapp.mobile.net.sa/billing-subscription",
  subscribeUrlType: "form",
  additionalFeatures: [""],
  tiers: [defaultWhatsAppPlanTier(isAr)],
});

const defaultWhatsAppApiPrice = (isAr: boolean): WhatsAppConversationPrice => ({
  type: isAr ? "نوع المحادثة" : "Conversation Type",
  price: "",
  duration: isAr ? "للرسالة" : "per msg",
  description: "",
  isFree: false,
});

const WhatsAppPlansEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const plans = parseWhatsAppPlans(value, getDefaultWhatsAppPlans(isAr));

  const commit = (next: WhatsAppPlanConfig[]) => {
    onChange(serializeWhatsAppPlans(next));
  };

  const updatePlan = (index: number, patch: Partial<WhatsAppPlanConfig>) => {
    const next = plans.map((plan, i) => (i !== index ? plan : { ...plan, ...patch }));
    commit(next);
  };

  const updateTier = (planIndex: number, tierIndex: number, patch: Partial<WhatsAppPlanTier>) => {
    const next = plans.map((plan, pIndex) => {
      if (pIndex !== planIndex) return plan;
      return {
        ...plan,
        tiers: plan.tiers.map((tier, tIndex) => (tIndex === tierIndex ? { ...tier, ...patch } : tier)),
      };
    });
    commit(next);
  };

  const addPlan = () => commit([...plans, defaultWhatsAppPlan(isAr)]);
  const removePlan = (index: number) => commit(plans.filter((_, i) => i !== index));
  const addTier = (planIndex: number) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return { ...plan, tiers: [...plan.tiers, defaultWhatsAppPlanTier(isAr)] };
    });
    commit(next);
  };
  const removeTier = (planIndex: number, tierIndex: number) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return { ...plan, tiers: plan.tiers.filter((_, idx) => idx !== tierIndex) };
    });
    commit(next);
  };

  const addFeature = (planIndex: number) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return { ...plan, additionalFeatures: [...plan.additionalFeatures, ""] };
    });
    commit(next);
  };

  const updateFeature = (planIndex: number, featureIndex: number, valueText: string) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return {
        ...plan,
        additionalFeatures: plan.additionalFeatures.map((feature, idx) => (idx === featureIndex ? valueText : feature)),
      };
    });
    commit(next);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return { ...plan, additionalFeatures: plan.additionalFeatures.filter((_, idx) => idx !== featureIndex) };
    });
    commit(next);
  };

  return (
    <div className="space-y-4">
      <label className="text-xs text-gray-500 block">{isAr ? "تفاصيل باقات واتساب" : "WhatsApp package details"}</label>
      {plans.map((plan, planIndex) => (
        <div key={`${plan.id}-${planIndex}`} className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm text-[#104E8B]">{isAr ? `الباقة ${planIndex + 1}` : `Package ${planIndex + 1}`}</h5>
            <button onClick={() => removePlan(planIndex)} className="text-xs text-red-500 hover:text-red-600 hover:underline">
              {isAr ? "حذف الباقة" : "Delete package"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={plan.name}
              onChange={(e) => updatePlan(planIndex, { name: e.target.value })}
              placeholder={isAr ? "اسم الباقة" : "Package name"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={plan.period}
              onChange={(e) => updatePlan(planIndex, { period: e.target.value })}
              placeholder={isAr ? "الدورية (مثال: شهرياً)" : "Period (e.g. Monthly)"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={plan.badge}
              onChange={(e) => updatePlan(planIndex, { badge: e.target.value })}
              placeholder={isAr ? "شارة الباقة الشائعة" : "Popular badge text"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-xs text-gray-600 px-1">
              <input
                type="checkbox"
                checked={plan.popular}
                onChange={(e) => updatePlan(planIndex, { popular: e.target.checked })}
              />
              {isAr ? "تمييز هذه الباقة كالأكثر طلباً" : "Mark as most popular"}
            </label>
            <input
              type="text"
              value={plan.subscribeLabel}
              onChange={(e) => updatePlan(planIndex, { subscribeLabel: e.target.value })}
              placeholder={isAr ? "نص زر الاشتراك" : "Subscribe button text"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2">
              <select
                value={plan.subscribeUrlType || 'form'}
                onChange={(e) => updatePlan(planIndex, { subscribeUrlType: e.target.value as 'form' | 'external' })}
                className="border border-gray-200 rounded-md px-2 py-2 text-xs bg-white"
              >
                <option value="form">{isAr ? "فورم طلب الخدمة" : "Request Form"}</option>
                <option value="external">{isAr ? "رابط خارجي" : "External URL"}</option>
              </select>
              {plan.subscribeUrlType === 'external' && (
                <input
                  type="url"
                  value={plan.subscribeUrl}
                  onChange={(e) => updatePlan(planIndex, { subscribeUrl: e.target.value })}
                  placeholder={isAr ? "رابط الاشتراك" : "Subscribe URL"}
                  className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
                  dir="ltr"
                />
              )}
              {plan.subscribeUrlType === 'form' && (
                <span className="text-xs text-gray-500 flex-1">
                  {isAr ? "سيتم توجيه المستخدم لفورم الطلب مع تحديد الباقة تلقائياً" : "User will be directed to request form with package pre-selected"}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{isAr ? "المميزات الإضافية" : "Additional features"}</p>
              <button onClick={() => addFeature(planIndex)} className="text-xs text-[#104E8B] hover:text-[#0A2647] hover:underline">
                {isAr ? "إضافة ميزة" : "Add feature"}
              </button>
            </div>
            {plan.additionalFeatures.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(planIndex, featureIndex, e.target.value)}
                  placeholder={isAr ? "ميزة الباقة" : "Package feature"}
                  className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
                />
                <button onClick={() => removeFeature(planIndex, featureIndex)} className="text-xs text-red-500 hover:text-red-600 hover:underline">
                  {isAr ? "حذف" : "Delete"}
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{isAr ? "شرائح الباقة" : "Package tiers"}</p>
              <button onClick={() => addTier(planIndex)} className="text-xs text-[#104E8B] hover:text-[#0A2647] hover:underline">
                {isAr ? "إضافة شريحة" : "Add tier"}
              </button>
            </div>

            {plan.tiers.map((tier, tierIndex) => (
              <div key={tierIndex} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">{isAr ? `الشريحة ${tierIndex + 1}` : `Tier ${tierIndex + 1}`}</p>
                  <button onClick={() => removeTier(planIndex, tierIndex)} className="text-xs text-red-500 hover:text-red-600 hover:underline">
                    {isAr ? "حذف الشريحة" : "Delete tier"}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input type="text" value={tier.name} onChange={(e) => updateTier(planIndex, tierIndex, { name: e.target.value })} placeholder={isAr ? "اسم الشريحة" : "Tier name"} className="border border-gray-200 rounded-md px-2.5 py-2 text-xs" />
                  <input type="text" value={tier.price} onChange={(e) => updateTier(planIndex, tierIndex, { price: e.target.value })} placeholder={isAr ? "السعر الجديد" : "Offer Price"} className="border border-gray-200 rounded-md px-2.5 py-2 text-xs font-bold text-primary" />
                  <input type="text" value={tier.originalPrice || ""} onChange={(e) => updateTier(planIndex, tierIndex, { originalPrice: e.target.value })} placeholder={isAr ? "السعر الأصلي" : "Original Price"} className="border border-gray-200 rounded-md px-2.5 py-2 text-xs italic text-gray-400" />
                  <input type="text" value={tier.priceWithTax} onChange={(e) => updateTier(planIndex, tierIndex, { priceWithTax: e.target.value })} placeholder={isAr ? "السعر شامل الضريبة" : "Tax-included"} className="border border-gray-200 rounded-md px-2.5 py-2 text-xs" />
                  <input type="text" value={tier.setupFee} onChange={(e) => updateTier(planIndex, tierIndex, { setupFee: e.target.value })} placeholder={isAr ? "رسوم التأسيس" : "Setup fee"} className="border border-gray-200 rounded-md px-2.5 py-2 text-xs" />
                  <input type="text" value={tier.conversations} onChange={(e) => updateTier(planIndex, tierIndex, { conversations: e.target.value })} placeholder={isAr ? "عدد المحادثات" : "Conversations"} className="border border-gray-200 rounded-md px-2.5 py-2 text-xs" />
                  <input type="text" value={tier.broadcastMessages} onChange={(e) => updateTier(planIndex, tierIndex, { broadcastMessages: e.target.value })} placeholder={isAr ? "رسائل البث" : "Broadcast"} className="border border-gray-200 rounded-md px-2.5 py-2 text-xs" />
                  <input type="text" value={tier.users} onChange={(e) => updateTier(planIndex, tierIndex, { users: e.target.value })} placeholder={isAr ? "عدد المستخدمين" : "Users"} className="border border-gray-200 rounded-md px-2.5 py-2 text-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={addPlan} className="flex items-center gap-1 text-xs text-[#104E8B] hover:text-[#0A2647] transition-colors">
        <Plus className="w-3.5 h-3.5" />
        {isAr ? "إضافة باقة واتساب" : "Add WhatsApp package"}
      </button>
    </div>
  );
};

const WhatsAppApiPricesEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const rows = parseWhatsAppConversationPrices(value, getDefaultWhatsAppConversationPrices(isAr));

  const commit = (next: WhatsAppConversationPrice[]) => {
    onChange(serializeWhatsAppConversationPrices(next));
  };

  const updateRow = (index: number, patch: Partial<WhatsAppConversationPrice>) => {
    const next = rows.map((row, i) => {
      if (i !== index) return row;
      const updated = { ...row, ...patch };
      if (updated.isFree && !updated.price.trim()) {
        return { ...updated, price: isAr ? "مجانية" : "Free" };
      }
      return updated;
    });
    commit(next);
  };

  const addRow = () => commit([...rows, defaultWhatsAppApiPrice(isAr)]);
  const removeRow = (index: number) => commit(rows.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <label className="text-xs text-gray-500 block">{isAr ? "أسعار محادثات واتساب API" : "WhatsApp API conversation prices"}</label>
      {rows.map((row, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={row.type}
              onChange={(e) => updateRow(index, { type: e.target.value })}
              placeholder={isAr ? "نوع المحادثة" : "Conversation type"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={row.price}
              onChange={(e) => updateRow(index, { price: e.target.value })}
              placeholder={isAr ? "السعر" : "Price"}
              disabled={row.isFree}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
            />
          </div>
          <input
            type="text"
            value={row.duration}
            onChange={(e) => updateRow(index, { duration: e.target.value })}
            placeholder={isAr ? "المدة" : "Duration"}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-gray-600 px-1">
              <input
                type="checkbox"
                checked={row.isFree}
                onChange={(e) => updateRow(index, { isFree: e.target.checked })}
              />
              {isAr ? "مجانية" : "Free"}
            </label>
          </div>
          <input
            type="text"
            value={row.description}
            onChange={(e) => updateRow(index, { description: e.target.value })}
            placeholder={isAr ? "الوصف" : "Description"}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
          <div className="flex justify-end">
            <button onClick={() => removeRow(index)} className="text-xs text-red-500 hover:text-red-600 hover:underline">
              {isAr ? "حذف" : "Delete"}
            </button>
          </div>
        </div>
      ))}
      <button onClick={addRow} className="flex items-center gap-1 text-xs text-[#104E8B] hover:text-[#0A2647] transition-colors">
        <Plus className="w-3.5 h-3.5" />
        {isAr ? "إضافة سعر" : "Add price"}
      </button>
    </div>
  );
};

const SECTION_THEME: Record<string, { color: string; bg: string; border: string; icon: typeof Globe }> = {
  hero:            { color: 'text-blue-500',       bg: 'bg-blue-50',       border: 'border-l-blue-500',       icon: Globe },
  pricing:         { color: 'text-green-500',      bg: 'bg-green-50',      border: 'border-l-green-500',      icon: FileText },
  feature:         { color: 'text-purple-500',      bg: 'bg-purple-50',     border: 'border-l-purple-500',     icon: Lightbulb },
  integration:     { color: 'text-orange-500',      bg: 'bg-orange-50',     border: 'border-l-orange-500',     icon: Zap },
  trust:           { color: 'text-emerald-500',     bg: 'bg-emerald-50',    border: 'border-l-emerald-500',    icon: Shield },
  solution:         { color: 'text-indigo-500',      bg: 'bg-indigo-50',     border: 'border-l-indigo-500',     icon: Lightbulb },
  persona:          { color: 'text-cyan-500',        bg: 'bg-cyan-50',       border: 'border-l-cyan-500',       icon: Users },
  'persona-tab':    { color: 'text-cyan-500',        bg: 'bg-cyan-50',       border: 'border-l-cyan-500',       icon: Users },
  cta:              { color: 'text-rose-500',        bg: 'bg-rose-50',       border: 'border-l-rose-500',      icon: ArrowRight },
  'why-us':         { color: 'text-amber-500',       bg: 'bg-amber-50',      border: 'border-l-amber-500',      icon: Star },
  contact:          { color: 'text-sky-500',         bg: 'bg-sky-50',        border: 'border-l-sky-500',        icon: Mail },
  blog:             { color: 'text-slate-500',        bg: 'bg-slate-50',      border: 'border-l-slate-500',      icon: Newspaper },
  form:             { color: 'text-violet-500',      bg: 'bg-violet-50',     border: 'border-l-violet-500',     icon: Layers },
  footer:          { color: 'text-gray-500',        bg: 'bg-gray-50',       border: 'border-l-gray-500',       icon: LayoutGrid },
  request:          { color: 'text-teal-500',        bg: 'bg-teal-50',       border: 'border-l-teal-500',       icon: MessageSquare },
  plan:             { color: 'text-green-500',       bg: 'bg-green-50',      border: 'border-l-green-500',      icon: Tag },
  module:           { color: 'text-fuchsia-500',    bg: 'bg-fuchsia-50',    border: 'border-l-fuchsia-500',    icon: Layers },
  api:              { color: 'text-red-500',         bg: 'bg-red-50',        border: 'border-l-red-500',        icon: Settings },
  screenshot:       { color: 'text-pink-500',        bg: 'bg-pink-50',       border: 'border-l-pink-500',       icon: ImageIcon },
};

const getSectionTheme = (sectionId: string) => {
  for (const [key, theme] of Object.entries(SECTION_THEME)) {
    if (sectionId.includes(key)) return theme;
  }
  return { color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-l-gray-400', icon: FileText as typeof Globe };
};

const SPACING_PRESETS = [
  { label: 'عادي', labelEn: 'Normal', value: 'py-16 md:py-20' },
  { label: 'كبير', labelEn: 'Large', value: 'py-20 md:py-24' },
  { label: 'ممتد', labelEn: 'Extra Large', value: 'py-24 md:py-32' },
  { label: 'صغير', labelEn: 'Compact', value: 'py-10 md:py-14' },
  { label: 'هيرو', labelEn: 'Hero', value: 'pt-24 pb-16 md:pt-32 md:pb-24' },
  { label: 'مخصص', labelEn: 'Custom', value: '' },
];

const SectionSpacingEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const matchingPreset = SPACING_PRESETS.find(p => p.value && value === p.value);
  const [isCustom, setIsCustom] = useState(!matchingPreset);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
    const match = SPACING_PRESETS.find(p => p.value && value === p.value);
    setIsCustom(!match);
  }, [value]);

  const handlePreset = (presetValue: string) => {
    if (presetValue === '') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setLocalValue(presetValue);
      onChange(presetValue);
    }
  };

  const handleCustomChange = (val: string) => {
    setLocalValue(val);
    onChange(val);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {SPACING_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePreset(preset.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              (preset.value === '' && isCustom) || (preset.value && value === preset.value)
                ? 'bg-[#104E8B] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isAr ? preset.label : preset.labelEn}
          </button>
        ))}
      </div>
      {isCustom && (
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 block">{isAr ? 'فئات Tailwind مخصصة (مثل: py-20 md:py-24)' : 'Custom Tailwind classes (e.g. py-20 md:py-24)'}</label>
          <input
            type="text"
            value={localValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all font-mono"
            dir="ltr"
            placeholder="py-20 md:py-24"
          />
        </div>
      )}
    </div>
  );
};

const COL_PRESETS = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

const SectionDisplayEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const [cols, setCols] = useState<{ mobile: number; tablet: number; desktop: number }>({ mobile: 1, tablet: 2, desktop: 3 });

  useEffect(() => {
    try {
      const parsed = JSON.parse(value);
      if (parsed.columns) {
        setCols(parsed.columns);
      }
    } catch {
      // use defaults
    }
  }, [value]);

  const update = (key: 'mobile' | 'tablet' | 'desktop', val: number) => {
    const next = { ...cols, [key]: val };
    setCols(next);
    onChange(JSON.stringify({ columns: next }));
  };

  const devices: { key: 'mobile' | 'tablet' | 'desktop'; label: string; labelEn: string }[] = [
    { key: 'mobile', label: 'جوال', labelEn: 'Mobile' },
    { key: 'tablet', label: 'تابلت', labelEn: 'Tablet' },
    { key: 'desktop', label: 'سطح المكتب', labelEn: 'Desktop' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {devices.map(({ key, label, labelEn }) => (
        <div key={key} className="space-y-1.5">
          <label className="text-[10px] text-gray-400 font-medium block">{isAr ? label : labelEn}</label>
          <div className="flex gap-1">
            {COL_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => update(key, preset.value)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  cols[key] === preset.value
                    ? 'bg-[#104E8B] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MARGIN_PRESETS = [
  { label: 'بدون', labelEn: 'None', value: '' },
  { label: 'صغير', labelEn: 'Small', value: 'mt-4' },
  { label: 'متوسط', labelEn: 'Medium', value: 'mt-8' },
  { label: 'كبير', labelEn: 'Large', value: 'mt-12' },
  { label: 'كبير جداً', labelEn: 'Extra Large', value: 'mt-16' },
  { label: 'مخصص', labelEn: 'Custom', value: '__custom__' },
];

const MARGIN_DIR_LABELS = {
  before: { label: 'هامش أعلى القسم (Margin Before)', labelEn: 'Margin Before Section' },
  after: { label: 'هامش أسفل القسم (Margin After)', labelEn: 'Margin After Section' },
};

const SectionMarginEditor = ({ value, onChange, isAr, direction }: { value: string; onChange: (value: string) => void; isAr: boolean; direction: 'before' | 'after' }) => {
  const matchingPreset = MARGIN_PRESETS.find(p => p.value !== '__custom__' && p.value === value) || (value && !MARGIN_PRESETS.find(p => p.value === value) ? MARGIN_PRESETS[MARGIN_PRESETS.length - 1] : null);
  const isCustom = value !== '' && !MARGIN_PRESETS.find(p => p.value !== '__custom__' && p.value === value);
  const [isCustomMode, setIsCustomMode] = useState(isCustom);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
    const match = MARGIN_PRESETS.find(p => p.value !== '__custom__' && p.value === value);
    setIsCustomMode(value !== '' && !match);
  }, [value]);

  const dirLabel = MARGIN_DIR_LABELS[direction];
  const handlePreset = (presetValue: string) => {
    if (presetValue === '__custom__') {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      setLocalValue(presetValue);
      onChange(presetValue);
    }
  };

  const handleCustomChange = (val: string) => {
    setLocalValue(val);
    onChange(val);
  };

  const isNoneSelected = value === '';

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-medium text-gray-600 block">{isAr ? dirLabel.label : dirLabel.labelEn}</label>
      <div className="flex flex-wrap gap-1.5">
        {MARGIN_PRESETS.map((preset) => {
          const isActive = preset.value === '__custom__'
            ? isCustomMode
            : preset.value === ''
              ? isNoneSelected
              : value === preset.value;
          return (
            <button
              key={preset.value}
              onClick={() => handlePreset(preset.value)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-[#104E8B] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isAr ? preset.label : preset.labelEn}
            </button>
          );
        })}
      </div>
      {isCustomMode && (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            {direction === 'before' ? (
              <>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 block mb-0.5">{isAr ? 'جوال' : 'Mobile'}</label>
                  <input
                    type="text"
                    value={localValue}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full h-8 border border-gray-200 rounded-lg px-2.5 text-[11px] bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all font-mono"
                    dir="ltr"
                    placeholder="mt-8"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 block mb-0.5">{isAr ? 'تابلت +' : 'Tablet+'}</label>
                  <input
                    type="text"
                    value={localValue}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full h-8 border border-gray-200 rounded-lg px-2.5 text-[11px] bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all font-mono"
                    dir="ltr"
                    placeholder="md:mt-12"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 block mb-0.5">{isAr ? 'جوال' : 'Mobile'}</label>
                  <input
                    type="text"
                    value={localValue}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full h-8 border border-gray-200 rounded-lg px-2.5 text-[11px] bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all font-mono"
                    dir="ltr"
                    placeholder="mb-8"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 block mb-0.5">{isAr ? 'تابلت +' : 'Tablet+'}</label>
                  <input
                    type="text"
                    value={localValue}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full h-8 border border-gray-200 rounded-lg px-2.5 text-[11px] bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all font-mono"
                    dir="ltr"
                    placeholder="md:mb-12"
                  />
                </div>
              </>
            )}
          </div>
          <p className="text-[10px] text-gray-400">{isAr ? 'فئات Tailwind مثل: mt-8 md:mt-12 أو mb-8 md:mb-12' : 'Tailwind classes e.g. mt-8 md:mt-12 or mb-8 md:mb-12'}</p>
        </div>
      )}
    </div>
  );
};

const GenericListEditor = ({ value, onChange, isAr, pageId, sectionId }: { value: string; onChange: (value: string) => void; isAr: boolean; pageId: string; sectionId: string }) => {
  let items: any[] = [];
  try {
    items = value ? JSON.parse(value) : [];
  } catch (e) {
    items = [];
  }

  const commit = (next: any[]) => onChange(JSON.stringify(next));
  const [langTab, setLangTab] = useState<"ar" | "en">("ar");

  const updateItem = (index: number, patch: any) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    commit(next);
  };

  const addItem = () => commit([...items, { titleAr: "", titleEn: "", descAr: "", descEn: "", listAr: "", listEn: "", icon: "", image: "" }]);
  const removeItem = (index: number) => commit(items.filter((_, i) => i !== index));

  const moveItem = (index: number, direction: "up" | "down") => {
    const next = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    commit(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500 font-medium">{isAr ? "إدارة العناصر" : "Manage Items"}</label>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setLangTab("ar")}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${langTab === "ar" ? "bg-white text-[#104E8B] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              عربي
            </button>
            <button
              onClick={() => setLangTab("en")}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${langTab === "en" ? "bg-white text-[#104E8B] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              EN
            </button>
          </div>
          <Button size="sm" onClick={addItem} className="bg-[#104E8B] hover:bg-[#0A2647] text-white h-7 text-[10px] rounded-lg">
            <Plus className="w-3 h-3 mr-1" /> {isAr ? "إضافة عنصر" : "Add Item"}
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-white space-y-3 relative shadow-sm hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                #{idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveItem(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-gray-300 hover:text-[#104E8B] hover:bg-blue-50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={isAr ? "نقل للأعلى" : "Move up"}
                >
                  <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                </button>
                <button
                  onClick={() => moveItem(idx, "down")}
                  disabled={idx === items.length - 1}
                  className="p-1 text-gray-300 hover:text-[#104E8B] hover:bg-blue-50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={isAr ? "نقل للأسفل" : "Move down"}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => removeItem(idx)} className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title={isAr ? "حذف" : "Remove"}>
                  <Plus className="w-3.5 h-3.5 rotate-45" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {langTab === "ar" ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "العنوان" : "Title"} (AR)</label>
                    <input type="text" value={item.titleAr || ""} onChange={e => updateItem(idx, { titleAr: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "الوصف" : "Description"} (AR)</label>
                    <textarea value={item.descAr || ""} onChange={e => updateItem(idx, { descAr: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all resize-none" />
                  </div>
                  {item.listAr !== undefined && (
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "نقاط فرعية" : "Sub-items"} (AR)</label>
                      <input type="text" value={item.listAr || ""} onChange={e => updateItem(idx, { listAr: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" placeholder="ميزة 1, ميزة 2" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Title (EN)</label>
                    <input type="text" value={item.titleEn || ""} onChange={e => updateItem(idx, { titleEn: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" dir="ltr" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Description (EN)</label>
                    <textarea value={item.descEn || ""} onChange={e => updateItem(idx, { descEn: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all resize-none" dir="ltr" />
                  </div>
                  {item.listEn !== undefined && (
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Sub-items (EN)</label>
                      <input type="text" value={item.listEn || ""} onChange={e => updateItem(idx, { listEn: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" dir="ltr" placeholder="feature 1, feature 2" />
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 block">{isAr ? "الأيقونة" : "Icon"}</label>
                  <ImageUploader
                    value={item.icon || ""}
                    onChange={(url) => updateItem(idx, { icon: url })}
                    folder={`pages/${pageId}/${sectionId}`}
                    isAr={isAr}
                    aspectRatio="square"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 block">{isAr ? "الصورة" : "Image"}</label>
                  <ImageUploader
                    value={item.image || ""}
                    onChange={(url) => updateItem(idx, { image: url })}
                    folder={`pages/${pageId}/${sectionId}`}
                    isAr={isAr}
                    aspectRatio="video"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-8 text-xs text-gray-400 italic bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-xl">{isAr ? "لا توجد عناصر مضافة" : "No items added yet"}</div>}
    </div>
  );
};

const IntegrationsListEditor = ({ value, onChange, isAr, pageId }: { value: string; onChange: (value: string) => void; isAr: boolean; pageId: string }) => {
  let items: { nameAr: string; nameEn: string; icon: string; link?: string }[] = [];
  try {
    items = value ? JSON.parse(value) : [];
  } catch (e) {
    console.error("Parse error in IntegrationsListEditor", e);
  }

  const commit = (next: typeof items) => onChange(JSON.stringify(next));

  const updateItem = (index: number, patch: any) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    commit(next);
  };

  const addItem = () => commit([...items, { nameAr: "", nameEn: "", icon: "", link: "" }]);
  const removeItem = (index: number) => commit(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500 font-medium">{isAr ? "قائمة التكاملات" : "Integrations List"}</label>
        <Button size="sm" onClick={addItem} className="bg-[#104E8B] hover:bg-[#0A2647] text-white h-7 text-[10px] rounded-lg">
          <Plus className="w-3 h-3 mr-1" /> {isAr ? "إضافة تكامل" : "Add Integration"}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-gray-100 rounded-xl p-3 bg-white space-y-3 relative shadow-sm hover:border-gray-200 transition-all">
            <button onClick={() => removeItem(idx)} className="absolute top-2.5 left-2.5 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
              <Plus className="w-3.5 h-3.5 rotate-45" />
            </button>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 block">{isAr ? "أيقونة التكامل" : "Icon"}</label>
              <ImageUploader
                value={item.icon}
                onChange={(url) => updateItem(idx, { icon: url })}
                folder={`pages/${pageId}/integrations`}
                isAr={isAr}
                aspectRatio="square"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "الاسم (عربي)" : "Name (AR)"}</label>
                <input type="text" value={item.nameAr} onChange={e => updateItem(idx, { nameAr: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Name (EN)</label>
                <input type="text" value={item.nameEn} onChange={e => updateItem(idx, { nameEn: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "رابط التكامل" : "Link URL"}</label>
              <input type="url" value={item.link || ""} onChange={e => updateItem(idx, { link: e.target.value })} placeholder="https://..." className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" dir="ltr" />
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-6 text-xs text-gray-400 italic border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">{isAr ? "لا توجد تكاملات مضافة" : "No integrations added yet"}</div>}
    </div>
  );
};

const TestimonialsListEditor = ({ value, onChange, isAr, pageId }: { value: string; onChange: (value: string) => void; isAr: boolean; pageId: string }) => {
  let items: { nameAr?: string; nameEn?: string; roleAr?: string; roleEn?: string; quoteAr?: string; quoteEn?: string; avatar?: string; rating?: number }[] = [];
  try {
    items = value ? JSON.parse(value) : [];
  } catch (e) {
    console.error("Parse error in TestimonialsListEditor", e);
  }

  const commit = (next: typeof items) => onChange(JSON.stringify(next));
  const updateItem = (index: number, patch: any) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    commit(next);
  };
  const addItem = () => commit([...items, { nameAr: "", nameEn: "", roleAr: "", roleEn: "", quoteAr: "", quoteEn: "", avatar: "", rating: 5 }]);
  const removeItem = (index: number) => commit(items.filter((_, i) => i !== index));
  const moveItem = (index: number, dir: "up" | "down") => {
    const next = [...items];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500 font-medium">{isAr ? "آراء العملاء" : "Testimonials"}</label>
        <Button size="sm" onClick={addItem} className="bg-[#104E8B] hover:bg-[#0A2647] text-white h-7 text-[10px] rounded-lg">
          <Plus className="w-3 h-3 mr-1" /> {isAr ? "إضافة رأي" : "Add Testimonial"}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-white space-y-3 relative shadow-sm hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">#{idx + 1}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => moveItem(idx, "up")} disabled={idx === 0} className="p-1 text-gray-300 hover:text-[#104E8B] hover:bg-blue-50 rounded-md transition-colors disabled:opacity-30" title={isAr ? "للأعلى" : "Up"}><ChevronDown className="w-3.5 h-3.5 rotate-180" /></button>
                <button onClick={() => moveItem(idx, "down")} disabled={idx === items.length - 1} className="p-1 text-gray-300 hover:text-[#104E8B] hover:bg-blue-50 rounded-md transition-colors disabled:opacity-30" title={isAr ? "للأسفل" : "Down"}><ChevronDown className="w-3.5 h-3.5" /></button>
                <button onClick={() => removeItem(idx)} className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title={isAr ? "حذف" : "Remove"}><Plus className="w-3.5 h-3.5 rotate-45" /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "الاسم (عربي)" : "Name (AR)"}</label>
                    <input type="text" value={item.nameAr || ""} onChange={e => updateItem(idx, { nameAr: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Name (EN)</label>
                    <input type="text" value={item.nameEn || ""} onChange={e => updateItem(idx, { nameEn: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" dir="ltr" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "المسمى (عربي)" : "Role (AR)"}</label>
                    <input type="text" value={item.roleAr || ""} onChange={e => updateItem(idx, { roleAr: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Role (EN)</label>
                    <input type="text" value={item.roleEn || ""} onChange={e => updateItem(idx, { roleEn: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "التقييم (1-5)" : "Rating (1-5)"}</label>
                  <select value={String(item.rating ?? 5)} onChange={e => updateItem(idx, { rating: Number(e.target.value) })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]">
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "صورة العميل" : "Avatar"}</label>
                  <ImageUploader value={item.avatar || ""} onChange={(url) => updateItem(idx, { avatar: url })} folder={`pages/${pageId}/testimonials`} isAr={isAr} aspectRatio="square" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "الاقتباس (عربي)" : "Quote (AR)"}</label>
                <textarea value={item.quoteAr || ""} onChange={e => updateItem(idx, { quoteAr: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Quote (EN)</label>
                <textarea value={item.quoteEn || ""} onChange={e => updateItem(idx, { quoteEn: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" dir="ltr" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-6 text-xs text-gray-400 italic border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">{isAr ? "لا توجد آراء مضافة (ستظهر آراء افتراضية في الموقع)" : "No testimonials added (site shows defaults)"}</div>}
    </div>
  );
};

const FaqListEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  let items: { qAr?: string; qEn?: string; aAr?: string; aEn?: string }[] = [];
  try {
    items = value ? JSON.parse(value) : [];
  } catch (e) {
    console.error("Parse error in FaqListEditor", e);
  }

  const commit = (next: typeof items) => onChange(JSON.stringify(next));
  const updateItem = (index: number, patch: any) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    commit(next);
  };
  const addItem = () => commit([...items, { qAr: "", qEn: "", aAr: "", aEn: "" }]);
  const removeItem = (index: number) => commit(items.filter((_, i) => i !== index));
  const moveItem = (index: number, dir: "up" | "down") => {
    const next = [...items];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500 font-medium">{isAr ? "الأسئلة الشائعة" : "FAQ"}</label>
        <Button size="sm" onClick={addItem} className="bg-[#104E8B] hover:bg-[#0A2647] text-white h-7 text-[10px] rounded-lg">
          <Plus className="w-3 h-3 mr-1" /> {isAr ? "إضافة سؤال" : "Add Question"}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-white space-y-3 relative shadow-sm hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">#{idx + 1}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => moveItem(idx, "up")} disabled={idx === 0} className="p-1 text-gray-300 hover:text-[#104E8B] hover:bg-blue-50 rounded-md transition-colors disabled:opacity-30" title={isAr ? "للأعلى" : "Up"}><ChevronDown className="w-3.5 h-3.5 rotate-180" /></button>
                <button onClick={() => moveItem(idx, "down")} disabled={idx === items.length - 1} className="p-1 text-gray-300 hover:text-[#104E8B] hover:bg-blue-50 rounded-md transition-colors disabled:opacity-30" title={isAr ? "للأسفل" : "Down"}><ChevronDown className="w-3.5 h-3.5" /></button>
                <button onClick={() => removeItem(idx)} className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title={isAr ? "حذف" : "Remove"}><Plus className="w-3.5 h-3.5 rotate-45" /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "السؤال (عربي)" : "Question (AR)"}</label>
                  <input type="text" value={item.qAr || ""} onChange={e => updateItem(idx, { qAr: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "الإجابة (عربي)" : "Answer (AR)"}</label>
                  <textarea value={item.aAr || ""} onChange={e => updateItem(idx, { aAr: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" />
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Question (EN)</label>
                  <input type="text" value={item.qEn || ""} onChange={e => updateItem(idx, { qEn: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" dir="ltr" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Answer (EN)</label>
                  <textarea value={item.aEn || ""} onChange={e => updateItem(idx, { aEn: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]" dir="ltr" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-6 text-xs text-gray-400 italic border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">{isAr ? "لا توجد أسئلة مضافة (ستظهر أسئلة افتراضية في الموقع)" : "No questions added (site shows defaults)"}</div>}
    </div>
  );
};

const SchoolBitPlansListEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const plans = parseSchoolBitPlans(value, getDefaultSchoolBitPlans(isAr));

  const updatePlan = (index: number, patch: Partial<SchoolBitPlan>) => {
    const next = plans.map((p, i) => i === index ? { ...p, ...patch } : p);
    onChange(serializeSchoolBitPlans(next));
  };

  const updateFeature = (planIndex: number, featureIndex: number, text: string) => {
    const plan = plans[planIndex];
    const features = isAr ? [...plan.features] : [...plan.featuresEn];
    features[featureIndex] = text;
    updatePlan(planIndex, isAr ? { features } : { featuresEn: features });
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const plan = plans[planIndex];
    const features = isAr ? plan.features.filter((_, i) => i !== featureIndex) : plan.featuresEn.filter((_, i) => i !== featureIndex);
    updatePlan(planIndex, isAr ? { features } : { featuresEn: features });
  };

  const addFeature = (planIndex: number) => {
    const plan = plans[planIndex];
    const features = isAr ? [...plan.features, ''] : [...plan.featuresEn, ''];
    updatePlan(planIndex, isAr ? { features } : { featuresEn: features });
  };

  const addPlan = () => {
    onChange(serializeSchoolBitPlans([...plans, {
      name: isAr ? 'باقة جديدة' : 'New Plan',
      nameEn: 'New Plan',
      price: 0,
      price3Months: 0,
      priceYearly: 0,
      description: '',
      descriptionEn: '',
      featured: false,
      features: [],
      featuresEn: [],
      isCustom: false,
      ctaUrl: 'https://schoolbit.corbit.sa/',
      ctaUrlEn: 'https://schoolbit.corbit.sa/',
    }]));
  };

  const removePlan = (index: number) => {
    onChange(serializeSchoolBitPlans(plans.filter((_, i) => i !== index)));
  };

  return (
    <div className="space-y-4">
      <label className="text-xs text-gray-500 font-medium block mb-2">{isAr ? "باقات SchoolBit" : "SchoolBit Plans"}</label>
      {plans.map((plan, pi) => (
        <div key={pi} className="border border-gray-100 rounded-xl p-4 bg-white space-y-3 shadow-sm hover:border-gray-200 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0EA8F1]">{isAr ? plan.name : plan.nameEn}</span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-gray-500">
                <input type="checkbox" checked={plan.featured} onChange={(e) => updatePlan(pi, { featured: e.target.checked })} className="rounded" />
                {isAr ? "مميزة" : "Featured"}
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-500">
                <input type="checkbox" checked={plan.isCustom} onChange={(e) => updatePlan(pi, { isCustom: e.target.checked })} className="rounded" />
                {isAr ? "سعر مخصص" : "Custom"}
              </label>
              <button onClick={() => removePlan(pi)} className="text-red-400 hover:text-red-600 text-xs">{isAr ? "حذف" : "Remove"}</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input type="text" value={isAr ? plan.name : plan.nameEn} onChange={(e) => updatePlan(pi, isAr ? { name: e.target.value } : { nameEn: e.target.value })} placeholder={isAr ? "اسم الباقة (عربي)" : "Plan name (EN)"} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" />
            <input type="text" value={isAr ? plan.description : plan.descriptionEn} onChange={(e) => updatePlan(pi, isAr ? { description: e.target.value } : { descriptionEn: e.target.value })} placeholder={isAr ? "الوصف (عربي)" : "Description (EN)"} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" />
          </div>
          {!plan.isCustom && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-gray-400">{isAr ? "السعر الشهري (ر.س)" : "Monthly (SAR)"}</label>
                <input type="number" value={plan.price ?? ''} onChange={(e) => updatePlan(pi, { price: e.target.value === '' ? null : Number(e.target.value) })} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400">{isAr ? "سعر 3 أشهر (ر.س)" : "3-Month (SAR)"}</label>
                <input type="number" value={plan.price3Months ?? ''} onChange={(e) => updatePlan(pi, { price3Months: e.target.value === '' ? null : Number(e.target.value) })} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" />
                {plan.price && plan.price3Months ? (
                  <span className="text-[10px] text-green-600">-{Math.round(((plan.price * 3 - plan.price3Months) / (plan.price * 3)) * 100)}%</span>
                ) : null}
              </div>
              <div>
                <label className="text-[10px] text-gray-400">{isAr ? "السعر السنوي/شهر (ر.س)" : "Yearly/month (SAR)"}</label>
                <input type="number" value={plan.priceYearly ?? ''} onChange={(e) => updatePlan(pi, { priceYearly: e.target.value === '' ? null : Number(e.target.value) })} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" />
                {plan.price && plan.priceYearly ? (
                  <span className="text-[10px] text-green-600">-{Math.round(((plan.price - plan.priceYearly) / plan.price) * 100)}%</span>
                ) : null}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400">{isAr ? "رابط الزر (عربي)" : "Button URL (AR)"}</label>
              <input type="url" value={plan.ctaUrl || ''} onChange={(e) => updatePlan(pi, { ctaUrl: e.target.value })} placeholder={isAr ? "/contact أو https://..." : "/contact or https://..."} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" dir="ltr" />
            </div>
            <div>
              <label className="text-[10px] text-gray-400">{isAr ? "رابط الزر (إنجليزي)" : "Button URL (EN)"}</label>
              <input type="url" value={plan.ctaUrlEn || ''} onChange={(e) => updatePlan(pi, { ctaUrlEn: e.target.value })} placeholder="https://... or /contact" className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" dir="ltr" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] text-gray-400 font-medium">{isAr ? "المميزات" : "Features"}</span>
            {(isAr ? plan.features : plan.featuresEn).map((f, fi) => (
              <div key={fi} className="flex items-center gap-2">
                <input type="text" value={f} onChange={(e) => updateFeature(pi, fi, e.target.value)} className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-sm" />
                <button onClick={() => removeFeature(pi, fi)} className="text-red-400 hover:text-red-600 text-xs px-2">{isAr ? "حذف" : "X"}</button>
              </div>
            ))}
            <button onClick={() => addFeature(pi)} className="text-[#1B6BF1] text-xs font-medium hover:underline">+ {isAr ? "إضافة ميزة" : "Add feature"}</button>
          </div>
        </div>
      ))}
      <button onClick={addPlan} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-[#1B6BF1] hover:text-[#1B6BF1] transition-all">
        + {isAr ? "إضافة باقة" : "Add Plan"}
      </button>
    </div>
  );
};

const SchoolBitSmsPlansEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const plans = parseSchoolBitSmsPlans(value, getDefaultSchoolBitSmsPlans(isAr));

  const updatePlan = (index: number, patch: Partial<SchoolBitSmsPlan>) => {
    const next = plans.map((p, i) => i === index ? { ...p, ...patch } : p);
    onChange(JSON.stringify(next));
  };

  const addPlan = () => {
    onChange(JSON.stringify([...plans, { name: 'باقة جديدة', nameEn: 'New Plan', messages: 0, price: 0, priceEn: '0 SAR' }]));
  };

  const removePlan = (index: number) => {
    onChange(JSON.stringify(plans.filter((_, i) => i !== index)));
  };

  return (
    <div className="space-y-4">
      <label className="text-xs text-gray-500 font-medium block mb-2">{isAr ? "باقات الرسائل النصية" : "SMS Plans"}</label>
      {plans.map((plan, pi) => (
        <div key={pi} className="border border-gray-100 rounded-xl p-4 bg-white space-y-3 shadow-sm hover:border-gray-200 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0EA8F1]">{isAr ? plan.name : plan.nameEn}</span>
            <button onClick={() => removePlan(pi)} className="text-red-400 hover:text-red-600 text-xs">{isAr ? "حذف" : "Remove"}</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <input type="text" value={isAr ? plan.name : plan.nameEn} onChange={(e) => updatePlan(pi, isAr ? { name: e.target.value } : { nameEn: e.target.value })} placeholder={isAr ? "الاسم (عربي)" : "Name (EN)"} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" />
            <input type="number" value={plan.messages} onChange={(e) => updatePlan(pi, { messages: Number(e.target.value) || 0 })} placeholder={isAr ? "عدد الرسائل" : "Messages"} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" />
            <input type="number" value={plan.price} onChange={(e) => updatePlan(pi, { price: Number(e.target.value) || 0 })} placeholder={isAr ? "السعر (ر.س)" : "Price (SAR)"} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" />
            <input type="text" value={plan.priceEn} onChange={(e) => updatePlan(pi, { priceEn: e.target.value })} placeholder="Price (EN)" className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm" />
          </div>
        </div>
      ))}
      <button onClick={addPlan} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-[#1B6BF1] hover:text-[#1B6BF1] transition-all">
        + {isAr ? "إضافة باقة رسائل" : "Add SMS Plan"}
      </button>
    </div>
  );
};

const HeroSlidesEditor = ({ value, onChange, isAr, pageId }: { value: string; onChange: (value: string) => void; isAr: boolean; pageId: string }) => {
  let slides: any[] = [];
  try {
    slides = value ? JSON.parse(value) : [];
  } catch (e) {
    // Attempt fallback from old fields if possible, or just start empty
    slides = [];
  }

  const commit = (next: any[]) => onChange(JSON.stringify(next));

  const updateSlide = (index: number, patch: any) => {
    const next = [...slides];
    next[index] = { ...next[index], ...patch };
    commit(next);
  };

  const addSlide = () => commit([...slides, { 
    id: Date.now(), titleAr: "", titleEn: "", descAr: "", descEn: "", 
    ctaTextAr: "", ctaTextEn: "", ctaUrl: "", image: "", badgeAr: "", badgeEn: "" 
  }]);
  
  const removeSlide = (index: number) => commit(slides.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500 font-medium">{isAr ? "شرائح البانر (Slider)" : "Hero Slides"}</label>
        <Button size="sm" onClick={addSlide} className="bg-[#104E8B] hover:bg-[#0A2647] text-white h-7 text-[10px] rounded-lg">
          <Plus className="w-3 h-3 mr-1" /> {isAr ? "إضافة شريحة" : "Add Slide"}
        </Button>
      </div>
      
      <div className="space-y-4">
        {slides.map((slide, idx) => (
          <div key={slide.id || idx} className="border border-gray-100 rounded-xl p-4 bg-white space-y-4 relative shadow-sm hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <span className="text-xs font-bold text-[#104E8B] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-[#104E8B]/10 flex items-center justify-center text-[10px]">{idx + 1}</span>
                {isAr ? `الشريحة ${idx + 1}` : `Slide ${idx + 1}`}
              </span>
              <button onClick={() => removeSlide(idx)} className="text-xs text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors">
                {isAr ? "حذف الشريحة" : "Remove Slide"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "العنوان (عربي)" : "Title (AR)"}</label>
                    <input type="text" value={slide.titleAr} onChange={e => updateSlide(idx, { titleAr: e.target.value })} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Title (EN)</label>
                    <input type="text" value={slide.titleEn} onChange={e => updateSlide(idx, { titleEn: e.target.value })} className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "الوصف (عربي)" : "Description (AR)"}</label>
                  <textarea value={slide.descAr} onChange={e => updateSlide(idx, { descAr: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all resize-none" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Description (EN)</label>
                  <textarea value={slide.descEn} onChange={e => updateSlide(idx, { descEn: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all resize-none" dir="ltr" />
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 block">{isAr ? "صورة الشريحة" : "Slide Image"}</label>
                    <ImageUploader
                      value={slide.image}
                      onChange={(url) => updateSlide(idx, { image: url })}
                      folder={`pages/${pageId}/hero`}
                      isAr={isAr}
                      aspectRatio="video"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "نص الزر" : "CTA Text"}</label>
                    <input type="text" value={slide.ctaTextAr} onChange={e => updateSlide(idx, { ctaTextAr: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">{isAr ? "رابط الزر" : "CTA URL"}</label>
                    <input type="text" value={slide.ctaUrl} onChange={e => updateSlide(idx, { ctaUrl: e.target.value })} className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all" dir="ltr" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {slides.length === 0 && (
        <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex flex-col items-center gap-3">
          <ImageIcon className="w-8 h-8 text-gray-300" />
          <p className="text-sm text-gray-400">{isAr ? "لم يتم إضافة شرائح بعد. سيظهر الهيرو الافتراضي." : "No slides added. Default hero will be shown."}</p>
          <Button size="sm" onClick={addSlide} className="bg-[#104E8B] hover:bg-[#0A2647] text-white">{isAr ? "إضافة الشريحة الأولى" : "Add First Slide"}</Button>
        </div>
      )}
    </div>
  );
};

const getGroupLabel = (sectionId: string, groupKey: string, isAr: boolean): string => {
  const heroLabels: Record<string, { ar: string; en: string }> = {
    retail: { ar: "قطاع التجارة", en: "Retail Segment" },
    finance: { ar: "قطاع المالية", en: "Finance Segment" },
    education: { ar: "قطاع التعليم", en: "Education Segment" },
    logistics: { ar: "قطاع اللوجستيات", en: "Logistics Segment" },
    health: { ar: "قطاع الصحة", en: "Healthcare Segment" },
    general: { ar: "عام", en: "General" },
  };
  const pricingLabels: Record<string, { ar: string; en: string }> = {
    general: { ar: "رأس قسم الأسعار", en: "Pricing Header" },
    benefit1: { ar: "الفائدة الأولى", en: "Benefit 1" },
    benefit2: { ar: "الفائدة الثانية", en: "Benefit 2" },
    benefit3: { ar: "الفائدة الثالثة", en: "Benefit 3" },
    plans: { ar: "الباقات", en: "Plans" },
  };
  const genericLabels: Record<string, { ar: string; en: string }> = {
    general: { ar: "محتوى أساسي", en: "Core Content" },
    cta: { ar: "أزرار وروابط CTA", en: "CTA Buttons & Links" },
    hero: { ar: "محتوى البانر", en: "Hero Content" },
    feature: { ar: "بطاقات المميزات", en: "Feature Cards" },
    pricing: { ar: "إعدادات الأسعار", en: "Pricing Settings" },
    plans: { ar: "الباقات", en: "Packages" },
    modules: { ar: "قسم الوحدات", en: "Modules Section" },
    screenshots: { ar: "قسم لقطات النظام", en: "Screenshots Section" },
    tech: { ar: "قسم المواصفات التقنية", en: "Technical Section" },
    solutions: { ar: "قسم الحلول", en: "Solutions Section" },
    campaigns: { ar: "قسم الحملات", en: "Campaigns Section" },
    api: { ar: "قسم تكلفة API", en: "API Cost Section" },
    final: { ar: "الرسالة الختامية", en: "Final CTA" },
    contact: { ar: "ملاحظة التواصل", en: "Contact Note" },
    wa: { ar: "بطاقة واتساب", en: "WhatsApp Card" },
    sms: { ar: "بطاقة الرسائل SMS", en: "SMS Card" },
    otime: { ar: "بطاقة O-Time", en: "O-Time Card" },
    govgate: { ar: "بطاقة Gov Gate", en: "Gov Gate Card" },
  };
  const labels = sectionId === "sms-hero" ? heroLabels : sectionId === "sms-pricing" ? pricingLabels : genericLabels;
  return isAr ? (labels[groupKey]?.ar || groupKey) : (labels[groupKey]?.en || groupKey);
};

const getGroupedFields = (sectionId: string, sectionFields: SectionField[]) => {
  const groups = new Map<string, SectionField[]>();
  sectionFields.forEach((field) => {
    const groupKey = field.key.includes("_") ? field.key.split("_")[0] : "general";
    const prev = groups.get(groupKey) || [];
    prev.push(field);
    groups.set(groupKey, prev);
  });

  const preferredOrderMap: Record<string, string[]> = {
    "sms-hero": ["retail", "finance", "education", "logistics", "health", "general"],
    "sms-pricing": ["general", "benefit1", "benefit2", "benefit3", "plans"],
    "wa-hero": ["general", "cta"],
    "wa-features": ["general", "solutions", "campaigns", "api"],
    "wa-pricing": ["general", "plans", "api", "contact"],
    "wa-request-form": ["industry_options", "employee_count_options", "service_goals", "notification_email"],
    "home-solutions": ["general", "wa", "sms", "otime", "govgate"],
    "ot-hero": ["general", "cta"],
    "ot-features": ["general", "modules", "screenshots", "tech"],
    "gg-hero": ["general"],
    "gg-cta": ["general", "final"],
  };
  const preferredOrder = preferredOrderMap[sectionId] || ["general"];
  return Array.from(groups.entries()).sort(([a], [b]) => {
    const ai = preferredOrder.indexOf(a);
    const bi = preferredOrder.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
};

const shouldUseGroupedFields = (sectionId: string) => {
  const groupedSectionIds = new Set([
    "sms-hero", "sms-pricing", "wa-hero", "wa-features", "wa-pricing",
    "wa-request-form", "home-solutions", "ot-hero", "ot-features", "gg-hero", "gg-cta",
  ]);
  return groupedSectionIds.has(sectionId);
};

  const getSectionIcon = (sectionId: string) => {
  const theme = getSectionTheme(sectionId);
  const IconComponent = theme.icon;
  return <IconComponent className={`w-4 h-4 ${theme.color}`} />;
};

interface SectionCardProps {
  section: PageSection;
  isAr: boolean;
  isExpanded: boolean;
  isExternallyManaged: boolean;
  // وضع البطاقة
  reorderEnabled: boolean; // تُظهر مقبض السحب والأسهم (الصفحة الرئيسية فقط)
  pinned?: boolean;        // الهيرو: مثبّت أعلى، لا يُنقل ولا يُخفى
  structural?: boolean;    // النافبار: بنيوي، لا يُنقل
  position?: number;       // رقم الترتيب (1-based) للأقسام القابلة للنقل
  isFirst?: boolean;
  isLast?: boolean;
  onToggleExpand: () => void;
  onToggleVisibility: () => void;
  onMove: (dir: 'up' | 'down') => void;
  renderFields: (sectionId: string, fields: SectionField[]) => React.ReactNode;
}

const SectionCard = ({
  section, isAr, isExpanded, isExternallyManaged, reorderEnabled,
  pinned = false, structural = false, position, isFirst = false, isLast = false,
  onToggleExpand, onToggleVisibility, onMove, renderFields,
}: SectionCardProps) => {
  const controls = useDragControls();
  const theme = getSectionTheme(section.id);
  const visible = section.visible !== false;
  const lockedControls = pinned || structural; // لا أسهم/سحب/مفتاح إخفاء

  const inner = (
    <div className={`rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${isExpanded ? 'shadow-md' : ''} ${!visible ? 'opacity-60' : ''}`}>
      <div className={`border ${isExpanded ? 'border-gray-200' : 'border-gray-100'} border-l-4 ${theme.border} bg-white transition-colors`}>
        <div className="flex items-center justify-between p-3.5 gap-2">
          {/* يسار: مقبض السحب + الرقم + الأيقونة + العنوان */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer" onClick={onToggleExpand}>
            {reorderEnabled && !lockedControls && (
              <button
                onPointerDown={(e) => { e.preventDefault(); controls.start(e); }}
                onClick={(e) => e.stopPropagation()}
                className="p-1 -m-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
                title={isAr ? 'اسحب لإعادة الترتيب' : 'Drag to reorder'}
              >
                <GripVertical className="w-4 h-4" />
              </button>
            )}
            {pinned ? (
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-amber-100 text-amber-600" title={isAr ? 'مثبّت في الأعلى' : 'Pinned to top'}>
                <Pin className="w-3 h-3" />
              </span>
            ) : typeof position === 'number' ? (
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-gray-100 text-gray-500 text-[10px] font-bold tabular-nums">{position}</span>
            ) : null}
            <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${theme.bg} ${theme.color} transition-colors shrink-0`}>
              {getSectionIcon(section.id)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{isAr ? section.name : section.nameEn}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {isExternallyManaged ? (
                  <span className="text-[10px] text-amber-600 font-medium">{isAr ? 'يُدار مركزياً' : 'Managed centrally'}</span>
                ) : pinned ? (
                  <span className="text-[10px] text-amber-600 font-medium">{isAr ? 'ثابت في أعلى الصفحة' : 'Fixed at top'}</span>
                ) : structural ? (
                  <span className="text-[10px] text-gray-400 font-medium">{isAr ? 'قسم بنيوي (قائمة التنقّل)' : 'Structural (navbar)'}</span>
                ) : (
                  <>
                    <span className="text-[10px] text-gray-400 font-medium">{section.fields.length} {isAr ? 'حقول' : 'fields'}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className={`text-[10px] font-medium ${visible ? 'text-green-600' : 'text-gray-400'}`}>
                      {visible ? (isAr ? 'ظاهر' : 'Visible') : (isAr ? 'مخفي' : 'Hidden')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* يمين: الأسهم + مفتاح الإظهار + التوسعة */}
          <div className="flex items-center gap-1.5 shrink-0">
            {reorderEnabled && !lockedControls && (
              <div className="flex items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); onMove('up'); }}
                  disabled={isFirst}
                  className="p-1 text-gray-300 hover:text-[#104E8B] hover:bg-blue-50 rounded-md transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                  title={isAr ? 'نقل لأعلى' : 'Move up'}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onMove('down'); }}
                  disabled={isLast}
                  className="p-1 text-gray-300 hover:text-[#104E8B] hover:bg-blue-50 rounded-md transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                  title={isAr ? 'نقل لأسفل' : 'Move down'}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
            {!lockedControls && !isExternallyManaged && (
              <div className="flex items-center gap-1.5 px-1" onClick={(e) => e.stopPropagation()}>
                <Switch
                  checked={visible}
                  onCheckedChange={onToggleVisibility}
                  className="data-[state=checked]:bg-green-600"
                  title={visible ? (isAr ? 'إخفاء القسم' : 'Hide section') : (isAr ? 'إظهار القسم' : 'Show section')}
                />
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
              className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${isExpanded ? 'bg-[#104E8B]/10' : 'bg-gray-100 hover:bg-gray-200'}`}
              title={isExpanded ? (isAr ? 'طي' : 'Collapse') : (isAr ? 'توسعة' : 'Expand')}
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#104E8B]' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && !isExternallyManaged && (
        <div className="px-5 pb-5 pt-4 bg-gray-50/60 border-t border-gray-100">
          {renderFields(section.id, section.fields)}
        </div>
      )}
    </div>
  );

  if (reorderEnabled && !lockedControls) {
    return (
      <Reorder.Item as="div" value={section.id} dragListener={false} dragControls={controls} className="relative">
        {inner}
      </Reorder.Item>
    );
  }
  return inner;
};

export function CmsPageEditorView({ isAr, pageId, onBack }: Props) {
  const { pages, updateSectionField, toggleSectionVisibility, moveSection, reorderSections, saveSiteData, updatePageSeo } = useSiteData();
  const page = useMemo(() => pages.find(p => p.id === pageId) || pages[0], [pages, pageId]);
  const [activeLangTab, setActiveLangTab] = useState<"ar" | "en">("ar");
  const [activeEditorTab, setActiveEditorTab] = useState<"content" | "seo" | "image">("content");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  
  const getDefaultSeo = (pageData: any): PageSeo => {
    const pageTitle = pageData?.title || pageData?.titleEn || 'CORBIT';
    const pagePath = pageData?.path || '';
    return {
      title: pageData?.seo?.title || `${pageTitle} | حلول تقنية رائدة`,
      titleEn: pageData?.seo?.titleEn || `${pageTitle} | Leading Technical Solutions`,
      description: pageData?.seo?.description || 'مزود حلول تقنية رائد في المملكة العربية السعودية',
      descriptionEn: pageData?.seo?.descriptionEn || 'Leading technical solutions provider in Saudi Arabia',
      keywords: pageData?.seo?.keywords || 'SMS, WhatsApp, واتساب, رسائل,API',
      keywordsEn: pageData?.seo?.keywordsEn || 'SMS, WhatsApp, messaging, API',
      canonical: pageData?.seo?.canonical || `https://corbit.sa${pagePath}`,
      noIndex: pageData?.seo?.noIndex || false,
      ogImage: pageData?.seo?.ogImage || '',
    };
  };
  
  const [seo, setSeo] = useState<PageSeo>(() => getDefaultSeo(page));

  // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset on page/section count change, not on every field edit
  useEffect(() => {
    if (!page?.sections?.[0]?.id) return;
    setExpandedSections(new Set([page.sections[0].id]));
  }, [page?.id, page?.sections?.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset SEO when page ID changes
  useEffect(() => {
    if (page) {
      setSeo(getDefaultSeo(page));
    }
  }, [page?.id]);

  if (!page) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-gray-500">{isAr ? "لا توجد صفحات في قاعدة البيانات." : "No pages found in the database."}</p>
          <Button onClick={onBack} className="mt-4 bg-[#104E8B] hover:bg-[#0A2647] text-white">{isAr ? "رجوع" : "Back"}</Button>
        </CardContent>
      </Card>
    );
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const handleFieldChange = (sectionId: string, fieldKey: string, value: string) => {
    updateSectionField(page.id, sectionId, fieldKey, value, activeLangTab);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (updatePageSeo) {
        updatePageSeo(page.id, seo);
      }
      
      const updatedPages = pages.map(p => 
        p.id === page.id ? { ...p, seo } : p
      );
      
      const ok = await saveSiteData(updatedPages);
      if (ok) {
        alert(isAr ? "تم الحفظ بنجاح!" : "Saved successfully!");
      } else {
        alert(isAr ? "حدث خطأ أثناء الحفظ" : "Error saving changes");
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(isAr ? "حدث خطأ أثناء الحفظ" : "Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (sectionId: string, field: SectionField) => {
    const fieldKey = `${sectionId}-${field.key}`;
    const value = activeLangTab === "en" ? (field.valueEn || field.value) : field.value;
    
    if (field.key === 'plans_list' && sectionId === 'sms-pricing') {
      return (
        <SmsPlansListEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
        />
      );
    }

    if (field.key === 'plans_list' && sectionId === 'wa-pricing') {
      return (
        <WhatsAppPlansEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
        />
      );
    }

    if (field.key === 'plans_list' && sectionId === 'schoolbit-pricing') {
      return (
        <SchoolBitPlansListEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
        />
      );
    }

    if (field.key === 'sms_plans_json' && sectionId === 'schoolbit-pricing') {
      return (
        <SchoolBitSmsPlansEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
        />
      );
    }
    
    if (field.key === 'wa_pricing') {
      const plansField = page.sections.find(s => s.id === sectionId)?.fields.find(f => f.key === 'plans_list');
      return (
        <WhatsAppPlansEditor
          key={fieldKey}
          value={plansField ? (activeLangTab === "en" ? (plansField.valueEn || plansField.value) : plansField.value) : ""}
          onChange={(v) => handleFieldChange(sectionId, 'plans_list', v)}
          isAr={isAr}
        />
      );
    }
    
    if (field.key === 'api_prices_list') {
      return (
        <WhatsAppApiPricesEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
        />
      );
    }

    if (field.key === 'slides_json') {
      return (
        <HeroSlidesEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
          pageId={page.id}
        />
      );
    }

    if (field.key === 'integrations_json') {
      return (
        <IntegrationsListEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
          pageId={page.id}
        />
      );
    }

    if (field.key === 'testimonials_json') {
      return (
        <TestimonialsListEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
          pageId={page.id}
        />
      );
    }

    if (field.key === 'faq_json') {
      return (
        <FaqListEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
        />
      );
    }

    if (field.type === 'spacing') {
      return (
        <SectionSpacingEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
        />
      );
    }

    if (field.type === 'display') {
      return (
        <SectionDisplayEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
        />
      );
    }

    if (field.type === 'margin') {
      const direction = field.key === 'margin_before' ? 'before' : 'after';
      return (
        <SectionMarginEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
          direction={direction}
        />
      );
    }

    if (field.key.endsWith('_json')) {
      return (
        <GenericListEditor
          key={fieldKey}
          value={value}
          onChange={(v) => handleFieldChange(sectionId, field.key, v)}
          isAr={isAr}
          pageId={page.id}
          sectionId={sectionId}
        />
      );
    }

    if (field.type === 'image' || field.key.includes('image') || field.key.includes('logo') || field.key.includes('icon')) {
      const isIcon = field.key.includes('logo') || field.key.includes('icon');
      return (
        <div key={fieldKey} className="space-y-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#104E8B]/20 transition-all">
          <div className="flex items-center justify-between">
             <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{isAr ? field.label : field.labelEn}</label>
             <Badge variant="outline" className="text-[9px] uppercase font-bold text-[#104E8B] bg-blue-50/50 border-blue-100">{isIcon ? 'Icon' : 'Image'}</Badge>
          </div>
          <ImageUploader
            value={value}
            onChange={(url) => handleFieldChange(sectionId, field.key, url)}
            folder={`pages/${page.id}/${sectionId}`}
            isAr={isAr}
            aspectRatio={isIcon ? 'square' : 'video'}
          />
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          key={fieldKey}
          value={value}
          onChange={(e) => handleFieldChange(sectionId, field.key, e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all"
          placeholder={isAr ? 'أدخل النص...' : 'Enter text...'}
        />
      );
    }

    if (field.type === 'url') {
      return (
        <input
          key={fieldKey}
          type="url"
          value={value}
          onChange={(e) => handleFieldChange(sectionId, field.key, e.target.value)}
          className="w-full h-10 border border-gray-200 rounded-xl px-4 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all"
          dir="ltr"
          placeholder="https://"
        />
      );
    }

    if (field.type === 'select' && field.options && field.options.length > 0) {
      return (
        <div key={fieldKey}>
          <select
            value={value}
            onChange={(e) => handleFieldChange(sectionId, field.key, e.target.value)}
            className="w-full h-10 border border-gray-200 rounded-xl px-4 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all appearance-none"
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {isAr ? opt.label : opt.labelEn}
              </option>
            ))}
          </select>
          {field.key.includes('type') && value === 'form' && (
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {isAr ? "سيتم توجيه المستخدم لفورم الطلب مع تحديد الباقة تلقائياً" : "User will be directed to request form with package pre-selected"}
            </p>
          )}
          {field.key.includes('type') && value === 'external' && (
            <p className="text-xs text-gray-500 mt-1.5">
              {isAr ? "أدخل الرابط الخارجي في حقل الرابط أعلاه" : "Enter the external URL in the URL field above"}
            </p>
          )}
        </div>
      );
    }

    return (
      <input
        key={fieldKey}
        type="text"
        value={value}
        onChange={(e) => handleFieldChange(sectionId, field.key, e.target.value)}
        className="w-full h-10 border border-gray-200 rounded-xl px-4 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] transition-all"
      />
    );
  };

  const renderFields = (sectionId: string, fields: SectionField[]) => {
    const theme = getSectionTheme(sectionId);
    if (shouldUseGroupedFields(sectionId)) {
      const groupedFields = getGroupedFields(sectionId, fields);
      return (
        <div className="space-y-4">
          {groupedFields.map(([groupKey, groupFields]) => (
            <div key={groupKey} className={`rounded-xl p-4 border-l-4 ${theme.border} bg-white border border-gray-100 shadow-sm`}>
              <h4 className="text-xs font-bold text-[#104E8B] mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#104E8B]" />
                {getGroupLabel(sectionId, groupKey, isAr)}
              </h4>
              <div className="space-y-3">
                {groupFields.map((field) => {
                  const hasOwnLabel = field.key === 'plans_list' || field.key === 'integrations_json' || field.key === 'slides_json' || field.key.endsWith('_json');
                  return (
                    <div key={field.key}>
                      {!hasOwnLabel && (
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          {isAr ? field.label : field.labelEn}
                        </label>
                      )}
                      {renderField(sectionId, field)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {fields.map((field) => {
          const hasOwnLabel = field.key === 'plans_list' || field.key === 'integrations_json' || field.key === 'slides_json' || field.key.endsWith('_json');
          return (
            <div key={field.key} className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-all ${hasOwnLabel ? 'p-0' : 'p-3'}`}>
              {!hasOwnLabel && (
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {isAr ? field.label : field.labelEn}
                </label>
              )}
              {renderField(sectionId, field)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-[#104E8B] -ml-2">
            <ChevronDown className="w-4 h-4 rotate-90" />
            {isAr ? "العودة" : "Back"}
          </Button>
          <span className="text-gray-200 hidden sm:inline">|</span>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{isAr ? page.title : page.titleEn}</h2>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${page.visible !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {page.visible !== false ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مخفي' : 'Hidden')}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 h-9 w-full sm:w-auto" asChild>
            <a href={page.path} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              {isAr ? "معاينة" : "Preview"}
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#FFA502] hover:bg-[#E59400] text-white h-9 w-full sm:w-auto shadow-sm shadow-orange-200">
            <Save className="w-4 h-4" />
            {saving ? (isAr ? "جارِ الحفظ..." : "Saving...") : (isAr ? "حفظ ونشر" : "Save & Publish")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-full sm:w-fit">
          {[
            { id: 'content' as const, icon: FileText, label: isAr ? 'المحتوى' : 'Content' },
            { id: 'seo' as const, icon: Search, label: 'SEO' },
            { id: 'image' as const, icon: ImageIcon, label: isAr ? 'الصور' : 'Images' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEditorTab(tab.id)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeEditorTab === tab.id ? "bg-white text-[#104E8B] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeEditorTab === 'content' && (
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-full sm:w-fit">
            <button
              onClick={() => setActiveLangTab("ar")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeLangTab === "ar" ? "bg-white text-[#104E8B] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}
            >
              العربية
            </button>
            <button
              onClick={() => setActiveLangTab("en")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeLangTab === "en" ? "bg-white text-[#104E8B] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}
            >
              English
            </button>
          </div>
        )}
      </div>

      {activeEditorTab === 'seo' && (
        <Card className="border border-gray-200">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#104E8B]" />
              {isAr ? 'إعدادات SEO للصفحة' : 'Page SEO Settings'}
            </h3>
            <p className="text-sm text-gray-500">
              {isAr 
                ? 'هذه الإعدادات تؤثر على ظهور الصفحة في محركات البحث ووسائل التواصل.' 
                : 'These settings affect how the page appears in search engines and social media.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAr ? 'عنوان الصفحة (Meta Title)' : 'Page Title (Meta Title)'} ({isAr ? 'عربي' : 'AR'})
                </label>
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                  placeholder={isAr ? 'أدخل عنوان الصفحة...' : 'Enter page title...'}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {seo.title.length}/60 {isAr ? 'حرف' : 'characters'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAr ? 'عنوان الصفحة (Meta Title)' : 'Page Title (Meta Title)'} (EN)
                </label>
                <input
                  type="text"
                  value={seo.titleEn}
                  onChange={(e) => setSeo({ ...seo, titleEn: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                  dir="ltr"
                  placeholder={isAr ? 'Enter page title...' : 'Enter page title...'}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAr ? 'وصف الصفحة (Meta Description)' : 'Page Description (Meta Description)'} ({isAr ? 'عربي' : 'AR'})
                </label>
                <textarea
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                  placeholder={isAr ? 'أدخل وصف الصفحة...' : 'Enter page description...'}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {seo.description.length}/160 {isAr ? 'حرف' : 'characters'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAr ? 'وصف الصفحة (Meta Description)' : 'Page Description (Meta Description)'} (EN)
                </label>
                <textarea
                  value={seo.descriptionEn}
                  onChange={(e) => setSeo({ ...seo, descriptionEn: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                  dir="ltr"
                  placeholder={isAr ? 'Enter page description...' : 'Enter page description...'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAr ? 'الكلمات المفتاحية' : 'Keywords'} ({isAr ? 'عربي' : 'AR'})
                </label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                  placeholder={isAr ? 'كلمة1، كلمة2، كلمة3' : 'keyword1, keyword2, keyword3'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAr ? 'الكلمات المفتاحية' : 'Keywords'} (EN)
                </label>
                <input
                  type="text"
                  value={seo.keywordsEn}
                  onChange={(e) => setSeo({ ...seo, keywordsEn: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                  dir="ltr"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAr ? 'الرابطCanonical' : 'Canonical URL'}
                </label>
                <input
                  type="url"
                  value={seo.canonical}
                  onChange={(e) => setSeo({ ...seo, canonical: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                  dir="ltr"
                  placeholder="https://corbit.sa/page"
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seo.noIndex}
                    onChange={(e) => setSeo({ ...seo, noIndex: e.target.checked })}
                    className="w-4 h-4 text-[#104E8B] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {isAr ? 'عدم أرشفة الصفحة (noindex)' : 'No index this page (noindex)'}
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeEditorTab === 'image' && (
        <Card className="border border-gray-200">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#104E8B]" />
              {isAr ? 'صورة Open Graph' : 'Open Graph Image'}
            </h3>
            <p className="text-sm text-gray-500">
              {isAr 
                ? 'هذه الصورة تظهر عند مشاركة الصفحة في فيسبوك ووسائل التواصل.' 
                : 'This image appears when the page is shared on Facebook and social media.'}
            </p>
            <div className="max-w-md">
              <ImageUploader
                value={seo.ogImage}
                onChange={(url) => setSeo({ ...seo, ogImage: url })}
                folder={`pages/${page.id}`}
                isAr={isAr}
                label={isAr ? 'صورة Open Graph' : 'Open Graph Image'}
                aspectRatio="video"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeEditorTab === 'content' && (() => {
        const isHome = page.id === 'home' || page.path === '/';
        const PINNED = new Set(['home-hero']);
        const TAIL = new Set(['home-navbar']);
        const pinnedSections = isHome ? page.sections.filter(s => PINNED.has(s.id)) : [];
        const tailSections = isHome ? page.sections.filter(s => TAIL.has(s.id)) : [];
        const movableSections = isHome
          ? page.sections.filter(s => !PINNED.has(s.id) && !TAIL.has(s.id))
          : page.sections;
        const movableIds = movableSections.map(s => s.id);

        const cardProps = (section: PageSection) => ({
          section,
          isAr,
          isExpanded: expandedSections.has(section.id),
          isExternallyManaged: section.id === 'sms-trust',
          onToggleExpand: () => toggleSection(section.id),
          onToggleVisibility: () => toggleSectionVisibility(page.id, section.id),
          renderFields,
        });

        return (
          <div className="space-y-3">
            {isHome && (
              <p className="text-[11px] text-gray-400 px-1 flex items-center gap-1.5">
                <GripVertical className="w-3.5 h-3.5" />
                {isAr ? 'اسحب الأقسام لإعادة ترتيبها على الصفحة، أو استخدم الأسهم. الهيرو ثابت دائماً في الأعلى.' : 'Drag sections to reorder them on the page, or use the arrows. The Hero is always pinned to the top.'}
              </p>
            )}

            {pinnedSections.map((section) => (
              <SectionCard key={section.id} {...cardProps(section)} reorderEnabled={false} pinned onMove={() => {}} />
            ))}

            {isHome ? (
              <Reorder.Group as="div" axis="y" values={movableIds} onReorder={(ids) => reorderSections(page.id, ids as string[])} className="space-y-3">
                {movableSections.map((section, i) => (
                  <SectionCard
                    key={section.id}
                    {...cardProps(section)}
                    reorderEnabled
                    position={i + 1}
                    isFirst={i === 0}
                    isLast={i === movableSections.length - 1}
                    onMove={(dir) => moveSection(page.id, section.id, dir)}
                  />
                ))}
              </Reorder.Group>
            ) : (
              movableSections.map((section) => (
                <SectionCard key={section.id} {...cardProps(section)} reorderEnabled={false} onMove={() => {}} />
              ))
            )}

            {tailSections.map((section) => (
              <SectionCard key={section.id} {...cardProps(section)} reorderEnabled={false} structural onMove={() => {}} />
            ))}
          </div>
        );
      })()}

      {page.sections.length === 0 && (
        <Card className="border border-gray-200">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-gray-500">{isAr ? "لا توجد أقسام في هذه الصفحة." : "No sections in this page."}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
