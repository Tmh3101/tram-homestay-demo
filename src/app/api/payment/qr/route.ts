import { NextResponse } from 'next/server';
import { generateOrderCode } from '@/lib/utils';
import { generateVietQRContent, getBankDeeplinks } from '@/lib/vietqr';
import { HOMESTAY_BANK_ACCOUNT } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  const phone = searchParams.get('phone');

  if (!bookingId || !amount || !phone) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const orderCode = generateOrderCode();
  const qrContent = generateVietQRContent({
    bankBin: HOMESTAY_BANK_ACCOUNT.bankBin,
    accountNumber: HOMESTAY_BANK_ACCOUNT.accountNumber,
    accountName: HOMESTAY_BANK_ACCOUNT.accountName,
    amount: parseInt(amount),
    orderCode,
    phone,
  });

  const deeplinks = getBankDeeplinks(qrContent, parseInt(amount));

  return NextResponse.json({
    qrContent,
    deeplinks,
    orderCode,
    amount: parseInt(amount),
  });
}