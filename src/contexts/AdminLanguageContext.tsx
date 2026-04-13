'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminTranslations {
  dashboard: string;
  heroSection: string;
  aboutUs: string;
  uniqueFeatures: string;
  services: string;
  portfolio: string;
  testimonials: string;
  faqs: string;
  video: string;
  packages: string;
  logout: string;
  welcome: string;
  adminDashboard: string;
  controlPanel: string;
  backToDashboard: string;
  saveChanges: string;
  saving: string;
  loading: string;
  edit: string;
  delete: string;
  create: string;
  cancel: string;
  confirm: string;
  english: string;
  arabic: string;
}

const translations: { en: AdminTranslations; ar: AdminTranslations } = {
  en: {
    dashboard: 'Dashboard',
    heroSection: 'Hero Section',
    aboutUs: 'About Us',
    uniqueFeatures: 'Unique Features',
    services: 'Services',
    portfolio: 'Portfolio',
    testimonials: 'Testimonials',
    faqs: 'FAQs',
    video: 'Video',
    packages: 'Packages',
    logout: 'Logout',
    welcome: 'Welcome back,',
    adminDashboard: 'Admin Dashboard',
    controlPanel: 'ORBIT Control Panel',
    backToDashboard: 'Back to Dashboard',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    loading: 'Loading...',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    cancel: 'Cancel',
    confirm: 'Confirm',
    english: 'English',
    arabic: 'Arabic',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    heroSection: 'قسم البطل',
    aboutUs: 'من نحن',
    uniqueFeatures: 'ما يميزنا',
    services: 'الخدمات',
    portfolio: 'الأعمال',
    testimonials: 'الشهادات',
    faqs: 'الأسئلة الشائعة',
    video: 'الفيديو',
    packages: 'الباقات',
    logout: 'تسجيل الخروج',
    welcome: 'مرحبًا بعودتك،',
    adminDashboard: 'لوحة إدارة',
    controlPanel: 'لوحة تحكم مارك لاين',
    backToDashboard: 'العودة للوحة التحكم',
    saveChanges: 'حفظ التغييرات',
    saving: 'جاري الحفظ...',
    loading: 'جاري التحميل...',
    edit: 'تعديل',
    delete: 'حذف',
    create: 'إنشاء',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    english: 'English',
    arabic: 'العربية',
  },
};

interface AdminLanguageContextType {
  language: 'en' | 'ar';
  t: AdminTranslations;
  toggleLanguage: () => void;
  isArabic: boolean;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('adminLanguage') as 'en' | 'ar' | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'en' ? 'ar' : 'en';
      localStorage.setItem('adminLanguage', newLang);
      return newLang;
    });
  };

  const value = {
    language,
    t: translations[language],
    toggleLanguage,
    isArabic: language === 'ar',
  };

  return (
    <AdminLanguageContext.Provider value={value}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error('useAdminLanguage must be used within AdminLanguageProvider');
  }
  return context;
}

