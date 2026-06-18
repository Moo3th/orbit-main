'use client';

import { useEffect, useRef } from 'react';

/**
 * يستدعي onInView مرة واحدة فقط عندما يدخل العنصر إطار العرض، ثم يفصل المراقب.
 * يُستخدم لتتبّع «عرض» قسم التسعير بصدق (وليس عند mount بينما القسم أسفل الصفحة).
 *
 * الاستخدام:
 *   const ref = useInViewOnce<HTMLDivElement>(() => trackPricingView({...}));
 *   <section ref={ref} id="pricing">...</section>
 */
// الافتراضي: الإطلاق عند أول دخول للعنصر إطارَ العرض (threshold:0) مع هامش سفلي بسيط
// كي يُحتسب «ظهورًا» فعليًا لا مجرد ظهور حافة. عتبة 0 موثوقة حتى مع التمرير السريع/القفزات،
// بخلاف عتبة جزئية (0.3) التي قد يفوّتها IntersectionObserver لأقسام طويلة في صفحات طويلة
// (كان pricing_view لا يُطلَق في صفحة واتساب الطويلة بينما يُطلَق في SMS الأقصر).
export function useInViewOnce<T extends HTMLElement = HTMLElement>(
  onInView: () => void,
  options: IntersectionObserverInit = { threshold: 0, rootMargin: '0px 0px -10% 0px' }
) {
  const ref = useRef<T | null>(null);
  const firedRef = useRef(false);
  // نُثبّت أحدث callback دون إعادة إنشاء المراقب.
  const callbackRef = useRef(onInView);
  callbackRef.current = onInView;

  useEffect(() => {
    const el = ref.current;
    if (!el || firedRef.current) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          callbackRef.current();
          observer.disconnect();
          break;
        }
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
