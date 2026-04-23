import { FormsFormPage } from './FormsFormPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CustomFormPage({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <FormsFormPage slug={slug} />
      </div>
      <Footer />
    </>
  );
}