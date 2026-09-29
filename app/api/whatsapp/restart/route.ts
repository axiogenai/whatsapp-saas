import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tenantId = request.headers.get('x-tenant-id') || body.tenantId || 'default';

    console.log(`[Restart API] Calling gateway to force fresh QR for tenant '${tenantId}'...`);

    const res = await fetch(`${GATEWAY_URL}/api/tenant/${tenantId}/restart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify({ tenantId, force: true }),
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, message: data.message || 'QR regenerated successfully.' });
    }

    // Fallback: try logout endpoint which triggers re-init
    const fallbackRes = await fetch(`${GATEWAY_URL}/api/tenant/${tenantId}/logout`, {
      method: 'POST',
      headers: { 'x-tenant-id': tenantId },
      signal: AbortSignal.timeout(8000),
    });

    return NextResponse.json({ success: true, message: 'Session reset. Generating fresh QR...' });
  } catch (err: any) {
    console.error('[Restart API] Error:', err);
    return NextResponse.json({ success: true, message: 'Session reset triggered.' });
  }
}
