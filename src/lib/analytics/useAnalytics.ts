'use client';

import { trackContactFormSubmit, trackWhatsAppRequestSubmit, sendConversionAPIEvent } from '@/lib/analytics/events';

interface TrackContactFormOptions {
  serviceType: string;
  product?: string;
  source?: string;
  email?: string;
  phone?: string;
  name?: string;
}

interface TrackWhatsAppRequestOptions {
  planId: string;
  tierId: string;
  industry?: string;
  email?: string;
  phone?: string;
  name?: string;
}

export function useAnalytics() {
  const trackContactForm = async (options: TrackContactFormOptions) => {
    trackContactFormSubmit({
      serviceType: options.serviceType,
      product: options.product,
      source: options.source,
    });

    if (options.email || options.phone) {
      try {
        await sendConversionAPIEvent({
          eventName: 'Lead',
          userData: {
            email: options.email,
            phone: options.phone,
            firstName: options.name?.split(' ')[0],
            lastName: options.name?.split(' ').slice(1).join(' '),
          },
          customData: {
            content_name: 'Contact Form',
            content_category: 'Lead',
            service_type: options.serviceType,
          },
        });
      } catch (error) {
        console.error('Conversion API error:', error);
      }
    }
  };

  const trackWhatsAppRequest = async (options: TrackWhatsAppRequestOptions) => {
    trackWhatsAppRequestSubmit({
      planId: options.planId,
      tierId: options.tierId,
      industry: options.industry,
    });

    if (options.email || options.phone) {
      try {
        await sendConversionAPIEvent({
          eventName: 'Lead',
          userData: {
            email: options.email,
            phone: options.phone,
            firstName: options.name?.split(' ')[0],
            lastName: options.name?.split(' ').slice(1).join(' '),
          },
          customData: {
            content_name: 'WhatsApp Service Request',
            content_category: 'Lead',
            content_ids: [options.planId],
            plan_id: options.planId,
            tier_id: options.tierId,
          },
        });
      } catch (error) {
        console.error('Conversion API error:', error);
      }
    }
  };

  return {
    trackContactForm,
    trackWhatsAppRequest,
  };
}