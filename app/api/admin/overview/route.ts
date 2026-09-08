import { NextResponse } from 'next/server';
import { getAdminTenants, saveAdminTenants, getAdminTransactions, AdminTenant } from '@/lib/admin-store';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'axiogen_admin_2026';
const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

function verifyAdmin(request: Request): boolean {
  const headerKey = request.headers.get('x-admin-key');
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('key');
  const cookieHeader = request.headers.get('cookie') || '';
  const hasAdminCookie = cookieHeader.includes('wa_is_admin=true');
  return headerKey === ADMIN_SECRET_KEY || queryKey === ADMIN_SECRET_KEY || hasAdminCookie;
}

export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Invalid admin secret.' }, { status: 401 });
  }

  let tenants: AdminTenant[] = getAdminTenants();

  // Query live WhatsApp backend on Oracle VM for real-time tenants & connection statuses
  try {
    const vmRes = await fetch(`${GATEWAY_URL}/api/admin/tenants?key=${ADMIN_SECRET_KEY}`, {
      headers: { 'x-admin-key': ADMIN_SECRET_KEY },
      signal: AbortSignal.timeout(4000),
      cache: 'no-store',
    });

    if (vmRes.ok) {
      const vmData = await vmRes.json();
      if (vmData.success && Array.isArray(vmData.tenants)) {
        const vmTenants: AdminTenant[] = vmData.tenants;
        const localTenants = getAdminTenants();
        const mergedMap = new Map<string, AdminTenant>();

        for (const t of vmTenants) {
          mergedMap.set(t.tenantId, t);
        }

        for (const loc of localTenants) {
          if (!mergedMap.has(loc.tenantId)) {
            mergedMap.set(loc.tenantId, loc);
          } else {
            const existing = mergedMap.get(loc.tenantId)!;
            mergedMap.set(loc.tenantId, {
              ...existing,
              name: loc.name || existing.name,
              email: loc.email || existing.email,
              businessName: loc.businessName || existing.businessName,
            });
          }
        }

        tenants = Array.from(mergedMap.values());
        saveAdminTenants(tenants);
      }
    }
  } catch (err) {
    console.error('[Admin Overview] Failed to fetch live tenants from VM gateway:', err);
  }

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
