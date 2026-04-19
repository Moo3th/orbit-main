'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/business/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/business/ui/card';

interface PrivacyConsentProps {
  onConsentChange?: (consent: { analytics: boolean; ads: boolean }) => void;
}

const CONSENT_STORAGE_KEY = 'cookie-consent';
const CONSENT_COOKIE_MAX_AGE = 31536000;

type ConsentLevel = 'accepted' | 'necessary' | null;

function getConsentLevel(): ConsentLevel {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (stored === 'accepted' || stored === 'necessary') return stored;

  const cookie = document.cookie.split(';').find(c => c.trim().startsWith(`${CONSENT_STORAGE_KEY}=`));
  if (cookie) {
    const value = cookie.split('=')[1].trim();
    if (value === 'accepted' || value === 'necessary') return value;
  }

  return null;
}

function setConsent(level: 'accepted' | 'necessary') {
  localStorage.setItem(CONSENT_STORAGE_KEY, level);
  document.cookie = `${CONSENT_STORAGE_KEY}=${level}; path=/; max-age=${CONSENT_COOKIE_MAX_AGE}`;

  const analytics = true;
  const ads = level === 'accepted';

  window.dispatchEvent(new CustomEvent('cookie-consent-changed', {
    detail: { analytics, ads, consent: true, level }
  }));
}

export default function PrivacyConsent({ onConsentChange }: PrivacyConsentProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const existing = getConsentLevel();
    if (existing) {
      const analytics = true;
      const ads = existing === 'accepted';
      onConsentChange?.({ analytics, ads });
      return;
    }

    const timer = window.setTimeout(() => {
      setShowBanner(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [onConsentChange]);

  const handleAcceptAll = () => {
    setConsent('accepted');
    setShowBanner(false);
    onConsentChange?.({ analytics: true, ads: true });
  };

  const handleNecessary = () => {
    setConsent('necessary');
    setShowBanner(false);
    onConsentChange?.({ analytics: true, ads: false });
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 px-4 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <Card className="border border-[#104E8B]/20 bg-white/95 backdrop-blur-md shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#161616]">إعدادات الخصوصية</CardTitle>
            <CardDescription className="text-sm text-gray-700">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل الأداء. يمكنك قبول الكل أو الضروري فقط.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleNecessary}
                className="sm:order-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                ضروري فقط
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="sm:order-2 bg-[#104E8B] hover:bg-[#0A2647] text-white"
              >
                قبول الكل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}