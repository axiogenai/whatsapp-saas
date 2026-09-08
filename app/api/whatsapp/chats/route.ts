import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = request.headers.get('x-tenant-id') || searchParams.get('tenantId') || 'default';

  try {
    const res = await fetch(`${GATEWAY_URL}/api/tenant/${tenantId}/chats`, {
      cache: 'no-store',
      headers: { 'x-tenant-id': tenantId },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json({ telemetry: [], contacts: [] });
}
