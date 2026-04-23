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

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join('/');
  const headersList = await headers();
  const host = headersList.get('host');

  await connectDB();
  
  // Try to find form by custom domain + slug or just slug
  let config = await FormConfig.findOne({ 
    $or: [
      { slug: path, customDomain: host },
      { slug: path, customDomain: { $in: [null, ''] } }
    ]
  }).lean() as any;

  if (!config) return {};

  return {
    title: config.titleAr || config.productName,
    description: config.productNameEn,
  };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const path = slug.join('/');
  const headersList = await headers();
  const host = headersList.get('host');

  await connectDB();

  // 1. Try to find by exact slug + custom domain
  // 2. Try to find by exact slug + no custom domain
  let config = await FormConfig.findOne({ 
    $or: [
      { slug: path, customDomain: host },
      { slug: path, customDomain: { $in: [null, ''] } }
    ]
  }).lean() as any;

  if (!config) {
    notFound();
  }

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
