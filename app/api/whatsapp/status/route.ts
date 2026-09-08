import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = request.headers.get('x-tenant-id') || searchParams.get('tenantId') || 'default';
  const targetEndpoint = `${GATEWAY_URL}/api/tenant/${tenantId}/status`;

  try {
    const res = await fetch(targetEndpoint, {
      cache: 'no-store',
      headers: { 'x-tenant-id': tenantId },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        success: true,
        tenantId,
        status: data.status,
        phone: data.phone || '',
        name: data.name || '',
        qrCodeUrl: data.qrCodeUrl || '',
        pairingCode: data.pairingCode || '',
        lastConnectedAt: data.lastConnectedAt,
        lastError: data.lastError,
        botConfig: data.botConfig,
      });
    }
  } catch (err: any) {
    // Gateway down
  }

  return NextResponse.json({
    success: false,
    tenantId,
    status: 'disconnected',
    phone: '',
    name: '',
    qrCodeUrl: '',
    pairingCode: '',
    lastError: 'Connecting to Axiogen WhatsApp Engine...',
  });
}
