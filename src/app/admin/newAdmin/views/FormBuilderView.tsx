'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import * as XLSX from 'xlsx';
import { Button } from '@/components/business/ui/button';
import { Card, CardContent } from '@/components/business/ui/card';
import { Badge } from '@/components/business/ui/badge';
import {
  Plus, Trash2, ChevronUp, ChevronDown, Save, Eye,
  Loader2, ArrowRight, ArrowLeft, ListChecks, Edit3,
  ExternalLink, Mail, ToggleLeft, ToggleRight, Inbox,
  BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export type FormFieldType = 'text' | 'textarea' | 'email' | 'tel' | 'number' | 'select' | 'multiselect' | 'radio' | 'rating' | 'scale' | 'date' | 'time' | 'file';

export interface FormFieldOption {
  value: string;
  labelAr: string;
  labelEn: string;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  labelAr: string;
  labelEn: string;
  placeholderAr: string;
  placeholderEn: string;
  required: boolean;
  step: number;
  min: number;
  max: number;
  stepSize: number;
  options: FormFieldOption[];
}

export interface FormConfigData {
  productId: string;
  productName: string;
  productNameEn: string;
  titleAr?: string;
  titleEn?: string;
  thankYouMessageAr?: string;
  thankYouMessageEn?: string;
  formType: 'service' | 'survey';
  slug: string;
  customDomain?: string;
  notificationEmails: string;
  isActive: boolean;
  fields: FormField[];
  totalSubmissions?: number;
  todaySubmissions?: number;
}

const PRODUCTS = [
  { id: 'whatsapp', nameAr: 'واتساب', nameEn: 'WhatsApp', defaultSlug: 'whatsapp-request' },
  { id: 'otime', nameAr: 'O-Time', nameEn: 'O-Time', defaultSlug: 'otime-demo' },
  { id: 'govgate', nameAr: 'Gov Gate', nameEn: 'Gov Gate', defaultSlug: 'govgate-demo' },
];

const FORM_URLS: Record<string, string> = {
  whatsapp: '/products/whatsapp/request',
  otime: '/products/o-time/form',
  govgate: '/products/gov-gate/form',
};

const getFormUrl = (slug: string, productId: string, customDomain?: string) => {
  if (customDomain) {
    const path = slug.startsWith('/') ? slug : `/${slug}`;
    return `https://${customDomain}${path}`;
  }
  // Standard products have fixed URLs unless custom slug is used for custom forms
  if (FORM_URLS[productId] && !slug) return FORM_URLS[productId];
  
  return slug.startsWith('/') ? slug : `/${slug}`;
};

const FIELD_TYPES: { value: FormFieldType; labelAr: string; labelEn: string }[] = [
  { value: 'text', labelAr: 'نص قصير', labelEn: 'Short Text' },
  { value: 'textarea', labelAr: 'نص طويل', labelEn: 'Long Text' },
  { value: 'email', labelAr: 'بريد إلكتروني', labelEn: 'Email' },
  { value: 'tel', labelAr: 'رقم هاتف', labelEn: 'Phone' },
  { value: 'number', labelAr: 'رقم', labelEn: 'Number' },
  { value: 'select', labelAr: 'قائمة منسدلة', labelEn: 'Dropdown' },
  { value: 'multiselect', labelAr: 'اختيار متعدد', labelEn: 'Multi-Select' },
  { value: 'radio', labelAr: 'اختيار واحد', labelEn: 'Radio' },
  { value: 'rating', labelAr: 'تقييم (نجوم)', labelEn: 'Rating (Stars)' },
  { value: 'scale', labelAr: 'مقياس رقمي', labelEn: 'Numeric Scale' },
  { value: 'date', labelAr: 'تاريخ', labelEn: 'Date' },
  { value: 'time', labelAr: 'وقت', labelEn: 'Time' },
  { value: 'file', labelAr: 'رفع ملف', labelEn: 'File Upload' },
];

const DEFAULT_WHATSAPP_FIELDS: FormField[] = [
  { id: 'name', type: 'text', labelAr: 'الاسم الكامل', labelEn: 'Full Name', placeholderAr: 'أدخل اسمك الكامل', placeholderEn: 'Enter your full name', required: true, step: 2, min: 1, max: 10, stepSize: 1, options: [] },
  { id: 'email', type: 'email', labelAr: 'البريد الإلكتروني', labelEn: 'Email', placeholderAr: 'أدخل بريدك الإلكتروني', placeholderEn: 'Enter your email', required: true, step: 2, min: 1, max: 10, stepSize: 1, options: [] },
  { id: 'phone', type: 'tel', labelAr: 'رقم الجوال', labelEn: 'Phone Number', placeholderAr: '05XXXXXXXX', placeholderEn: '05XXXXXXXX', required: true, step: 2, min: 1, max: 10, stepSize: 1, options: [] },
  { id: 'companyName', type: 'text', labelAr: 'اسم الشركة', labelEn: 'Company Name', placeholderAr: 'أدخل اسم الشركة', placeholderEn: 'Enter company name', required: false, step: 3, min: 1, max: 10, stepSize: 1, options: [] },
  { id: 'industry', type: 'select', labelAr: 'الصناعة', labelEn: 'Industry', placeholderAr: 'اختر الصناعة', placeholderEn: 'Select industry', required: true, step: 3, min: 1, max: 10, stepSize: 1, options: [
    { value: 'retail', labelAr: 'تجزئة ومبيعات', labelEn: 'Retail & Sales' },
    { value: 'restaurants', labelAr: 'مطاعم وكافيهات', labelEn: 'Restaurants & Cafes' },
    { value: 'healthcare', labelAr: 'صحة وعناية صحية', labelEn: 'Healthcare' },
    { value: 'education', labelAr: 'تعليم', labelEn: 'Education' },
    { value: 'realestate', labelAr: 'عقارات', labelEn: 'Real Estate' },
    { value: 'logistics', labelAr: 'لوجستيات ونقل', labelEn: 'Logistics & Transport' },
    { value: 'banking', labelAr: 'بنوك ومالية', labelEn: 'Banking & Finance' },
    { value: 'government', labelAr: 'حكومي', labelEn: 'Government' },
    { value: 'technology', labelAr: 'تكنولوجيا', labelEn: 'Technology' },
    { value: 'other', labelAr: 'أخرى', labelEn: 'Other' },
  ] },
  { id: 'goal', type: 'multiselect', labelAr: 'أهداف الخدمة', labelEn: 'Service Goals', placeholderAr: 'اختر أهداف الخدمة', placeholderEn: 'Select service goals', required: false, step: 4, min: 1, max: 10, stepSize: 1, options: [
    { value: 'customer-support', labelAr: 'دعم العملاء', labelEn: 'Customer Support' },
    { value: 'sales', labelAr: 'مبيعات وتسويق', labelEn: 'Sales & Marketing' },
    { value: 'notifications', labelAr: 'إشعارات آلية', labelEn: 'Automated Notifications' },
    { value: 'internal-communication', labelAr: 'تواصل داخلي', labelEn: 'Internal Communication' },
  ] },
  { id: 'employeeCount', type: 'radio', labelAr: 'عدد الموظفين', labelEn: 'Employee Count', placeholderAr: '', placeholderEn: '', required: true, step: 5, min: 1, max: 10, stepSize: 1, options: [
    { value: '1-10', labelAr: '1 - 10 موظفين', labelEn: '1 - 10 employees' },
    { value: '11-50', labelAr: '11 - 50 موظف', labelEn: '11 - 50 employees' },
    { value: '51-100', labelAr: '51 - 100 موظف', labelEn: '51 - 100 employees' },
    { value: '101-500', labelAr: '101 - 500 موظف', labelEn: '101 - 500 employees' },
    { value: '500+', labelAr: 'أكثر من 500', labelEn: '500+ employees' },
  ] },
  { id: 'notes', type: 'textarea', labelAr: 'ملاحظات', labelEn: 'Notes', placeholderAr: 'أي ملاحظات إضافية', placeholderEn: 'Any additional notes', required: false, step: 6, min: 1, max: 10, stepSize: 1, options: [] },
];

const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

interface Props {
  isAr: boolean;
}

type ViewMode = 'list' | 'edit' | 'submissions' | 'analytics';

export const FormBuilderView = ({ isAr }: Props) => {
  const [configs, setConfigs] = useState<FormConfigData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('whatsapp');
  const [fields, setFields] = useState<FormField[]>([]);
  const [slug, setSlug] = useState('');
  const [notificationEmails, setNotificationEmails] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [customDomain, setCustomDomain] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [thankYouMessageAr, setThankYouMessageAr] = useState('');
  const [thankYouMessageEn, setThankYouMessageEn] = useState('');
  const [formType, setFormType] = useState<'service' | 'survey'>('service');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [newFormMode, setNewFormMode] = useState(false);
  const [showNewFormDialog, setShowNewFormDialog] = useState(false);
  const [newFormProductId, setNewFormProductId] = useState('');
  const [newFormNameAr, setNewFormNameAr] = useState('');
  const [newFormNameEn, setNewFormNameEn] = useState('');
  const [newFormNameSlug, setNewFormSlug] = useState('');

  const t = isAr ? (ar: string, _en: string) => ar : (_ar: string, en: string) => en;

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/form-configs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setConfigs(data.configs || []);
    } catch (err) {
      console.error('Error fetching form configs:', err);
      toast.error(isAr ? 'فشل في تحميل النماذج' : 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  }, [isAr]);

  useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

  const loadProductConfig = useCallback((productId: string) => {
    setSelectedProduct(productId);
    const config = configs.find(c => c.productId === productId);
    if (config) {
      setFields(config.fields || []);
      setSlug(config.slug || productId);
      setNotificationEmails(config.notificationEmails || '');
      setIsActive(config.isActive !== false);
      setCustomDomain(config.customDomain || '');
      setTitleAr(config.titleAr || '');
      setTitleEn(config.titleEn || '');
      setThankYouMessageAr(config.thankYouMessageAr || '');
      setThankYouMessageEn(config.thankYouMessageEn || '');
      setFormType(config.formType || 'service');
    } else {
      setFields(productId === 'whatsapp' ? DEFAULT_WHATSAPP_FIELDS : []);
      setSlug(FORM_URLS[productId]?.replace('/products/', '').replace('/form', '').replace('/request', '') || productId);
      setNotificationEmails('');
      setIsActive(true);
      setCustomDomain('');
      setTitleAr('');
      setTitleEn('');
      setThankYouMessageAr('');
      setThankYouMessageEn('');
      setFormType('service');
    }
    setViewMode('edit');
  }, [configs]);

  const handleAddField = () => {
    setFields([...fields, {
      id: generateId(), type: 'text', labelAr: '', labelEn: '', placeholderAr: '', placeholderEn: '',
      required: false, step: 2, min: 1, max: 10, stepSize: 1, options: [],
    }]);
  };

  const handleUpdateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    if (updates.type && !['select', 'multiselect', 'radio'].includes(updates.type)) {
      newFields[index].options = [];
    }
    if (updates.type && ['select', 'multiselect', 'radio'].includes(updates.type) && newFields[index].options.length === 0) {
      newFields[index].options = [{ value: '', labelAr: '', labelEn: '' }];
    }
    setFields(newFields);
  };

  const handleRemoveField = (index: number) => setFields(fields.filter((_, i) => i !== index));

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newFields.length) return;
    [newFields[index], newFields[target]] = [newFields[target], newFields[index]];
    setFields(newFields);
  };

  const handleAddOption = (fieldIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.push({ value: '', labelAr: '', labelEn: '' });
    setFields(newFields);
  };

  const handleUpdateOption = (fi: number, oi: number, updates: Partial<FormFieldOption>) => {
    const newFields = [...fields];
    newFields[fi].options[oi] = { ...newFields[fi].options[oi], ...updates };
    setFields(newFields);
  };

  const handleRemoveOption = (fi: number, oi: number) => {
    const newFields = [...fields];
    newFields[fi].options = newFields[fi].options.filter((_, i) => i !== oi);
    setFields(newFields);
  };

  const handleSave = async () => {
    const reservedSlugs = ['admin', 'api', 'contact', 'about-us', 'portfolio', 'news', 'blog', 'solutions', 'products', 'forms', 'offers', 'healthcare', 'request-quote', 'packages', 'enterprise'];
    if (reservedSlugs.includes(slug.split('/')[0].toLowerCase()) && !customDomain) {
      toast.error(isAr ? 'هذا الرابط محجوز للنظام' : 'This slug is reserved by the system');
      return;
    }

    setSaving(true);
    try {
      const product = PRODUCTS.find(p => p.id === selectedProduct);
      const body = {
        productId: selectedProduct,
        productName: product?.nameAr || (newFormMode ? newFormNameAr : selectedProduct),
        productNameEn: product?.nameEn || (newFormMode ? newFormNameEn : selectedProduct),
        slug: slug || selectedProduct,
        customDomain,
        notificationEmails,
        isActive,
        titleAr,
        titleEn,
        thankYouMessageAr,
        thankYouMessageEn,
        formType,
        fields,
      };

      // Use PUT for everything as it handles upsert: true
      const res = await fetch(`/api/form-configs/${selectedProduct}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save');
      }

      toast.success(isAr ? 'تم الحفظ بنجاح' : 'Saved successfully');
      setNewFormMode(false);
      fetchConfigs();
    } catch (err: any) {
      console.error('Error saving form config:', err);
      toast.error(isAr ? `فشل الحفظ: ${err.message}` : `Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfig = async (productId: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا النموذج؟' : 'Are you sure you want to delete this form?')) return;
    try {
      await fetch(`/api/form-configs/${productId}`, { method: 'DELETE' });
      toast.success(isAr ? 'تم الحذف' : 'Deleted');
      fetchConfigs();
    } catch { toast.error(isAr ? 'فشل الحذف' : 'Delete failed'); }
  };

  const fetchSubmissions = async (productId: string) => {
    setSubmissionsLoading(true);
    setViewMode('submissions');
    setSelectedProduct(productId);
    try {
      const res = await fetch(`/api/form-submit?productId=${productId}&limit=50`);
      if (res.ok) { const data = await res.json(); setSubmissions(data.submissions || []); }
    } catch (e) { console.error(e); }
    finally { setSubmissionsLoading(false); }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/form-submit/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      fetchSubmissions(selectedProduct);
      toast.success(isAr ? 'تم التحديث' : 'Updated');
    } catch { toast.error(isAr ? 'فشل التحديث' : 'Update failed'); }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm(isAr ? 'حذف الطلب؟' : 'Delete submission?')) return;
    try {
      await fetch(`/api/form-submit/${id}`, { method: 'DELETE' });
      fetchSubmissions(selectedProduct);
    } catch { toast.error(isAr ? 'فشل الحذف' : 'Delete failed'); }
  };

  const exportToExcel = () => {
    try {
      const config = configs.find(c => c.productId === selectedProduct);
      const dataToExport = submissions.map(sub => {
        const row: any = {
          [isAr ? 'التاريخ' : 'Date']: new Date(sub.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US'),
          [isAr ? 'الحالة' : 'Status']: sub.status,
        };
        
        // Add form data fields
        if (config) {
          config.fields.forEach(f => {
            const label = isAr ? f.labelAr : f.labelEn;
            const val = sub.data?.[f.id];
            row[label] = Array.isArray(val) ? val.join(', ') : val || '';
          });
        } else {
          // Fallback if config not found
          Object.entries(sub.data || {}).forEach(([key, val]) => {
            row[key] = Array.isArray(val) ? val.join(', ') : val || '';
          });
        }
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
      XLSX.writeFile(workbook, `${selectedProduct}_submissions_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(isAr ? 'تم تصدير ملف إكسيل بنجاح' : 'Excel exported successfully');
    } catch (err) {
      console.error('Export error:', err);
      toast.error(isAr ? 'فشل تصدير إكسيل' : 'Excel export failed');
    }
  };

  const steps = Array.from(new Set(fields.map(f => f.step))).sort((a, b) => a - b);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#7A1E2E]" /></div>;
  }

  // --- LIST VIEW ---
  if (viewMode === 'list') {
    const customConfigs = configs.filter(c => !PRODUCTS.some(p => p.id === c.productId));

    return (
      <div className={`space-y-6 ${isAr ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('إنشاء النماذج', 'Service Forms')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('إدارة نماذج طلب الخدمة والاستبيانات', 'Manage service request forms and surveys')}</p>
          </div>
          <Button className="bg-[#7A1E2E] hover:bg-[#601824] text-white" onClick={() => setShowNewFormDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            {t('نموذج جديد', 'New Form')}
          </Button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t('النموذج', 'Form')}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t('المنتج', 'Product')}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">{t('الرابط', 'URL')}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">{t('الحقول', 'Fields')}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">{t('طلبات اليوم', 'Today')}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">{t('إجمالي الطلبات', 'Total')}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">{t('إشعارات البريد', 'Notifications')}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">{t('الحالة', 'Status')}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">{t('إجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map(product => {
                const config = configs.find(c => c.productId === product.id);
                const total = config?.totalSubmissions || 0;
                const today = config?.todaySubmissions || 0;
                const fieldCount = config?.fields?.length || 0;
                const hasConfig = !!config;
                return (
                  <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{isAr ? product.nameAr : product.nameEn}</div>
                      {hasConfig && <div className="text-xs text-gray-500">{config?.productName || ''}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{isAr ? product.nameAr : product.nameEn}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">
                      {hasConfig ? (
                        <a href={getFormUrl(config?.slug || product.id, product.id)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {config?.slug || product.id} <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={`${hasConfig ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'} text-xs`}>{fieldCount}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={`${today > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'} text-xs`}>{today}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{total}</td>
                    <td className="px-4 py-3 text-center">
                      {config?.notificationEmails ? (
                        <span className="text-xs text-gray-600" title={config.notificationEmails}>
                          <Mail className="w-4 h-4 inline text-green-500" /> {config.notificationEmails.split(',')[0]}{config.notificationEmails.split(',').length > 1 ? '...' : ''}
                        </span>
                      ) : <span className="text-xs text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasConfig && config?.isActive !== false ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">{t('نشط', 'Active')}</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 text-xs">{t('معطل', 'Inactive')}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button variant="ghost" size="sm" onClick={() => { setNewFormMode(false); loadProductConfig(product.id); }} title={t('تعديل', 'Edit')}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        {hasConfig && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => fetchSubmissions(product.id)} title={t('الطلبات', 'Submissions')}>
                              <Inbox className="w-4 h-4" />
                            </Button>
                            <a href={getFormUrl(config?.slug || product.id, product.id)} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" title={t('معاينة', 'Preview')}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </a>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteConfig(product.id)} title={t('حذف', 'Delete')} className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {customConfigs.map(config => (
                <tr key={config.productId} className="border-b hover:bg-gray-50 transition-colors bg-yellow-50/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{isAr ? config.productName : config.productNameEn}</div>
                    <div className="text-xs text-gray-500">{config.productId}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge className="bg-amber-100 text-amber-700 text-xs">{t('مخصص', 'Custom')}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600">
                    <a href={getFormUrl(config.slug || config.productId, config.productId, config.customDomain)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {config.customDomain ? `${config.customDomain}/` : ''}{config.slug || config.productId} <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="bg-blue-100 text-blue-700 text-xs">{config.fields?.length || 0}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`${(config.todaySubmissions || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'} text-xs`}>{config.todaySubmissions || 0}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{config.totalSubmissions || 0}</td>
                  <td className="px-4 py-3 text-center">
                    {config.notificationEmails ? (
                      <span className="text-xs text-gray-600" title={config.notificationEmails}>
                        <Mail className="w-4 h-4 inline text-green-500" /> {config.notificationEmails.split(',')[0]}{config.notificationEmails.split(',').length > 1 ? '...' : ''}
                      </span>
                    ) : <span className="text-xs text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {config.isActive !== false ? (
                      <Badge className="bg-green-100 text-green-700 text-xs">{t('نشط', 'Active')}</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 text-xs">{t('معطل', 'Inactive')}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <Button variant="ghost" size="sm" onClick={() => { setNewFormMode(false); loadProductConfig(config.productId); }} title={t('تعديل', 'Edit')}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => fetchSubmissions(config.productId)} title={t('الطلبات', 'Submissions')}>
                        <Inbox className="w-4 h-4" />
                      </Button>
                      {config.formType === 'survey' && (
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedProduct(config.productId); fetchSubmissions(config.productId); setViewMode('analytics'); }} title={t('التحليلات', 'Analytics')} className="text-purple-600">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      )}
                      <a href={getFormUrl(config.slug || config.productId, config.productId, config.customDomain)} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" title={t('معاينة', 'Preview')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteConfig(config.productId)} title={t('حذف', 'Delete')} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showNewFormDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewFormDialog(false)}>
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
              <h3 className="text-lg font-bold text-gray-900">{t('إنشاء نموذج جديد', 'Create New Form')}</h3>
              <div>
                <label className="text-sm font-medium text-gray-700">{t('معرف المنتج (بالإنجليزية)', 'Product ID (English)')}</label>
                <input type="text" value={newFormProductId} onChange={e => setNewFormProductId(e.target.value.replace(/[^a-z0-9-]/g, ''))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="e.g. survey-1" dir="ltr" />
                <p className="text-xs text-gray-400 mt-1">{t('يُستخدم كمعرف فريد للنموذج', 'Used as unique identifier for the form')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">{t('اسم النموذج (عربي)', 'Form Name (Arabic)')}</label>
                <input type="text" value={newFormNameAr} onChange={e => setNewFormNameAr(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="استبيان رضا العملاء" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">{t('اسم النموذج (إنجليزي)', 'Form Name (English)')}</label>
                <input type="text" value={newFormNameEn} onChange={e => setNewFormNameEn(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="Customer Satisfaction Survey" dir="ltr" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">{t('الرابط (Slug)', 'URL Slug')}</label>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-gray-400">/forms/</span>
                  <input type="text" value={newFormNameSlug} onChange={e => setNewFormSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))} className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="customer-survey" dir="ltr" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="bg-[#7A1E2E] hover:bg-[#601824] text-white flex-1" onClick={() => {
                  if (!newFormProductId.trim() || !newFormNameAr.trim() || !newFormNameEn.trim()) {
                    toast.error(isAr ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
                    return;
                  }
                  setSelectedProduct(newFormProductId.trim());
                  setFields([]);
                  setSlug(newFormNameSlug || newFormProductId.trim());
                  setNotificationEmails('');
                  setIsActive(true);
                  setTitleAr(newFormNameAr.trim());
                  setTitleEn(newFormNameEn.trim());
                  setThankYouMessageAr('');
                  setThankYouMessageEn('');
                  setFormType('service');
                  setNewFormMode(true);
                  setShowNewFormDialog(false);
                  setNewFormProductId('');
                  setNewFormNameAr('');
                  setNewFormNameEn('');
                  setNewFormSlug('');
                  setViewMode('edit');
                }}>
                  {t('إنشاء', 'Create')}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowNewFormDialog(false)}>
                  {t('إلغاء', 'Cancel')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- SUBMISSIONS VIEW ---
  if (viewMode === 'analytics') {
    const config = configs.find(c => c.productId === selectedProduct);
    const CHART_COLORS = ['#7A1E2E', '#F15822', '#128C7E', '#104E8B', '#FFA502', '#00BCD4', '#9C27B0'];

    const getFieldAnalytics = (field: FormField) => {
      const counts: Record<string, number> = {};
      let totalCount = 0;
      
      submissions.forEach(sub => {
        const val = sub.data?.[field.id];
        if (val === undefined || val === null || val === '') return;
        
        if (Array.isArray(val)) {
          val.forEach(v => {
            counts[v] = (counts[v] || 0) + 1;
            totalCount++;
          });
        } else {
          counts[val] = (counts[val] || 0) + 1;
          totalCount++;
        }
      });

      // Map values to labels for charts
      const data = Object.entries(counts).map(([val, count]) => {
        const opt = field.options.find(o => o.value === val);
        const name = opt ? (isAr ? opt.labelAr : opt.labelEn) : val;
        return { name, value: count, percentage: totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : 0 };
      });

      return { data, totalCount };
    };

    const aggregatableTypes: FormFieldType[] = ['select', 'radio', 'multiselect', 'rating', 'scale'];

    return (
      <div className={`space-y-6 ${isAr ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setViewMode('list')}>
              <ArrowRight className={`w-4 h-4 ${isAr ? 'ml-1' : 'mr-1'}`} /> {t('رجوع', 'Back')}
            </Button>
            <h2 className="text-xl font-bold text-gray-900">{t('تحليلات الاستبيان', 'Survey Analytics')} - {isAr ? config?.productName : config?.productNameEn}</h2>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setViewMode('submissions')} variant="outline">
              <Inbox className="w-4 h-4 mr-2" />
              {t('الردود التفصيلية', 'Detailed Responses')}
            </Button>
            <Button onClick={exportToExcel} variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('تصدير إكسيل', 'Export Excel')}
            </Button>
          </div>
        </div>

        {submissionsLoading ? (
          <div className="flex items-center justify-center h-32"><Loader2 className="w-6 h-6 animate-spin text-[#7A1E2E]" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-full bg-white border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">{t('إجمالي الردود', 'Total Submissions')}</p>
                    <p className="text-4xl font-extrabold text-[#7A1E2E]">{submissions.length}</p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-[#7A1E2E]/10" />
                </div>
              </CardContent>
            </Card>

            {config?.fields.filter(f => aggregatableTypes.includes(f.type)).map(field => {
              const { data, totalCount } = getFieldAnalytics(field);
              if (totalCount === 0) return null;

              return (
                <Card key={field.id} className="border shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="font-bold text-gray-900">{isAr ? field.labelAr : field.labelEn}</h3>
                    <p className="text-xs text-gray-500">{t('إجمالي الاختيارات:', 'Total selections:')} {totalCount}</p>
                  </div>
                  <CardContent className="p-4">
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {field.type === 'radio' || field.type === 'select' ? (
                          <PieChart>
                            <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        ) : (
                          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#7A1E2E" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {config?.fields.filter(f => !aggregatableTypes.includes(f.type) && f.type !== 'file').map(field => (
              <Card key={field.id} className="border shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-bold text-gray-900">{isAr ? field.labelAr : field.labelEn}</h3>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {submissions.filter(sub => sub.data?.[field.id]).slice(0, 10).map((sub, i) => (
                      <div key={i} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                        {String(sub.data[field.id])}
                      </div>
                    ))}
                    {submissions.filter(sub => sub.data?.[field.id]).length > 10 && (
                      <p className="text-xs text-center text-gray-400 mt-2">{t('يوجد المزيد من الردود في جدول البيانات', 'More responses available in data table')}</p>
                    )}
                    {submissions.filter(sub => sub.data?.[field.id]).length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">{t('لا يوجد ردود بعد', 'No responses yet')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'submissions') {
    const product = PRODUCTS.find(p => p.id === selectedProduct);
    const config = configs.find(c => c.productId === selectedProduct);
    const isSurvey = config?.formType === 'survey';

    return (
      <div className={`space-y-6 ${isAr ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setViewMode('list')}>
              <ArrowRight className={`w-4 h-4 ${isAr ? 'ml-1' : 'mr-1'}`} /> {t('رجوع', 'Back')}
            </Button>
            <h2 className="text-xl font-bold text-gray-900">{t('طلبات', 'Submissions')} - {isAr ? config?.productName || product?.nameAr : config?.productNameEn || product?.nameEn}</h2>
            {isSurvey && <Badge className="bg-purple-100 text-purple-700">{t('استبيان', 'Survey')}</Badge>}
          </div>
          <Button onClick={exportToExcel} variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
            <ExternalLink className="w-4 h-4 mr-2" />
            {t('تصدير إكسيل', 'Export Excel')}
          </Button>
        </div>
        {submissionsLoading ? (
          <div className="flex items-center justify-center h-32"><Loader2 className="w-6 h-6 animate-spin text-[#7A1E2E]" /></div>
        ) : submissions.length === 0 ? (
          <Card className="border-dashed"><CardContent className="py-12 text-center"><p className="text-gray-500">{t('لا توجد طلبات بعد', 'No submissions yet')}</p></CardContent></Card>
        ) : isSurvey ? (
          <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 min-w-[150px]">{t('التاريخ', 'Date')}</th>
                  {config?.fields.map(f => (
                    <th key={f.id} className="px-4 py-3 text-right font-semibold text-gray-600 min-w-[120px]">{isAr ? f.labelAr : f.labelEn}</th>
                  ))}
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">{t('إجراءات', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub: any) => (
                  <tr key={sub._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                    </td>
                    {config?.fields.map(f => {
                      const val = sub.data?.[f.id];
                      return (
                        <td key={f.id} className="px-4 py-3 text-gray-900">
                          {Array.isArray(val) ? (
                            <div className="flex flex-wrap gap-1">
                              {val.map((v, i) => <Badge key={i} variant="outline" className="text-[10px] py-0">{v}</Badge>)}
                            </div>
                          ) : String(val || '-')}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm" onClick={() => deleteSubmission(sub._id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub: any) => (
              <Card key={sub._id} className="border hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{sub.data?.name || sub.data?.email || '-'}</span>
                        <span className="text-xs text-gray-400">{new Date(sub.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US')}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                        {config?.fields.slice(0, 8).map(f => (
                          <div key={f.id}>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{isAr ? f.labelAr : f.labelEn}</p>
                            <p className="text-xs text-gray-700 truncate">{String(sub.data?.[f.id] || '-')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={sub.status}
                        onChange={(e) => updateSubmissionStatus(sub._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border font-medium ${
                          sub.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          sub.status === 'contacted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        <option value="new">{t('جديد', 'New')}</option>
                        <option value="contacted">{t('تم التواصل', 'Contacted')}</option>
                        <option value="closed">{t('مغلق', 'Closed')}</option>
                      </select>
                      <Button variant="ghost" size="sm" onClick={() => deleteSubmission(sub._id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- EDIT VIEW ---
  return (
    <div className={`space-y-6 ${isAr ? 'font-ibm-plex-arabic' : 'font-ibm-plex'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setViewMode('list')}>
            <ArrowRight className={`w-4 h-4 ${isAr ? 'ml-1' : 'mr-1'}`} /> {t('رجوع', 'Back')}
          </Button>
          <h2 className="text-xl font-bold text-gray-900">{t('تعديل النموذج', 'Edit Form')}</h2>
        </div>
        <div className="flex gap-2">
          <a href={getFormUrl(slug || selectedProduct, selectedProduct, customDomain)} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-1" />
              {t('معاينة', 'Preview')}
            </Button>
          </a>
          <Button onClick={handleSave} disabled={saving} className="bg-[#7A1E2E] hover:bg-[#601824] text-white">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            {t('حفظ', 'Save')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-[#7A1E2E]">{t('إعدادات النموذج', 'Form Settings')}</h3>
            <div>
              <label className="text-xs text-gray-500">{t('المنتج', 'Product')}</label>
              <div className="flex gap-2 flex-wrap">
                {PRODUCTS.map(product => (
                  <button key={product.id} onClick={() => loadProductConfig(product.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedProduct === product.id ? 'bg-[#7A1E2E] text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-[#7A1E2E]/30'}`}
                  >{isAr ? product.nameAr : product.nameEn}</button>
                ))}
                {newFormMode && !PRODUCTS.some(p => p.id === selectedProduct) && (
                  <div className="px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-800 border border-amber-300">
                    {selectedProduct} <Badge className="bg-amber-200 text-amber-800 text-xs ml-1">{t('مخصص', 'Custom')}</Badge>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('النطاق المخصص (اختياري)', 'Custom Domain (Optional)')}</label>
              <input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm" placeholder="survey.yourdomain.com" dir="ltr" />
              <p className="text-[10px] text-gray-400 mt-0.5">{t('اتركه فارغاً لاستخدام الدومين الأساسي', 'Leave empty to use primary domain')}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('رابط الفورم (Slug)', 'Form URL Slug')}</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{customDomain ? `https://${customDomain}/` : '/'}</span>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 border rounded px-3 py-1.5 text-sm" placeholder="feedback/customer-survey" dir="ltr" />
              </div>
              <p className="text-[10px] text-[#7A1E2E] mt-0.5 font-medium">
                {t('يمكنك استخدام مسارات متعددة مثل marketing/survey', 'You can use nested paths like marketing/survey')}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('إيميلات الإشعار (مفصولة بفاصلة)', 'Notification Emails (comma separated)')}</label>
              <input type="text" value={notificationEmails} onChange={(e) => setNotificationEmails(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm" placeholder="marketing@corbit.sa, sales@corbit.sa" dir="ltr" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">{t('تفعيل النموذج', 'Active')}</label>
              <button onClick={() => setIsActive(!isActive)} className="text-2xl">
                {isActive ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
              </button>
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('نوع النموذج', 'Form Type')}</label>
              <select 
                value={formType} 
                onChange={(e) => setFormType(e.target.value as 'service' | 'survey')}
                className="w-full border rounded px-3 py-1.5 text-sm bg-white"
              >
                <option value="service">{t('طلب خدمة', 'Service Request')}</option>
                <option value="survey">{t('استبيان / استطلاع', 'Survey / Questionnaire')}</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">{t('عنوان النموذج (عربي)', 'Form Title (AR)')}</label>
                <input type="text" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm" placeholder="أخبرنا برأيك" />
              </div>
              <div>
                <label className="text-xs text-gray-500">{t('عنوان النموذج (إنجليزي)', 'Form Title (EN)')}</label>
                <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm" placeholder="Give us your feedback" dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">{t('رسالة الشكر (عربي)', 'Thank You Message (AR)')}</label>
                <textarea value={thankYouMessageAr} onChange={(e) => setThankYouMessageAr(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm" rows={2} placeholder="شكراً لك على وقتك" />
              </div>
              <div>
                <label className="text-xs text-gray-500">{t('رسالة الشكر (إنجليزي)', 'Thank You Message (EN)')}</label>
                <textarea value={thankYouMessageEn} onChange={(e) => setThankYouMessageEn(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm" rows={2} placeholder="Thank you for your time" dir="ltr" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-amber-50">
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-amber-800">{t('معلومات سريعة', 'Quick Info')}</h3>
            <div className="text-sm text-amber-700 space-y-1">
              <p>{t('عدد الحقول', 'Fields')}: <strong>{fields.length}</strong></p>
              <p>{t('عدد الخطوات', 'Steps')}: <strong>{steps.length}</strong></p>
              <p>{t('الحقول الإجبارية', 'Required')}: <strong>{fields.filter(f => f.required).length}</strong></p>
              {selectedProduct === 'whatsapp' && (
                <Button variant="outline" size="sm" onClick={() => { setFields(DEFAULT_WHATSAPP_FIELDS); toast.success(isAr ? 'تم إعادة التعيين' : 'Reset to defaults'); }} className="mt-2">
                  <ListChecks className="w-4 h-4 mr-1" /> {t('إعادة للافتراضي', 'Reset to Default')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{t('حقول النموذج', 'Form Fields')} ({fields.length})</h3>
        <Button size="sm" onClick={handleAddField} className="bg-[#7A1E2E] hover:bg-[#601824] text-white">
          <Plus className="w-4 h-4 mr-1" /> {t('إضافة حقل', 'Add Field')}
        </Button>
      </div>

      {steps.map(step => (
        <div key={step} className="space-y-3">
          <Badge className="bg-[#7A1E2E] text-white text-sm px-3 py-1">{t(`الخطوة ${step}`, `Step ${step}`)}</Badge>
          {fields.map((field, index) => field.step !== step ? null : (
            <Card key={field.id} className="border hover:border-[#7A1E2E]/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-1 pt-2">
                    <button onClick={() => handleMoveField(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => handleMoveField(index, 'down')} disabled={index === fields.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-gray-500">{t('العنوان (عربي)', 'Label (AR)')}</label><input type="text" value={field.labelAr} onChange={e => handleUpdateField(index, { labelAr: e.target.value })} className="w-full border rounded p-1.5 text-sm" /></div>
                      <div><label className="text-xs text-gray-500">{t('العنوان (إنجليزي)', 'Label (EN)')}</label><input type="text" value={field.labelEn} onChange={e => handleUpdateField(index, { labelEn: e.target.value })} className="w-full border rounded p-1.5 text-sm" /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div><label className="text-xs text-gray-500">{t('نوع الحقل', 'Type')}</label><select value={field.type} onChange={e => handleUpdateField(index, { type: e.target.value as FormFieldType })} className="w-full border rounded p-1.5 text-sm bg-white">{FIELD_TYPES.map(ft => <option key={ft.value} value={ft.value}>{isAr ? ft.labelAr : ft.labelEn}</option>)}</select></div>
                      <div><label className="text-xs text-gray-500">{t('الخطوة', 'Step')}</label><input type="number" min={2} value={field.step} onChange={e => handleUpdateField(index, { step: Math.max(2, parseInt(e.target.value) || 2) })} className="w-full border rounded p-1.5 text-sm" /></div>
                      <div className="flex items-end gap-3 pt-1"><label className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" checked={field.required} onChange={e => handleUpdateField(index, { required: e.target.checked })} className="w-4 h-4 accent-[#7A1E2E]" />{t('إجباري', 'Required')}</label></div>
                      <div className="flex items-end gap-3 pt-1"><label className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#7A1E2E]" />{t('نشط', 'Active')}</label></div>
                    </div>
                    {['rating', 'scale'].includes(field.type) && (
                      <div className="grid grid-cols-3 gap-3">
                        <div><label className="text-xs text-gray-500">{t('الحد الأدنى', 'Min')}</label><input type="number" value={field.min} onChange={e => handleUpdateField(index, { min: parseInt(e.target.value) || 1 })} className="w-full border rounded p-1.5 text-sm" /></div>
                        <div><label className="text-xs text-gray-500">{t('الحد الأقصى', 'Max')}</label><input type="number" value={field.max} onChange={e => handleUpdateField(index, { max: parseInt(e.target.value) || 10 })} className="w-full border rounded p-1.5 text-sm" /></div>
                        <div><label className="text-xs text-gray-500">{t('الخطوة', 'Step Size')}</label><input type="number" value={field.stepSize} onChange={e => handleUpdateField(index, { stepSize: parseInt(e.target.value) || 1 })} className="w-full border rounded p-1.5 text-sm" /></div>
                      </div>
                    )}
                    {!['radio', 'multiselect'].includes(field.type) && (
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-gray-500">{t('نص مساعد (عربي)', 'Placeholder (AR)')}</label><input type="text" value={field.placeholderAr} onChange={e => handleUpdateField(index, { placeholderAr: e.target.value })} className="w-full border rounded p-1.5 text-sm" /></div>
                        <div><label className="text-xs text-gray-500">{t('نص مساعد (إنجليزي)', 'Placeholder (EN)')}</label><input type="text" value={field.placeholderEn} onChange={e => handleUpdateField(index, { placeholderEn: e.target.value })} className="w-full border rounded p-1.5 text-sm" /></div>
                      </div>
                    )}
                    {['select', 'multiselect', 'radio'].includes(field.type) && (
                      <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">{t('الخيارات', 'Options')} ({field.options.length})</span>
                          <Button variant="outline" size="sm" onClick={() => handleAddOption(index)} className="h-6 text-xs"><Plus className="w-3 h-3 mr-0.5" />{t('خيار', 'Option')}</Button>
                        </div>
                        {field.options.map((opt, oi) => (
                          <div key={oi} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                            <input type="text" value={opt.value} onChange={e => handleUpdateOption(index, oi, { value: e.target.value, labelAr: opt.labelAr || e.target.value, labelEn: opt.labelEn || e.target.value })} className="border rounded p-1.5 text-sm" placeholder={t('القيمة', 'Value')} />
                            <div className="flex gap-1">
                              <input type="text" value={opt.labelAr} onChange={e => handleUpdateOption(index, oi, { labelAr: e.target.value })} className="border rounded p-1.5 text-sm flex-1" placeholder="عربي" />
                              <input type="text" value={opt.labelEn} onChange={e => handleUpdateOption(index, oi, { labelEn: e.target.value })} className="border rounded p-1.5 text-sm flex-1" placeholder="EN" />
                            </div>
                            <button onClick={() => handleRemoveOption(index, oi)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleRemoveField(index)} className="text-red-400 hover:text-red-600 p-1 mt-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}

      <Button onClick={handleAddField} variant="outline" className="w-full border-dashed border-2 py-6">
        <Plus className="w-4 h-4 mr-2" /> {t('إضافة حقل جديد', 'Add New Field')}
      </Button>
    </div>
  );
};