'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, GripVertical, FileText, Globe, Layers } from 'lucide-react';
import { Button } from '@/components/business/ui/button';
import { Card, CardContent } from '@/components/business/ui/card';
import { useSiteData } from '../SiteDataContext';

interface Props {
  isAr: boolean;
  onNavigate: (view: 'cms-page-editor', options?: { pageId?: string }) => void;
}

const getPageIcon = (pageId: string) => {
  if (pageId === 'home') return Globe;
  if (pageId.includes('sms') || pageId.includes('whatsapp') || pageId.includes('wa')) return Layers;
  return FileText;
};

const getPageTheme = (pageId: string) => {
  if (pageId === 'home') return { color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-l-blue-500' };
  if (pageId.includes('sms')) return { color: 'text-green-500', bg: 'bg-green-50', border: 'border-l-green-500' };
  if (pageId.includes('whatsapp') || pageId.includes('wa')) return { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-l-emerald-500' };
  if (pageId.includes('schoolbit')) return { color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-l-sky-600' };
  if (pageId.includes('otime') || pageId.includes('o-time')) return { color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-l-purple-500' };
  if (pageId.includes('gov')) return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-500' };
  return { color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-l-gray-400' };
};

export function CmsPagesView({ isAr, onNavigate }: Props) {
  const { pages, setPages } = useSiteData();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleVisibility = async (pageId: string, currentVisible: boolean) => {
    if (pageId === 'home') return;
    setUpdatingId(pageId);
    try {
      const updatedPages = pages.map(p => p.id === pageId ? { ...p, visible: !currentVisible } : p);
      const res = await fetch("/api/cms/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: updatedPages,
        }),
      });
      if (res.ok) {
        setPages(updatedPages);
      } else {
        alert(isAr ? 'حدث خطأ أثناء تحديث الحالة' : 'Error updating status');
      }
    } catch (error) {
      console.error('Failed to update visibility:', error);
      alert(isAr ? 'حدث خطأ أثناء تحديث الحالة' : 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        const siteRes = await fetch("/api/cms/site");
        if (siteRes.ok) {
          const data = await siteRes.json();
          const site = data?.site;
          if (site?.pages) {
            setPages(site.pages);
          }
        }
      } else {
        alert(isAr ? 'حدث خطأ أثناء إضافة الصفحات' : 'Error seeding pages');
      }
    } catch (error) {
      console.error('Seed failed:', error);
      alert(isAr ? 'حدث خطأ أثناء إضافة الصفحات' : 'Error seeding pages');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذه الصفحة؟ سيتم حذف جميع محتوياتها.' : 'Are you sure you want to delete this page? All content will be deleted.')) {
      return;
    }
    setDeletingId(pageId);
    try {
      const updatedPages = pages.filter(p => p.id !== pageId);
      const res = await fetch("/api/cms/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: updatedPages,
        }),
      });
      if (res.ok) {
        setPages(updatedPages);
      } else {
        alert(isAr ? 'حدث خطأ أثناء الحذف' : 'Error deleting page');
      }
    } catch (error) {
      console.error('Failed to delete page:', error);
      alert(isAr ? 'حدث خطأ أثناء الحذف' : 'Error deleting page');
    } finally {
      setDeletingId(null);
    }
  };

  if (pages.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة المحتوى' : 'Content Management'}</h2>
          <p className="text-gray-500 mt-1">{isAr ? 'إنشاء وتعديل صفحات الموقع' : 'Create and edit website pages'}</p>
        </div>
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-1 text-lg font-medium">{isAr ? 'لا توجد صفحات بعد' : 'No pages yet'}</p>
          <p className="text-gray-400 text-sm mb-6">{isAr ? 'اضغط الزر أدناه لإضافة الصفحات الافتراضية' : 'Click the button below to add default pages'}</p>
          <Button 
            onClick={handleSeed} 
            disabled={seeding}
            className="bg-[#104E8B] hover:bg-[#0A2647] text-white shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {seeding ? (isAr ? 'جارِ الإضافة...' : 'Adding pages...') : (isAr ? 'إضافة الصفحات الافتراضية' : 'Add Default Pages')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة المحتوى' : 'Content Management'}</h2>
          <p className="text-gray-500 mt-1 text-sm">{isAr ? 'إنشاء وتعديل صفحات الموقع' : 'Create and edit website pages'}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#104E8B]/5 px-3 py-1.5 rounded-lg">
          <Layers className="w-4 h-4 text-[#104E8B]" />
          <span className="text-sm font-medium text-[#104E8B]">{pages.length} {isAr ? 'صفحات' : 'pages'}</span>
        </div>
      </div>

      <div className="space-y-3">
        {pages.map((page) => {
          const theme = getPageTheme(page.id);
          const IconComponent = getPageIcon(page.id);
          return (
            <div
              key={page.id}
              className={`rounded-xl overflow-hidden border-l-4 ${theme.border} bg-white shadow-sm hover:shadow-md transition-all border border-gray-100`}
            >
              <div className="flex items-center justify-between p-4 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${theme.bg} ${theme.color} flex-shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{isAr ? page.title : page.titleEn}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 font-mono">{page.path}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className={`text-[10px] font-medium ${page.sections?.length ? 'text-gray-400' : 'text-gray-300'}`}>
                        {page.sections?.length || 0} {isAr ? 'قسم' : 'sections'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleVisibility(page.id, page.visible !== false)}
                    disabled={updatingId === page.id || page.id === 'home'}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      page.visible !== false
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {page.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span className="hidden sm:inline">{page.visible !== false ? (isAr ? 'منشور' : 'Live') : (isAr ? 'مخفي' : 'Hidden')}</span>
                  </button>
                  <a
                    href={page.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-[#104E8B] hover:bg-blue-50 rounded-lg transition-colors"
                    title={isAr ? 'معاينة' : 'Preview'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onNavigate('cms-page-editor', { pageId: page.id })}
                    className="p-2 text-[#104E8B] hover:bg-blue-50 rounded-lg transition-colors"
                    title={isAr ? 'تعديل' : 'Edit'}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {page.id !== 'home' && (
                    <button
                      onClick={() => handleDelete(page.id)}
                      disabled={deletingId === page.id}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}