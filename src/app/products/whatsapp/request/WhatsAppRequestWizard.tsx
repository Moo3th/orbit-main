'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/business/ui/button";
import { Card, CardContent } from "@/components/business/ui/card";
import { Badge } from "@/components/business/ui/badge";
import { Input } from "@/components/business/ui/input";
import { Textarea } from "@/components/business/ui/textarea";
import { 
  ArrowRight, ArrowLeft, CheckCircle, MessageCircle, 
  Users, Building2, Target, Send, Loader2, Sparkles, Ban, Phone, Mail
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsPage } from '@/lib/cms/types';
import { getCmsField } from '@/lib/cms/helpers';
import {
  getDefaultWhatsAppPlans,
  parseWhatsAppPlans,
  serializeWhatsAppPlans,
} from '@/lib/cms/whatsappPricing';
import toast from "react-hot-toast";

interface WhatsAppRequestWizardProps {
  cmsPage?: CmsPage | null;
}

interface FormFieldOption {
  value: string;
  labelAr: string;
  labelEn: string;
}

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'number' | 'select' | 'multiselect' | 'radio';
  labelAr: string;
  labelEn: string;
  placeholderAr: string;
  placeholderEn: string;
  required: boolean;
  step: number;
  options: FormFieldOption[];
}

const steps = [
  { id: 1, key: 'plan', labelAr: 'اختر الباقة', labelEn: 'Choose Package' },
  { id: 2, key: 'contact', labelAr: 'بيانات التواصل', labelEn: 'Contact Info' },
  { id: 3, key: 'company', labelAr: 'بيانات الشركة', labelEn: 'Company Info' },
  { id: 4, key: 'goal', labelAr: 'الهدف من الخدمة', labelEn: 'Service Goal' },
  { id: 5, key: 'employees', labelAr: 'عدد الموظفين', labelEn: 'Employees' },
  { id: 6, key: 'review', labelAr: 'مراجعة وإرسال', labelEn: 'Review & Submit' },
];

const defaultIndustryOptions = [
  { value: "retail", labelAr: "تجزئة ومبيعات", labelEn: "Retail & Sales" },
  { value: "restaurant", labelAr: "مطاعم وكافيهات", labelEn: "Restaurants & Cafes" },
  { value: "healthcare", labelAr: "صحة وعناية صحية", labelEn: "Healthcare" },
  { value: "education", labelAr: "تعليم", labelEn: "Education" },
  { value: "real-estate", labelAr: "عقارات", labelEn: "Real Estate" },
  { value: "logistics", labelAr: "لوجستيات ونقل", labelEn: "Logistics & Transport" },
  { value: "banking", labelAr: "بنوك ومالية", labelEn: "Banking & Finance" },
  { value: "government", labelAr: "حكومي", labelEn: "Government" },
  { value: "automotive", labelAr: "سيارات", labelEn: "Automotive" },
  { value: "technology", labelAr: "تكنولوجيا", labelEn: "Technology" },
  { value: "manufacturing", labelAr: "تصنيع", labelEn: "Manufacturing" },
  { value: "other", labelAr: "أخرى", labelEn: "Other" },
];

const defaultEmployeeCountOptions = [
  { value: "1-10", labelAr: "1 - 10 موظفين", labelEn: "1 - 10 employees" },
  { value: "11-50", labelAr: "11 - 50 موظف", labelEn: "11 - 50 employees" },
  { value: "51-100", labelAr: "51 - 100 موظف", labelEn: "51 - 100 employees" },
  { value: "101-500", labelAr: "101 - 500 موظف", labelEn: "101 - 500 employees" },
  { value: "500+", labelAr: "أكثر من 500", labelEn: "500+ employees" },
];

const defaultGoalOptions = [
  { value: "customer-support", labelAr: "دعم العملاء", labelEn: "Customer Support" },
  { value: "sales", labelAr: "مبيعات وتسويق", labelEn: "Sales & Marketing" },
  { value: "notifications", labelAr: "إشعارات آلية", labelEn: "Automated Notifications" },
  { value: "internal-communication", labelAr: "تواصل داخلي", labelEn: "Internal Communication" },
];

const parseListOptions = (raw: string, defaults: { value: string; labelAr: string; labelEn: string }[]): { value: string; labelAr: string; labelEn: string }[] => {
  if (!raw || !raw.trim()) return defaults;
  try {
    const lines = raw.split('\n').filter(line => line.trim());
    if (lines.length === 0) return defaults;
    
    const isKeyValue = lines[0].includes(':');
    if (isKeyValue) {
      return lines.map(line => {
        const [value, label] = line.split(':');
        return { value: value.trim(), labelAr: label?.trim() || value.trim(), labelEn: label?.trim() || value.trim() };
      });
    } else {
      return lines.map((label, index) => ({
        value: `option_${index}`,
        labelAr: label.trim(),
        labelEn: label.trim()
      }));
    }
  } catch {
    return defaults;
  }
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{9,15}$/;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleaned);
};

export const WhatsAppRequestWizard = ({ cmsPage = null }: WhatsAppRequestWizardProps) => {
  const { isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [dynamicFields, setDynamicFields] = useState<FormField[]>([]);
  const [formConfigLoaded, setFormConfigLoaded] = useState(false);
  const [isFormInactive, setIsFormInactive] = useState(false);
  const [dynamicFormData, setDynamicFormData] = useState<Record<string, string>>({});
  const [thankYouMessage, setThankYouMessage] = useState({ ar: '', en: '' });
  const [title, setTitle] = useState({ ar: '', en: '' });
  const [formData, setFormData] = useState({
    planId: '',
    tierId: '',
    name: '',
    email: '',
    phone: '',
    companyName: '',
    industry: '',
    otherIndustry: '',
    goal: '',
    employeeCount: '',
    notes: '',
  });

  useEffect(() => {
    const fetchFormConfig = async () => {
      try {
        const res = await fetch('/api/form-configs/whatsapp');
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            if (data.config.isActive === false) {
              setIsFormInactive(true);
              setFormConfigLoaded(true);
              return;
            }
            setTitle({ ar: data.config.titleAr || '', en: data.config.titleEn || '' });
            setThankYouMessage({ ar: data.config.thankYouMessageAr || '', en: data.config.thankYouMessageEn || '' });
            if (data.config.fields && data.config.fields.length > 0) {
              setDynamicFields(data.config.fields);
              const initial: Record<string, string> = {};
              data.config.fields.forEach((f: FormField) => { initial[f.id] = ''; });
              setDynamicFormData(initial);
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch form config:', e);
      }
      setFormConfigLoaded(true);
    };
    fetchFormConfig();
  }, []);

  const hasDynamicFields = dynamicFields.length > 0;
  const maxDynamicStep = hasDynamicFields ? Math.max(...dynamicFields.map(f => f.step)) : 0;
  const totalSteps = hasDynamicFields ? maxDynamicStep : 6;

  const defaultPricingPlans = useMemo(() => getDefaultWhatsAppPlans(isRTL), [isRTL]);
  const cmsPricingPlansRaw = useMemo(() => getCmsField(
    cmsPage,
    'wa-pricing',
    'plans_list',
    isRTL,
    serializeWhatsAppPlans(defaultPricingPlans)
  ), [cmsPage, isRTL, defaultPricingPlans]);
  const pricingPlans = useMemo(() => parseWhatsAppPlans(cmsPricingPlansRaw, defaultPricingPlans), [cmsPricingPlansRaw, defaultPricingPlans]);

  const initFromUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    const tierParam = params.get('tier');
    if (planParam && tierParam && pricingPlans.length > 0) {
      const plan = pricingPlans.find(p => p.id === planParam);
      if (plan) {
        setFormData(prev => ({
          ...prev,
          planId: plan.id,
          tierId: tierParam,
        }));
        setCurrentStep(2);
      }
    }
  }, [pricingPlans]);

  useEffect(() => {
    initFromUrlParams();
  }, [initFromUrlParams]);

  const cmsIndustryOptionsRaw = getCmsField(
    cmsPage,
    'wa-request-form',
    'industry_options',
    isRTL,
    ''
  );
  const industryOptions = parseListOptions(cmsIndustryOptionsRaw, defaultIndustryOptions);

  const cmsEmployeeCountRaw = getCmsField(
    cmsPage,
    'wa-request-form',
    'employee_count_options',
    isRTL,
    ''
  );
  const employeeCountOptions = parseListOptions(cmsEmployeeCountRaw, defaultEmployeeCountOptions);

  const cmsGoalsRaw = getCmsField(
    cmsPage,
    'wa-request-form',
    'service_goals',
    isRTL,
    ''
  );
  const goalOptions = parseListOptions(cmsGoalsRaw, defaultGoalOptions);

  const notificationEmail = getCmsField(
    cmsPage,
    'wa-request-form',
    'notification_email',
    isRTL,
    'marketing@corbit.sa'
  );

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    const hasDynamicStepFields = hasDynamicFields && dynamicFields.filter(f => f.step === step).length > 0;
    
    if (step === 1) {
      if (!formData.planId) {
        newErrors.planId = isRTL ? 'يرجى اختيار باقة' : 'Please select a package';
      }
      if (!formData.tierId) {
        newErrors.tierId = isRTL ? 'يرجى اختيار الشريحة' : 'Please select a tier';
      }
    }
    
    if (step === 2 && !hasDynamicStepFields) {
      if (!formData.name.trim()) {
        newErrors.name = isRTL ? 'يرجى إدخال الاسم' : 'Please enter your name';
      }
      if (!formData.email.trim()) {
        newErrors.email = isRTL ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = isRTL ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = isRTL ? 'رقم الهاتف غير صحيح' : 'Invalid phone number';
      }
    }
    
    if (step === 3 && !hasDynamicStepFields) {
      if (formData.industry === 'other' && !formData.otherIndustry.trim()) {
        newErrors.otherIndustry = isRTL ? 'يرجى إدخال نشاطك' : 'Please enter your industry';
      }
    }
    
    if (step === 4 && !hasDynamicStepFields) {
      if (selectedGoals.length === 0) {
        newErrors.goal = isRTL ? 'يرجى اختيار هدف واحد على الأقل' : 'Please select at least one goal';
      }
    }
    
    if (step === 5 && !hasDynamicStepFields) {
      if (!formData.employeeCount) {
        newErrors.employeeCount = isRTL ? 'يرجى اختيار عدد الموظفين' : 'Please select number of employees';
      }
    }

    if (hasDynamicFields) {
      const stepFields = dynamicFields.filter(f => f.step === step);
      stepFields.forEach(field => {
        if (field.required) {
          if (field.type === 'multiselect') {
            const fieldVal = dynamicFormData[field.id];
            if (!Array.isArray(fieldVal) || fieldVal.length === 0) {
              newErrors[field.id] = isRTL ? 'يرجى اختيار خيار واحد على الأقل' : 'Please select at least one option';
            }
          } else if (!dynamicFormData[field.id]?.trim()) {
            newErrors[field.id] = isRTL ? `يرجى إدخال ${field.labelAr}` : `Please enter ${field.labelEn}`;
          }
          if (field.type === 'email' && dynamicFormData[field.id] && !validateEmail(dynamicFormData[field.id])) {
            newErrors[field.id] = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address';
          }
          if (field.type === 'tel' && dynamicFormData[field.id] && !validatePhone(dynamicFormData[field.id])) {
            newErrors[field.id] = isRTL ? 'رقم الهاتف غير صحيح' : 'Invalid phone number';
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlanSelect = (planId: string, tierId: string) => {
    setFormData(prev => ({ ...prev, planId, tierId }));
    setErrors(prev => ({ ...prev, planId: '', tierId: '' }));
  };

  const toggleGoal = (goalValue: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalValue)) {
        return prev.filter(g => g !== goalValue);
      }
      return [...prev, goalValue];
    });
    setErrors(prev => ({ ...prev, goal: '' }));
  };

  const handleSubmit = async () => {
    const finalFormData = hasDynamicFields
      ? { ...formData, ...dynamicFormData, goal: selectedGoals.length > 0 ? selectedGoals.join(', ') : dynamicFormData.goal || '' }
      : { ...formData, goal: selectedGoals.join(', ') };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/whatsapp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData),
      });

      if (response.ok) {
        setIsComplete(true);
        toast.success(isRTL ? 'تم إرسال طلبك بنجاح!' : 'Request submitted successfully!');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(isRTL ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'Error, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDynamicStepFields = (step: number) => {
    const stepFields = dynamicFields.filter(f => f.step === step);
    if (stepFields.length === 0) return null;

    const stepIcons: Record<number, React.ElementType> = { 2: Users, 3: Building2, 4: Target, 5: Users, 6: Send };
    const stepLabels: Record<number, { ar: string; en: string }> = {
      2: { ar: 'بيانات التواصل', en: 'Contact Info' },
      3: { ar: 'بيانات الشركة', en: 'Company Info' },
      4: { ar: 'الهدف من الخدمة', en: 'Service Goal' },
      5: { ar: 'تفاصيل إضافية', en: 'Additional Details' },
      6: { ar: 'تفاصيل إضافية', en: 'Additional Details' },
    };
    const StepIcon = stepIcons[step] || Send;
    const stepInfo = stepLabels[step] || { ar: `الخطوة ${step}`, en: `Step ${step}` };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Badge className="bg-[#25D366] text-white border-none px-4 py-2 text-sm mb-3">
            <StepIcon className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? stepInfo.ar : stepInfo.en}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#161616]">
            {isRTL ? stepInfo.ar : stepInfo.en}
          </h2>
        </div>
        <div className="max-w-lg mx-auto space-y-4">
          {stepFields.map(field => (
            <div key={field.id} className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                {isRTL ? field.labelAr : field.labelEn}
                {field.required && <span className="text-red-500 mr-1">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <Textarea
                  value={dynamicFormData[field.id] || ''}
                  onChange={e => {
                    setDynamicFormData(prev => ({ ...prev, [field.id]: e.target.value }));
                    if (errors[field.id]) setErrors(prev => ({ ...prev, [field.id]: '' }));
                  }}
                  placeholder={isRTL ? field.placeholderAr : field.placeholderEn}
                  className="border-gray-300 focus:border-[#25D366] focus:ring-[#25D366]"
                  rows={3}
                />
              ) : field.type === 'select' ? (
                <select
                  value={dynamicFormData[field.id] || ''}
                  onChange={e => {
                    setDynamicFormData(prev => ({ ...prev, [field.id]: e.target.value }));
                    if (errors[field.id]) setErrors(prev => ({ ...prev, [field.id]: '' }));
                  }}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#25D366] focus:ring-[#25D366]"
                >
                  <option value="">{isRTL ? field.placeholderAr : field.placeholderEn}</option>
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{isRTL ? opt.labelAr : opt.labelEn}</option>
                  ))}
                </select>
              ) : field.type === 'radio' ? (
                <div className="space-y-2">
                  {field.options.map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        dynamicFormData[field.id] === opt.value
                          ? 'border-[#25D366] bg-green-50'
                          : 'border-gray-200 hover:border-[#25D366]'
                      }`}
                    >
                      <input
                        type="radio"
                        name={field.id}
                        value={opt.value}
                        checked={dynamicFormData[field.id] === opt.value}
                        onChange={e => {
                          setDynamicFormData(prev => ({ ...prev, [field.id]: e.target.value }));
                          if (errors[field.id]) setErrors(prev => ({ ...prev, [field.id]: '' }));
                        }}
                        className="w-4 h-4 accent-[#25D366]"
                      />
                      <span className="text-sm font-medium">{isRTL ? opt.labelAr : opt.labelEn}</span>
                    </label>
                  ))}
                </div>
              ) : field.type === 'multiselect' ? (
                <div className="space-y-2">
                  {field.options.map(opt => {
                    const isSelected = selectedGoals.includes(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-[#25D366] bg-green-50' : 'border-gray-200 hover:border-[#25D366]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleGoal(opt.value)}
                          className="w-4 h-4 accent-[#25D366]"
                        />
                        <span className="text-sm font-medium">{isRTL ? opt.labelAr : opt.labelEn}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <Input
                  type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : field.type === 'number' ? 'number' : 'text'}
                  value={dynamicFormData[field.id] || ''}
                  onChange={e => {
                    setDynamicFormData(prev => ({ ...prev, [field.id]: e.target.value }));
                    if (errors[field.id]) setErrors(prev => ({ ...prev, [field.id]: '' }));
                  }}
                  placeholder={isRTL ? field.placeholderAr : field.placeholderEn}
                  className="border-gray-300 focus:border-[#25D366] focus:ring-[#25D366]"
                />
              )}
              {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Badge className="bg-[#25D366] text-white border-none px-4 py-2 text-sm mb-3">
                <MessageCircle className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'ml-2'}`} />
                {isRTL ? 'واتساب أعمال API' : 'WhatsApp Business API'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#161616]">
                {isRTL ? 'اختر الباقة المناسبة' : 'Choose Your Package'}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {isRTL ? 'اختر الباقة والشريحة التي تناسب احتياجاتك' : 'Select the package and tier that fits your needs'}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, planIndex) => (
                <Card 
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    formData.planId === plan.id 
                      ? 'ring-4 ring-[#25D366] shadow-lg' 
                      : 'border-2 border-gray-200 hover:border-[#25D366]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0">
                      <div className="bg-[#F15822] text-white text-center py-1.5 text-sm font-bold">
                        ⭐ {isRTL ? 'الأكثر طلباً' : 'Most Popular'}
                      </div>
                    </div>
                  )}
                  <CardContent className={`p-6 ${plan.popular ? 'pt-14' : 'pt-6'}`}>
                    <h3 className="text-xl font-extrabold text-[#161616] mb-4 text-center">{plan.name}</h3>
                    <div className="space-y-3 mb-6">
                      {plan.tiers.map((tier, tierIndex) => (
                        <div 
                          key={tierIndex}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            formData.planId === plan.id && formData.tierId === tier.name 
                              ? 'border-[#25D366] bg-green-50' 
                              : 'border-gray-200 hover:border-[#25D366]'
                          }`}
                          onClick={() => handlePlanSelect(plan.id, tier.name)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-[#161616]">{tier.name}</span>
                            <div className="text-left">
                              <span className="text-2xl font-extrabold text-[#25D366]">{tier.price}</span>
                              <span className="text-sm text-gray-500"> {isRTL ? 'ر.س' : 'SAR'}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                            <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-700">
                              {tier.conversations} {isRTL ? 'محادثة' : 'conv.'}
                            </span>
                            <span className="bg-purple-50 px-2 py-0.5 rounded text-purple-700">
                              {tier.users} {isRTL ? 'مستخدم' : 'users'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className={`w-full h-12 font-bold ${
                        formData.planId === plan.id 
                          ? 'bg-[#25D366] hover:bg-[#1da954]' 
                          : 'bg-[#128C7E] hover:bg-[#0d6b5f]'
                      }`}
                      onClick={() => handlePlanSelect(plan.id, plan.tiers[0]?.name || '')}
                    >
                      {isRTL ? 'اختر هذه الباقة' : 'Select This Package'}
                      {formData.planId === plan.id && <CheckCircle className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {errors.planId && <p className="text-center text-red-500 text-sm mt-4">{errors.planId}</p>}
          </div>
        );

      case 2:
        if (hasDynamicFields) {
          const stepFields = dynamicFields.filter(f => f.step === 2);
          if (stepFields.length > 0) return renderDynamicStepFields(2);
        }
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Badge className="bg-[#25D366] text-white border-none px-4 py-2 text-sm mb-3">
                <Users className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'ml-2'}`} />
                {isRTL ? 'بيانات التواصل' : 'Contact Info'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#161616]">
                {isRTL ? 'بيانات التواصل' : 'Contact Information'}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {isRTL ? 'يرجى إدخال بيانات التواصل الخاصة بك' : 'Please enter your contact details'}
              </p>
            </div>
            <div className="max-w-lg mx-auto">
              <Card className="border-2 border-gray-100 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#161616]">
                      {isRTL ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      className={`h-14 text-lg ${errors.name ? 'border-red-500 border-2' : 'border-gray-200'}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#161616]">
                      {isRTL ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder={isRTL ? 'example@email.com' : 'example@email.com'}
                      className={`h-14 text-lg ${errors.email ? 'border-red-500 border-2' : 'border-gray-200'}`}
                      dir="ltr"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#161616]">
                      {isRTL ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder={isRTL ? '966501234567' : '966501234567'}
                      className={`h-14 text-lg ${errors.phone ? 'border-red-500 border-2' : 'border-gray-200'}`}
                      dir="ltr"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        if (hasDynamicFields) {
          const stepFields = dynamicFields.filter(f => f.step === 3);
          if (stepFields.length > 0) return renderDynamicStepFields(3);
        }
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Badge className="bg-[#25D366] text-white border-none px-4 py-2 text-sm mb-3">
                <Building2 className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'ml-2'}`} />
                {isRTL ? 'بيانات الشركة' : 'Company Info'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#161616]">
                {isRTL ? 'بيانات الشركة' : 'Company Information'}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {isRTL ? 'أخبرنا عن شركتك' : 'Tell us about your company'}
              </p>
            </div>
            <div className="max-w-lg mx-auto">
              <Card className="border-2 border-gray-100 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#161616]">
                      {isRTL ? 'اسم الشركة' : 'Company Name'}
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      placeholder={isRTL ? 'أدخل اسم شركتك' : 'Enter your company name'}
                      className="h-14 text-lg border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-[#161616]">
                      {isRTL ? 'الصناعة' : 'Industry'}
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                      className={`w-full h-14 px-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] ${
                        errors.industry ? 'border-red-500 border-2' : 'border-gray-200'
                      }`}
                    >
                      <option value="">{isRTL ? 'اختر الصناعة' : 'Select Industry'}</option>
                      {industryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {isRTL ? option.labelAr : option.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.industry === 'other' && (
                    <div>
                      <label className="block text-sm font-bold mb-2 text-[#161616]">
                        {isRTL ? 'النشاط التجاري' : 'Business Activity'} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.otherIndustry}
                        onChange={(e) => handleChange('otherIndustry', e.target.value)}
                        placeholder={isRTL ? 'اكتب نشاطك التجاري' : 'Describe your business activity'}
                        className={`h-14 text-lg ${errors.otherIndustry ? 'border-red-500 border-2' : 'border-gray-200'}`}
                      />
                      {errors.otherIndustry && <p className="text-red-500 text-sm mt-1">{errors.otherIndustry}</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        if (hasDynamicFields) {
          const stepFields = dynamicFields.filter(f => f.step === 4);
          if (stepFields.length > 0) return renderDynamicStepFields(4);
        }
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Badge className="bg-[#25D366] text-white border-none px-4 py-2 text-sm mb-3">
                <Target className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'ml-2'}`} />
                {isRTL ? 'الهدف من الخدمة' : 'Service Goal'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#161616]">
                {isRTL ? 'الهدف من الخدمة' : 'Service Goal'}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {isRTL ? 'ما الذي تريد تحقيقه من خدمة واتساب؟' : 'What do you want to achieve with WhatsApp service?'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {isRTL ? '(يمكنك اختيار أكثر من هدف)' : '(You can select multiple goals)'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {goalOptions.map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedGoals.includes(option.value) 
                      ? 'ring-2 ring-[#25D366] bg-green-50 border-[#25D366]' 
                      : 'border-2 border-gray-200 hover:border-[#25D366]'
                  }`}
                  onClick={() => toggleGoal(option.value)}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedGoals.includes(option.value) 
                        ? 'border-[#25D366] bg-[#25D366]' 
                        : 'border-gray-300'
                    }`}>
                      {selectedGoals.includes(option.value) && <CheckCircle className="w-5 h-5 text-white" />}
                    </div>
                    <span className="font-bold text-lg">{isRTL ? option.labelAr : option.labelEn}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            {errors.goal && <p className="text-center text-red-500 text-sm mt-4">{errors.goal}</p>}
          </div>
        );

      case 5:
        if (hasDynamicFields) {
          const stepFields = dynamicFields.filter(f => f.step === 5);
          if (stepFields.length > 0) return renderDynamicStepFields(5);
        }
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Badge className="bg-[#25D366] text-white border-none px-4 py-2 text-sm mb-3">
                <Users className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'ml-2'}`} />
                {isRTL ? 'عدد الموظفين' : 'Employees'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#161616]">
                {isRTL ? 'عدد الموظفين' : 'Number of Employees'}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {isRTL ? 'كم عدد الموظفين في شركتك؟' : 'How many employees does your company have?'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {employeeCountOptions.map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    formData.employeeCount === option.value 
                      ? 'ring-2 ring-[#25D366] bg-green-50 border-[#25D366]' 
                      : 'border-2 border-gray-200 hover:border-[#25D366]'
                  }`}
                  onClick={() => {
                    handleChange('employeeCount', option.value);
                    setErrors(prev => ({ ...prev, employeeCount: '' }));
                  }}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.employeeCount === option.value 
                        ? 'border-[#25D366] bg-[#25D366]' 
                        : 'border-gray-300'
                    }`}>
                      {formData.employeeCount === option.value && <CheckCircle className="w-5 h-5 text-white" />}
                    </div>
                    <span className="font-bold text-lg">{isRTL ? option.labelAr : option.labelEn}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            {errors.employeeCount && <p className="text-center text-red-500 text-sm mt-4">{errors.employeeCount}</p>}
          </div>
        );

      case 6:
        const selectedPlan = pricingPlans.find(p => p.id === formData.planId);
        const selectedTier = selectedPlan?.tiers.find(t => t.name === formData.tierId);

        const renderDynamicReviewFields = (stepNumber: number) => {
          const fields = dynamicFields.filter(f => f.step === stepNumber);
          if (fields.length === 0) return null;
          return fields.map(field => {
            const val = dynamicFormData[field.id];
            const displayVal = Array.isArray(val) ? val.join(', ') : val || '-';
            const label = isRTL ? field.labelAr : field.labelEn;
            let displayLabel = label;
            if (field.type === 'select' || field.type === 'radio') {
              const opt = field.options.find(o => o.value === val);
              displayLabel = label;
              const displayValue = opt ? (isRTL ? opt.labelAr : opt.labelEn) : displayVal;
              return (
                <div key={field.id}>
                  <p className="text-sm text-gray-500">{displayLabel}</p>
                  <p className="font-bold text-[#161616]">{displayValue}</p>
                </div>
              );
            }
            if (field.type === 'multiselect' && Array.isArray(val)) {
              const labels = val.map(v => {
                const opt = field.options.find(o => o.value === v);
                return opt ? (isRTL ? opt.labelAr : opt.labelEn) : v;
              });
              return (
                <div key={field.id}>
                  <p className="text-sm text-gray-500">{displayLabel}</p>
                  <p className="font-bold text-[#161616]">{labels.join(', ')}</p>
                </div>
              );
            }
            return (
              <div key={field.id}>
                <p className="text-sm text-gray-500">{displayLabel}</p>
                <p className="font-bold text-[#161616]" dir={field.type === 'email' || field.type === 'tel' ? 'ltr' : undefined}>{displayVal}</p>
              </div>
            );
          });
        };

        if (hasDynamicFields) {
          const dynamicSteps = [2, 3, 4, 5].filter(s => dynamicFields.some(f => f.step === s));
          const stepColors: Record<number, string> = { 2: 'from-blue-500 to-blue-600', 3: 'from-purple-500 to-purple-600', 4: 'from-orange-500 to-orange-600', 5: 'from-teal-500 to-teal-600' };
          const stepIcons: Record<number, React.ElementType> = { 2: Users, 3: Building2, 4: Target, 5: Users };

          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Badge className="bg-[#F15822] text-white border-none px-4 py-2 text-sm mb-3">
                  <Sparkles className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'ml-2'}`} />
                  {isRTL ? 'مراجعة الطلب' : 'Review Request'}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#161616]">
                  {isRTL ? 'مراجعة وإرسال' : 'Review & Submit'}
                </h2>
                <p className="text-gray-600 mt-2 text-lg">
                  {isRTL ? 'راجع بيانات طلبك قبل الإرسال' : 'Review your request before submitting'}
                </p>
              </div>
              <div className="max-w-2xl mx-auto space-y-4">
                <Card className="border-2 border-gray-100 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-4">
                    <h3 className="text-white text-xl font-bold flex items-center gap-2">
                      <MessageCircle className="w-6 h-6" />
                      {isRTL ? 'الباقة المختارة' : 'Selected Package'}
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <p className="text-2xl font-extrabold text-[#161616]">
                          {selectedPlan?.name}
                        </p>
                        <p className="text-lg text-gray-600">{selectedTier?.name}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-3xl font-extrabold text-[#25D366]">
                          {selectedTier?.price}
                          <span className="text-sm text-gray-500"> {isRTL ? 'ر.س/شهر' : 'SAR/mo'}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {dynamicSteps.map(step => {
                  const StepIcon = stepIcons[step] || Users;
                  const stepLabelAr = { 2: 'بيانات التواصل', 3: 'بيانات الشركة', 4: 'الهدف من الخدمة', 5: 'تفاصيل إضافية' }[step] || `الخطوة ${step}`;
                  const stepLabelEn = { 2: 'Contact Info', 3: 'Company Info', 4: 'Service Goal', 5: 'Additional Details' }[step] || `Step ${step}`;
                  return (
                    <Card key={step} className="border-2 border-gray-100 shadow-lg overflow-hidden">
                      <div className={`bg-gradient-to-r ${stepColors[step] || 'from-gray-500 to-gray-600'} px-6 py-4`}>
                        <h3 className="text-white text-xl font-bold flex items-center gap-2">
                          <StepIcon className="w-6 h-6" />
                          {isRTL ? stepLabelAr : stepLabelEn}
                        </h3>
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          {renderDynamicReviewFields(step)}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        }

        const selectedIndustry = industryOptions.find(i => i.value === formData.industry);
        const displayIndustry = formData.industry === 'other' 
          ? formData.otherIndustry 
          : (selectedIndustry ? (isRTL ? selectedIndustry.labelAr : selectedIndustry.labelEn) : '-');
        
        const selectedEmployees = employeeCountOptions.find(e => e.value === formData.employeeCount);

        const selectedGoalsLabels = selectedGoals.map(g => {
          const goal = goalOptions.find(o => o.value === g);
          return goal ? (isRTL ? goal.labelAr : goal.labelEn) : g;
        }).join(', ');

        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Badge className="bg-[#F15822] text-white border-none px-4 py-2 text-sm mb-3">
                <Sparkles className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'ml-2'}`} />
                {isRTL ? 'مراجعة الطلب' : 'Review Request'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#161616]">
                {isRTL ? 'مراجعة وإرسال' : 'Review & Submit'}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {isRTL ? 'راجع بيانات طلبك قبل الإرسال' : 'Review your request before submitting'}
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              <Card className="border-2 border-gray-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-4">
                  <h3 className="text-white text-xl font-bold flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    {isRTL ? 'الباقة المختارة' : 'Selected Package'}
                  </h3>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <p className="text-2xl font-extrabold text-[#161616]">
                        {selectedPlan?.name}
                      </p>
                      <p className="text-lg text-gray-600">{selectedTier?.name}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-3xl font-extrabold text-[#25D366]">
                        {selectedTier?.price}
                        <span className="text-sm text-gray-500"> {isRTL ? 'ر.س/شهر' : 'SAR/mo'}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <h3 className="text-white text-xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    {isRTL ? 'بيانات التواصل' : 'Contact Info'}
                  </h3>
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{isRTL ? 'الاسم' : 'Name'}</p>
                      <p className="font-bold text-[#161616]">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{isRTL ? 'البريد' : 'Email'}</p>
                      <p className="font-bold text-[#161616]" dir="ltr">{formData.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">{isRTL ? 'الهاتف' : 'Phone'}</p>
                      <p className="font-bold text-[#161616]" dir="ltr">{formData.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                  <h3 className="text-white text-xl font-bold flex items-center gap-2">
                    <Building2 className="w-6 h-6" />
                    {isRTL ? 'بيانات الشركة' : 'Company Info'}
                  </h3>
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{isRTL ? 'الشركة' : 'Company'}</p>
                      <p className="font-bold text-[#161616]">{formData.companyName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{isRTL ? 'الصناعة' : 'Industry'}</p>
                      <p className="font-bold text-[#161616]">{displayIndustry}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                  <h3 className="text-white text-xl font-bold flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    {isRTL ? 'الهدف والموظفين' : 'Goal & Employees'}
                  </h3>
                </div>
                <CardContent className="p-6 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? 'الأهداف' : 'Goals'}</p>
                    <p className="font-bold text-[#161616]">{selectedGoalsLabels}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{isRTL ? 'عدد الموظفين' : 'Employees'}</p>
                    <p className="font-bold text-[#161616]">
                      {selectedEmployees ? (isRTL ? selectedEmployees.labelAr : selectedEmployees.labelEn) : '-'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isFormInactive) {
    return (
      <div className={`min-h-[70vh] bg-gradient-to-br from-green-50 to-white ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center">
            <Ban className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold text-[#161616] mb-4">
              {isRTL ? 'هذه الخدمة غير متاحة حالياً' : 'This service is currently unavailable'}
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              {isRTL ? 'عذراً، تم تعطيل هذه الخدمة مؤقتاً. يرجى التواصل معنا للمزيد من المعلومات.' : 'Sorry, this service has been temporarily disabled. Please contact us for more information.'}
            </p>
            <div className="flex gap-4 justify-center">
              <a href="tel:+966500000000" className="inline-flex items-center gap-2 px-6 py-3 bg-[#128C7E] text-white rounded-lg hover:bg-[#0d6b5f] transition-colors font-bold">
                <Phone className="w-5 h-5" /> {isRTL ? 'اتصل بنا' : 'Call Us'}
              </a>
              <a href="mailto:info@orbit.sa" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#128C7E] text-[#128C7E] rounded-lg hover:bg-[#128C7E]/5 transition-colors font-bold">
                <Mail className="w-5 h-5" /> {isRTL ? 'راسلنا' : 'Email Us'}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className={`min-h-[70vh] bg-gradient-to-br from-green-50 to-white ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#25D366]/30">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#161616] mb-4">
              {isRTL 
                ? (thankYouMessage.ar || 'تم إرسال طلبك بنجاح!') 
                : (thankYouMessage.en || 'Request Submitted!')}
            </h1>
            {!thankYouMessage.ar && !thankYouMessage.en ? (
              <p className="text-gray-600 text-lg mb-8">
                {isRTL 
                  ? 'شكراً لطلبك خدمة واتساب أعمال API. سيقوم فريق المبيعات بالتواصل معك خلال 24 ساعة.'
                  : 'Thank you for your WhatsApp Business API request. Our sales team will contact you within 24 hours.'}
              </p>
            ) : <div className="mb-8" />}
            <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">
                {isRTL ? 'رقم الطلب' : 'Request ID'}
              </p>
              <p className="text-2xl font-extrabold text-[#161616]" dir="ltr">
                WA-{Date.now().toString().slice(-8)}
              </p>
            </div>
            <Button 
              className="bg-[#128C7E] hover:bg-[#0d6b5f] h-14 px-8 text-lg font-bold"
              onClick={() => window.location.href = '/'}
            >
              {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-[70vh] bg-gradient-to-br from-white via-green-50/30 to-orange-50/20 ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 pt-28 pb-12 md:pt-32 md:pb-16">
        {(title.ar || title.en) && (
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#161616] mb-4">
              {isRTL ? (title.ar || title.en) : (title.en || title.ar)}
            </h1>
            <div className="w-24 h-1.5 bg-[#128C7E] mx-auto rounded-full" />
          </div>
        )}
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    currentStep > step.id 
                      ? 'bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30' 
                      : currentStep === step.id 
                        ? 'bg-[#128C7E] text-white shadow-lg shadow-[#128C7E]/30 scale-110' 
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.id}
                  </div>
                  <span className="text-xs mt-2 font-medium hidden md:block text-gray-600">{isRTL ? step.labelAr : step.labelEn}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-2 mx-2 rounded-full transition-all ${
                    currentStep > step.id ? 'bg-[#25D366]' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-5xl mx-auto">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < totalSteps && (
          <div className="flex justify-between mt-10 max-w-2xl mx-auto">
            <Button 
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-8 h-12 text-lg border-2 border-gray-300 hover:border-gray-400"
            >
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'السابق' : 'Back'}
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-[#128C7E] hover:bg-[#0d6b5f] px-10 h-12 text-lg font-bold shadow-lg shadow-[#128C7E]/30"
            >
              {isRTL ? 'التالي' : 'Next'}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </div>
        )}

        {currentStep === 6 && (
          <div className="flex justify-center mt-10">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#25D366] hover:bg-[#1da954] px-16 h-14 text-xl font-bold shadow-xl shadow-[#25D366]/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin ml-2" />
                  {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Send className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'إرسال الطلب' : 'Submit Request'}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
