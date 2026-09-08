import { NextResponse } from 'next/server';
import { getAdminTenants, saveAdminTenants, AdminTenant } from '@/lib/admin-store';

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

export async function POST(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tenantId, plan, addCredits, resetQuota, disconnect } = body;

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Tenant ID required.' }, { status: 400 });
    }

    const tenants = getAdminTenants();
    const idx = tenants.findIndex((t) => t.tenantId === tenantId);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Tenant not found.' }, { status: 404 });
    }

    const current = tenants[idx];
    const updated: AdminTenant = { ...current };

    if (plan && ['free_trial', 'starter', 'pro', 'agency'].includes(plan)) {
      updated.plan = plan;
      if (plan === 'starter') updated.trialLimit = 1500;
      else if (plan === 'pro') updated.trialLimit = 8000;
      else if (plan === 'agency') updated.trialLimit = 30000;
    }

    if (typeof addCredits === 'number' && addCredits > 0) {
      updated.trialLimit = (updated.trialLimit || 70) + addCredits;
    }

    if (resetQuota) {
      updated.messagesUsed = 0;
    }

    if (disconnect) {
      updated.whatsappStatus = 'disconnected';
      updated.phone = '';
    }

    updated.updatedAt = new Date().toISOString();
    tenants[idx] = updated;
    saveAdminTenants(tenants);

    // Forward to VM backend gateway
    try {
      fetch(`${GATEWAY_URL}/api/admin/tenant/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET_KEY,
        },
        body: JSON.stringify({
          tenantId,
          plan: updated.plan,
          trialLimit: updated.trialLimit,
        }),
        signal: AbortSignal.timeout(3000),
      }).catch(() => {});
    } catch {}

    return NextResponse.json({ success: true, tenant: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Tenant ID required.' }, { status: 400 });
    }

    let tenants = getAdminTenants();
    tenants = tenants.filter((t) => t.tenantId !== tenantId);
    saveAdminTenants(tenants);

    return NextResponse.json({ success: true, message: 'Tenant deleted from admin registry.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
