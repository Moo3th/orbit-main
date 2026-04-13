import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById } from '@/lib/cms/helpers';

export default async function ContactPage() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage = getCmsPageById(snapshot, 'contact');
  const footerData = snapshot?.footerData;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <Contact cmsPage={cmsPage} footerData={footerData} />
      <Footer />
    </div>
  );
}
