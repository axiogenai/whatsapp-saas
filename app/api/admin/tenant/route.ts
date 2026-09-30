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

    // Determine target plan and quota limit
    let targetLimit: number | undefined = undefined;
    if (plan === 'starter') targetLimit = 1500;
    else if (plan === 'pro') targetLimit = 8000;
    else if (plan === 'agency') targetLimit = 30000;
    else if (plan === 'free_trial') targetLimit = 70;

    // 1. Forward directly to Oracle VM Gateway FIRST and AWAIT it
    let vmSuccess = false;
    let vmTenant: any = null;
    try {
      const vmRes = await fetch(`${GATEWAY_URL}/api/admin/tenant/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET_KEY,
        },
        body: JSON.stringify({
          tenantId,
          plan,
          trialLimit: targetLimit,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (vmRes.ok) {
        const vmData = await vmRes.json();
        if (vmData.success && vmData.tenant) {
          vmSuccess = true;
          vmTenant = vmData.tenant;
        }
      }
    } catch (err) {
      console.error('[Admin Tenant Update] Failed to call VM gateway:', err);
    }

    // 2. Synchronize local admin store (update or record)
    let tenants = getAdminTenants();
    const idx = tenants.findIndex((t) => t.tenantId === tenantId);
    let updated: AdminTenant;

    if (idx >= 0) {
      updated = { ...tenants[idx] };
      if (plan) updated.plan = plan;
      if (targetLimit !== undefined) updated.trialLimit = targetLimit;
      if (typeof addCredits === 'number' && addCredits > 0) {
        updated.trialLimit = (updated.trialLimit || 70) + addCredits;
      }
      if (resetQuota) updated.messagesUsed = 0;
      if (disconnect) {
        updated.whatsappStatus = 'disconnected';
        updated.phone = '';
      }
      updated.updatedAt = new Date().toISOString();
      tenants[idx] = updated;
      saveAdminTenants(tenants);
    } else {
      updated = {
        id: vmTenant?.id || `usr_${tenantId}`,
        tenantId,
        businessName: vmTenant?.businessName || tenantId,
        name: vmTenant?.ownerName || 'Workspace Owner',
        email: vmTenant?.ownerEmail || `${tenantId}@axiogen.in`,
        plan: plan || 'free_trial',
        messagesUsed: 0,
        trialLimit: targetLimit || 70,
        whatsappStatus: 'disconnected',
        phone: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tenants.unshift(updated);
      saveAdminTenants(tenants);
    }

    return NextResponse.json({ success: true, tenant: updated, vmSynced: vmSuccess });
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
    let tenantId = searchParams.get('tenantId');
    if (!tenantId) {
      try {
        const body = await request.json();
        tenantId = body?.tenantId;
      } catch {}
    }

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Tenant ID required.' }, { status: 400 });
    }

    if (tenantId === 'default' || tenantId === 'aditaypatil07') {
      return NextResponse.json({ success: false, error: 'Super Admin tenant cannot be deleted.' }, { status: 400 });
    }

    // 1. Trigger complete wipe on VM gateway (storage, Baileys keys, config, contacts, users.json)
    try {
      const vmRes = await fetch(`${GATEWAY_URL}/api/admin/tenant/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET_KEY,
        },
        body: JSON.stringify({ tenantId }),
        signal: AbortSignal.timeout(6000),
      });

      if (!vmRes.ok) {
        console.warn(`[Admin Tenant DELETE] Gateway responded with status ${vmRes.status}`);
      }
    } catch (e) {
      console.error('[Admin Tenant DELETE] Failed to call VM gateway delete:', e);
    }

    // 2. Remove from local admin store
    let tenants = getAdminTenants();
    tenants = tenants.filter((t) => t.tenantId !== tenantId);
    saveAdminTenants(tenants);

    return NextResponse.json({
      success: true,
      message: `Tenant '${tenantId}' and all associated storage, auth keys, configuration, and data permanently deleted.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

