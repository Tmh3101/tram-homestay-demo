'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, ChevronRight, Calendar, Star, MapPin, Phone, 
  Mail, Heart, CheckCircle, Bed, Mountain, Bath, Utensils, Trees,
  Sparkles, ShieldCheck, X, Check, ArrowRight
} from 'lucide-react';
import { vi } from 'date-fns/locale';
import { 
  format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameDay, isSameMonth, isAfter, isBefore 
} from 'date-fns';
import { formatCurrency, isPastDate, isToday, getNights, addDays, cn } from '@/lib/utils';
import { useRoomStore } from '@/lib/store/roomStore';
import { useBookingStore } from '@/lib/store/bookingStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoomCard } from '@/components/booking/RoomCard';
import { GoogleMap, GOOGLE_MAPS_URL } from '@/components/ui/GoogleMap';
import Image from 'next/image';
import roomsDataJson from '@/mocks/data/rooms.json';
import { Room } from '@/types';

const typedRoomsData = roomsDataJson as { rooms: Room[] };

export default function HomePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const defaultCheckIn = today;
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 2);

  // Date Range state
  const [checkIn, setCheckIn] = useState<Date | null>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<Date | null>(defaultCheckOut);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { fetchRooms } = useRoomStore();
  const { setDateRange, setStep } = useBookingStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Sync date range to store when checkIn & checkOut are set
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInStr = checkIn.toISOString().split('T')[0];
      const checkOutStr = checkOut.toISOString().split('T')[0];
      setDateRange({ checkIn: checkInStr, checkOut: checkOutStr });
    }
  }, [checkIn, checkOut, setDateRange]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Date Range click handler
  const handleDateClick = (date: Date) => {
    if (isPastDate(date) && !isToday(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Step 1: Start range selection
      setCheckIn(date);
      setCheckOut(null);
    } else if (checkIn && !checkOut) {
      // Step 2: Finish range selection
      if (isBefore(date, checkIn) || isSameDay(date, checkIn)) {
        setCheckIn(date);
        setCheckOut(null);
      } else {
        setCheckOut(date);
      }
    }
  };

  const checkInStr = checkIn ? checkIn.toISOString().split('T')[0] : '';
  const checkOutStr = checkOut ? checkOut.toISOString().split('T')[0] : '';
  const nightsCount = checkIn && checkOut ? getNights(checkInStr, checkOutStr) : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#101810] flex flex-col">
      <Header />

      <main className="flex-1 -mt-[84px]">
        {/* Hero Section - Full height to top edge */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 px-4 sm:px-6">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero.webp?v=2"
              alt="Tràm Homestay Tam Đảo Hero"
              fill
              priority
              quality={95}
              className="object-cover object-center scale-105"
            />
            {/* Multi-stage dark gradient overlay for optimal text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-[#0F180F]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10 text-center text-white space-y-7">
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/25 rounded-full px-4 py-2 text-xs font-bold text-white shadow-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.9/5 • 230+ đánh giá Google Maps</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight text-balance text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              Nghỉ dưỡng giữa rừng tràm
              <br />
              <span className="text-emerald-200 italic font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">Tỉnh táo từng giấc mơ</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-100/95 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              12 phòng nghỉ dưỡng sinh thái view núi rừng Tam Đảo tuyệt đẹp. Đặt phòng trực tuyến, thanh toán chuyển khoản QR tức thì, nhận phòng 24/7.
            </p>

            {/* Date Range Picker Selector & CTA Container */}
            <div className="bg-black/55 backdrop-blur-xl border border-white/25 rounded-3xl p-5 sm:p-7 max-w-2xl mx-auto shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Date Range Button Trigger */}
                <div className="w-full sm:w-2/3 text-left space-y-1.5">
                  <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                    Khoảng ngày nghỉ (Check-in → Check-out)
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowCalendar(true)}
                    className="w-full bg-white text-[#243D24] font-bold rounded-2xl px-4 py-3.5 text-xs sm:text-sm flex items-center justify-between shadow-lg hover:bg-[#F5F0E1] transition-all border border-white"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
                      <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                        <span>{checkIn ? format(checkIn, 'dd/MM/yyyy') : 'Nhận phòng'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>{checkOut ? format(checkOut, 'dd/MM/yyyy') : 'Trả phòng'}</span>
                      </div>
                    </div>

                    {nightsCount > 0 && (
                      <span className="bg-[#243D24] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shrink-0 shadow">
                        {nightsCount} đêm
                      </span>
                    )}
                  </button>
                </div>

                {/* Primary CTA */}
                <div className="w-full sm:w-1/3 sm:self-end">
                  <Link href={`/rooms?checkIn=${checkInStr}&checkOut=${checkOutStr}`}>
                    <Button
                      size="xl"
                      className="w-full bg-[#F5F0E1] hover:bg-white text-[#243D24] font-extrabold py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-1.5 group text-xs sm:text-sm transition-all"
                    >
                      <span>Xem phòng trống</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

              </div>

              {/* Status info bar */}
              <div className="flex items-center justify-center gap-6 text-xs text-emerald-200/90 pt-3 border-t border-white/15">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>12 phòng nghỉ dưỡng view núi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Thị trấn Tam Đảo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Room Grid Section */}
        <section id="phong" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                Không gian nghỉ dưỡng
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#243D24] mt-2">
                Danh sách phòng homestay
              </h2>
            </div>

            <Link href="/rooms">
              <Button variant="outline" className="rounded-full text-xs font-semibold px-5 py-2">
                Xem tất cả 12 phòng ↗
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {typedRoomsData.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                selectedDate={checkInStr || undefined}
              />
            ))}
          </div>
        </section>

        {/* Location & Google Map Section */}
        <section id="vi-tri" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                Vị trí & Chỉ đường
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#243D24] mt-2">
                Bản đồ vị trí Tràm Homestay
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Tổ 3, Thôn Yên Thịnh, Xã Tam Đảo, Vĩnh Phúc (Cách trung tâm thị trấn Tam Đảo 1.2km)
              </p>
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="rounded-full text-xs font-semibold px-5 py-2.5 flex items-center gap-2 border-emerald-800/30 text-[#243D24] hover:bg-emerald-50">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Xem trên Google Maps ↗</span>
              </Button>
            </a>
          </div>

          <div className="space-y-6">
            <div className="shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
              <GoogleMap height="h-[560px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-xs text-[#243D24]">Từ Hà Nội (60 phút)</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Đi cao tốc Nội Bài - Lào Cai, rẽ Nút giao IC4 đến thẳng homestay.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-xs text-[#243D24]">Đường xe ô tô rộng rãi</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Đường nhựa đèo Tam Đảo thảm mượt, xe từ 4 đến 45 chỗ lên thoải mái.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-xs text-[#243D24]">Bãi đỗ xe an toàn 24/7</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Có chỗ đỗ riêng rộng rãi, bảo vệ & camera an ninh giám sát liên tục.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Range Date Picker Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in-0 duration-200"
            onClick={() => setShowCalendar(false)}
          />

          {/* Modal Container */}
          <div className="relative z-[60] w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-[#243D24] animate-in zoom-in-95 duration-200 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#243D24]">
                  {!checkIn || (checkIn && checkOut) 
                    ? '1. Chọn ngày nhận phòng (Check-in)' 
                    : '2. Chọn ngày trả phòng (Check-out)'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {checkIn && !checkOut ? `Ngày nhận: ${format(checkIn, 'dd/MM/yyyy')}` : 'Chọn khoảng từ 1 đến 14 đêm'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-100 hover:bg-[#F5F0E1] text-[#243D24] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-heading text-base font-bold capitalize text-[#243D24]">
                {format(currentMonth, 'MMMM yyyy', { locale: vi })}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-100 hover:bg-[#F5F0E1] text-[#243D24] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 py-1">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Calendar Range Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, i) => (
                <div key={`prev-${i}`} className="aspect-square" />
              ))}
              {calendarDays.map((day) => {
                const disabled = isPastDate(day) && !isToday(day);
                const isCheckInDay = checkIn && isSameDay(day, checkIn);
                const isCheckOutDay = checkOut && isSameDay(day, checkOut);
                
                const isInRange = checkIn && checkOut && isAfter(day, checkIn) && isBefore(day, checkOut);
                const isHoveredRange = checkIn && !checkOut && hoverDate && isAfter(day, checkIn) && (isBefore(day, hoverDate) || isSameDay(day, hoverDate));

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => setHoverDate(day)}
                    disabled={disabled}
                    className={cn(
                      'aspect-square flex items-center justify-center text-xs font-semibold transition-all relative',
                      (isCheckInDay || isCheckOutDay) && 'bg-[#243D24] text-white font-bold shadow-md z-10 rounded-xl scale-105',
                      isInRange && 'bg-emerald-100 text-[#243D24] font-bold rounded-none',
                      isHoveredRange && !isCheckInDay && 'bg-emerald-50 text-[#243D24] rounded-none',
                      !isCheckInDay && !isCheckOutDay && !isInRange && !isHoveredRange && !disabled && 'hover:bg-slate-100 text-slate-800 rounded-xl',
                      disabled && 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 rounded-xl'
                    )}
                  >
                    {format(day, 'd', { locale: vi })}
                  </button>
                );
              })}
            </div>

            {/* Selected Range Summary & Confirm CTA */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs">
                {checkIn && checkOut ? (
                  <span className="font-bold text-emerald-800">
                    {nightsCount} đêm nghỉ ({format(checkIn, 'dd/MM')} → {format(checkOut, 'dd/MM')})
                  </span>
                ) : checkIn ? (
                  <span className="text-slate-500 font-medium">Chọn ngày trả phòng...</span>
                ) : (
                  <span className="text-slate-500 font-medium">Chưa chọn ngày</span>
                )}
              </div>

              <Button
                disabled={!checkIn || !checkOut}
                onClick={() => setShowCalendar(false)}
                className="bg-[#243D24] text-white rounded-full text-xs font-bold px-5 py-2 shadow-md"
              >
                Xác nhận chọn
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
