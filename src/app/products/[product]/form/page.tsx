import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById } from '@/lib/cms/helpers';
import { DynamicFormPage } from './DynamicFormPage';

const PRODUCT_SLUG_TO_ID: Record<string, string> = {
  'o-time': 'otime',
  'gov-gate': 'govgate',
  'whatsapp': 'whatsapp',
  'sms': 'sms',
};

interface Props {
  params: Promise<{ product: string }>;
}

export default async function ProductFormPage({ params }: Props) {
  const { product } = await params;
  const productId = PRODUCT_SLUG_TO_ID[product] || product;
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage = getCmsPageById(snapshot, product);
  return <DynamicFormPage productId={productId} cmsPage={cmsPage} />;
}