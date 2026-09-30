import { getAdminTenants, saveAdminTenants, AdminTenant } from '@/lib/admin-store';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'axiogen_admin_2026';
const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function fulfillPaidTenantPlan(tenantId: string, plan: string, txnId: string) {
  if (!tenantId || !plan) {
    return { success: false, error: 'Missing tenantId or plan' };
  }

  let targetLimit = 70;
  if (plan === 'starter') targetLimit = 1500;
  else if (plan === 'pro') targetLimit = 8000;
  else if (plan === 'agency') targetLimit = 30000;

  console.log(`[Fulfillment] Provisioning plan ${plan} (${targetLimit} quota) for tenant ${tenantId}, txn: ${txnId}`);

  // 1. Forward directly to Oracle VM Gateway
  let vmSuccess = false;
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
      signal: AbortSignal.timeout(6000),
    });

    if (vmRes.ok) {
      const data = await vmRes.json();
      vmSuccess = data.success ?? true;
      console.log(`[Fulfillment] Oracle VM successfully provisioned tenant ${tenantId}:`, data);
    } else {
      console.warn(`[Fulfillment] Oracle VM responded with status: ${vmRes.status}`);
    }
  } catch (err: any) {
    console.error(`[Fulfillment] Network error contacting Oracle VM for tenant ${tenantId}:`, err?.message);
  }

  // 2. Synchronize local admin store
  try {
    const tenants = getAdminTenants();
    const idx = tenants.findIndex((t) => t.tenantId === tenantId);
    if (idx >= 0) {
      tenants[idx].plan = plan as any;
      tenants[idx].trialLimit = targetLimit;
      tenants[idx].updatedAt = new Date().toISOString();
      saveAdminTenants(tenants);
    }
  } catch (err: any) {
    console.error('[Fulfillment] Error synchronizing admin-store:', err?.message);
  }

  return { success: true, vmSuccess };
}
