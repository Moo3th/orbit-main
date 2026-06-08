// يربط slugs نموذج Solution القديم (مسارات /solutions/* المحذوفة) بمسارات المنتجات المعتمدة /products/*.
// مصدر بيانات البطاقات (العنوان/الوصف/الصورة) ما زال يأتي من /api/solutions،
// لكن الروابط يجب أن تشير إلى صفحات المنتجات المعتمدة.

export const SOLUTION_SLUG_TO_PRODUCT_HREF: Record<string, string> = {
  'sms-platform': '/products/sms',
  'whatsapp-business-api': '/products/whatsapp',
  'otime': '/products/o-time',
  'gov-gate': '/products/gov-gate',
  'healthcare': '/healthcare',
};

/** يعيد مسار المنتج المعتمد لِـ slug حلٍّ معيّن، مع تحويل افتراضي آمن. */
export function productHref(slug: string): string {
  return SOLUTION_SLUG_TO_PRODUCT_HREF[slug] ?? `/products/${slug}`;
}
