'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Clock, CheckCircle, Copy, 
  ArrowLeft, Check, RefreshCw
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useBookingStore } from '@/lib/store/bookingStore';
import { formatCurrency } from '@/lib/utils';
import { HOMESTAY_BANK_ACCOUNT } from '@/lib/constants';

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#243D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingIdParam = searchParams.get('bookingId');

  const {
    booking,
    paymentTimer,
    decrementTimer,
    onPaymentMatched,
  } = useBookingStore();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  const orderCode = booking.orderCode || (bookingIdParam ? bookingIdParam.replace(/\D/g, '') : 12345678);
  const totalAmount = booking.totalAmount || 2500000;
  const transferContent = `TMH ${orderCode}`;

  // VietQR standard text string format
  const qrValue = `https://qr.sepay.vn/img?acc=${HOMESTAY_BANK_ACCOUNT.accountNumber}&bank=${HOMESTAY_BANK_ACCOUNT.bankName}&amount=${totalAmount}&des=${encodeURIComponent(transferContent)}`;

  // 1. Countdown timer interval (30 min)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [decrementTimer]);

  // 2. Real-time polling `/api/bookings/:id` every 3 seconds
  useEffect(() => {
    const bookingId = bookingIdParam || booking.id;
    if (!bookingId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          const currentBooking = data.booking || data;
          if (currentBooking.status === 'CONFIRMED') {
            onPaymentMatched();
            router.push(`/success?bookingId=${bookingId}`);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [bookingIdParam, booking.id, onPaymentMatched, router]);

  // Handle manual payment match trigger (Demo mode: pass immediately)
  const handleManualMatch = async () => {
    setIsMatching(true);
    const targetBookingId = bookingIdParam || booking.id || orderCode;
    
    // Set state in store
    onPaymentMatched();
    
    // Background notification to API route (non-blocking for instant demo UX)
    fetch('/api/payment/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: targetBookingId,
        orderCode: orderCode,
        amount: totalAmount,
      }),
    }).catch(() => {});

    // Pass directly to success page
    router.push(`/success?bookingId=${targetBookingId}`);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format timer MM:SS
  const minutes = Math.floor(paymentTimer / 60);
  const seconds = paymentTimer % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeLow = paymentTimer < 300; // less than 5 mins

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#101810] flex flex-col">
      <Header />

      <main className="flex-1 pb-24">
        {/* Payment Banner & Countdown */}
        <div className="bg-[#243D24] text-[#F5F0E1] py-8 px-4 sm:px-6 shadow-md mb-8">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/booking" className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F0E1]">Thanh toán chuyển khoản 24/7</h1>
                <p className="text-sm text-[#F5F0E1] font-medium mt-0.5">Quét mã QR bằng ứng dụng ngân hàng bất kỳ</p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-sm font-bold shadow-lg border ${
              isTimeLow 
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                : 'bg-[#F5F0E1] text-[#243D24] border-emerald-400/40'
            }`}>
              <Clock className="w-4 h-4 text-[#243D24]" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Simplified Centered Card Container */}
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl space-y-6 text-center">
            
            {/* Header Status */}
            <div className="flex items-center justify-center gap-2 border-b border-slate-100 pb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-sm font-bold text-slate-800">Quét mã QR để thanh toán</span>
            </div>

            {/* QR Code SVG */}
            <div className="inline-block p-4 rounded-3xl bg-white border-2 border-emerald-950/10 shadow-inner relative">
              <QRCodeSVG
                value={qrValue}
                size={220}
                level="H"
                includeMargin
                imageSettings={{
                  src: '/favicon.ico',
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true,
                }}
              />
              <div className="mt-2 text-xs text-slate-600 font-medium">
                Mã đơn hàng: <strong className="text-[#243D24] text-sm">#{orderCode}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Sử dụng app ngân hàng (VCB, TCB, MB, BIDV...) quét mã QR trên
            </p>

            {/* Simplified Transfer Details */}
            <div className="space-y-3 text-left border-t border-slate-100 pt-4">
              {/* Account Number */}
              <div 
                onClick={() => copyToClipboard(HOMESTAY_BANK_ACCOUNT.accountNumber, 'acc')}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-slate-600 block text-[11px] uppercase tracking-wider font-bold">Tài khoản thanh toán</span>
                  <span className="font-bold text-slate-900 font-mono text-base">{HOMESTAY_BANK_ACCOUNT.accountNumber}</span>
                  <span className="text-xs text-slate-600 ml-2">({HOMESTAY_BANK_ACCOUNT.bankName})</span>
                </div>
                <div className="text-slate-600 hover:text-emerald-700 text-xs flex items-center gap-1 font-medium">
                  {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedField === 'acc' ? 'Đã chép' : ''}</span>
                </div>
              </div>

              {/* Total Amount */}
              <div 
                onClick={() => copyToClipboard(totalAmount.toString(), 'amount')}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-slate-600 block text-[11px] uppercase tracking-wider font-bold">Số tiền</span>
                  <span className="font-bold text-[#243D24] text-lg">{formatCurrency(totalAmount)}đ</span>
                </div>
                <div className="text-slate-600 hover:text-emerald-700 text-xs flex items-center gap-1 font-medium">
                  {copiedField === 'amount' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedField === 'amount' ? 'Đã chép' : ''}</span>
                </div>
              </div>

              {/* Transfer Content */}
              <div 
                onClick={() => copyToClipboard(transferContent, 'content')}
                className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 hover:border-emerald-400 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-emerald-900 block text-[11px] uppercase tracking-wider font-bold">Nội dung chuyển khoản</span>
                  <span className="font-bold text-emerald-950 font-mono text-base">{transferContent}</span>
                </div>
                <div className="text-emerald-800 text-xs flex items-center gap-1 font-medium">
                  {copiedField === 'content' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedField === 'content' ? 'Đã chép' : ''}</span>
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="pt-2">
              <Button
                onClick={handleManualMatch}
                disabled={isMatching}
                className="w-full bg-[#243D24] text-[#F5F0E1] hover:bg-[#1A2D1A] rounded-2xl py-4 text-sm sm:text-base font-bold shadow-xl flex items-center justify-center gap-2"
              >
                {isMatching ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
                <span>{isMatching ? 'Đang xác nhận...' : 'Tôi đã hoàn tất chuyển khoản ➔'}</span>
              </Button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
