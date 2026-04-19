'use client';

import { useEffect, useState } from 'react';

interface ClarityAnalyticsProps {
  projectId?: string;
  enabled?: boolean;
  respectPrivacy?: boolean;
}

export default function ClarityAnalytics({
  projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '',
  enabled = true,
  respectPrivacy = true
}: ClarityAnalyticsProps) {
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(null);

  useEffect(() => {
    if (!respectPrivacy) {
      setAnalyticsConsent(true);
      return;
    }

    const getConsentLevel = (): boolean => {
      const stored = localStorage.getItem('cookie-consent');
      if (stored === 'accepted' || stored === 'necessary') return true;

      const cookie = document.cookie.split(';').find(c =>
        c.trim().startsWith('cookie-consent=')
      );
      if (cookie) {
        const value = cookie.split('=')[1].trim();
        return value === 'accepted' || value === 'necessary';
      }
      return false;
    };

    setAnalyticsConsent(getConsentLevel());

    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setAnalyticsConsent(true);
    };

    window.addEventListener('cookie-consent-changed' as any, handleConsentChange);
    return () => {
      window.removeEventListener('cookie-consent-changed' as any, handleConsentChange);
    };
  }, [respectPrivacy]);

  useEffect(() => {
    if (!enabled || !projectId || typeof window === 'undefined' || analyticsConsent !== true) {
      return;
    }

    if (window.clarity) return;

    (function(c: any, l: Document, a: string, r: string, i: string) {
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = 'https://www.clarity.ms/tag/' + i;
      const y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', projectId);
  }, [projectId, enabled, analyticsConsent]);

  return null;
}

declare global {
  interface Window {
    clarity: any;
  }
}