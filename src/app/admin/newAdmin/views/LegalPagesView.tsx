'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, FileText, Eye, EyeOff, Loader2, Plus, Trash2, ExternalLink, Lock } from 'lucide-react';
import { RichTextEditor } from '@/components/business/RichTextEditor';

interface LegalPage {
  _id: string;
  slug: string;
  title: { en: string; ar: string };
  content: { en: string; ar: string };
  seo: { title: { en: string; ar: string }; description: { en: string; ar: string } };
  isActive: boolean;
  isSystem: boolean;
  order: number;
}

const emptyPage = (): Partial<LegalPage> => ({
  slug: '',
  title: { en: '', ar: '' },
  content: { en: '', ar: '' },
  seo: { title: { en: '', ar: '' }, description: { en: '', ar: '' } },
  isActive: true,
  isSystem: false,
});

export function LegalPagesView({ isAr }: { isAr: boolean }) {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editLang, setEditLang] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async (selectId?: string) => {
    try {
      const res = await fetch('/api/legal?admin=true');
      const data = await res.json();
      if (data.success) {
        setPages(data.pages);
        if (selectId) setActiveId(selectId);
        else if (!activeId && data.pages.length) setActiveId(data.pages[0]._id);
      }
    } catch {
      toast.error(isAr ? 'تعذّر تحميل الصفحات' : 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const active = pages.find((p) => p._id === activeId) || null;

  const patchActive = (patch: Partial<LegalPage>) =>
    setPages((prev) => prev.map((p) => (p._id === activeId ? { ...p, ...patch } : p)));

  const setBilingual = (field: 'title' | 'content', value: string) =>
    active && patchActive({ [field]: { ...(active as any)[field], [editLang]: value } } as any);

  const setSeo = (field: 'title' | 'description', value: string) =>
    active && patchActive({ seo: { ...active.seo, [field]: { ...active.seo[field], [editLang]: value } } });

  // إنشاء صفحة جديدة
  const addPage = async () => {
    const base = emptyPage();
    const res = await fetch('/api/legal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...base, slug: `new-page-${Date.now().toString(36)}`, title: { ar: 'صفحة جديدة', en: 'New Page' } }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error || 'فشل الإنشاء'); return; }
    toast.success(isAr ? 'أُنشئت صفحة جديدة' : 'New page created');
    await load(data.page._id);
  };

  // حفظ الصفحة الحالية
  const save = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/legal/${active._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: active.slug,
          title: active.title,
          content: active.content,
          seo: active.seo,
          isActive: active.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast.success(isAr ? 'تم الحفظ' : 'Saved');
      await load(active._id);
    } catch (e: any) {
      toast.error(e.message || (isAr ? 'فشل الحفظ' : 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  // حذف صفحة
  const remove = async (page: LegalPage) => {
    if (page.isSystem) { toast.error(isAr ? 'الصفحات النظامية لا تُحذف' : 'System pages cannot be deleted'); return; }
    if (!confirm(isAr ? `حذف صفحة "${page.title.ar || page.slug}"؟` : `Delete "${page.title.en || page.slug}"?`)) return;
    const res = await fetch(`/api/legal/${page._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error || 'فشل الحذف'); return; }
    toast.success(isAr ? 'حُذفت الصفحة' : 'Page deleted');
    setActiveId(null);
    await load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        {isAr ? 'جارٍ التحميل...' : 'Loading...'}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            {isAr ? 'الصفحات القانونية' : 'Legal Pages'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr ? 'أضف صفحات جديدة وتحكّم باسمها ورابطها ومحتواها. التعديلات تظهر فوراً.' : 'Add pages and control their name, URL, and content. Changes appear instantly.'}
          </p>
        </div>
        <button onClick={addPage} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          {isAr ? 'صفحة جديدة' : 'New Page'}
        </button>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* قائمة الصفحات */}
        <div className="space-y-2">
          {pages.map((p) => (
            <div
              key={p._id}
              className={`group flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                activeId === p._id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setActiveId(p._id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {p.isSystem && <Lock className="w-3 h-3 text-gray-400 shrink-0" />}
                  <span className="text-sm font-medium text-gray-900 truncate">{isAr ? p.title.ar || p.slug : p.title.en || p.slug}</span>
                </div>
                <span className="text-xs text-gray-400 truncate block" dir="ltr">/{p.slug}</span>
              </div>
              {!p.isActive && <EyeOff className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
              {!p.isSystem && (
                <button
                  onClick={(e) => { e.stopPropagation(); remove(p); }}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 shrink-0"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          {pages.length === 0 && (
            <p className="text-sm text-gray-500 p-3">{isAr ? 'لا توجد صفحات.' : 'No pages.'}</p>
          )}
        </div>

        {/* المحرّر */}
        {active ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b pb-4">
              <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                {(['ar', 'en'] as const).map((l) => (
                  <button key={l} onClick={() => setEditLang(l)}
                    className={`px-4 py-1.5 text-sm font-medium ${editLang === l ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                    {l === 'ar' ? 'العربية' : 'English'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => patchActive({ isActive: !active.isActive })}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${active.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {active.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {active.isActive ? (isAr ? 'ظاهرة' : 'Visible') : (isAr ? 'مخفية' : 'Hidden')}
                </button>
                <a href={`/${active.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> {isAr ? 'معاينة' : 'Preview'}
                </a>
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isAr ? 'حفظ' : 'Save'}
                </button>
              </div>
            </div>

            {/* الاسم + الرابط */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isAr ? `اسم الصفحة (${editLang === 'ar' ? 'عربي' : 'إنجليزي'})` : `Page Name (${editLang})`}
                </label>
                <input type="text" value={active.title[editLang] || ''} onChange={(e) => setBilingual('title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  dir={editLang === 'ar' ? 'rtl' : 'ltr'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  {isAr ? 'الرابط (URL)' : 'URL (slug)'}
                  {active.isSystem && <span className="text-xs text-gray-400">{isAr ? '(صفحة نظامية)' : '(system)'}</span>}
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-400 shrink-0" dir="ltr">/</span>
                  <input type="text" value={active.slug} onChange={(e) => patchActive({ slug: e.target.value })}
                    placeholder="terms" dir="ltr"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <p className="text-xs text-gray-400 mt-1" dir="ltr">corbit.sa/{active.slug}</p>
              </div>
            </div>

            {/* المحتوى */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'المحتوى' : 'Content'}</label>
              <RichTextEditor
                key={`${active._id}-${editLang}`}
                content={active.content[editLang] || ''}
                onChange={(html) => setBilingual('content', html)}
                placeholder={editLang === 'ar' ? 'اكتب المحتوى بالعربية...' : 'Write content in English...'}
              />
            </div>

            {/* SEO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'عنوان SEO' : 'SEO Title'}</label>
                <input type="text" value={active.seo.title[editLang] || ''} onChange={(e) => setSeo('title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  dir={editLang === 'ar' ? 'rtl' : 'ltr'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'وصف SEO' : 'SEO Description'}</label>
                <input type="text" value={active.seo.description[editLang] || ''} onChange={(e) => setSeo('description', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  dir={editLang === 'ar' ? 'rtl' : 'ltr'} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-2xl">
            {isAr ? 'اختر صفحة من القائمة أو أضف صفحة جديدة' : 'Select a page or add a new one'}
          </div>
        )}
      </div>
    </div>
  );
}
