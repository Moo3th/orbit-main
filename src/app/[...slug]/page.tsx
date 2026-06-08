import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import FormConfig from '@/models/FormConfig';
import { DynamicFormPage } from '@/app/products/[product]/form/DynamicFormPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById } from '@/lib/cms/helpers';
import { LegalPage, type ILegalPage } from '@/models/LegalPage';
import LegalPageClient from '@/components/LegalPageClient';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join('/');
  const headersList = await headers();
  const host = headersList.get('host');

  await connectDB();

  // 1) نموذج (form) بالـ slug + النطاق المخصّص
  const config = await FormConfig.findOne({
    $or: [
      { slug: path, customDomain: host },
      { slug: path, customDomain: { $in: [null, ''] } }
    ]
  }).lean() as any;

  if (config) {
    return {
      title: config.titleAr || config.productName,
      description: config.productNameEn,
    };
  }

  // 2) صفحة قانونية بالـ slug (قراءة مباشرة من القاعدة — تظهر التعديلات فوراً)
  const legal = await LegalPage.findOne({ slug: path, isActive: true }).lean<ILegalPage>();
  if (legal) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa';
    const url = `${baseUrl}/${legal.slug}`;
    return {
      title: legal.seo?.title?.ar || legal.title?.ar,
      description: legal.seo?.description?.ar,
      alternates: {
        canonical: url,
        languages: { ar: url, en: `${baseUrl}/en/${legal.slug}` },
      },
      openGraph: {
        title: legal.seo?.title?.ar || legal.title?.ar,
        description: legal.seo?.description?.ar,
        url,
        type: 'article',
      },
    };
  }

  return {};
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const path = slug.join('/');
  const headersList = await headers();
  const host = headersList.get('host');

  await connectDB();

  // 1) نموذج (form)
  const config = await FormConfig.findOne({
    $or: [
      { slug: path, customDomain: host },
      { slug: path, customDomain: { $in: [null, ''] } }
    ]
  }).lean() as any;

  if (config) {
    const snapshot = await getSiteCmsSnapshot();
    const cmsPage = getCmsPageById(snapshot, 'home');
    return (
      <>
        <Navbar />
        <div className="pt-20">
          <DynamicFormPage productId={config.productId} cmsPage={cmsPage} />
        </div>
        <Footer />
      </>
    );
  }

  // 2) صفحة قانونية (قراءة مباشرة من القاعدة)
  const legal = await LegalPage.findOne({ slug: path, isActive: true }).lean<ILegalPage>();
  if (legal) {
    return (
      <LegalPageClient
        page={{ title: legal.title, content: legal.content, updatedAt: String(legal.updatedAt) }}
      />
    );
  }

  notFound();
}
