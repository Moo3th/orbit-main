'use client';

import { useEffect, useMemo, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrbitSectionBackground from '@/components/OrbitSectionBackground';
import { useLanguage } from '@/contexts/LanguageContext';
import { injectLegalAnchors } from '@/lib/cms/legalAnchors';

export interface LegalPageData {
  title: { en: string; ar: string };
  content: { en: string; ar: string };
  updatedAt?: string;
}

/** مدّة إبراز السطر المقصود بعد الانتقال إليه (بالمللي ثانية). */
const HIGHLIGHT_MS = 2600;

/** معرّف صالح كمحدّد CSS بلا هروب — يمنع تمرير hash عشوائي إلى querySelector. */
const SAFE_ID = /^[A-Za-z][\w-]*$/;

export default function LegalPageClient({ page }: { page: LegalPageData }) {
  const { isRTL } = useLanguage();
  const articleRef = useRef<HTMLElement | null>(null);

  const title = isRTL ? page.title.ar : page.title.en;
  const rawContent = isRTL ? page.content.ar : page.content.en;

  // نحقن معرّفات السطور (sec-1, sec-2...) ليعمل الانتقال إلى سطر محدد
  // القادم من روابط التذييل. الترقيم مطابق لما تعرضه لوحة التحكم.
  const content = useMemo(() => injectLegalAnchors(rawContent || ''), [rawContent]);

  // الانتقال يدوياً: المحتوى يُرسم بعد ترطيب React، فمحاولة المتصفح التلقائية
  // للوصول إلى الـ hash تحدث قبل وجود العنصر ولا تنجح.
  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let highlightTimer: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;
    let userTookOver = false;

    const clearPending = () => {
      timers.forEach(clearTimeout);
      timers.clear();
      cancelAnimationFrame(raf);
    };

    const scrollToHash = (highlight: boolean) => {
      if (userTookOver) return;
      const hash = decodeURIComponent(window.location.hash.replace('#', ''));
      // نقبل معرّفاً بسيطاً فقط (sec-3 أو معرّف كتبه الأدمن) — لضمان محدّد CSS صالح.
      if (!SAFE_ID.test(hash)) return;
      const target = articleRef.current?.querySelector<HTMLElement>(`#${hash}`);
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!highlight) return;

      target.classList.add('legal-line-highlight');
      if (highlightTimer) clearTimeout(highlightTimer);
      highlightTimer = setTimeout(() => target.classList.remove('legal-line-highlight'), HIGHLIGHT_MS);
    };

    // الصفحة ثقيلة (خطوط وصور وخلفيات)، وقد يزيح تحميلها المتأخر موضع السطر
    // بعد القفزة الأولى. لذلك نصحّح الموضع مرّتين بصمت — ما لم يتدخّل الزائر.
    const jump = () => {
      clearPending();
      raf = requestAnimationFrame(() => scrollToHash(true));
      [450, 1100].forEach((delay) => {
        timers.add(setTimeout(() => scrollToHash(false), delay));
      });
    };

    // أي تمرير أو ضغط مفتاح من الزائر يُلغي التصحيحات المتبقية حتى لا نسحبه عنوة.
    const surrender = () => {
      userTookOver = true;
      clearPending();
    };
    const surrenderEvents = ['wheel', 'touchstart', 'keydown'] as const;
    surrenderEvents.forEach((event) =>
      window.addEventListener(event, surrender, { passive: true, once: true })
    );

    const onHashChange = () => {
      userTookOver = false;
      jump();
    };

    jump();
    window.addEventListener('hashchange', onHashChange);

    return () => {
      clearPending();
      if (highlightTimer) clearTimeout(highlightTimer);
      window.removeEventListener('hashchange', onHashChange);
      surrenderEvents.forEach((event) => window.removeEventListener(event, surrender));
    };
  }, [content]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-primary via-[#8a2a3d] to-primary text-white overflow-hidden">
        <OrbitSectionBackground alignment="both" density="low" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-heading tracking-tight"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article
            ref={articleRef}
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-primary prose-headings:mt-8 leading-8 [&>*]:scroll-mt-28"
            style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            dir={isRTL ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
