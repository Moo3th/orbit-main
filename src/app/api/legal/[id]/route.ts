import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { LegalPage, normalizeSlug, isReservedSlug, normalizeLegalLink } from '@/models/LegalPage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Internal server error');

// GET صفحة واحدة بالمعرّف (للأدمن).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const page = await LegalPage.findById(id).lean();
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, page });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

// PUT تحديث صفحة بالمعرّف (أدمن فقط) — يشمل تغيير الرابط (slug).
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const current = await LegalPage.findById(id);
    if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const update: Record<string, unknown> = {};
    if (body.title) update.title = body.title;
    if (body.content) update.content = body.content;
    if (body.seo) update.seo = body.seo;
    if (body.link) update.link = normalizeLegalLink(body.link);
    if (typeof body.isActive === 'boolean') update.isActive = body.isActive;
    if (typeof body.order === 'number') update.order = body.order;

    // تغيير الرابط مع التحقق
    if (typeof body.slug === 'string') {
      const slug = normalizeSlug(body.slug);
      if (!slug) return NextResponse.json({ error: 'الرابط (slug) غير صالح' }, { status: 400 });
      if (slug !== current.slug) {
        if (isReservedSlug(slug)) {
          return NextResponse.json({ error: `الرابط "${slug}" محجوز` }, { status: 400 });
        }
        const dup = await LegalPage.findOne({ slug, _id: { $ne: id } }).lean();
        if (dup) return NextResponse.json({ error: `الرابط "${slug}" مستخدم بالفعل` }, { status: 409 });
        update.slug = slug;
      }
    }

    const oldSlug = current.slug;
    const page = await LegalPage.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).lean();

    revalidateTag('legal-pages', 'default');
    revalidatePath(`/${oldSlug}`);
    if (update.slug) revalidatePath(`/${update.slug as string}`);

    return NextResponse.json({ success: true, page });
  } catch (error: unknown) {
    const msg = errorMessage(error);
    if (msg.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    console.error('Error updating legal page:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE حذف صفحة بالمعرّف (أدمن فقط) — الصفحات النظامية محمية من الحذف.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const page = await LegalPage.findById(id);
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (page.isSystem) {
      return NextResponse.json({ error: 'الصفحات النظامية لا يمكن حذفها (يمكن إخفاؤها بدلاً من ذلك)' }, { status: 400 });
    }

    const slug = page.slug;
    await LegalPage.findByIdAndDelete(id);
    revalidateTag('legal-pages', 'default');
    revalidatePath(`/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = errorMessage(error);
    if (msg.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    console.error('Error deleting legal page:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
