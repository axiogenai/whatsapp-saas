import { NextResponse } from 'next/server';
import { initiateSubscriptionPayment, PlanType } from '@/lib/payments';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, tenantId, email, phone, customerName } = body;

    if (!plan || !['starter', 'pro', 'agency'].includes(plan)) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected. Choose starter, pro, or agency.' },
        { status: 400 }
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Missing tenantId.' },
        { status: 400 }
      );
    }

    const result = await initiateSubscriptionPayment({
      plan: plan as 'starter' | 'pro' | 'agency',
      tenantId: String(tenantId),
      email: email ? String(email) : undefined,
      phone: phone ? String(phone) : undefined,
      customerName: customerName ? String(customerName) : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to initiate payment session.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      gateway: result.gateway,
      merchantTransactionId: result.merchantTransactionId,
      redirectUrl: result.redirectUrl,
      amount: result.amount,
      plan: result.plan,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error processing payment initiation.' },
      { status: 500 }
    );
  }
}
