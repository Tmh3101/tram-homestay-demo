'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CheckCircle2, MapPin, Home, PhoneCall, MessageCircle, Facebook,
  Heart, Users, ExternalLink, Sparkles
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useBookingStore } from '@/lib/store/bookingStore';
import { formatCurrency } from '@/lib/utils';
import { GoogleMap, GOOGLE_MAPS_URL } from '@/components/ui/GoogleMap';
import Image from 'next/image';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#243D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const { booking, resetFlow } = useBookingStore();

  const orderCode = booking.orderCode || bookingId || 'TMH-20260723';
  const guestName = booking.guestName || 'Nguyễn Văn A';
  const roomName = booking.roomName || 'Deluxe View Núi';
  const checkIn = booking.checkIn || '2026-07-25';
  const checkOut = booking.checkOut || '2026-07-27';
  const totalAmount = booking.totalAmount || 2500000;
  const zaloGroupUrl = 'https://zalo.me/g/tramhomestaytamdao';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#101810] flex flex-col">
      <Header />

      <main className="flex-1 pb-24">
        {/* Animated Celebration Banner */}
        <div className="bg-[#243D24] text-[#F5F0E1] py-10 px-4 sm:px-6 shadow-md mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,240,225,0.1),transparent_70%)]" />

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-16 h-16 rounded-full bg-[#F5F0E1] text-[#243D24] flex items-center justify-center mx-auto mb-3 shadow-xl border-4 border-emerald-500/30"
          >
            <CheckCircle2 className="w-10 h-10 text-[#243D24]" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F0E1] mb-1"
          >
            Đặt phòng thành công!
          </motion.h1>

          <p className="text-xs text-emerald-200/90 max-w-sm mx-auto">
            Mã xác nhận vé đã gửi qua Zalo & Email của bạn.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Thank you message, Ticket & Contact Details */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Thank You Note Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#243D24] text-[#F5F0E1] shadow-md flex items-center gap-3.5 border border-emerald-500/20">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-[#F5F0E1]">
                    Cảm ơn quý khách {guestName}!
                  </h3>
                  <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">
                    Tràm Homestay chúc bạn có kì nghỉ tuyệt vời và trọn vẹn tại Tam Đảo.
                  </p>
                </div>
              </div>

              {/* Main Ticket Container */}
              <div className="rounded-3xl bg-white border border-emerald-950/15 p-6 sm:p-8 shadow-xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#243D24] text-[#F5F0E1] text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl">
                  XÁC NHẬN CHÍNH THỨC
                </div>

                {/* Booking Code Header */}
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs text-slate-400 font-medium">Mã đặt phòng</span>
                  <div className="font-mono text-2xl sm:text-3xl font-bold text-[#243D24] tracking-wider mt-0.5">
                    #{orderCode}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-xs">Khách hàng</span>
                    <p className="font-bold text-slate-900">{guestName}</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-xs">Hạng phòng</span>
                    <p className="font-bold text-[#243D24]">{roomName}</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-xs">Check-in</span>
                    <p className="font-semibold text-slate-900">{checkIn} (14:00)</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 text-xs">Check-out</span>
                    <p className="font-semibold text-slate-900">{checkOut} (12:00)</p>
                  </div>
                </div>

                {/* Total Paid Badge */}
                <div className="p-3.5 rounded-2xl bg-[#F5F0E1] border border-amber-900/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-600 block">Đã thanh toán</span>
                    <span className="font-heading text-xl font-bold text-[#243D24]">
                      {formatCurrency(totalAmount)}đ
                    </span>
                  </div>
                  <Badge variant="success" className="rounded-full px-3 py-1 text-xs">
                    ✓ Đã nhận tiền
                  </Badge>
                </div>

                {/* Location Note */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Địa chỉ Tràm Homestay</p>
                    <p className="mt-0.5 text-slate-600">Tổ 3, Thôn Yên Thịnh, Xã Tam Đảo, Vĩnh Phúc</p>
                  </div>
                </div>

              </div>

              {/* Contact & Support Section */}
              <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-3">
                <h3 className="font-heading text-sm font-bold text-[#243D24] border-b border-slate-100 pb-2">
                  Kênh hỗ trợ khách hàng
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Zalo */}
                  <a
                    href="https://zalo.me/0988123456"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 hover:bg-blue-100/80 transition-colors flex items-center gap-2.5 text-xs text-blue-900"
                  >
                    <Image src="/icons/zalo.png" width={22} height={22} alt="Zalo" className="rounded-md shrink-0" />
                    <div>
                      <span className="text-[10px] text-blue-600/80 block uppercase font-bold">Chat Zalo</span>
                      <span className="font-mono text-xs font-bold">0988.123.456</span>
                    </div>
                  </a>

                  {/* Facebook Fanpage */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200/80 hover:bg-indigo-100/80 transition-colors flex items-center gap-2.5 text-xs text-indigo-900"
                  >
                    <Facebook className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-indigo-600/80 block uppercase font-bold">Fanpage</span>
                      <span className="truncate block font-bold text-xs">Tràm Homestay</span>
                    </div>
                  </a>

                  {/* Hotline */}
                  <a
                    href="tel:0988123456"
                    className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 hover:bg-emerald-100/80 transition-colors flex items-center gap-2.5 text-xs text-emerald-900"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-700/80 block uppercase font-bold">Hotline 24/7</span>
                      <span className="font-mono text-xs font-bold">0988.123.456</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Primary Return Home Button */}
              <div className="pt-1">
                <Link href="/" onClick={() => resetFlow()}>
                  <Button className="w-full bg-[#243D24] text-[#F5F0E1] hover:bg-[#1A2D1A] rounded-2xl py-3.5 text-sm font-bold shadow-lg flex items-center justify-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>Trở về trang chủ</span>
                  </Button>
                </Link>
              </div>

            </div>

            {/* Right 1 Col: Join Zalo Group QR Code */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm text-center space-y-4 sticky top-24">
                
                <div className="w-12 h-12 rounded-2xl bg-blue-50/80 flex items-center justify-center mx-auto border border-blue-200/60 shadow-sm p-1.5">
                  <Image src="/icons/zalo.png" width={34} height={34} alt="Zalo Logo" className="rounded-lg object-contain" />
                </div>

                <div>
                  <Badge variant="info" className="rounded-full px-3 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border-blue-200 mb-1.5">
                    Cộng đồng du khách
                  </Badge>
                  <h3 className="font-heading text-base font-bold text-[#243D24]">Tham gia Group Zalo</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Quét mã QR để gia nhập nhóm Zalo tư vấn & hỗ trợ khách hàng:
                  </p>
                </div>

                {/* Zalo Group QR Code */}
                <div className="inline-block p-3 rounded-2xl bg-white border-2 border-blue-600/20 shadow-inner relative">
                  <QRCodeSVG
                    value={zaloGroupUrl}
                    size={160}
                    level="H"
                    includeMargin
                    imageSettings={{
                      src: '/icons/zalo.png',
                      x: undefined,
                      y: undefined,
                      height: 32,
                      width: 32,
                      excavate: true,
                    }}
                  />
                </div>

                {/* Direct Join Link Button */}
                <a
                  href={zaloGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all block"
                >
                  <span>Vào Group Zalo ngay</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

              </div>
            </div>

          </div>

          {/* Standalone Google Map Section Below Both Cards */}
          <div className="mt-10 rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#243D24]">Bản đồ & Chỉ đường tới Tràm Homestay</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Tổ 3, Thôn Yên Thịnh, Xã Tam Đảo, Vĩnh Phúc (Chế độ xem vệ tinh)</p>
                </div>
              </div>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-100/80 text-emerald-900 font-bold text-xs hover:bg-emerald-200 transition-colors shrink-0 self-start sm:self-auto"
              >
                <span>Mở trên Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <GoogleMap height="h-[460px]" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
