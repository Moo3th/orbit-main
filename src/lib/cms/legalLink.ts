/**
 * حلّ وجهة رابط السياسة حسب السلوك المختار من اللوحة.
 * ملف نقي بلا اعتماديات خادم — يُستورد في التذييل (مكوّن عميل) وفي الخادم معاً.
 */

export interface LegalLinkLike {
  type?: string | null;
  targetSlug?: string | null;
  targetAnchor?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  openInNewTab?: boolean | null;
}

export interface ResolvedLegalLink {
  /** العنوان النهائي — فارغ يعني أن الرابط غير مكتمل فلا يُعرض. */
  href: string;
  /** رابط تحميل ملف (يحتاج سمة download). */
  isDownload: boolean;
  openInNewTab: boolean;
}

const EMPTY: ResolvedLegalLink = { href: '', isDownload: false, openInNewTab: false };

/** يضيف ?download=1 لملفات GridFS الداخلية حتى ينزّلها المتصفح بدل عرضها. */
function withDownloadParam(url: string): string {
  if (!url.startsWith('/api/uploads/')) return url;
  if (/[?&]download=/.test(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}download=1`;
}

export function resolveLegalLink(page: {
  slug?: string | null;
  link?: LegalLinkLike | null;
}): ResolvedLegalLink {
  const slug = (page?.slug || '').replace(/^\/+/, '');
  const link = page?.link || {};
  const type = link.type || 'page';

  if (type === 'file') {
    const fileUrl = (link.fileUrl || '').trim();
    if (!fileUrl) return EMPTY; // لم يُرفع ملف بعد — لا نعرض رابطاً مكسوراً
    return { href: withDownloadParam(fileUrl), isDownload: true, openInNewTab: true };
  }

  if (type === 'anchor') {
    const targetSlug = (link.targetSlug || slug).replace(/^\/+/, '');
    if (!targetSlug) return EMPTY;
    const anchor = (link.targetAnchor || '').replace(/^#/, '');
    return {
      href: anchor ? `/${targetSlug}#${anchor}` : `/${targetSlug}`,
      isDownload: false,
      openInNewTab: Boolean(link.openInNewTab),
    };
  }

  if (!slug) return EMPTY;
  return { href: `/${slug}`, isDownload: false, openInNewTab: Boolean(link.openInNewTab) };
}
