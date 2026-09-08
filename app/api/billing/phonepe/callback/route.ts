import { NextResponse } from 'next/server';
import { checkPhonePePaymentStatus } from '@/lib/payments';

function getAppUrl(request: Request): string {
  const host = request.headers.get('host') || 'whatsapp-saas-jet.vercel.app';
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  return process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
}

async function handlePhonePeCallback(request: Request) {
  const url = new URL(request.url);
  const appUrl = getAppUrl(request);

  // Extract from query params
  let txn = url.searchParams.get('txn') || '';
  let plan = url.searchParams.get('plan') || '';
  let tenant = url.searchParams.get('tenant') || '';

  // PhonePe POST request can also contain form body or JSON
  if (request.method === 'POST') {
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        if (!txn) txn = (formData.get('transactionId') as string) || (formData.get('merchantTransactionId') as string) || '';
      } else if (contentType.includes('application/json')) {
        const json = await request.json();
        if (!txn) txn = json.transactionId || json.merchantTransactionId || '';
      }
    } catch {
      // Body parsing fallback
    }
  }

  if (!txn) {
    // If no transaction ID, redirect back to dashboard
    return NextResponse.redirect(`${appUrl}/dashboard?tab=subscription`, 303);
  }

  // 100% Reliable Server-to-Server Verification
  const verification = await checkPhonePePaymentStatus(txn);

  // Derive plan from transaction or params
  const resolvedPlan = verification.plan || plan || 'starter';

  if (verification.status === 'SUCCESS') {
    const successUrl = new URL(`${appUrl}/dashboard`);
    successUrl.searchParams.set('tab', 'subscription');
    successUrl.searchParams.set('payment', 'success');
    successUrl.searchParams.set('plan', resolvedPlan);
    successUrl.searchParams.set('txn', txn);
    if (verification.amount) {
      successUrl.searchParams.set('amount', String(verification.amount));
    }
    if (verification.paymentMode) {
      successUrl.searchParams.set('mode', verification.paymentMode);
    }

    const response = NextResponse.redirect(successUrl.toString(), 303);

    // Set cookie for quick sync
    response.cookies.set('wa_paid_plan', resolvedPlan, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return response;
  }

  if (verification.status === 'PENDING') {
    const pendingUrl = new URL(`${appUrl}/dashboard`);
    pendingUrl.searchParams.set('tab', 'subscription');
    pendingUrl.searchParams.set('payment', 'pending');
    pendingUrl.searchParams.set('txn', txn);

    return NextResponse.redirect(pendingUrl.toString(), 303);
  }

  // FAILED
  const failedUrl = new URL(`${appUrl}/dashboard`);
  failedUrl.searchParams.set('tab', 'subscription');
  failedUrl.searchParams.set('payment', 'failed');
  failedUrl.searchParams.set('txn', txn);
  failedUrl.searchParams.set('reason', verification.message || 'Payment declined or cancelled by user.');

  return NextResponse.redirect(failedUrl.toString(), 303);
}

export async function POST(request: Request) {
  return handlePhonePeCallback(request);
}

export async function GET(request: Request) {
  return handlePhonePeCallback(request);
}
