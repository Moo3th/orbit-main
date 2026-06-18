import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById } from '@/lib/cms/helpers';
import { getAllLegalPages } from '@/lib/cms/legal';

export default async function ContactPage() {
  const [snapshot, allLegal] = await Promise.all([
    getSiteCmsSnapshot(),
    getAllLegalPages(),
  ]);
  const cmsPage = getCmsPageById(snapshot, 'contact');
  const footerData = snapshot?.footerData;
  // الصفحات القانونية المخفيّة (isActive: false) — لإخفاء روابطها في نموذج التواصل.
  const hiddenLegalSlugs = allLegal.filter((p) => !p.isActive).map((p) => p.slug);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <Contact cmsPage={cmsPage} footerData={footerData} hiddenLegalSlugs={hiddenLegalSlugs} />
      <Footer />
    </div>
  );
}
