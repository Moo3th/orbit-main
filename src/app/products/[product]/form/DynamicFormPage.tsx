'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/business/ui/button';
import { Input } from '@/components/business/ui/input';
import { Textarea } from '@/components/business/ui/textarea';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Ban, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { CmsPage } from '@/lib/cms/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormField {
  id: string;
  type: string;
  labelAr: string;
  labelEn: string;
  placeholderAr: string;
  placeholderEn: string;
  required: boolean;
  step: number;
  min: number;
  max: number;
  stepSize: number;
  ratingType?: 'star' | 'emoji' | 'number';
  options: { value: string; labelAr: string; labelEn: string }[];
  htmlContent?: string;
  spacingSize?: 'sm' | 'md' | 'lg' | 'xl';
}

interface Props {
  productId: string;
  cmsPage: CmsPage | null;
}

export const DynamicFormPage = ({ productId, cmsPage: _cmsPage }: Props) => {
  const { isRTL } = useLanguage();
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isFormInactive, setIsFormInactive] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [formType, setFormType] = useState<'service' | 'survey'>('service');
  const [displayMode, setDisplayMode] = useState<'wizard' | 'single'>('wizard');
  const [closedMessage, setClosedMessage] = useState({ ar: '', en: '' });
  const [title, setTitle] = useState({ ar: '', en: '' });
  const [thankYouMessage, setThankYouMessage] = useState({ ar: '', en: '' });
  const [colors, setColors] = useState({
    primary: '#7A1E2E',
    buttonText: '#FFFFFF',
    buttonHover: '#601824'
  });
  const [optionSelectedTextColor, setOptionSelectedTextColor] = useState('#FFFFFF');
  const [showRefillButton, setShowRefillButton] = useState(false);
  const [showBackToFormButton, setShowBackToFormButton] = useState(false);
  const [formBgColor, setFormBgColor] = useState('#f9fafb');
  const [formCardBgColor, setFormCardBgColor] = useState('#ffffff');
  const [formTitleColor, setFormTitleColor] = useState('#161616');
  const [fieldLabelColor, setFieldLabelColor] = useState('#374151');
  const [fieldBorderColor, setFieldBorderColor] = useState('#d1d5db');
  const [optionBgColor, setOptionBgColor] = useState('#ffffff');
  const [optionBorderColor, setOptionBorderColor] = useState('#e5e7eb');
  const [optionTextColor, setOptionTextColor] = useState('#111827');
  const [successColor, setSuccessColor] = useState('#16a34a');
  const formRef = useRef<HTMLDivElement>(null);

  // Theme configuration using CSS variables
  const theme = {
    primary: 'bg-[var(--primary-color)]',
    text: 'text-[var(--primary-color)]',
    border: 'border-[var(--primary-color)]',
    focus: 'focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]',
    accent: 'accent-[var(--primary-color)]'
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/form-configs/${productId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            if (data.config.isActive === false) {
              setIsFormInactive(true);
              return;
            }
            if (data.config.acceptingResponses === false) {
              setIsClosed(true);
              setClosedMessage({ ar: data.config.closedMessageAr || '', en: data.config.closedMessageEn || '' });
              return;
            }
            setFormType(data.config.formType || 'service');
            setDisplayMode(data.config.displayMode || 'wizard');
            setTitle({ ar: data.config.titleAr || '', en: data.config.titleEn || '' });
            setThankYouMessage({ ar: data.config.thankYouMessageAr || '', en: data.config.thankYouMessageEn || '' });
            
            // Set colors from config or defaults based on form type
            const isSurvey = data.config.formType === 'survey';
            setColors({
              primary: data.config.primaryColor || (isSurvey ? '#8B5CF6' : '#7A1E2E'),
              buttonText: data.config.buttonTextColor || '#FFFFFF',
              buttonHover: data.config.buttonHoverColor || (isSurvey ? '#7C3AED' : '#601824')
            });
            setOptionSelectedTextColor(data.config.optionSelectedTextColor || '#FFFFFF');
            setShowRefillButton(data.config.showRefillButton || false);
            setShowBackToFormButton(data.config.showBackToFormButton || false);
            setFormBgColor(data.config.formBgColor || '#f9fafb');
            setFormCardBgColor(data.config.formCardBgColor || '#ffffff');
            setFormTitleColor(data.config.formTitleColor || '#161616');
            setFieldLabelColor(data.config.fieldLabelColor || '#374151');
            setFieldBorderColor(data.config.fieldBorderColor || '#d1d5db');
            setOptionBgColor(data.config.optionBgColor || '#ffffff');
            setOptionBorderColor(data.config.optionBorderColor || '#e5e7eb');
            setOptionTextColor(data.config.optionTextColor || '#111827');
            setSuccessColor(data.config.successColor || '#16a34a');

            if (data.config.fields && data.config.fields.length > 0) {
              setFields(data.config.fields);
              const initial: Record<string, string | string[]> = {};
              data.config.fields.forEach((f: FormField) => {
                initial[f.id] = f.type === 'multiselect' ? [] : '';
              });
              setFormData(initial);
              setCurrentStep(Math.min(...data.config.fields.map((f: FormField) => f.step), 2));
            }
          }
        }
      } catch (e) { console.error('Failed to fetch form config:', e); }
      finally { setLoading(false); }
    };
    fetchConfig();
  }, [productId]);

  // Update CSS variables on color change - scoped to form element only
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    el.style.setProperty('--primary-color', colors.primary);
    el.style.setProperty('--button-text-color', colors.buttonText);
    el.style.setProperty('--button-hover-color', colors.buttonHover);
    el.style.setProperty('--option-selected-text-color', optionSelectedTextColor);
    el.style.setProperty('--form-bg-color', formBgColor);
    el.style.setProperty('--form-card-bg-color', formCardBgColor);
    el.style.setProperty('--form-title-color', formTitleColor);
    el.style.setProperty('--field-label-color', fieldLabelColor);
    el.style.setProperty('--field-border-color', fieldBorderColor);
    el.style.setProperty('--option-bg-color', optionBgColor);
    el.style.setProperty('--option-border-color', optionBorderColor);
    el.style.setProperty('--option-text-color', optionTextColor);
    el.style.setProperty('--success-color', successColor);
  }, [colors, optionSelectedTextColor, formBgColor, formCardBgColor, formTitleColor, fieldLabelColor, fieldBorderColor, optionBgColor, optionBorderColor, optionTextColor, successColor]);

  const stepNumbers = Array.from(new Set(fields.map(f => f.step))).sort((a, b) => a - b);
  const maxStep = stepNumbers.length > 0 ? stepNumbers[stepNumbers.length - 1] : 1;
  const stepFields = (step: number) => fields.filter(f => f.step === step);

  const handleChange = (fieldId: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) setErrors(prev => ({ ...prev, [fieldId]: '' }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    stepFields(step).forEach(field => {
      if (!field.required) return;
      const val = formData[field.id];
      if (field.type === 'multiselect') {
        if (!Array.isArray(val) || val.length === 0) {
          newErrors[field.id] = isRTL ? 'يرجى اختيار خيار واحد على الأقل' : 'Please select at least one option';
        }
      } else if (!val || (typeof val === 'string' && !val.trim())) {
        newErrors[field.id] = isRTL ? `يرجى إدخال ${field.labelAr}` : `Please enter ${field.labelEn}`;
      }
      if (field.type === 'email' && val && typeof val === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        newErrors[field.id] = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address';
      }
      if (field.type === 'tel' && val && typeof val === 'string' && !/^\+?[0-9]{9,15}$/.test(val.replace(/[\s\-()]/g, ''))) {
        newErrors[field.id] = isRTL ? 'رقم الهاتف غير صحيح' : 'Invalid phone number';
      }
    });
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => { if (currentStep > Math.min(...stepNumbers)) setCurrentStep(currentStep - 1); };

  const handleRefill = () => {
    const initial: Record<string, string | string[]> = {};
    fields.forEach(f => {
      initial[f.id] = f.type === 'multiselect' ? [] : '';
    });
    setFormData(initial);
    setCurrentStep(Math.min(...fields.map(f => f.step), 2));
    setErrors({});
    setIsComplete(false);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/form-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, data: formData }),
      });
      if (res.ok) { setIsComplete(true); toast.success(isRTL ? 'تم إرسال طلبك بنجاح!' : 'Request submitted successfully!'); }
      else { const err = await res.json(); toast.error(err.error || (isRTL ? 'حدث خطأ' : 'Error occurred')); }
    } catch { toast.error(isRTL ? 'حدث خطأ' : 'Error occurred'); }
    finally { setIsSubmitting(false); }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] ?? (field.type === 'multiselect' ? [] : '');
    const label = isRTL ? field.labelAr : field.labelEn;
    const placeholder = isRTL ? field.placeholderAr : field.placeholderEn;
    const error = errors[field.id];

    const fieldContent = (() => {
      switch (field.type) {
        case 'textarea':
          return <Textarea value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} rows={3} className="text-gray-900" style={{ borderColor: 'var(--field-border-color)' }} />;
        case 'email':
          return <Input type="email" value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} className="text-gray-900" style={{ borderColor: 'var(--field-border-color)' }} />;
        case 'tel':
          return <Input type="tel" value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} style={{ borderColor: 'var(--field-border-color)' }} dir="ltr" />;
        case 'number':
          return <Input type="number" value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} className="text-gray-900" style={{ borderColor: 'var(--field-border-color)' }} />;
        case 'select':
          return <select value={value as string} onChange={e => handleChange(field.id, e.target.value)} className="w-full rounded-lg p-3 text-sm" style={{ borderColor: 'var(--field-border-color)', color: 'var(--option-text-color)' }}><option value="">{placeholder}</option>{field.options.map((opt, i) => <option key={i} value={opt.value}>{isRTL ? opt.labelAr : opt.labelEn}</option>)}</select>;
        case 'multiselect':
          return <div className="space-y-2">{field.options.map((opt, i) => { const selected = Array.isArray(value) ? value.includes(opt.value) : false; return <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all`} style={selected ? { backgroundColor: 'var(--primary-color)', color: 'var(--option-selected-text-color)', borderColor: 'var(--primary-color)' } : { backgroundColor: 'var(--option-bg-color)', color: 'var(--option-text-color)', borderColor: 'var(--option-border-color)' }}><input type="checkbox" checked={selected} onChange={() => { const arr = Array.isArray(value) ? [...value] : []; handleChange(field.id, selected ? arr.filter((v: string) => v !== opt.value) : [...arr, opt.value]); }} className={`w-4 h-4 ${selected ? '' : theme.accent}`} style={selected ? { accentColor: 'var(--option-selected-text-color)' } : {}} /><span className={`text-sm font-medium`}>{isRTL ? opt.labelAr : opt.labelEn}</span></label>; })}</div>;
        case 'radio':
          return <div className="space-y-2">{field.options.map((opt, i) => <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all`} style={value === opt.value ? { backgroundColor: 'var(--primary-color)', color: 'var(--option-selected-text-color)', borderColor: 'var(--primary-color)' } : { backgroundColor: 'var(--option-bg-color)', color: 'var(--option-text-color)', borderColor: 'var(--option-border-color)' }}><input type="radio" name={field.id} value={opt.value} checked={value === opt.value} onChange={() => handleChange(field.id, opt.value)} className={`w-4 h-4 ${value === opt.value ? '' : theme.accent}`} style={value === opt.value ? { accentColor: 'var(--option-selected-text-color)' } : {}} /><span className="text-sm font-medium">{isRTL ? opt.labelAr : opt.labelEn}</span></label>)}</div>;
        case 'rating':
          const ratingType = field.ratingType || 'number';
          const maxRating = field.max || 5;
          const emojis = ['😠', '🙁', '😐', '🙂', '🤩'];
          
          return (
            <div className="flex flex-wrap gap-2 justify-center py-2">
              {Array.from({ length: maxRating }, (_, i) => {
                const ratingValue = String(i + 1);
                const isSelected = value === ratingValue;
                
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleChange(field.id, ratingValue)}
                    className={`
                      relative group transition-all duration-200 transform hover:scale-110
                      ${ratingType === 'number' 
                        ? `w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold ${isSelected ? `${theme.border} ${theme.primary} text-[var(--button-text-color)] shadow-md` : 'border-gray-200 hover:border-gray-400 text-gray-600'}` 
                        : 'p-1'}
                    `}
                  >
                    {ratingType === 'star' && (
                      <svg 
                        className={`w-10 h-10 ${isSelected ? 'text-yellow-400 fill-current' : 'text-gray-300 group-hover:text-yellow-200'}`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    )}
                    {ratingType === 'emoji' && (
                      <span className={`text-4xl filter grayscale-[0.5] hover:grayscale-0 transition-all ${isSelected ? 'grayscale-0 scale-125 drop-shadow-md' : 'opacity-60'}`}>
                        {emojis[i] || '⭐'}
                      </span>
                    )}
                    {ratingType === 'number' && ratingValue}
                  </button>
                );
              })}
            </div>
          );
        case 'scale':
          return <div className="space-y-3"><input type="range" min={field.min || 1} max={field.max || 10} step={field.stepSize || 1} value={Number(value) || field.min || 1} onChange={e => handleChange(field.id, e.target.value)} className={`w-full ${theme.accent}`} /><div className="flex justify-between text-xs" style={{ color: 'var(--field-label-color)' }}><span>{field.min || 1}</span><span className="font-bold text-lg" style={{ color: 'var(--primary-color)' }}>{value || field.min || 1}</span><span>{field.max || 10}</span></div></div>;
        case 'date':
          return <Input type="date" value={value as string} onChange={e => handleChange(field.id, e.target.value)} className="text-gray-900" style={{ borderColor: 'var(--field-border-color)' }} />;
        case 'time':
          return <Input type="time" value={value as string} onChange={e => handleChange(field.id, e.target.value)} className="text-gray-900" style={{ borderColor: 'var(--field-border-color)' }} />;
        case 'file':
          return <Input type="file" onChange={e => { const f = (e.target as HTMLInputElement).files?.[0]; handleChange(field.id, f?.name || ''); }} className="text-gray-900" style={{ borderColor: 'var(--field-border-color)' }} />;
        case 'richtext':
          return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: field.htmlContent || '' }} />;
        case 'spacing': {
          const spacingMap: Record<string, string> = { sm: 'h-4', md: 'h-8', lg: 'h-16', xl: 'h-24' };
          return <div className={spacingMap[field.spacingSize || 'md'] || 'h-8'} />;
        }
        case 'divider':
          return <div className="border-t my-4" style={{ borderColor: 'var(--primary-color)', opacity: 0.3 }} />;
        default:
          return <Input type="text" value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} className="text-gray-900" style={{ borderColor: 'var(--field-border-color)' }} />;
      }
    })();

    const isDisplayOnly = ['richtext', 'spacing', 'divider'].includes(field.type);

    if (isDisplayOnly) {
      return (
        <div key={field.id}>
          {fieldContent}
        </div>
      );
    }

    return (
      <div key={field.id} className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: 'var(--field-label-color)' }}>
          {label}
          {field.required && <span className="text-red-500 mr-1">*</span>}
        </label>
        {fieldContent}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary-color)' }} /></div>;

  return (
    <div ref={formRef} style={{ '--primary-color': colors.primary, '--button-text-color': colors.buttonText, '--button-hover-color': colors.buttonHover, '--option-selected-text-color': optionSelectedTextColor, '--form-bg-color': formBgColor, '--form-card-bg-color': formCardBgColor, '--form-title-color': formTitleColor, '--field-label-color': fieldLabelColor, '--field-border-color': fieldBorderColor, '--option-bg-color': optionBgColor, '--option-border-color': optionBorderColor, '--option-text-color': optionTextColor, '--success-color': successColor } as React.CSSProperties}>
    {isFormInactive ? (
    <div className={`min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center p-8 ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Ban className="w-16 h-16 text-red-400" />
      <h2 className="text-2xl font-bold text-gray-900">{isRTL ? 'هذه الخدمة غير متاحة حالياً' : 'This service is currently unavailable'}</h2>
      <p className="text-gray-600 max-w-md">{isRTL ? 'عذراً، تم تعطيل هذه الخدمة مؤقتاً. يرجى التواصل معنا للمزيد من المعلومات.' : 'Sorry, this service has been temporarily disabled. Please contact us for more information.'}</p>
      <div className="flex gap-3">
        <a 
          href={`tel:+966500000000`} 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all font-medium"
          style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
        >
          <Phone className="w-4 h-4" /> {isRTL ? 'اتصل بنا' : 'Call Us'}
        </a>
        <a 
          href={`mailto:info@orbit.sa`} 
          className="inline-flex items-center gap-2 px-6 py-3 border-2 rounded-lg transition-all font-medium"
          style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
        >
          <Mail className="w-4 h-4" /> {isRTL ? 'راسلنا' : 'Email Us'}
        </a>
      </div>
    </div>
    ) : isClosed ? (
    <div className={`min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center p-8 ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
        <Ban className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">
        {isRTL ? 'توقف استقبال الردود' : 'Accepting Responses Stopped'}
      </h2>
      <p className="text-gray-600 max-w-md text-lg">
        {isRTL 
          ? (closedMessage.ar || 'نعتذر منك، لقد تم الانتهاء من جمع الردود لهذا النموذج. شكراً لاهتمامك.') 
          : (closedMessage.en || 'Sorry, we are no longer accepting responses for this form. Thank you for your interest.')}
      </p>
      <Link href="/" className="mt-4 hover:underline font-medium" style={{ color: 'var(--primary-color)' }}>{isRTL ? 'العودة للرئيسية' : 'Go to Home'}</Link>
    </div>
    ) : isComplete ? (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center p-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--success-color) 15%, transparent)', color: 'var(--success-color)' }}>
        <CheckCircle className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900">
        {isRTL 
          ? (thankYouMessage.ar || 'تم إرسال طلبك بنجاح!') 
          : (thankYouMessage.en || 'Request submitted successfully!')}
      </h2>
      {!thankYouMessage.ar && !thankYouMessage.en && (
        <p className="text-gray-600 text-lg">{isRTL ? 'سنتواصل معك قريباً' : 'We will contact you soon'}</p>
      )}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium border-2"
          style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
        >
          {isRTL ? 'العودة للرئيسية' : 'Go to Home'}
        </Link>
        {showRefillButton && (
          <button
            onClick={handleRefill}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium"
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--button-hover-color)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
          >
            {isRTL ? 'تعبئة النموذج مرة أخرى' : 'Fill Form Again'}
          </button>
        )}
        {showBackToFormButton && !showRefillButton && (
          <button
            onClick={handleRefill}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium"
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--button-hover-color)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
          >
            {isRTL ? 'العودة للنموذج' : 'Back to Form'}
          </button>
        )}
        {showBackToFormButton && showRefillButton && (
          <button
            onClick={handleRefill}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium border-2"
            style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color)', e.currentTarget.style.color = 'var(--button-text-color)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--primary-color)')}
          >
            {isRTL ? 'العودة للنموذج' : 'Back to Form'}
          </button>
        )}
      </div>
    </div>
    ) : fields.length === 0 ? (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
      <p className="text-gray-500 text-lg">{isRTL ? 'لا يوجد نموذج متاح لهذا المنتج حالياً' : 'No form available for this product at the moment'}</p>
      <Link href="/contact" className="text-[#7A1E2E] hover:underline font-medium">{isRTL ? 'تواصل معنا' : 'Contact Us'}</Link>
    </div>
    ) : (
    <div className={`${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'} py-12 md:py-20`} style={{ backgroundColor: 'var(--form-bg-color)' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto px-4">
        {(title.ar || title.en) && (
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--form-title-color)' }}>
              {isRTL ? (title.ar || title.en) : (title.en || title.ar)}
            </h1>
            <div className="w-20 h-1.5 mx-auto mt-4 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }} />
          </div>
        )}

        {displayMode === 'wizard' ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-8">
              {stepNumbers.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <button onClick={() => { if (step <= currentStep) setCurrentStep(step); }} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentStep === step ? `${theme.primary} text-white` : step < currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step < currentStep ? <CheckCircle className="w-4 h-4" /> : stepNumbers.indexOf(step) + 1}
                  </button>
                  {i < stepNumbers.length - 1 && <div className={`w-8 h-0.5 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            <div className="rounded-2xl shadow-lg p-6 md:p-8 space-y-5" style={{ backgroundColor: 'var(--form-card-bg-color)' }}>
              {stepFields(currentStep).map(field => renderField(field))}

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={handleBack} disabled={currentStep <= Math.min(...stepNumbers)} className="px-6">
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'mr-1' : 'mr-1'}`} /> {isRTL ? 'السابق' : 'Back'}
                </Button>
                {currentStep >= maxStep ? (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} 
                    className={`${theme.primary} text-[var(--button-text-color)] hover:opacity-90 px-8 transition-all`}
                    style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--button-hover-color)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                    {isRTL ? 'إرسال' : 'Submit'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext} 
                    className={`${theme.primary} text-[var(--button-text-color)] hover:opacity-90 px-6 transition-all`}
                    style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--button-hover-color)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
                  >
                    {isRTL ? 'التالي' : 'Next'} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl shadow-lg p-6 md:p-8 space-y-8" style={{ backgroundColor: 'var(--form-card-bg-color)' }}>
            <div className="space-y-6">
              {fields.map(field => renderField(field))}
            </div>
            <div className="pt-6 border-t">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className={`w-full ${theme.primary} text-[var(--button-text-color)] hover:opacity-90 h-14 text-lg font-bold transition-all`}
                style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--button-hover-color)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isRTL ? 'إرسال البيانات' : 'Submit Response'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    )}
    </div>
  );
};