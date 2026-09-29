import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/userStore';

const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Try verifying against VM gateway first (if online)
    try {
      const vmRes = await fetch(`${GATEWAY_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(4000),
      });

      if (vmRes.ok) {
        const vmData = await vmRes.json();
        if (vmData.success && vmData.user) {
          const response = NextResponse.json({
            success: true,
            user: vmData.user,
          });

          // Set secure session cookies
          response.cookies.set('wa_tenant_id', vmData.user.tenantId, { path: '/', maxAge: 2592000, sameSite: 'lax' });
          response.cookies.set('wa_user_email', vmData.user.email, { path: '/', maxAge: 2592000, sameSite: 'lax' });
          if (vmData.user.isAdmin) {
            response.cookies.set('wa_is_admin', 'true', { path: '/', maxAge: 2592000, sameSite: 'lax' });
          }

          return response;
        } else if (vmRes.status === 401) {
          return NextResponse.json(
            { success: false, error: vmData.error || 'Invalid email or password.' },
            { status: 401 }
          );
        }
      }
    } catch (_) {
      // Fallback to local authentication engine
    }

    // Local authentication fallback
    const result = authenticateUser(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    response.cookies.set('wa_tenant_id', result.user.tenantId, { path: '/', maxAge: 2592000, sameSite: 'lax' });
    response.cookies.set('wa_user_email', result.user.email, { path: '/', maxAge: 2592000, sameSite: 'lax' });
    if (result.user.isAdmin) {
      response.cookies.set('wa_is_admin', 'true', { path: '/', maxAge: 2592000, sameSite: 'lax' });
    }

    return response;
  } catch (err: any) {
    console.error('[Auth Login API] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Authentication service error. Please try again.' },
      { status: 500 }
    );
  }
}
