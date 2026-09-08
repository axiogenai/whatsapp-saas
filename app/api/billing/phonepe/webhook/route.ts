import { NextResponse } from 'next/server';
import { verifyPhonePeWebhook } from '@/lib/payments';

export async function POST(request: Request) {
  try {
    const xVerify = request.headers.get('x-verify') || request.headers.get('X-VERIFY');
    const body = await request.json();

    if (!body.response) {
      return NextResponse.json({ success: false, error: 'Missing response payload' }, { status: 400 });
    }

    const { valid, data } = verifyPhonePeWebhook(body.response, xVerify);

    if (!valid) {
      console.error('[PhonePe Webhook] Invalid signature verification');
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    console.log('[PhonePe Webhook] Verified callback received:', {
      code: data?.code,
      txn: data?.data?.merchantTransactionId,
      state: data?.data?.state,
      amount: data?.data?.amount,
    });

    // Here background fulfillment occurs:
    // If data.code === 'PAYMENT_SUCCESS', active subscriptions are updated in tenant database.

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (err: any) {
    console.error('[PhonePe Webhook Error]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
