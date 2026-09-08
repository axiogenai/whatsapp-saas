import { InitiatePaymentParams, InitiatePaymentResult, PaymentStatusResult } from './types';
import { initiatePhonePePayment, checkPhonePePaymentStatus } from './phonepe';
import { initiateRazorpayPayment } from './razorpay';

export * from './types';
export * from './phonepe';
export * from './razorpay';

export function getActivePaymentGateway(): 'phonepe' | 'razorpay' {
  const provider = (process.env.PAYMENT_GATEWAY_PROVIDER || 'phonepe').toLowerCase();
  if (provider === 'razorpay' && process.env.RAZORPAY_KEY_ID) {
    return 'razorpay';
  }
  return 'phonepe';
}

/**
 * Unified entry point to initiate payments regardless of underlying provider.
 */
export async function initiateSubscriptionPayment(
  params: InitiatePaymentParams
): Promise<InitiatePaymentResult> {
  const gateway = getActivePaymentGateway();
  if (gateway === 'razorpay') {
    return initiateRazorpayPayment(params);
  }
  return initiatePhonePePayment(params);
}

/**
 * Unified entry point to verify payments.
 */
export async function verifySubscriptionPayment(
  merchantTransactionId: string,
  gateway: 'phonepe' | 'razorpay' = 'phonepe'
): Promise<PaymentStatusResult> {
  if (gateway === 'phonepe') {
    return checkPhonePePaymentStatus(merchantTransactionId);
  }
  return {
    success: false,
    status: 'FAILED',
    merchantTransactionId,
    message: 'Verification for provider not supported.',
  };
}
