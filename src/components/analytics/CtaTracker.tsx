'use client';

import { useEffect } from 'react';
import { trackCTAClick, trackOutboundLink } from '@/lib/analytics/events';

/**
 * مُتتبّع نقرات الدعوة (CTA) المفوَّض.
 *
 * يركّب مستمع نقر native بطور الالتقاط (capture) على المستند، ويلتقط:
 *  - أي عنصر يحمل سمة [data-cta]    → trackCTAClick (يقرأ data-cta-id / data-cta-text / الوجهة).
 *  - أي <a> بمضيف خارجي             → trackOutboundLink (تلقائيًا).
 *
 * مستمع سلبي تمامًا: لا يستدعي preventDefault أبدًا، فلا يكسر التنقّل ولا يُكرّر الإطلاق.
 * يُركَّب مرة واحدة (يُوضع في جذر مكوّن الصفحة).
 */
export default function CtaTracker() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const isExternal = (anchor: HTMLAnchorElement): boolean => {
      const raw = anchor.getAttribute('href') || '';
      if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
        return false;
      }
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
        return url.hostname !== window.location.hostname;
      } catch {
        return false;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || typeof target.closest !== 'function') return;

      // 1) عنصر CTA صريح عبر data-cta
      const ctaEl = target.closest<HTMLElement>('[data-cta]');
      if (ctaEl) {
        const anchor = ctaEl.closest('a') as HTMLAnchorElement | null;
        trackCTAClick({
          buttonId: ctaEl.dataset.ctaId || ctaEl.dataset.cta || 'cta',
          buttonText: (ctaEl.dataset.ctaText || ctaEl.textContent || '').trim().slice(0, 120),
          destination: ctaEl.dataset.destination || anchor?.getAttribute('href') || '',
        });
      }

      // 2) رابط خارجي (تتبّع تلقائي) — مستقل عن data-cta
      const anchorEl = target.closest('a') as HTMLAnchorElement | null;
      if (anchorEl && isExternal(anchorEl)) {
        trackOutboundLink(anchorEl.href, (anchorEl.textContent || '').trim().slice(0, 120));
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
}
