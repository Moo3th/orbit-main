'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/business/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/business/ui/card';

interface PrivacyConsentProps {
  onConsentChange?: (consent: boolean) => void;
}

const CONSENT_STORAGE_KEY = 'cookie-consent';
const CONSENT_SNOOZE_KEY = 'cookie-consent-snoozed-at';
const CONSENT_COOKIE_MAX_AGE = 31536000; // 1 year
const SNOOZE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Privacy Consent Banner for GDPR compliance
 * Manages cookie consent and triggers analytics consent updates
 */
export default function PrivacyConsent({ onConsentChange }: PrivacyConsentProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const checkExistingConsent = () => {
      const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
      const hasFinalChoice = consent === 'accepted' || consent === 'declined';

      if (hasFinalChoice) {
        setShowBanner(false);
        return;
      }

      if (consent === 'deferred') {
        const snoozedAt = Number(localStorage.getItem(CONSENT_SNOOZE_KEY) || 0);
        const isStillSnoozed = Number.isFinite(snoozedAt) && Date.now() - snoozedAt < SNOOZE_DURATION_MS;

        setShowBanner(!isStillSnoozed);
        return;
      }

      // Delay first appearance slightly to reduce interruption on initial load.
      const timer = window.setTimeout(() => {
        setShowBanner(true);
      }, 1800);

      return () => window.clearTimeout(timer);
    };

    const cleanup = checkExistingConsent();
    return () => {
      cleanup?.();
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    localStorage.removeItem(CONSENT_SNOOZE_KEY);
    document.cookie = `${CONSENT_STORAGE_KEY}=accepted; path=/; max-age=${CONSENT_COOKIE_MAX_AGE}`;

    setShowBanner(false);

    // Dispatch custom event for analytics listeners
    window.dispatchEvent(new CustomEvent('cookie-consent-changed', {
      detail: { consent: true }
    }));

    onConsentChange?.(true);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'declined');
    localStorage.removeItem(CONSENT_SNOOZE_KEY);
    document.cookie = `${CONSENT_STORAGE_KEY}=declined; path=/; max-age=${CONSENT_COOKIE_MAX_AGE}`;

    setShowBanner(false);

    // Dispatch custom event for analytics listeners
    window.dispatchEvent(new CustomEvent('cookie-consent-changed', {
      detail: { consent: false }
    }));

    onConsentChange?.(false);
  };

  const handleLater = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'deferred');
    localStorage.setItem(CONSENT_SNOOZE_KEY, String(Date.now()));
    document.cookie = `${CONSENT_STORAGE_KEY}=deferred; path=/; max-age=${Math.floor(SNOOZE_DURATION_MS / 1000)}`;
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 px-4 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <Card className="border border-[#7A1E2E]/15 bg-white/95 backdrop-blur-md shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#161616]">إعدادات الخصوصية</CardTitle>
            <CardDescription className="text-sm text-gray-700">
              نستخدم Google Tag Manager لتحسين الأداء. يمكنك القبول أو الرفض أو التذكير لاحقاً.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
              <Button
                variant="ghost"
                onClick={handleLater}
                className="sm:order-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                لاحقاً
              </Button>
              <Button
                variant="outline"
                onClick={handleDecline}
                className="sm:order-2 border-gray-300"
              >
                رفض
              </Button>
              <Button
                onClick={handleAccept}
                className="sm:order-3 bg-[#7A1E2E] hover:bg-[#7A1E2E]/90 text-white"
              >
                قبول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
