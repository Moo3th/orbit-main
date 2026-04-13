'use client';

import { useState, useEffect } from 'react';
import { Save, Globe, Building2, BarChart3, Code, Settings, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/business/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/business/ui/card';
import { ImageUploader } from '@/components/business/ImageUploader';

interface SeoSettings {
  _id: string;
  siteName: { en: string; ar: string };
  siteUrl: string;
  notificationEmail: string;
  emailConfig: {
    provider: 'emailjs' | 'smtp' | 'none';
    emailjsServiceId: string;
    emailjsTemplateId: string;
    emailjsPublicKey: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
  };
  defaultSeo: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    keywords: { en: string; ar: string };
  };
  organization: {
    name: string;
    logo: string;
    description: { en: string; ar: string };
    address: { street: string; city: string; country: string };
    phone: string;
    email: string;
    socialLinks: { twitter?: string; linkedin?: string; instagram?: string; facebook?: string };
  };
  analytics: {
    gtmId: string;
    gscVerification: string;
    facebookPixelId: string;
    facebookAccessToken: string;
    clarityProjectId: string;
  };
  robotsTxt: string;
}

interface Props {
  isAr: boolean;
}

export function CmsSeoView({ isAr }: Props) {
  const [settings, setSettings] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'organization' | 'analytics' | 'robots'>('general');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seo/settings');
      const data = await res.json();
      if (data.success) {
        const settings = data.settings;
        if (!settings.organization) {
          settings.organization = { name: '', logo: '', description: { en: '', ar: '' }, address: { street: '', city: '', country: '' }, phone: '', email: '', socialLinks: {} };
        }
        if (!settings.organization.socialLinks) {
          settings.organization.socialLinks = {};
        }
        if (!settings.emailConfig) {
          settings.emailConfig = {
            provider: 'none',
            emailjsServiceId: '',
            emailjsTemplateId: '',
            emailjsPublicKey: '',
            smtpHost: '',
            smtpPort: 587,
            smtpUser: '',
            smtpPassword: '',
          };
        }
        setSettings(settings);
      }
    } catch (error) {
      console.error('Failed to fetch SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      console.log('Saving settings:', JSON.stringify(settings, null, 2));
      const res = await fetch('/api/seo/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      console.log('Save response:', res.status, JSON.stringify(data));
      
      if (data.success) {
        setToastMessage({ type: 'success', message: isAr ? 'تم الحفظ بنجاح!' : 'Saved successfully!' });
      } else {
        setToastMessage({ type: 'error', message: data.error || (isAr ? 'حدث خطأ' : 'Error occurred') });
      }
    } catch (error) {
      console.error('Failed to save:', error);
      setToastMessage({ type: 'error', message: isAr ? 'حدث خطأ أثناء الحفظ' : 'Error saving' });
    } finally {
      setSaving(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{isAr ? 'جارِ التحميل...' : 'Loading...'}</div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
          toastMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toastMessage.message}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isAr ? 'إعدادات الموقع' : 'Site Settings'}</h2>
          <p className="text-gray-500 mt-1">{isAr ? 'إعدادات عامة، SEO، تحليلات وأكثر' : 'General settings, SEO, analytics and more'}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#FFA502] hover:bg-[#E59400] text-white">
          <Save className="w-4 h-4 ml-2" />
          {saving ? (isAr ? 'جارِ الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'general', icon: Globe, label: isAr ? 'عام' : 'General' },
            { id: 'notifications', icon: Settings, label: isAr ? 'الإشعارات' : 'Notifications' },
            { id: 'organization', icon: Building2, label: isAr ? 'المنظمة' : 'Organization' },
            { id: 'analytics', icon: BarChart3, label: isAr ? 'التحليلات' : 'Analytics' },
            { id: 'robots', icon: Code, label: 'robots.txt' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 sm:px-6 py-4 font-medium text-center transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === tab.id ? 'bg-[#104E8B] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'general' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#104E8B]" />
            {isAr ? 'المعلومات العامة' : 'General Information'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'اسم الموقع (عربي)' : 'Site Name (AR)'}</label>
              <input 
                type="text" 
                value={settings.siteName.ar} 
                onChange={(e) => setSettings({ ...settings, siteName: { ...settings.siteName, ar: e.target.value } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name (EN)</label>
              <input 
                type="text" 
                value={settings.siteName.en} 
                onChange={(e) => setSettings({ ...settings, siteName: { ...settings.siteName, en: e.target.value } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'رابط الموقع' : 'Site URL'}</label>
              <input 
                type="text" 
                value={settings.siteUrl} 
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
              />
            </div>
          </div>

          <h3 className="font-bold text-gray-700 pt-4 border-t flex items-center gap-2">
            <Code className="w-5 h-5 text-[#104E8B]" />
            {isAr ? 'SEO الافتراضي' : 'Default SEO'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'العنوان الافتراضي (عربي)' : 'Default Title (AR)'}</label>
              <input 
                type="text" 
                value={settings.defaultSeo.title.ar} 
                onChange={(e) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, title: { ...settings.defaultSeo.title, ar: e.target.value } } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Title (EN)</label>
              <input 
                type="text" 
                value={settings.defaultSeo.title.en} 
                onChange={(e) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, title: { ...settings.defaultSeo.title, en: e.target.value } } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الوصف الافتراضي (عربي)' : 'Default Description (AR)'}</label>
              <textarea 
                value={settings.defaultSeo.description.ar} 
                onChange={(e) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, description: { ...settings.defaultSeo.description, ar: e.target.value } } })} 
                rows={3} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Description (EN)</label>
              <textarea 
                value={settings.defaultSeo.description.en} 
                onChange={(e) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, description: { ...settings.defaultSeo.description, en: e.target.value } } })} 
                rows={3} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الكلمات المفتاحية (مفصولة بفواصل)' : 'Keywords (comma separated)'}</label>
              <input 
                type="text" 
                value={settings.defaultSeo.keywords.ar} 
                onChange={(e) => setSettings({ ...settings, defaultSeo: { ...settings.defaultSeo, keywords: { ...settings.defaultSeo.keywords, ar: e.target.value } } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#104E8B]" />
            {isAr ? 'إعدادات الإشعارات' : 'Notification Settings'}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'بريد استلام الإشعارات' : 'Notification Emails'}</label>
            <input 
              type="text" 
              value={settings.notificationEmail} 
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
              dir="ltr" 
              placeholder="sales@orbit.sa, marketing@corbit.sa"
            />
            <p className="text-xs text-gray-500 mt-2">
              {isAr 
                ? 'يمكنك إضافة أكثر من بريد بالفصل بينهم بفاصلة (,). مثال: email1@domain.com, email2@domain.com' 
                : 'You can add multiple emails separated by comma. Example: email1@domain.com, email2@domain.com'}
            </p>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-700 mb-4">{isAr ? 'موفر خدمات البريد الإلكتروني' : 'Email Service Provider'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { id: 'none', label: isAr ? 'بدون خدمات' : 'Disabled', desc: isAr ? 'تعطيل الإشعارات' : 'Disable notifications' },
                { id: 'emailjs', label: 'EmailJS', desc: isAr ? 'خدمة مجانية' : 'Free service' },
                { id: 'smtp', label: 'SMTP', desc: isAr ? 'خادم بريد خاص' : 'Custom mail server' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSettings({ 
                    ...settings, 
                    emailConfig: { ...settings.emailConfig, provider: option.id as 'none' | 'emailjs' | 'smtp' } 
                  })}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    settings.emailConfig.provider === option.id 
                      ? 'border-[#104E8B] bg-[#104E8B]/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>

            {settings.emailConfig.provider === 'emailjs' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 mt-0.5">ℹ️</div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">{isAr ? 'إعداد EmailJS' : 'EmailJS Setup'}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {isAr 
                        ? 'أنشئ حساب في EmailJS واحصل على بيانات الاعتماد من emailjs.com'
                        : 'Create an account at emailjs.com and get your credentials'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service ID</label>
                    <input 
                      type="text" 
                      value={settings.emailConfig.emailjsServiceId} 
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        emailConfig: { ...settings.emailConfig, emailjsServiceId: e.target.value } 
                      })} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                      dir="ltr" 
                      placeholder="service_xxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template ID</label>
                    <input 
                      type="text" 
                      value={settings.emailConfig.emailjsTemplateId} 
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        emailConfig: { ...settings.emailConfig, emailjsTemplateId: e.target.value } 
                      })} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                      dir="ltr" 
                      placeholder="template_xxx"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Public Key</label>
                    <input 
                      type="password" 
                      value={settings.emailConfig.emailjsPublicKey} 
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        emailConfig: { ...settings.emailConfig, emailjsPublicKey: e.target.value } 
                      })} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                      dir="ltr" 
                      placeholder="xxx"
                    />
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800">
                    <strong>{isAr ? 'ملاحظة:' : 'Note:'}</strong>{isAr 
                      ? ' يجب أن يحتوي القالب على المتغيرات: to_email, from_name, from_email, subject, message' 
                      : ' Template must have variables: to_email, from_name, from_email, subject, message'}
                  </p>
                </div>
              </div>
            )}

            {settings.emailConfig.provider === 'smtp' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-green-600 mt-0.5">ℹ️</div>
                  <div>
                    <p className="text-sm text-green-800 font-medium">{isAr ? 'إعداد SMTP' : 'SMTP Setup'}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {isAr 
                        ? 'أدخل بيانات خادم البريد الإلكتروني الخاص بك'
                        : 'Enter your mail server credentials'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'المضيف (Host)' : 'SMTP Host'}</label>
                    <input 
                      type="text" 
                      value={settings.emailConfig.smtpHost || ''} 
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        emailConfig: { ...settings.emailConfig, smtpHost: e.target.value } 
                      })} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                      dir="ltr" 
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'المنفذ (Port)' : 'SMTP Port'}</label>
                    <input 
                      type="number" 
                      value={settings.emailConfig.smtpPort || 587} 
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        emailConfig: { ...settings.emailConfig, smtpPort: parseInt(e.target.value) || 587 } 
                      })} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                      dir="ltr" 
                      placeholder="587"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {isAr ? 'الأكثر شيوعاً: 587 (TLS) أو 465 (SSL)' : 'Most common: 587 (TLS) or 465 (SSL)'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'المستخدم' : 'SMTP Username'}</label>
                    <input 
                      type="text" 
                      value={settings.emailConfig.smtpUser || ''} 
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        emailConfig: { ...settings.emailConfig, smtpUser: e.target.value } 
                      })} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                      dir="ltr" 
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'كلمة المرور' : 'SMTP Password'}</label>
                    <input 
                      type="password" 
                      value={settings.emailConfig.smtpPassword || ''} 
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        emailConfig: { ...settings.emailConfig, smtpPassword: e.target.value } 
                      })} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                      dir="ltr" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>{isAr ? 'نصيحة:' : 'Tip:'}</strong>{isAr 
                      ? ' استخدم منفذ 587 مع TLS للاتصال الآمن. تأكد من أن حساب البريد يدعم الإرسال عبر SMTP.' 
                      : ' Use port 587 with TLS for secure connection. Make sure your email account supports SMTP sending.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#104E8B]/5 border border-[#104E8B]/20 rounded-lg p-4">
            <h4 className="font-medium text-[#104E8B] mb-2">{isAr ? 'نظام الإشعارات' : 'Notification System'}</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {isAr ? 'طلبات التواصل من صفحة اتصل بنا' : 'Contact form submissions'}</li>
              <li>• {isAr ? 'طلبات واتساب الجديدة' : 'New WhatsApp requests'}</li>
              <li>• {isAr ? 'طلبات المنتجات والخدمات' : 'Product/service requests'}</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'organization' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#104E8B]" />
            {isAr ? 'معلومات المنظمة' : 'Organization Information'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'اسم المنظمة' : 'Organization Name'}</label>
              <input 
                type="text" 
                value={settings.organization.name} 
                onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, name: e.target.value } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
              <input 
                type="email" 
                value={settings.organization.email} 
                onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, email: e.target.value } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الهاتف' : 'Phone'}</label>
              <input 
                type="text" 
                value={settings.organization.phone} 
                onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, phone: e.target.value } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'المدينة' : 'City'}</label>
              <input 
                type="text" 
                value={settings.organization.address.city} 
                onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, address: { ...settings.organization.address, city: e.target.value } } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الدولة' : 'Country'}</label>
              <input 
                type="text" 
                value={settings.organization.address.country} 
                onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, address: { ...settings.organization.address, country: e.target.value } } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#104E8B]" />
              {isAr ? 'شعار المنظمة' : 'Organization Logo'}
            </h4>
            <div className="max-w-md">
              <ImageUploader
                value={settings.organization.logo}
                onChange={(url) => setSettings({ ...settings, organization: { ...settings.organization, logo: url } })}
                folder="logos"
                isAr={isAr}
              />
            </div>
          </div>

          <div className="md:col-span-2 border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الوصف (عربي)' : 'Description (AR)'}</label>
            <textarea 
              value={settings.organization.description.ar} 
              onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, description: { ...settings.organization.description, ar: e.target.value } } })} 
              rows={3} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
            />
          </div>

          <h3 className="font-bold text-gray-700 pt-4 border-t flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#104E8B]" />
            {isAr ? 'روابط السوشيال ميديا' : 'Social Media Links'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter / X</label>
              <input 
                type="text" 
                value={settings.organization.socialLinks.twitter || ''} 
                onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, socialLinks: { ...settings.organization.socialLinks, twitter: e.target.value } } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
              <input 
                type="text" 
                value={settings.organization.socialLinks.linkedin || ''} 
                onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, socialLinks: { ...settings.organization.socialLinks, linkedin: e.target.value } } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input 
                type="text" 
                value={settings.organization.socialLinks.instagram || ''} 
                onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, socialLinks: { ...settings.organization.socialLinks, instagram: e.target.value } } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
                placeholder="https://instagram.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input 
                type="text" 
                value={settings.organization.socialLinks.facebook || ''} 
                onChange={(e) => setSettings({ ...settings, organization: { ...settings.organization, socialLinks: { ...settings.organization.socialLinks, facebook: e.target.value } } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
                placeholder="https://facebook.com/page"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#104E8B]" />
            {isAr ? 'أدوات التحليل والتتبع' : 'Analytics & Tracking Tools'}
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800">
              {isAr 
                ? '💡 هذه الأدوات تساعدك في تحليل زوار الموقع وتتبع الأداء.' 
                : '💡 These tools help you analyze visitors and track performance.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Tag Manager ID</label>
              <input 
                type="text" 
                value={settings.analytics.gtmId} 
                onChange={(e) => setSettings({ ...settings, analytics: { ...settings.analytics, gtmId: e.target.value } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
                placeholder="GTM-XXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-1">
                {isAr ? 'مثال: GTM-P3F8K2' : 'Example: GTM-P3F8K2'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'Google Search Console (التحقق)' : 'Google Search Console (Verification)'}</label>
              <input 
                type="text" 
                value={settings.analytics.gscVerification} 
                onChange={(e) => setSettings({ ...settings, analytics: { ...settings.analytics, gscVerification: e.target.value } })} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                dir="ltr" 
                placeholder="google-site-verification: ..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {isAr ? 'كود التحقق من Google Search Console' : 'Verification code from Google Search Console'}
              </p>
            </div>
<div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
               <input 
                 type="text" 
                 value={settings.analytics.facebookPixelId} 
                 onChange={(e) => setSettings({ ...settings, analytics: { ...settings.analytics, facebookPixelId: e.target.value } })} 
                 className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                 dir="ltr" 
                 placeholder="XXXXXXXXXXXXXXXXXX"
               />
               <p className="text-xs text-gray-500 mt-1">
                 {isAr ? 'معرف Pixel لتتبع زيارات فيسبوك' : 'Pixel ID for Facebook visit tracking'}
               </p>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'Facebook Access Token (CAPI)' : 'Facebook Access Token (CAPI)'}</label>
               <input 
                 type="password" 
                 value={settings.analytics.facebookAccessToken || ''} 
                 onChange={(e) => setSettings({ ...settings, analytics: { ...settings.analytics, facebookAccessToken: e.target.value } })} 
                 className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                 dir="ltr" 
                 placeholder="EAAB..."
               />
               <p className="text-xs text-gray-500 mt-1">
                 {isAr ? 'رمز الوصول لـ Conversion API (آمن ولا يظهر للمستخدمين)' : 'Access Token for Conversion API (secure, not visible to users)'}
               </p>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Microsoft Clarity Project ID</label>
               <input 
                 type="text" 
                 value={settings.analytics.clarityProjectId || ''} 
                 onChange={(e) => setSettings({ ...settings, analytics: { ...settings.analytics, clarityProjectId: e.target.value } })} 
                 className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" 
                 dir="ltr" 
                 placeholder="v2xrletty3"
               />
               <p className="text-xs text-gray-500 mt-1">
                 {isAr ? 'معرف مشروع Clarity للخرائط الحرارية وتسجيل الجلسات' : 'Clarity Project ID for heatmaps and session recordings'}
               </p>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'robots' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-[#104E8B]" />
            robots.txt
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {isAr 
              ? 'ملف robots.txt يتحكم في哪些 الصفحات يمكن لمحركات البحث الوصول إليها.' 
              : 'The robots.txt file controls which pages search engines can access.'}
          </p>
          <textarea
            value={settings.robotsTxt}
            onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
            rows={15}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20"
            dir="ltr"
          />
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">{isAr ? 'أوامر شائعة' : 'Common Commands'}</h4>
            <ul className="text-xs text-gray-600 space-y-1 font-mono">
              <li><code>User-agent: *</code> - {isAr ? 'ينطبق على جميع المحركات' : 'Applies to all crawlers'}</li>
              <li><code>Allow: /</code> - {isAr ? 'السماح بالوصول' : 'Allow access'}</li>
              <li><code>Disallow: /admin</code> - {isAr ? 'حظر مجلد' : 'Block a directory'}</li>
              <li><code>Sitemap: /sitemap.xml</code> - {isAr ? 'خريطة الموقع' : 'Sitemap location'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
