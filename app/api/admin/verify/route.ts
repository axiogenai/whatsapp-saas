import { NextResponse } from 'next/server';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'axiogen_admin_2026';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json({ success: false, error: 'Passcode required' }, { status: 400 });
    }

    if (passcode.trim() === ADMIN_SECRET_KEY) {
      const response = NextResponse.json({ success: true, message: 'Super admin verified' });
      response.cookies.set('wa_is_admin', 'true', {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        httpOnly: false,
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Incorrect master passcode' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Verification error' }, { status: 500 });
  }
}
