import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || body.tenantId || 'default';
    const { jid, action } = body;

    const res = await fetch(`${GATEWAY_URL}/api/tenant/${tenantId}/takeover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify({ jid, action }),
      signal: AbortSignal.timeout(6000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: `Takeover failed: ${err.message}` }, { status: 502 });
  }
}
