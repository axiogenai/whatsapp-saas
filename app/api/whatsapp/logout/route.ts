import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tenantId = request.headers.get('x-tenant-id') || body.tenantId || 'default';

    const res = await fetch(`${GATEWAY_URL}/api/tenant/${tenantId}/logout`, {
      method: 'POST',
      headers: { 'x-tenant-id': tenantId },
      signal: AbortSignal.timeout(6000),
    });

    const data = await res.json().catch(() => ({ success: true }));
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: true, message: 'Unlinked.' });
  }
}
