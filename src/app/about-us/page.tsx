import Navbar from '@/components/Navbar';
import About from '@/components/About';
import WhyOrbit from '@/components/WhyOrbit';
import Footer from '@/components/Footer';
import { getMainPageSettingsSnapshot } from '@/lib/mainPageSettings.server';

export const revalidate = 300;

export default async function AboutUs() {
  const settings = await getMainPageSettingsSnapshot();

  return (
    <div className="min-h-screen" style={{ minHeight: '100dvh' }}>
      <Navbar />

      <About data={settings.about} />

      <WhyOrbit data={settings.whyOrbit} />

      <Footer />
    </div>
  );
}
