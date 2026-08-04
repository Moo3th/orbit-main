'use client';

import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, FileText, Eye, EyeOff, Loader2, Plus, Trash2, ExternalLink, Lock, Link2, ListTree, Download, Upload as UploadIcon } from 'lucide-react';
import { RichTextEditor } from '@/components/business/RichTextEditor';
import { listLegalLines, truncateLine } from '@/lib/cms/legalAnchors';
import { resolveLegalLink } from '@/lib/cms/legalLink';

type LegalLinkType = 'page' | 'anchor' | 'file';

interface LegalLink {
  type: LegalLinkType;
  targetSlug: string;
  targetAnchor: string;
  targetLabel: { en: string; ar: string };
  fileUrl: string;
  fileName: string;
  openInNewTab: boolean;
}

interface LegalPage {
  _id: string;
  slug: string;
  title: { en: string; ar: string };
  content: { en: string; ar: string };
  seo: { title: { en: string; ar: string }; description: { en: string; ar: string } };
  link: LegalLink;
  isActive: boolean;
  isSystem: boolean;
  order: number;
}

const defaultLink = (): LegalLink => ({
  type: 'page',
  targetSlug: '',
  targetAnchor: '',
  targetLabel: { en: '', ar: '' },
  fileUrl: '',
  fileName: '',
  openInNewTab: false,
});

/** الصفحات القديمة في القاعدة بلا حقل link — نعطيها السلوك الافتراضي. */
const withLinkDefaults = (page: LegalPage): LegalPage => ({
  ...page,
  link: { ...defaultLink(), ...(page.link || {}), targetLabel: { ...defaultLink().targetLabel, ...(page.link?.targetLabel || {}) } },
});

const emptyPage = (): Partial<LegalPage> => ({
  slug: '',
  title: { en: '', ar: '' },
  content: { en: '', ar: '' },
  seo: { title: { en: '', ar: '' }, description: { en: '', ar: '' } },
  link: defaultLink(),
  isActive: true,
  isSystem: false,
});

export function LegalPagesView({ isAr }: { isAr: boolean }) {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editLang, setEditLang] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const load = async (selectId?: string) => {
    try {
      const res = await fetch('/api/legal?admin=true');
      const data = await res.json();
      if (data.success) {
        setPages((data.pages as LegalPage[]).map(withLinkDefaults));
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

  const patchLink = (patch: Partial<LegalLink>) =>
    active && patchActive({ link: { ...active.link, ...patch } });

  // ── الخيار 2: سياسة موجودة + سطر محدد ───────────────────────────────
  // الصفحة الهدف يجب أن تكون غير الصفحة الحالية (لا معنى لأن تشير لنفسها).
  const anchorTargets = useMemo(
    () => pages.filter((p) => p._id !== activeId),
    [pages, activeId]
  );

  const anchorTargetPage = useMemo(
    () => pages.find((p) => p.slug === active?.link.targetSlug) || null,
    [pages, active?.link.targetSlug]
  );

  // سطور الصفحة الهدف بالترتيب — نفس الترقيم الذي يُحقن في الصفحة المنشورة.
  const anchorLines = useMemo(() => {
    if (!anchorTargetPage) return [];
    return listLegalLines(anchorTargetPage.content?.[editLang] || '').filter((line) => line.text);
  }, [anchorTargetPage, editLang]);

  const selectAnchorLine = (anchor: string) => {
    if (!anchorTargetPage) return;
    const arLines = listLegalLines(anchorTargetPage.content?.ar || '');
    const enLines = listLegalLines(anchorTargetPage.content?.en || '');
    patchLink({
      targetAnchor: anchor,
      targetLabel: {
        ar: arLines.find((l) => l.anchor === anchor)?.text || '',
        en: enLines.find((l) => l.anchor === anchor)?.text || '',
      },
    });
  };

  // ── الخيار 3: رفع الملف الذي يُحمَّل عند الضغط ────────────────────────
  const uploadLinkFile = async (file: File) => {
    setUploadingFile(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'legal');
      const res = await fetch('/api/uploads', { method: 'POST', body: form });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(
          res.status === 413
            ? (isAr ? 'الملف كبير جداً للرفع (الحد ~4MB).' : 'File too large to upload (~4MB limit).')
            : (isAr ? `فشل رفع الملف (رمز ${res.status}).` : `Upload failed (status ${res.status}).`)
        );
      }
      const data = await res.json();
      if (!data?.success || !data?.upload?.url) throw new Error(data?.error || 'Upload failed');
      patchLink({ fileUrl: data.upload.url, fileName: data.upload.originalName || file.name });
      toast.success(isAr ? 'تم رفع الملف — لا تنسَ الحفظ' : 'File uploaded — remember to save');
    } catch (e: any) {
      toast.error(e.message || (isAr ? 'فشل رفع الملف' : 'Upload failed'));
    } finally {
      setUploadingFile(false);
    }
  };

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
    if (active.link.type === 'anchor' && (!active.link.targetSlug || !active.link.targetAnchor)) {
      toast.error(isAr ? 'اختر السياسة والسطر المراد الانتقال إليه' : 'Select the policy and the line to jump to');
      return;
    }
    if (active.link.type === 'file' && !active.link.fileUrl) {
      toast.error(isAr ? 'ارفع الملف المراد تحميله' : 'Upload the file to be downloaded');
      return;
    }
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
          link: active.link,
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
                {/* وجهة الرابط الفعلية كما سيراها الزائر من التذييل */}
              <span className="text-xs text-gray-400 truncate block" dir="ltr">
                {p.link?.type === 'file'
                  ? `⤓ ${p.link.fileName || p.link.fileUrl || '—'}`
                  : resolveLegalLink(p).href || `/${p.slug}`}
              </span>
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
                <a href={resolveLegalLink(active).href || `/${active.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> {isAr ? 'معاينة الرابط' : 'Preview link'}
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

            {/* سلوك الرابط عند الضغط عليه في التذييل */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  {isAr ? 'عند الضغط على الرابط في التذييل' : 'When the footer link is clicked'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isAr ? 'اختر ما الذي يحدث للزائر عند الضغط على اسم هذه السياسة أسفل الموقع.' : 'Choose what happens when a visitor clicks this policy name in the footer.'}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {([
                  { value: 'page' as const, icon: FileText, title: isAr ? 'فتح صفحة خاصة بالسياسة' : 'Open a dedicated policy page', hint: isAr ? 'يفتح هذه الصفحة بالمحتوى المكتوب أدناه.' : 'Opens this page with the content below.' },
                  { value: 'anchor' as const, icon: ListTree, title: isAr ? 'فتح سياسة موجودة عند سطر محدد' : 'Open an existing policy at a line', hint: isAr ? 'يفتح سياسة أخرى وينتقل مباشرة إلى السطر المختار.' : 'Opens another policy and scrolls to the chosen line.' },
                  { value: 'file' as const, icon: Download, title: isAr ? 'تحميل ملف' : 'Download a file', hint: isAr ? 'ينزّل الملف المرفوع فوراً عند الضغط.' : 'Downloads the uploaded file on click.' },
                ]).map((option) => {
                  const Icon = option.icon;
                  const selected = active.link.type === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => patchLink({ type: option.value, openInNewTab: option.value === 'file' })}
                      className={`text-start rounded-lg border p-3 transition-colors ${
                        selected ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Icon className={`w-4 h-4 ${selected ? 'text-primary' : 'text-gray-400'}`} />
                        {option.title}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1 leading-relaxed">{option.hint}</span>
                    </button>
                  );
                })}
              </div>

              {/* الخيار 2: تحديد السياسة والسطر */}
              {active.link.type === 'anchor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{isAr ? 'السياسة' : 'Policy'}</label>
                    <select
                      value={active.link.targetSlug}
                      onChange={(e) => patchLink({ targetSlug: e.target.value, targetAnchor: '', targetLabel: { en: '', ar: '' } })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">{isAr ? '— اختر سياسة —' : '— Select a policy —'}</option>
                      {anchorTargets.map((p) => (
                        <option key={p._id} value={p.slug}>
                          {(isAr ? p.title.ar : p.title.en) || p.slug}
                          {p.isActive ? '' : (isAr ? ' (مخفية)' : ' (hidden)')}
                        </option>
                      ))}
                    </select>
                    {anchorTargetPage && !anchorTargetPage.isActive && (
                      <p className="text-xs text-amber-600 mt-1">
                        {isAr ? 'هذه السياسة مخفية حالياً ولن تُفتح للزوار — فعّلها من قائمة الصفحات.' : 'This policy is hidden and will not open for visitors — enable it first.'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {isAr ? `السطر (${editLang === 'ar' ? 'حسب النص العربي' : 'per English text'})` : 'Line'}
                    </label>
                    <select
                      value={active.link.targetAnchor}
                      onChange={(e) => selectAnchorLine(e.target.value)}
                      disabled={!anchorTargetPage}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">{isAr ? '— اختر السطر —' : '— Select a line —'}</option>
                      {anchorLines.map((line) => (
                        <option key={line.anchor} value={line.anchor}>
                          {line.index}. {/^h[1-6]$/.test(line.tag) ? '▸ ' : ''}{truncateLine(line.text, 70)}
                        </option>
                      ))}
                    </select>
                    {anchorTargetPage && anchorLines.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        {isAr ? 'لا يوجد محتوى في هذه اللغة لهذه السياسة.' : 'This policy has no content in this language.'}
                      </p>
                    )}
                    {active.link.targetAnchor && (
                      <p className="text-xs text-gray-400 mt-1" dir="ltr">
                        /{active.link.targetSlug}#{active.link.targetAnchor}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* الخيار 3: رفع الملف */}
              {active.link.type === 'file' && (
                <div className="pt-1 space-y-2">
                  <label className="block text-xs font-medium text-gray-600">
                    {isAr ? 'الملف الذي يُحمَّل عند الضغط (PDF أو Word — حتى 4MB)' : 'File to download on click (PDF or Word — up to 4MB)'}
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${uploadingFile ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />}
                      {uploadingFile ? (isAr ? 'جارٍ الرفع...' : 'Uploading...') : (isAr ? 'رفع ملف' : 'Upload file')}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,application/pdf"
                        className="hidden"
                        disabled={uploadingFile}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (file) void uploadLinkFile(file);
                        }}
                      />
                    </label>
                    {active.link.fileUrl && (
                      <>
                        <a href={active.link.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                          <ExternalLink className="w-3.5 h-3.5" />
                          {active.link.fileName || (isAr ? 'الملف الحالي' : 'Current file')}
                        </a>
                        <button
                          type="button"
                          onClick={() => patchLink({ fileUrl: '', fileName: '' })}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          {isAr ? 'إزالة' : 'Remove'}
                        </button>
                      </>
                    )}
                  </div>
                  {!active.link.fileUrl && (
                    <p className="text-xs text-amber-600">
                      {isAr ? 'لن يظهر الرابط في التذييل قبل رفع الملف.' : 'The link stays hidden in the footer until a file is uploaded.'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* المحتوى */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? 'المحتوى' : 'Content'}</label>
              {active.link.type !== 'page' && (
                <p className="text-xs text-amber-600 mb-2">
                  {isAr
                    ? 'الرابط في التذييل لا يفتح هذا المحتوى حالياً (حسب السلوك المختار أعلاه)، لكنه يبقى متاحاً على رابط الصفحة.'
                    : 'The footer link does not open this content right now (per the behaviour above), but it stays available at the page URL.'}
                </p>
              )}
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
