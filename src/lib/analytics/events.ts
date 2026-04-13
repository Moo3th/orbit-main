/**
 * Analytics Events Tracking Utility
 * 
 * This module provides unified tracking for:
 * - Google Tag Manager (Data Layer)
 * - Meta Pixel (Facebook)
 * - Google Analytics 4 (GA4)
 */

type EventParams = Record<string, unknown>;

type CookieConsentChangedEvent = CustomEvent<{ consent?: boolean }>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  const storedConsent = localStorage.getItem('cookie-consent');
  return storedConsent === 'accepted';
}

function pushToDataLayer(event: string, params?: EventParams) {
  if (typeof window === 'undefined' || !hasConsent()) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
    timestamp: new Date().toISOString(),
  });
}

function pushGtag(event: string, params?: EventParams) {
  if (typeof window === 'undefined' || !hasConsent()) {
    return;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}

function pushMetaPixel(event: string, params?: EventParams) {
  if (typeof window === 'undefined' || !hasConsent()) {
    return;
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}

// ============================================
// Event Tracking Functions
// ============================================

/**
 * Track page view
 * GTM: page_view
 * GA4: page_view
 * Meta: PageView (automatic)
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  const params = {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  };

  pushToDataLayer('page_view', params);
  pushGtag('page_view', params);
}

/**
 * Track contact form submission
 * GTM: contact_form_submit
 * GA4: generate_lead
 * Meta: Lead
 */
export function trackContactFormSubmit(params: {
  serviceType: string;
  product?: string;
  source?: string;
}) {
  const gtmParams = {
    form_id: 'contact',
    service_type: params.serviceType,
    product: params.product || 'other',
    source: params.source || 'contact-page',
  };

  pushToDataLayer('contact_form_submit', gtmParams);
  pushGtag('generate_lead', gtmParams);
  pushMetaPixel('Lead', {
    content_name: 'Contact Form',
    content_category: 'Lead',
    service_type: params.serviceType,
  });
}

/**
 * Track WhatsApp service request
 * GTM: whatsapp_request_submit
 * GA4: generate_lead
 * Meta: Lead
 */
export function trackWhatsAppRequestSubmit(params: {
  planId: string;
  tierId: string;
  industry?: string;
}) {
  const gtmParams = {
    form_id: 'whatsapp_request',
    plan_id: params.planId,
    tier_id: params.tierId,
    industry: params.industry || 'unknown',
  };

  pushToDataLayer('whatsapp_request_submit', gtmParams);
  pushGtag('generate_lead', gtmParams);
  pushMetaPixel('Lead', {
    content_name: 'WhatsApp Service Request',
    content_category: 'Lead',
    content_ids: [params.planId],
  });
}

/**
 * Track CTA button click
 * GTM: cta_click
 * GA4: click_button
 * Meta: ViewContent
 */
export function trackCTAClick(params: {
  buttonId: string;
  buttonText: string;
  destination?: string;
  pageLocation?: string;
}) {
  const gtmParams = {
    button_id: params.buttonId,
    button_text: params.buttonText,
    destination: params.destination || '',
    page_location: params.pageLocation || window.location.pathname,
  };

  pushToDataLayer('cta_click', gtmParams);
  pushGtag('click_button', gtmParams);
  pushMetaPixel('ViewContent', {
    content_name: `CTA: ${params.buttonText}`,
    content_category: 'Button',
    content_id: params.buttonId,
  });
}

/**
 * Track pricing page view
 * GTM: pricing_view
 * GA4: view_item_list
 * Meta: ViewContent
 */
export function trackPricingView(params: {
  serviceType: 'sms' | 'whatsapp' | 'o-time' | 'gov-gate';
  plans: Array<{ id: string; name: string; price?: number }>;
}) {
  const gtmParams = {
    item_list_id: `${params.serviceType}_pricing`,
    item_list_name: `${params.serviceType.toUpperCase()} Pricing Plans`,
    service_type: params.serviceType,
    items: params.plans,
  };

  pushToDataLayer('pricing_view', {
    service_type: params.serviceType,
    item_list_id: gtmParams.item_list_id,
  });
  pushGtag('view_item_list', gtmParams);
  pushMetaPixel('ViewContent', {
    content_name: `${params.serviceType.toUpperCase()} Pricing`,
    content_category: 'Pricing',
    content_ids: params.plans.map((p) => p.id),
  });
}

/**
 * Track item selection (Pricing plan selected)
 * GTM: select_item
 * GA4: select_item
 * Meta: ViewContent
 */
export function trackPlanSelected(params: {
  serviceType: 'sms' | 'whatsapp' | 'o-time' | 'gov-gate';
  planId: string;
  planName: string;
  price?: number;
}) {
  const gtmParams = {
    item_id: params.planId,
    item_name: params.planName,
    item_list_id: `${params.serviceType}_pricing`,
    price: params.price,
  };

  pushToDataLayer('select_item', gtmParams);
  pushGtag('select_item', gtmParams);
  pushMetaPixel('ViewContent', {
    content_name: `${params.serviceType.toUpperCase()} Plan: ${params.planName}`,
    content_category: 'Plan Selection',
    content_ids: [params.planId],
  });
}

/**
 * Track outbound link click
 * GTM: outbound_click
 * GA4: click
 * Meta: (not tracked)
 */
export function trackOutboundLink(url: string, linkText?: string) {
  pushToDataLayer('outbound_click', {
    link_url: url,
    link_text: linkText || '',
  });
}

// ============================================
// Server-side Conversion API Events
// ============================================

/**
 * Get user data for Conversion API (hashed for privacy)
 */
export async function hashUserData(data: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<Record<string, string>> {
  const encoder = new TextEncoder();

  const hash = async (value: string): Promise<string> => {
    const normalized = value.toLowerCase().trim();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const result: Record<string, string> = {};

  if (data.email) {
    result.em = await hash(data.email);
  }
  if (data.phone) {
    result.ph = await hash(data.phone);
  }
  if (data.firstName) {
    result.fn = await hash(data.firstName);
  }
  if (data.lastName) {
    result.ln = await hash(data.lastName);
  }

  return result;
}

/**
 * Send event to Conversion API
 */
export async function sendConversionAPIEvent(event: {
  eventName: string;
  eventId?: string;
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  };
  customData?: EventParams;
}) {
  try {
    const hashedUserData = await hashUserData(event.userData);

    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: event.eventName,
        event_id: event.eventId || `${event.eventName}_${Date.now()}`,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: window.location.href,
        user_data: hashedUserData,
        custom_data: event.customData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send Conversion API event');
    }

    return await response.json();
  } catch (error) {
    console.error('Conversion API error:', error);
    throw error;
  }
}