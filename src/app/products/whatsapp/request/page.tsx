import { WhatsAppRequestWizard } from './WhatsAppRequestWizard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteCmsSnapshot } from '@/lib/cms/siteCms';
import { getCmsPageById } from '@/lib/cms/helpers';

export default async function WhatsAppRequestPage() {
  const snapshot = await getSiteCmsSnapshot();
  const cmsPage = getCmsPageById(snapshot, 'whatsapp');

  return (
    <>
      <Navbar />
      <WhatsAppRequestWizard cmsPage={cmsPage} />
      <Footer />
    </>
  );
}
