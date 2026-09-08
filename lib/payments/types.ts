export type PlanType = 'free_trial' | 'starter' | 'pro' | 'agency';

export interface PlanDetails {
  id: PlanType;
  name: string;
  priceInr: number;
  amountInPaise: number;
  messagesPerMonth: number;
  whatsappNumbers: number;
  description: string;
}

export const PLANS: Record<Exclude<PlanType, 'free_trial'>, PlanDetails> = {
  starter: {
    id: 'starter',
    name: 'Starter Plan',
    priceInr: 499,
    amountInPaise: 49900,
    messagesPerMonth: 1500,
    whatsappNumbers: 1,
    description: 'Perfect for solo businesses, clinics, and local retail.',
  },
  pro: {
    id: 'pro',
    name: 'Business Pro',
    priceInr: 999,
    amountInPaise: 99900,
    messagesPerMonth: 8000,
    whatsappNumbers: 2,
    description: 'For growing brands, e-commerce, and real estate offices.',
  },
  agency: {
    id: 'agency',
    name: 'Agency / Scale',
    priceInr: 2499,
    amountInPaise: 249900,
    messagesPerMonth: 30000,
    whatsappNumbers: 5,
    description: 'High-volume agencies managing multiple client accounts.',
  },
};

export interface InitiatePaymentParams {
  plan: 'starter' | 'pro' | 'agency';
  tenantId: string;
  email?: string;
  phone?: string;
  customerName?: string;
}

export interface InitiatePaymentResult {
  success: boolean;
  gateway: 'phonepe' | 'razorpay';
  merchantTransactionId: string;
  redirectUrl: string;
  amount: number;
  plan: 'starter' | 'pro' | 'agency';
  error?: string;
}

export interface PaymentStatusResult {
  success: boolean;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  merchantTransactionId: string;
  providerTransactionId?: string;
  plan?: 'starter' | 'pro' | 'agency';
  amount?: number;
  paymentMode?: string;
  message?: string;
  raw?: any;
}
