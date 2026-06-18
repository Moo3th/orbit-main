// مكتبة رفع الصور من جهة العميل (مشتركة بين كل أماكن إرفاق الصور).
//
// لماذا: مسارات Vercel (serverless) تحدّ حجم جسم الطلب بـ ~4.5MB. كان العميل
// يسمح حتى 10MB ويستدعي res.json() دون فحص، فحين يرجّع Vercel صفحة خطأ HTML
// (413 «الطلب كبير جداً») يتحطّم التحليل برسالة «Unexpected token '<'».
//
// الحل: نضغط الصورة في المتصفح (canvas) لتنزل تحت الحد، ثم نرفعها مع فحص
// res.ok ونوع المحتوى قبل قراءة JSON، مع رسائل خطأ واضحة (عربي/إنجليزي).

// أقصى حجم لجسم الطلب على Vercel ~4.5MB؛ نُبقي هامشاً للأجزاء الأخرى من النموذج.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
// حد أعلى للملف الخام قبل الضغط (لرفض المدخلات الضخمة التي قد تُرهق المتصفح).
const MAX_RAW_BYTES = 25 * 1024 * 1024;
// أقصى بُعد بعد الضغط (مناسب لصور الأقسام/الهيرو؛ الشعارات أصغر فلا تُكبَّر).
const MAX_DIMENSION = 1920;
// أنواع يمكن إعادة ترميزها عبر canvas بأمان (نتجنّب GIF لحفظ الحركة، وSVG لأنه متجهي).
const COMPRESSIBLE = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * يضغط/يصغّر صورة نقطية في المتصفح. يعيد الملف الأصلي كما هو إن تعذّر الضغط
 * (متصفح قديم، نوع غير مدعوم، أو لم ينفع الضغط) — آمن دائماً.
 */
export async function compressImageFile(file: File): Promise<File> {
  if (typeof document === 'undefined' || typeof createImageBitmap === 'undefined') return file;
  if (!COMPRESSIBLE.includes(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    // JPEG يبقى JPEG (متوافق وأخف للصور)؛ PNG/WebP → WebP للحفاظ على الشفافية.
    const outType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
    const quality = file.type === 'image/jpeg' ? 0.85 : 0.9;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outType, quality)
    );

    // لم يدعم المتصفح الترميز أو لم يصغّر الحجم → أبقِ الأصل.
    if (!blob || blob.size >= file.size) return file;

    const ext = outType === 'image/jpeg' ? 'jpg' : 'webp';
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.${ext}`, { type: outType });
  } catch {
    return file;
  }
}

/**
 * يرفع صورة إلى /api/uploads (تخزين GridFS) بعد ضغطها، مع معالجة أخطاء واضحة.
 * يعيد رابط الصورة عند النجاح، ويرمي Error برسالة مفهومة عند الفشل.
 */
export async function uploadImageFile(
  file: File,
  opts: { folder?: string; isAr?: boolean } = {}
): Promise<string> {
  const isAr = opts.isAr ?? true;
  const folder = opts.folder ?? 'general';

  if (!file.type.startsWith('image/')) {
    throw new Error(isAr ? 'يرجى اختيار ملف صورة' : 'Please select an image file');
  }
  if (file.size > MAX_RAW_BYTES) {
    throw new Error(isAr ? 'حجم الملف كبير جداً (الحد 25MB)' : 'File too large (max 25MB)');
  }

  const optimized = await compressImageFile(file);

  if (optimized.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      isAr
        ? 'الصورة كبيرة جداً حتى بعد الضغط (الحد ~4MB). جرّب صورة أصغر أو بدقّة أقل.'
        : 'Image too large even after compression (~4MB limit). Try a smaller image.'
    );
  }

  const formData = new FormData();
  formData.append('file', optimized);
  formData.append('folder', folder);

  let res: Response;
  try {
    res = await fetch('/api/uploads', { method: 'POST', body: formData });
  } catch {
    throw new Error(isAr ? 'تعذّر الاتصال بالخادم أثناء الرفع.' : 'Network error during upload.');
  }

  // الحارس الأساسي: لا نقرأ JSON إلا إذا كانت الاستجابة ناجحة وفعلاً JSON.
  // يمنع تحطّم «Unexpected token '<'» عند رجوع صفحة خطأ HTML (413/504...).
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    if (res.status === 413) {
      throw new Error(
        isAr ? 'الصورة كبيرة جداً للرفع (الحد ~4MB).' : 'Image too large to upload (~4MB limit).'
      );
    }
    throw new Error(
      isAr ? `فشل رفع الصورة (رمز ${res.status}).` : `Image upload failed (status ${res.status}).`
    );
  }

  const data = await res.json();
  if (!data?.success || !data?.upload?.url) {
    throw new Error(data?.error || (isAr ? 'فشل رفع الصورة' : 'Image upload failed'));
  }

  return data.upload.url as string;
}
