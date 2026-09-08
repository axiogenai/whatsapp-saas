import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || body.tenantId || 'default';
    const phone = body.phone || body.phoneNumber || body.jid;
    const text = body.text || body.message;

    if (!phone || !text) {
      return NextResponse.json({ error: 'Phone and text are required.' }, { status: 400 });
    }

    const res = await fetch(`${GATEWAY_URL}/api/tenant/${tenantId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify({ phone, text, jid: phone }),
      signal: AbortSignal.timeout(12000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: `Send failed: ${err.message}` }, { status: 502 });
  }
}
