import { NextRequest, NextResponse } from 'next/server';
import { dispatchHashedLeadEvent, HashedIdentifiers } from '@/lib/analytics/serverConversions';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * يستقبل حدث تحويل من العميل (user_data مجزّأة SHA-256 مسبقاً في المتصفح —
 * انظر hashUserData في src/lib/analytics/events.ts) ويوزّعه على كل Conversion APIs
 * المهيأة من لوحة الأدمن: Meta وX ولينكدإن. المنصات غير المهيأة تُتجاهل.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.event_name || !body.user_data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: event_name, user_data' },
        { status: 400 }
      );
    }

    const ids: HashedIdentifiers = {
      em: body.user_data.em || undefined,
      ph: body.user_data.ph || undefined,
      fn: body.user_data.fn || undefined,
      ln: body.user_data.ln || undefined,
    };

    const results = await dispatchHashedLeadEvent(
      {
        eventName: String(body.event_name),
        eventId: String(body.event_id || `${body.event_name}_${Date.now()}`),
        sourceUrl: body.event_source_url,
        customData: body.custom_data,
      },
      ids
    );

    const anyConfigured = results.some((r) => r.error !== 'not configured');
    const anySuccess = results.some((r) => r.success);

    return NextResponse.json({
      success: anySuccess || !anyConfigured,
      results,
    });
  } catch (error) {
    console.error('Conversion API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
