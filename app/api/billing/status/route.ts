import { NextResponse } from 'next/server';
import { checkPhonePePaymentStatus } from '@/lib/payments';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txn = searchParams.get('txn');

  if (!txn) {
    return NextResponse.json({ success: false, error: 'Transaction ID required' }, { status: 400 });
  }

  try {
    const statusResult = await checkPhonePePaymentStatus(txn);
    return NextResponse.json(statusResult);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Status check failed' },
      { status: 500 }
    );
  }
}
