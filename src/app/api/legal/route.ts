import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { LegalPage, normalizeSlug, isReservedSlug, normalizeLegalLink, defaultLegalLink } from '@/models/LegalPage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Internal server error');

// GET كل الصفحات القانونية. الأدمن (?admin=true) يرى الجميع، والعام يرى النشطة فقط.
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const isAdmin = new URL(request.url).searchParams.get('admin') === 'true';
    const query = isAdmin ? {} : { isActive: true };
    const pages = await LegalPage.find(query).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, pages });
  } catch (error) {
    console.error('Error fetching legal pages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST إنشاء صفحة قانونية جديدة (أدمن فقط).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();

    const slug = normalizeSlug(body.slug || body?.title?.en || body?.title?.ar || '');
    if (!slug) {
      return NextResponse.json({ error: 'الرابط (slug) مطلوب' }, { status: 400 });
    }
    if (isReservedSlug(slug)) {
      return NextResponse.json({ error: `الرابط "${slug}" محجوز ولا يمكن استخدامه` }, { status: 400 });
    }
    const exists = await LegalPage.findOne({ slug }).lean();
    if (exists) {
      return NextResponse.json({ error: `الرابط "${slug}" مستخدم بالفعل` }, { status: 409 });
    }

    const count = await LegalPage.countDocuments();
    const page = await LegalPage.create({
      slug,
      title: body.title ?? { en: '', ar: '' },
      content: body.content ?? { en: '', ar: '' },
      seo: body.seo ?? { title: { en: '', ar: '' }, description: { en: '', ar: '' } },
      link: body.link ? normalizeLegalLink(body.link) : defaultLegalLink(),
      isActive: body.isActive ?? true,
      isSystem: false,
      order: typeof body.order === 'number' ? body.order : count + 1,
    });

    revalidateTag('legal-pages', 'default');
    return NextResponse.json({ success: true, page }, { status: 201 });
  } catch (error: unknown) {
    const msg = errorMessage(error);
    if (msg.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    console.error('Error creating legal page:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
