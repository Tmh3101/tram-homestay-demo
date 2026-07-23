import { HOMESTAY_BANK_ACCOUNT } from './constants';

export function generateVietQRContent(params: {
  bankBin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  orderCode: number;
  phone: string;
}): string {
  const content = `DATPHONG ${params.orderCode} ${params.phone.replace(/\D/g, '')}`;
  return `${params.bankBin}|${params.accountNumber}|${params.accountName}|${content}`;
}

export function getBankDeeplinks(content: string, amount: number): Record<string, string> {
  const encodedContent = encodeURIComponent(content);
  const encodedAmount = amount.toString();
  
  return {
    vietcombank: `vietcombank://pay?data=${encodedContent}&amount=${encodedAmount}`,
    techcombank: `tcbmobile://pay?data=${encodedContent}&amount=${encodedAmount}`,
    bidv: `bidv://pay?data=${encodedContent}&amount=${encodedAmount}`,
    mb: `mbbank://pay?data=${encodedContent}&amount=${encodedAmount}`,
    vpbank: `vpbank://pay?data=${encodedContent}&amount=${encodedAmount}`,
    acb: `acb://pay?data=${encodedContent}&amount=${encodedAmount}`,
    web: `https://vietqr.net/qr?data=${encodedContent}&amount=${encodedAmount}`,
  };
}