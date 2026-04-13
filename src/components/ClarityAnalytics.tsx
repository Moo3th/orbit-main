'use client';

import { useEffect, useState } from 'react';

interface ClarityAnalyticsProps {
  projectId?: string;
  enabled?: boolean;
  respectPrivacy?: boolean;
}

/**
 * Microsoft Clarity Analytics Component
 * Tracks user behavior, heatmaps, and session recordings for business pages
 *
 * Privacy Considerations:
 * - Only loads in production by default
 * - Respects privacy consent (checks for cookie consent)
 * - Can be disabled via props or environment variables
 * - GDPR compliant with consent management
 */
export default function ClarityAnalytics({
  projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'v2xrletty3',
  enabled = process.env.NODE_ENV === 'production',
  respectPrivacy = true
}: ClarityAnalyticsProps) {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for privacy consent if respecting privacy settings
    if (respectPrivacy) {
      const checkConsent = () => {
        // Check for common cookie consent patterns
        const consentCookie = document.cookie.split(';').find(c =>
          c.trim().startsWith('cookie-consent=') ||
          c.trim().startsWith('gdpr-consent=') ||
          c.trim().startsWith('analytics-consent=')
        );

        if (consentCookie) {
          const consentValue = consentCookie.split('=')[1];
          setConsentGiven(consentValue === 'accepted' || consentValue === 'true');
        } else {
          // If no consent cookie found, check localStorage
          const consent = localStorage.getItem('cookie-consent') ||
                         localStorage.getItem('gdpr-consent') ||
                         localStorage.getItem('analytics-consent');

          setConsentGiven(consent === 'accepted' || consent === 'true');
        }
      };

      checkConsent();

      // Listen for consent changes (custom event)
      const handleConsentChange = (e: CustomEvent) => {
        setConsentGiven(e.detail.consent);
      };

      window.addEventListener('cookie-consent-changed' as any, handleConsentChange);

      return () => {
        window.removeEventListener('cookie-consent-changed' as any, handleConsentChange);
      };
    } else {
      setConsentGiven(true); // Skip privacy check if disabled
    }
  }, [respectPrivacy]);

  useEffect(() => {
    // Only load when all conditions are met
    if (!enabled || typeof window === 'undefined' || consentGiven !== true) {
      return;
    }

    // Check if Clarity is already loaded
    if (window.clarity) {
      console.log('Microsoft Clarity already initialized');
      return;
    }

    // Initialize Clarity tracking
    const initClarity = () => {
      try {
        // Microsoft Clarity tracking script
        (function(c: any,l: Document,a: string,r: string,i: string){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          const t = l.createElement(r) as HTMLScriptElement; t.async = true; t.src = "https://www.clarity.ms/tag/"+i;
          const y = l.getElementsByTagName(r)[0]; if (y && y.parentNode) y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", projectId);

        console.log('Microsoft Clarity initialized for business tracking');
      } catch (error) {
        console.error('Failed to initialize Microsoft Clarity:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initClarity, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [projectId, enabled, consentGiven]);

  // Don't render anything - this is a side-effect only component
  return null;
}

// Type declaration for TypeScript
declare global {
  interface Window {
    clarity: any;
  }
}