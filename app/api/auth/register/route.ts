import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/userStore';

const GATEWAY_URL = process.env.NEXT_PUBLIC_WHATSAPP_SAAS_GATEWAY_URL || 'https://api.axiogen.in/whatsapp-saas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, businessName, tenantId } = body;

    if (!email || !password || !name || !businessName) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Try registering on VM gateway first
    try {
      const vmRes = await fetch(`${GATEWAY_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, businessName, tenantId }),
        signal: AbortSignal.timeout(4000),
      });

      if (vmRes.ok) {
        const vmData = await vmRes.json();
        if (vmData.success && vmData.user) {
          const response = NextResponse.json({
            success: true,
            user: vmData.user,
          });

          response.cookies.set('wa_tenant_id', vmData.user.tenantId, { path: '/', maxAge: 2592000, sameSite: 'lax' });
          response.cookies.set('wa_user_email', vmData.user.email, { path: '/', maxAge: 2592000, sameSite: 'lax' });
          if (vmData.user.isAdmin) {
            response.cookies.set('wa_is_admin', 'true', { path: '/', maxAge: 2592000, sameSite: 'lax' });
          }

          return response;
        } else if (vmRes.status === 409) {
          return NextResponse.json(
            { success: false, error: vmData.error || 'An account with this email already exists.' },
            { status: 409 }
          );
        }
      }
    } catch (_) {
      // Fallback to local
    }

    // Local registration
    const result = registerUser({
      email,
      password,
      name,
      businessName,
      tenantId,
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || 'Registration failed.' },
        { status: 400 }
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
    console.error('[Auth Register API] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Registration service error. Please try again.' },
      { status: 500 }
    );
  }
}
