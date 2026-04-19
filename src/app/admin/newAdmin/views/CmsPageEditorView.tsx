'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, ChevronDown, Eye, EyeOff, ExternalLink, FileText, Search, Image as ImageIcon, Globe } from 'lucide-react';
import { Button } from '@/components/business/ui/button';
import { Card, CardContent } from '@/components/business/ui/card';
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
import { ImageUploader } from '@/components/business/ImageUploader';

interface Props {
  isAr: boolean;
  pageId: string | null;
  onBack: () => void;
}

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
      <label className="text-xs text-gray-500 block">{isAr ? "باقات الرسائل" : "SMS Plans"}</label>
      {rows.map((row, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={row.messages}
              onChange={(e) => updateRow(index, { messages: e.target.value })}
              disabled={row.custom}
              placeholder={isAr ? "عدد الرسائل (مثال: 1000)" : "Messages count (e.g. 1000)"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
            />
            <input
              type="text"
              value={row.price}
              onChange={(e) => updateRow(index, { price: e.target.value })}
              disabled={row.custom}
              placeholder={isAr ? "السعر (مثال: 110)" : "Price (e.g. 110)"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
            />
            <input
              type="text"
              value={row.feature}
              onChange={(e) => updateRow(index, { feature: e.target.value })}
              placeholder={isAr ? "عنوان الباقة" : "Plan feature/title"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={row.description}
              onChange={(e) => updateRow(index, { description: e.target.value })}
              placeholder={isAr ? "وصف الباقة" : "Plan description"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={row.featured}
                onChange={(e) => updateRow(index, { featured: e.target.checked })}
              />
              {isAr ? "الباقة المميزة" : "Featured plan"}
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={row.custom}
                onChange={(e) => updateRow(index, { custom: e.target.checked })}
              />
              {isAr ? "باقة مخصصة" : "Custom plan"}
            </label>
            <button
              onClick={() => removeRow(index)}
              className="text-xs text-red-500 hover:text-red-600 hover:underline"
            >
              {isAr ? "حذف الباقة" : "Delete plan"}
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addRow}
        className="flex items-center gap-1 text-xs text-[#104E8B] hover:text-[#0A2647] transition-colors"
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
                  <input type="text" value={tier.price} onChange={(e) => updateTier(planIndex, tierIndex, { price: e.target.value })} placeholder={isAr ? "السعر" : "Price"} className="border border-gray-200 rounded-md px-2.5 py-2 text-xs" />
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
            <input
              type="text"
              value={row.duration}
              onChange={(e) => updateRow(index, { duration: e.target.value })}
              placeholder={isAr ? "المدة" : "Duration"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
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

const SPECIALIZED_FIELDS: Record<string, 'sms-plans' | 'whatsapp-plans' | 'whatsapp-api-prices'> = {
  'plans_list': 'sms-plans',
  'api_prices_list': 'whatsapp-api-prices',
  'wa_pricing': 'whatsapp-plans',
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

export function CmsPageEditorView({ isAr, pageId, onBack }: Props) {
  const { pages, updateSectionField, toggleSectionVisibility, saveSiteData, updatePageSeo } = useSiteData();
  const page = pages.find(p => p.id === pageId) || pages[0];
  const [activeLangTab, setActiveLangTab] = useState<"ar" | "en">("ar");
  const [activeEditorTab, setActiveEditorTab] = useState<"content" | "seo" | "image">("content");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  
  const getDefaultSeo = (pageData: any): PageSeo => {
    const pageTitle = pageData?.title || pageData?.titleEn || 'ORBIT';
    const pagePath = pageData?.path || '';
    return {
      title: pageData?.seo?.title || `${pageTitle} | حلول تقنية رائدة`,
      titleEn: pageData?.seo?.titleEn || `${pageTitle} | Leading Technical Solutions`,
      description: pageData?.seo?.description || 'مزود حلول تقنية رائد في المملكة العربية السعودية',
      descriptionEn: pageData?.seo?.descriptionEn || 'Leading technical solutions provider in Saudi Arabia',
      keywords: pageData?.seo?.keywords || 'SMS, WhatsApp, واتساب, رسائل,API',
      keywordsEn: pageData?.seo?.keywordsEn || 'SMS, WhatsApp, messaging, API',
      canonical: pageData?.seo?.canonical || `https://orbit.sa${pagePath}`,
      noIndex: pageData?.seo?.noIndex || false,
      ogImage: pageData?.seo?.ogImage || '',
    };
  };
  
  const [seo, setSeo] = useState<PageSeo>(() => getDefaultSeo(page));

  useEffect(() => {
    if (!page?.sections?.[0]?.id) return;
    setExpandedSections(new Set([page.sections[0].id]));
  }, [page]);

  useEffect(() => {
    if (page) {
      setSeo(getDefaultSeo(page));
    }
  }, [page]);

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

    if (field.type === 'textarea') {
      return (
        <textarea
          key={fieldKey}
          value={value}
          onChange={(e) => handleFieldChange(sectionId, field.key, e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
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
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
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
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white"
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {isAr ? opt.label : opt.labelEn}
              </option>
            ))}
          </select>
          {field.key.includes('type') && value === 'form' && (
            <p className="text-xs text-gray-500 mt-1">
              {isAr ? "سيتم توجيه المستخدم لفورم الطلب مع تحديد الباقة تلقائياً" : "User will be directed to request form with package pre-selected"}
            </p>
          )}
          {field.key.includes('type') && value === 'external' && (
            <p className="text-xs text-gray-500 mt-1">
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
        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
      />
    );
  };

  const renderFields = (sectionId: string, fields: SectionField[]) => {
    if (shouldUseGroupedFields(sectionId)) {
      const groupedFields = getGroupedFields(sectionId, fields);
      return (
        <div className="space-y-4">
          {groupedFields.map(([groupKey, groupFields]) => (
            <div key={groupKey} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
              <h4 className="text-xs font-bold text-[#104E8B] mb-3">{getGroupLabel(sectionId, groupKey, isAr)}</h4>
              <div className="space-y-3">
                {groupFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {isAr ? field.label : field.labelEn}
                    </label>
                    {renderField(sectionId, field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {isAr ? field.label : field.labelEn}
            </label>
            {renderField(sectionId, field)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-[#104E8B]">
            <ChevronDown className="w-4 h-4 rotate-90" />
            {isAr ? "العودة" : "Back"}
          </Button>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <h2 className="text-base sm:text-lg text-[#104E8B] truncate">{isAr ? page.title : page.titleEn}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="border-gray-200 text-gray-600 h-9 w-full sm:w-auto" asChild>
            <a href={page.path} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              {isAr ? "معاينة" : "Preview"}
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#FFA502] hover:bg-[#E59400] text-white h-9 w-full sm:w-auto">
            <Save className="w-4 h-4" />
            {saving ? (isAr ? "جارِ الحفظ..." : "Saving...") : (isAr ? "حفظ ونشر" : "Save & Publish")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-100 w-full sm:w-fit">
          {[
            { id: 'content' as const, icon: FileText, label: isAr ? 'المحتوى' : 'Content' },
            { id: 'seo' as const, icon: Search, label: 'SEO' },
            { id: 'image' as const, icon: ImageIcon, label: isAr ? 'الصور' : 'Images' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEditorTab(tab.id)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${
                activeEditorTab === tab.id ? "bg-[#104E8B] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeEditorTab === 'content' && (
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-100 w-full sm:w-fit">
            <button
              onClick={() => setActiveLangTab("ar")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm transition-all ${activeLangTab === "ar" ? "bg-[#104E8B] text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              العربية
            </button>
            <button
              onClick={() => setActiveLangTab("en")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm transition-all ${activeLangTab === "en" ? "bg-[#104E8B] text-white" : "text-gray-600 hover:bg-gray-100"}`}
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
                  placeholder="https://orbit.sa/page"
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

      {activeEditorTab === 'content' && (
      <div className="space-y-3">
        {page.sections.map((section, sIndex) => {
          const isExpanded = expandedSections.has(section.id);
          const isExternallyManagedSection = section.id === "sms-trust";
          return (
            <Card key={section.id} className={`border shadow-sm overflow-hidden ${!section.visible ? "opacity-60" : ""} ${isExpanded ? "border-[#104E8B]/30" : "border-gray-100"}`}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors gap-3"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#104E8B]/10 text-[#104E8B] text-sm">
                    {sIndex + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">{isAr ? section.name : section.nameEn}</p>
                    <p className="text-xs text-gray-400">
                      {isExternallyManagedSection
                        ? (isAr ? "يُدار مركزياً" : "Managed centrally")
                        : `${section.fields.length} ${isAr ? "حقول" : "fields"}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(page.id, section.id); }}
                    className={`p-1.5 rounded-md transition-colors ${section.visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                    title={section.visible ? (isAr ? "إخفاء القسم" : "Hide section") : (isAr ? "إظهار القسم" : "Show section")}
                  >
                    {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </div>

              {isExpanded && !isExternallyManagedSection && (
                <div className="p-4 bg-gray-50/50 border-t">
                  {renderFields(section.id, section.fields)}
                </div>
              )}
            </Card>
          );
        })}
      </div>
      )}

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
