import mongoose, { Schema, Model } from 'mongoose';

/**
 * سلوك الرابط عند الضغط عليه في التذييل:
 * - `page`   : فتح صفحة السياسة نفسها (المحتوى المكتوب أدناه).
 * - `anchor` : فتح سياسة موجودة والانتقال إلى سطر محدد داخلها.
 * - `file`   : تحميل ملف مرفوع من اللوحة.
 */
export type LegalLinkType = 'page' | 'anchor' | 'file';

export const LEGAL_LINK_TYPES: LegalLinkType[] = ['page', 'anchor', 'file'];

export interface ILegalLink {
  type: LegalLinkType;
  /** (anchor) رابط السياسة الهدف. */
  targetSlug: string;
  /** (anchor) معرّف السطر داخل السياسة الهدف، مثل "sec-3". */
  targetAnchor: string;
  /** (anchor) نص السطر المختار — لقطة للعرض في اللوحة فقط. */
  targetLabel: { en: string; ar: string };
  /** (file) رابط الملف المرفوع. */
  fileUrl: string;
  /** (file) اسم الملف كما يظهر للزائر. */
  fileName: string;
  openInNewTab: boolean;
}

export interface ILegalPage {
  _id?: string;
  /** الرابط (الجزء بعد الجذر) — قابل للتحرير من اللوحة، فريد. */
  slug: string;
  title: { en: string; ar: string };
  /** محتوى غني (HTML) قادم من محرّر TipTap. */
  content: { en: string; ar: string };
  seo: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
  };
  /** ما الذي يحدث عند الضغط على الرابط في التذييل. */
  link: ILegalLink;
  isActive: boolean;
  /** صفحة نظامية افتراضية (الشروط/الخصوصية...) — لا تُحذف، لكن محتواها وعنوانها قابلان للتحرير. */
  isSystem: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const bilingual = () => ({
  en: { type: String, default: '' },
  ar: { type: String, default: '' },
});

const legalLinkSchema = new Schema<ILegalLink>(
  {
    type: { type: String, enum: LEGAL_LINK_TYPES, default: 'page' },
    targetSlug: { type: String, default: '' },
    targetAnchor: { type: String, default: '' },
    targetLabel: bilingual(),
    fileUrl: { type: String, default: '' },
    fileName: { type: String, default: '' },
    openInNewTab: { type: Boolean, default: false },
  },
  { _id: false }
);

export const defaultLegalLink = (): ILegalLink => ({
  type: 'page',
  targetSlug: '',
  targetAnchor: '',
  targetLabel: { en: '', ar: '' },
  fileUrl: '',
  fileName: '',
  openInNewTab: false,
});

/** يطبّع كائن الرابط القادم من اللوحة ويُسقط أي حقول غريبة. */
export function normalizeLegalLink(input: unknown): ILegalLink {
  const raw = (input && typeof input === 'object' ? input : {}) as Partial<ILegalLink>;
  const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
  const type: LegalLinkType = LEGAL_LINK_TYPES.includes(raw.type as LegalLinkType)
    ? (raw.type as LegalLinkType)
    : 'page';
  const label = (raw.targetLabel && typeof raw.targetLabel === 'object' ? raw.targetLabel : {}) as Partial<ILegalLink['targetLabel']>;

  return {
    type,
    targetSlug: str(raw.targetSlug).replace(/^\/+/, ''),
    targetAnchor: str(raw.targetAnchor).replace(/^#/, ''),
    targetLabel: { en: str(label.en), ar: str(label.ar) },
    fileUrl: str(raw.fileUrl),
    fileName: str(raw.fileName),
    openInNewTab: typeof raw.openInNewTab === 'boolean' ? raw.openInNewTab : type === 'file',
  };
}

const legalPageSchema = new Schema<ILegalPage>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: bilingual(),
    content: bilingual(),
    seo: {
      title: bilingual(),
      description: bilingual(),
    },
    link: { type: legalLinkSchema, default: defaultLegalLink },
    isActive: { type: Boolean, default: true },
    isSystem: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

legalPageSchema.index({ slug: 1 }, { unique: true });
legalPageSchema.index({ isActive: 1 });
legalPageSchema.index({ order: 1 });

const existingLegalPageModel = mongoose.models.LegalPage as Model<ILegalPage> | undefined;

// في التطوير قد يحتفظ Mongoose بمخطّط قديم في الذاكرة بعد إعادة التحميل الساخن،
// فيُسقط الحقول الجديدة عند الحفظ. نُعيد بناء النموذج إذا غاب مسار `link`.
if (existingLegalPageModel && !existingLegalPageModel.schema.path('link')) {
  delete mongoose.models.LegalPage;
}

export const LegalPage = (mongoose.models.LegalPage as Model<ILegalPage>) ||
  mongoose.model<ILegalPage>('LegalPage', legalPageSchema);

/** مسارات الجذر المحجوزة التي لا يجوز أن يتعارض معها رابط صفحة قانونية. */
export const RESERVED_SLUGS = new Set([
  'about-us', 'admin', 'api', 'blog', 'contact', 'enterprise', 'forms',
  'healthcare', 'news', 'offers', 'packages', 'portfolio', 'preview',
  'products', 'request-quote', 'solutions', 'sitemap.xml', 'robots.txt',
]);

/** يطبّع الـ slug: حروف صغيرة، شرطات، بلا رموز غير آمنة. */
export function normalizeSlug(input: string): string {
  return (input || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-');
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}
