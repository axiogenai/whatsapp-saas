import crypto from 'crypto';
import { InitiatePaymentParams, InitiatePaymentResult, PaymentStatusResult, PLANS } from './types';

function getPhonePeConfig() {
  const merchantId = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT86';
  const saltKey = process.env.PHONEPE_SALT_KEY || '96434309-7796-489d-8924-ab56988a6076';
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
  const env = (process.env.PHONEPE_ENV || 'uat').toLowerCase();

  const host =
    env === 'production'
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://whatsapp-saas-jet.vercel.app');

  return { merchantId, saltKey, saltIndex, env, host, appUrl };
}

/**
 * Initiates a real PhonePe standard payment session with UPI / Cards / NetBanking.
 */
export async function initiatePhonePePayment(
  params: InitiatePaymentParams
): Promise<InitiatePaymentResult> {
  const { merchantId, saltKey, saltIndex, host, appUrl } = getPhonePeConfig();
  const planInfo = PLANS[params.plan];

  if (!planInfo) {
    throw new Error(`Invalid plan selected: ${params.plan}`);
  }

  // Self-describing transaction ID: TXN_<plan>_<cleanTenant>_<timestamp>
  const cleanTenant = params.tenantId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || 'workspace';
  const merchantTransactionId = `TXN_${params.plan}_${cleanTenant}_${Date.now()}`;
  const merchantUserId = `MUID_${cleanTenant}_${Date.now().toString().slice(-6)}`;

  // Mobile number must be 10 digits for PhonePe PG. Default to a valid format if not provided.
  let mobileNumber = (params.phone || '').replace(/\D/g, '');
  if (mobileNumber.length > 10) {
    mobileNumber = mobileNumber.slice(-10);
  } else if (mobileNumber.length < 10) {
    mobileNumber = '9876543210';
  }

  const endpoint = '/pg/v1/pay';
  const redirectUrl = `${appUrl}/api/billing/phonepe/callback?txn=${encodeURIComponent(merchantTransactionId)}&plan=${encodeURIComponent(params.plan)}&tenant=${encodeURIComponent(params.tenantId)}`;
  const callbackUrl = `${appUrl}/api/billing/phonepe/webhook`;

  const payload = {
    merchantId,
    merchantTransactionId,
    merchantUserId,
    amount: planInfo.amountInPaise,
    redirectUrl,
    redirectMode: 'POST',
    callbackUrl,
    mobileNumber,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const stringToSign = base64Payload + endpoint + saltKey;
  const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
  const xVerify = `${sha256}###${saltIndex}`;

  try {
    const response = await fetch(`${host}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        accept: 'application/json',
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const data = await response.json();

    if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
      return {
        success: true,
        gateway: 'phonepe',
        merchantTransactionId,
        redirectUrl: data.data.instrumentResponse.redirectInfo.url,
        amount: planInfo.priceInr,
        plan: params.plan,
      };
    }

    return {
      success: false,
      gateway: 'phonepe',
      merchantTransactionId,
      redirectUrl: '',
      amount: planInfo.priceInr,
      plan: params.plan,
      error: data.message || 'Failed to generate PhonePe payment URL.',
    };
  } catch (err: any) {
    return {
      success: false,
      gateway: 'phonepe',
      merchantTransactionId,
      redirectUrl: '',
      amount: planInfo.priceInr,
      plan: params.plan,
      error: err.message || 'Network error connecting to PhonePe.',
    };
  }
}

/**
 * 100% Reliable Server-to-Server Payment Status Check
 * Direct query to PhonePe status endpoint with SHA256 checksum verification.
 */
export async function checkPhonePePaymentStatus(
  merchantTransactionId: string
): Promise<PaymentStatusResult> {
  const { merchantId, saltKey, saltIndex, host } = getPhonePeConfig();
  const endpoint = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;

  const stringToSign = endpoint + saltKey;
  const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
  const xVerify = `${sha256}###${saltIndex}`;

  // Extract plan from self-describing transaction ID if present
  let extractedPlan: 'starter' | 'pro' | 'agency' | undefined;
  const parts = merchantTransactionId.split('_');
  if (parts.length >= 2 && (parts[1] === 'starter' || parts[1] === 'pro' || parts[1] === 'agency')) {
    extractedPlan = parts[1] as 'starter' | 'pro' | 'agency';
  }

  try {
    const response = await fetch(`${host}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': merchantId,
        accept: 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (data.code === 'PAYMENT_SUCCESS') {
      return {
        success: true,
        status: 'SUCCESS',
        merchantTransactionId,
        providerTransactionId: data.data?.transactionId || '',
        plan: extractedPlan,
        amount: data.data?.amount ? data.data.amount / 100 : undefined,
        paymentMode: data.data?.paymentInstrument?.type || 'UPI',
        message: data.message || 'Payment verified successfully.',
        raw: data,
      };
    }

    if (data.code === 'PAYMENT_PENDING') {
      return {
        success: false,
        status: 'PENDING',
        merchantTransactionId,
        providerTransactionId: data.data?.transactionId || '',
        plan: extractedPlan,
        amount: data.data?.amount ? data.data.amount / 100 : undefined,
        message: data.message || 'Payment is pending confirmation.',
        raw: data,
      };
    }

    return {
      success: false,
      status: 'FAILED',
      merchantTransactionId,
      providerTransactionId: data.data?.transactionId || '',
      plan: extractedPlan,
      amount: data.data?.amount ? data.data.amount / 100 : undefined,
      message: data.message || 'Payment failed or was declined.',
      raw: data,
    };
  } catch (err: any) {
    return {
      success: false,
      status: 'FAILED',
      merchantTransactionId,
      plan: extractedPlan,
      message: err.message || 'Error checking PhonePe payment status.',
    };
  }
}

/**
 * Cryptographically verifies PhonePe server-to-server webhook callback
 */
export function verifyPhonePeWebhook(
  base64Response: string,
  receivedXVerify: string | null
): { valid: boolean; data?: any } {
  if (!receivedXVerify) return { valid: false };

  const { saltKey, saltIndex } = getPhonePeConfig();
  const calculatedSha = crypto
    .createHash('sha256')
    .update(base64Response + saltKey)
    .digest('hex');
  const expectedXVerify = `${calculatedSha}###${saltIndex}`;

  if (receivedXVerify !== expectedXVerify) {
    return { valid: false };
  }

  try {
    const decoded = JSON.parse(Buffer.from(base64Response, 'base64').toString('utf8'));
    return { valid: true, data: decoded };
  } catch {
    return { valid: false };
  }
}
