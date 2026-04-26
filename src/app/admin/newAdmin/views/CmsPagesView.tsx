'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, GripVertical } from 'lucide-react';
import { Button } from '@/components/business/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/business/ui/card';
import { useSiteData, PageData } from '../SiteDataContext';

interface Props {
  isAr: boolean;
  onNavigate: (view: 'cms-page-editor', options?: { pageId?: string }) => void;
}

export function CmsPagesView({ isAr, onNavigate }: Props) {
  const { pages, refreshData } = useSiteData();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleVisibility = async (pageId: string, currentVisible: boolean) => {
    if (pageId === 'home') return; // Don't allow hiding home page
    setUpdatingId(pageId);
    try {
      const res = await fetch("/api/cms/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: pages.map(p => p.id === pageId ? { ...p, visible: !currentVisible } : p),
        }),
      });
      if (res.ok) {
        await refreshData();
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
        await refreshData();
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
      const res = await fetch("/api/cms/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: pages.filter(p => p.id !== pageId),
        }),
      });
      if (res.ok) {
        await refreshData();
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة المحتوى' : 'Content Management'}</h2>
            <p className="text-gray-500 mt-1">{isAr ? 'إنشاء وتعديل صفحات الموقع' : 'Create and edit website pages'}</p>
          </div>
        </div>
        <Card className="border border-gray-200">
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">{isAr ? 'لا توجد صفحات بعد. اضغط الزر أدناه لإضافة الصفحات الافتراضية.' : 'No pages found. Click the button below to add default pages.'}</p>
            <Button 
              onClick={handleSeed} 
              disabled={seeding}
              className="bg-[#104E8B] hover:bg-[#0A2647] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {seeding ? (isAr ? 'جارِ الإضافة...' : 'Adding pages...') : (isAr ? 'إضافة الصفحات الافتراضية' : 'Add Default Pages')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة المحتوى' : 'Content Management'}</h2>
          <p className="text-gray-500 mt-1">{isAr ? 'إنشاء وتعديل صفحات الموقع' : 'Create and edit website pages'}</p>
        </div>
        <div className="text-sm text-gray-500">
          {pages.length} {isAr ? 'صفحات' : 'pages'}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{isAr ? 'الترتيب' : 'Order'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{isAr ? 'الرابط' : 'Path'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{isAr ? 'العنوان' : 'Title'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{isAr ? 'الحالة' : 'Status'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{isAr ? 'الأقسام' : 'Sections'}</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">{isAr ? 'آخر تعديل' : 'Last Edited'}</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{isAr ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pages.map((page, index) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </td>
                <td className="px-4 py-3 text-sm font-medium">{page.id}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 font-mono text-xs">{page.path}</span>
                    <a href={page.path} target="_blank" rel="noopener noreferrer" className="text-[#104E8B] hover:underline">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="text-gray-900">{isAr ? page.title : page.titleEn}</div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleToggleVisibility(page.id, page.visible !== false)}
                    disabled={updatingId === page.id || page.id === 'home'}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      page.visible !== false
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {page.visible !== false ? (
                      <><Eye className="w-3 h-3" /> {isAr ? 'ظاهرة' : 'Visible'}</>
                    ) : (
                      <><EyeOff className="w-3 h-3" /> {isAr ? 'مخفية' : 'Hidden'}</>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {page.sections?.length || 0} {isAr ? 'قسم' : 'sections'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {page.lastEdited || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onNavigate('cms-page-editor', { pageId: page.id })}
                      className="p-2 text-[#104E8B] hover:bg-blue-50 rounded-lg transition-colors"
                      title={isAr ? 'تعديل' : 'Edit'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      disabled={deletingId === page.id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
