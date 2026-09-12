import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = request.headers.get('x-tenant-id') || searchParams.get('tenantId') || 'default';

  try {
    const body = await request.json();
    const res = await fetch(`${GATEWAY_URL}/api/tenant/${tenantId}/contacts/control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    const err = await res.json().catch(() => ({ error: 'Failed updating contact' }));
    return NextResponse.json(err, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Network error' }, { status: 500 });
  }
}
