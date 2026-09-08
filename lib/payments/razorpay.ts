import crypto from 'crypto';
import { InitiatePaymentParams, InitiatePaymentResult, PaymentStatusResult, PLANS } from './types';

function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const isConfigured = Boolean(keyId && keySecret);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://whatsapp-saas-jet.vercel.app');

  return { keyId, keySecret, isConfigured, appUrl };
}

/**
 * Initiates a Razorpay Order.
 * (Plug-and-play adapter: activates automatically when RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET are provided after KYC)
 */
export async function initiateRazorpayPayment(
  params: InitiatePaymentParams
): Promise<InitiatePaymentResult> {
  const { keyId, keySecret, isConfigured, appUrl } = getRazorpayConfig();
  const planInfo = PLANS[params.plan];

  if (!planInfo) {
    throw new Error(`Invalid plan selected: ${params.plan}`);
  }

  if (!isConfigured) {
    throw new Error(
      'Razorpay KYC is currently pending. Please use PhonePe PG for instant UPI payments.'
    );
  }

  const receipt = `RCPT_${params.plan}_${Date.now()}`;
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: planInfo.amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          tenantId: params.tenantId,
          plan: params.plan,
          email: params.email || '',
        },
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      return {
        success: false,
        gateway: 'razorpay',
        merchantTransactionId: receipt,
        redirectUrl: '',
        amount: planInfo.priceInr,
        plan: params.plan,
        error: order.error?.description || 'Razorpay order creation failed.',
      };
    }

    // In a full Razorpay Standard Checkout flow, this order ID is loaded by razorpay.js or a payment link
    return {
      success: true,
      gateway: 'razorpay',
      merchantTransactionId: order.id,
      redirectUrl: `${appUrl}/billing/razorpay?order_id=${order.id}&plan=${params.plan}`,
      amount: planInfo.priceInr,
      plan: params.plan,
    };
  } catch (err: any) {
    return {
      success: false,
      gateway: 'razorpay',
      merchantTransactionId: receipt,
      redirectUrl: '',
      amount: planInfo.priceInr,
      plan: params.plan,
      error: err.message || 'Network error connecting to Razorpay.',
    };
  }
}

/**
 * Verifies Razorpay payment signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const { keySecret } = getRazorpayConfig();
  if (!keySecret) return false;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}
