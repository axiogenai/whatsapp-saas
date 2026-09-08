import { NextResponse } from 'next/server';
import { recordTenant, recordTransaction } from '@/lib/admin-store';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'axiogen_admin_2026';
const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, tenant, transaction } = body;

    if (type === 'tenant' && tenant?.tenantId) {
      const saved = recordTenant(tenant);

      // Asynchronously forward to VM backend database
      try {
        fetch(`${GATEWAY_URL}/api/admin/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': ADMIN_SECRET_KEY,
          },
          body: JSON.stringify({ tenant }),
          signal: AbortSignal.timeout(3000),
        }).catch(() => {});
      } catch {}

      return NextResponse.json({ success: true, tenant: saved });
    }

    if (type === 'transaction' && transaction?.merchantTransactionId) {
      const saved = recordTransaction(transaction);
      return NextResponse.json({ success: true, transaction: saved });
    }

    return NextResponse.json({ success: false, error: 'Invalid sync payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
