'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/business/ui/button';
import { Input } from '@/components/business/ui/input';
import { Textarea } from '@/components/business/ui/textarea';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Ban, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

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
  options: { value: string; labelAr: string; labelEn: string }[];
}

interface Props {
  slug: string;
}

export const FormsFormPage = ({ slug }: Props) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(true);
  const [isFormInactive, setIsFormInactive] = useState(false);
  const [productId, setProductId] = useState<string>('');
  const [formNotFound, setFormNotFound] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/form-configs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            if (data.config.isActive === false) {
              setIsFormInactive(true);
              return;
            }
            setProductId(data.config.productId);
            if (data.config.fields && data.config.fields.length > 0) {
              setFields(data.config.fields);
              const initial: Record<string, string | string[]> = {};
              data.config.fields.forEach((f: FormField) => {
                initial[f.id] = f.type === 'multiselect' ? [] : '';
              });
              setFormData(initial);
              setCurrentStep(Math.min(...data.config.fields.map((f: FormField) => f.step)));
            }
          }
        } else {
          setFormNotFound(true);
        }
      } catch (e) {
        console.error('Failed to fetch form config:', e);
        setFormNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
    setIsRTL(typeof window !== 'undefined' && document.documentElement.dir === 'rtl');
  }, [slug]);

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
          return <Textarea value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} rows={3} className="border-gray-300 focus:border-[#7A1E2E] focus:ring-[#7A1E2E]" />;
        case 'email':
          return <Input type="email" value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} className="border-gray-300 focus:border-[#7A1E2E] focus:ring-[#7A1E2E]" />;
        case 'tel':
          return <Input type="tel" value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} className="border-gray-300 focus:border-[#7A1E2E] focus:ring-[#7A1E2E]" dir="ltr" />;
        case 'number':
          return <Input type="number" value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} className="border-gray-300 focus:border-[#7A1E2E] focus:ring-[#7A1E2E]" />;
        case 'select':
          return <select value={value as string} onChange={e => handleChange(field.id, e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#7A1E2E] focus:ring-[#7A1E2E]"><option value="">{placeholder}</option>{field.options.map((opt, i) => <option key={i} value={opt.value}>{isRTL ? opt.labelAr : opt.labelEn}</option>)}</select>;
        case 'multiselect':
          return <div className="space-y-2">{field.options.map((opt, i) => { const selected = Array.isArray(value) ? value.includes(opt.value) : false; return <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selected ? 'border-[#7A1E2E] bg-[#7A1E2E]/5' : 'border-gray-200 hover:border-[#7A1E2E]/30'}`}><input type="checkbox" checked={selected} onChange={() => { const arr = Array.isArray(value) ? [...value] : []; handleChange(field.id, selected ? arr.filter((v: string) => v !== opt.value) : [...arr, opt.value]); }} className="w-4 h-4 accent-[#7A1E2E]" /><span className="text-sm font-medium">{isRTL ? opt.labelAr : opt.labelEn}</span></label>; })}</div>;
        case 'radio':
          return <div className="space-y-2">{field.options.map((opt, i) => <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${value === opt.value ? 'border-[#7A1E2E] bg-[#7A1E2E]/5' : 'border-gray-200 hover:border-[#7A1E2E]/30'}`}><input type="radio" name={field.id} value={opt.value} checked={value === opt.value} onChange={() => handleChange(field.id, opt.value)} className="w-4 h-4 accent-[#7A1E2E]" /><span className="text-sm font-medium">{isRTL ? opt.labelAr : opt.labelEn}</span></label>)}</div>;
        case 'rating':
          return <div className="flex gap-1">{Array.from({ length: field.max || 10 }, (_, i) => <button key={i} type="button" onClick={() => handleChange(field.id, String(i + 1))} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${Number(value) === i + 1 ? 'border-[#7A1E2E] bg-[#7A1E2E] text-white' : 'border-gray-200 hover:border-[#7A1E2E]/50 text-gray-600'}`}>{i + 1}</button>)}</div>;
        case 'scale':
          return <div className="space-y-3"><input type="range" min={field.min || 1} max={field.max || 10} step={field.stepSize || 1} value={Number(value) || field.min || 1} onChange={e => handleChange(field.id, e.target.value)} className="w-full accent-[#7A1E2E]" /><div className="flex justify-between text-xs text-gray-500"><span>{field.min || 1}</span><span className="font-bold text-[#7A1E2E] text-lg">{value || field.min || 1}</span><span>{field.max || 10}</span></div></div>;
        case 'date':
          return <Input type="date" value={value as string} onChange={e => handleChange(field.id, e.target.value)} className="border-gray-300 focus:border-[#7A1E2E] focus:ring-[#7A1E2E]" />;
        case 'time':
          return <Input type="time" value={value as string} onChange={e => handleChange(field.id, e.target.value)} className="border-gray-300 focus:border-[#7A1E2E] focus:ring-[#7A1E2E]" />;
        case 'file':
          return <Input type="file" onChange={e => { const f = (e.target as HTMLInputElement).files?.[0]; handleChange(field.id, f?.name || ''); }} className="border-gray-300" />;
        default:
          return <Input type="text" value={value as string} onChange={e => handleChange(field.id, e.target.value)} placeholder={placeholder} className="border-gray-300 focus:border-[#7A1E2E] focus:ring-[#7A1E2E]" />;
      }
    })();

    return (
      <div key={field.id} className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {field.required && <span className="text-red-500 mr-1">*</span>}
        </label>
        {fieldContent}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-[#7A1E2E]" /></div>;

  if (isFormInactive) return (
    <div className={`min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center p-8 ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Ban className="w-16 h-16 text-red-400" />
      <h2 className="text-2xl font-bold text-gray-900">{isRTL ? 'هذه الخدمة غير متاحة حالياً' : 'This service is currently unavailable'}</h2>
      <p className="text-gray-600 max-w-md">{isRTL ? 'عذراً، تم تعطيل هذه الخدمة مؤقتاً. يرجى التواصل معنا للمزيد من المعلومات.' : 'Sorry, this service has been temporarily disabled. Please contact us for more information.'}</p>
      <div className="flex gap-3">
        <a href="tel:+966500000000" className="inline-flex items-center gap-2 px-6 py-3 bg-[#7A1E2E] text-white rounded-lg hover:bg-[#601824] transition-colors">
          <Phone className="w-4 h-4" /> {isRTL ? 'اتصل بنا' : 'Call Us'}
        </a>
        <a href="mailto:info@orbit.sa" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#7A1E2E] text-[#7A1E2E] rounded-lg hover:bg-[#7A1E2E]/5 transition-colors">
          <Mail className="w-4 h-4" /> {isRTL ? 'راسلنا' : 'Email Us'}
        </a>
      </div>
    </div>
  );

  if (formNotFound) return (
    <div className={`min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-8 ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-gray-900">{isRTL ? 'النموذج غير موجود' : 'Form Not Found'}</h2>
      <p className="text-gray-500">{isRTL ? 'لم يتم العثور على النموذج المطلوب' : 'The requested form could not be found'}</p>
      <Link href="/" className="text-[#7A1E2E] hover:underline font-medium">{isRTL ? 'العودة للرئيسية' : 'Go to Home'}</Link>
    </div>
  );

  if (isComplete) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
      <CheckCircle className="w-16 h-16 text-green-500" />
      <h2 className="text-2xl font-bold text-gray-900">{isRTL ? 'تم إرسال طلبك بنجاح!' : 'Request submitted successfully!'}</h2>
      <p className="text-gray-600">{isRTL ? 'سنتواصل معك قريباً' : 'We will contact you soon'}</p>
    </div>
  );
  if (fields.length === 0) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-gray-500">{isRTL ? 'لا يوجد نموذج متاح' : 'No form available'}</p></div>;

  return (
    <div className={`min-h-screen ${isRTL ? 'font-ibm-plex-arabic' : 'font-ibm-plex'} bg-gray-50`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepNumbers.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <button onClick={() => { if (step <= currentStep) setCurrentStep(step); }} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentStep === step ? 'bg-[#7A1E2E] text-white' : step < currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step < currentStep ? <CheckCircle className="w-4 h-4" /> : stepNumbers.indexOf(step) + 1}
              </button>
              {i < stepNumbers.length - 1 && <div className={`w-8 h-0.5 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-5">
          {stepFields(currentStep).map(field => renderField(field))}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack} disabled={currentStep <= Math.min(...stepNumbers)} className="px-6">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'mr-1' : 'mr-1'}`} /> {isRTL ? 'السابق' : 'Back'}
            </Button>
            {currentStep >= maxStep ? (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#7A1E2E] hover:bg-[#601824] text-white px-8">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                {isRTL ? 'إرسال' : 'Submit'}
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-[#7A1E2E] hover:bg-[#601824] text-white px-6">
                {isRTL ? 'التالي' : 'Next'} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'}`} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};