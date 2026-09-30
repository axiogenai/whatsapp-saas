import { NextResponse } from 'next/server';
import { verifyPhonePeWebhook, fulfillPaidTenantPlan } from '@/lib/payments';

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

    const txn = data?.data?.merchantTransactionId || '';
    const code = data?.code;

    console.log('[PhonePe Webhook] Verified callback received:', {
      code,
      txn,
      state: data?.data?.state,
      amount: data?.data?.amount,
    });

    // Background fulfillment:
    if (code === 'PAYMENT_SUCCESS' && txn.startsWith('TXN_')) {
      const parts = txn.split('_');
      // format: TXN_<plan>_<cleanTenant>_<timestamp>
      if (parts.length >= 3) {
        const plan = parts[1];
        const tenantId = parts[2];
        await fulfillPaidTenantPlan(tenantId, plan, txn);
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (err: any) {
    console.error('[PhonePe Webhook Error]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
