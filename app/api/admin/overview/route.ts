import { NextResponse } from 'next/server';
import { getAdminTenants, getAdminTransactions } from '@/lib/admin-store';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'axiogen_admin_2026';

function verifyAdmin(request: Request): boolean {
  const headerKey = request.headers.get('x-admin-key');
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('key');
  return headerKey === ADMIN_SECRET_KEY || queryKey === ADMIN_SECRET_KEY;
}

export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Invalid admin secret.' }, { status: 401 });
  }

  const tenants = getAdminTenants();
  const transactions = getAdminTransactions();

  const planPrices = { free_trial: 0, starter: 499, pro: 999, agency: 2499 };

  const paidSubscribers = tenants.filter((t) => t.plan !== 'free_trial').length;
  const mrr = tenants.reduce((acc, t) => acc + (planPrices[t.plan] || 0), 0);
  const totalRevenue = transactions
    .filter((tx) => tx.status === 'SUCCESS')
    .reduce((acc, tx) => acc + (tx.amount || 0), 0);
  const connectedNumbers = tenants.filter((t) => t.whatsappStatus === 'connected').length;
  const totalAiMessages = tenants.reduce((acc, t) => acc + (t.messagesUsed || 0), 0);

  return NextResponse.json({
    success: true,
    kpis: {
      totalTenants: tenants.length,
      paidSubscribers,
      mrr,
      totalRevenue,
      connectedNumbers,
      totalAiMessages,
    },
    tenants,
    transactions,
    system: {
      gatewayProvider: process.env.PAYMENT_GATEWAY_PROVIDER || 'phonepe',
      phonePeEnv: process.env.PHONEPE_ENV || 'uat',
      whatsappGateway: process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas',
    },
  });
}
