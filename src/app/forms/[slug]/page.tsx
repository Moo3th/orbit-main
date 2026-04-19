import { FormsFormPage } from './FormsFormPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CustomFormPage({ params }: Props) {
  const { slug } = await params;
  return <FormsFormPage slug={slug} />;
}