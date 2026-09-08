import { NextResponse } from 'next/server';
import { recordTenant, recordTransaction } from '@/lib/admin-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, tenant, transaction } = body;

    if (type === 'tenant' && tenant?.tenantId) {
      const saved = recordTenant(tenant);
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
