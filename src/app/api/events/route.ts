import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { SeoSettings } from '@/models/SeoSettings';

interface ConversionAPIEvent {
  event_name: string;
  event_id: string;
  event_time: number;
  action_source: string;
  event_source_url: string;
  user_data: Record<string, string>;
  custom_data?: Record<string, unknown>;
}

interface FacebookConversionAPIResponse {
  success: boolean;
  error?: string;
  eventId?: string;
}

async function hashWithSHA256(value: string): Promise<string> {
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
}

async function sendToFacebookCAPI(
  pixelId: string,
  accessToken: string,
  event: ConversionAPIEvent
): Promise<FacebookConversionAPIResponse> {
  const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;

  const eventData = {
    data: [
      {
        event_name: event.event_name,
        event_time: event.event_time,
        event_id: event.event_id,
        action_source: event.action_source,
        event_source_url: event.event_source_url,
        user_data: event.user_data,
        custom_data: event.custom_data || {},
      },
    ],
    access_token: accessToken,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Facebook CAPI error:', errorData);
      return {
        success: false,
        error: errorData.error?.message || 'Failed to send to Facebook CAPI',
      };
    }

    return {
      success: true,
      eventId: event.event_id,
    };
  } catch (error) {
    console.error('Facebook CAPI error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const settings = await SeoSettings.findOne({ key: 'primary' }).lean();

    const pixelId = (settings as any)?.analytics?.facebookPixelId;
    const accessToken = (settings as any)?.analytics?.facebookAccessToken;

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { success: false, error: 'Facebook Pixel ID or Access Token not configured' },
        { status: 400 }
      );
    }

    const body: ConversionAPIEvent = await request.json();

    if (!body.event_name || !body.user_data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: event_name, user_data' },
        { status: 400 }
      );
    }

    const result = await sendToFacebookCAPI(pixelId, accessToken, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Conversion API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}