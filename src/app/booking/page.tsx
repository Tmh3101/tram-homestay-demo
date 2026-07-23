'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ChevronRight, ChevronLeft, Calendar, Users, ShieldCheck, CheckCircle2, 
  ArrowLeft, CreditCard, User, Phone, Mail, FileText, Lock, ArrowRight, X
} from 'lucide-react';
import { vi } from 'date-fns/locale';
import { 
  format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameDay, isSameMonth, isAfter, isBefore 
} from 'date-fns';
import { formatCurrency, getNights, addDays, isPastDate, isToday, cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { RoomImage } from '@/components/ui/RoomImage';
import { useBookingStore } from '@/lib/store/bookingStore';
import roomsDataJson from '@/mocks/data/rooms.json';
import { Room } from '@/types';

// Zod validation schema for Guest Form
const guestSchema = z.object({
  guestName: z.string().min(2, 'Vui lòng nhập họ và tên (ít nhất 2 ký tự)'),
  guestPhone: z
    .string()
    .min(10, 'Số điện thoại gồm ít nhất 10 chữ số')
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ (VD: 0988123456)'),
  guestEmail: z.string().email('Email không đúng định dạng'),
  guestNote: z.string().optional(),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: 'Bạn cần đồng ý với điều khoản và chính sách đặt phòng',
  }),
});

type GuestFormData = z.infer<typeof guestSchema>;

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#243D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const paramRoomId = searchParams.get('roomId');
  const paramCheckIn = searchParams.get('checkIn');
  const paramCheckOut = searchParams.get('checkOut');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const defaultCheckInDate = paramCheckIn ? new Date(paramCheckIn) : today;
  const defaultCheckOutDate = paramCheckOut ? new Date(paramCheckOut) : new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);

  const { 
    selectedRoomId, setSelectedRoom, 
    dateRange, setDateRange, 
    setGuestInfo, createBooking,
    booking
  } = useBookingStore();

  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [selectedRoom, setSelectedRoomState] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Date Range state
  const [checkIn, setCheckIn] = useState<Date | null>(defaultCheckInDate);
  const [checkOut, setCheckOut] = useState<Date | null>(defaultCheckOutDate);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const targetRoomId = paramRoomId || selectedRoomId || roomsDataJson.rooms[0].id;
  
  const checkInStr = checkIn ? checkIn.toISOString().split('T')[0] : '';
  const checkOutStr = checkOut ? checkOut.toISOString().split('T')[0] : '';
  const nights = checkIn && checkOut ? getNights(checkInStr, checkOutStr) : 1;

  useEffect(() => {
    const r = roomsDataJson.rooms.find((item) => item.id === targetRoomId);
    if (r) {
      setSelectedRoomState(r as Room);
      setSelectedRoom(r.id);
    }
    if (checkInStr && checkOutStr) {
      setDateRange({ checkIn: checkInStr, checkOut: checkOutStr });
    }
  }, [targetRoomId, checkInStr, checkOutStr]);

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      guestName: booking.guestName || '',
      guestPhone: booking.guestPhone || '',
      guestEmail: booking.guestEmail || '',
      guestNote: booking.guestNote || '',
      termsAgreed: true,
    },
  });

  const onSubmitGuestInfo = async (data: GuestFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Save to store
      setGuestInfo({
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        guestEmail: data.guestEmail,
        guestNote: data.guestNote,
      });

      // API call to create booking
      const newBooking = await createBooking();
      
      // Navigate to payment screen
      router.push(`/payment?bookingId=${newBooking.id || newBooking.orderCode}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Không thể khởi tạo đơn đặt phòng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = (selectedRoom?.pricePerNight || 0) * nights;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#101810] flex flex-col">
      <Header />

      <main className="flex-1 pb-24">
        {/* Step Indicator Header */}
        <div className="bg-[#243D24] text-[#F5F0E1] py-8 px-4 sm:px-6 shadow-md mb-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/rooms" className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold">Đặt phòng trực tuyến</h1>
                <p className="text-xs text-emerald-200/80">Quy trình đặt phòng tức thì & bảo mật</p>
              </div>
            </div>

            {/* Stepper pills */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
              <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${activeStep === 1 ? 'bg-[#F5F0E1] text-[#243D24]' : 'bg-white/10 text-white/70'}`}>
                <span>1. Chọn ngày & phòng</span>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-300" />
              <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${activeStep === 2 ? 'bg-[#F5F0E1] text-[#243D24]' : 'bg-white/10 text-white/70'}`}>
                <span>2. Thông tin & Thanh toán</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Step Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Room Selection & Range Date Picker Block */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#243D24] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h2 className="font-heading text-xl font-bold text-[#243D24]">Thông tin phòng & Ngày ở</h2>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                    {nights} đêm nghỉ
                  </span>
                </div>

                {/* Range Date Picker Button Trigger */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Khoảng ngày ở (Check-in → Check-out)
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(true)}
                    className="w-full bg-slate-50 border border-slate-200 text-[#243D24] font-bold rounded-2xl px-4 py-3.5 text-sm flex items-center justify-between hover:bg-[#F5F0E1]/60 hover:border-emerald-300 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                        <span>{checkIn ? format(checkIn, 'dd/MM/yyyy') : 'Nhận phòng'}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span>{checkOut ? format(checkOut, 'dd/MM/yyyy') : 'Trả phòng'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-[#243D24] text-[#F5F0E1] text-xs font-extrabold px-3 py-1 rounded-full">
                        {nights} đêm
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                </div>

                {/* Change Room Selector Dropdown */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <Label className="text-xs font-bold text-slate-700">Đổi phòng khác (nếu cần)</Label>
                  <select
                    value={targetRoomId}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#243D24]"
                  >
                    {roomsDataJson.rooms.map((rm) => (
                      <option key={rm.id} value={rm.id}>
                        {rm.name} - {formatCurrency(rm.pricePerNight)}đ/đêm ({rm.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Information Form */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-full bg-[#243D24] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="font-heading text-xl font-bold text-[#243D24]">Thông tin người đặt phòng</h2>
                </div>

                {submitError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    ⚠️ {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmitGuestInfo)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Guest Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="guestName" className="text-xs font-bold text-slate-700">
                        Họ và tên khách hàng *
                      </Label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <Input
                          id="guestName"
                          placeholder="Nguyễn Văn A"
                          className="pl-9 text-xs"
                          {...register('guestName')}
                        />
                      </div>
                      {errors.guestName && (
                        <p className="text-[11px] text-rose-600 font-medium">{errors.guestName.message}</p>
                      )}
                    </div>

                    {/* Guest Phone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="guestPhone" className="text-xs font-bold text-slate-700">
                        Số điện thoại (Zalo nhận QR) *
                      </Label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <Input
                          id="guestPhone"
                          placeholder="0988 123 456"
                          className="pl-9 text-xs"
                          {...register('guestPhone')}
                        />
                      </div>
                      {errors.guestPhone && (
                        <p className="text-[11px] text-rose-600 font-medium">{errors.guestPhone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Guest Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="guestEmail" className="text-xs font-bold text-slate-700">
                      Địa chỉ Email *
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <Input
                        id="guestEmail"
                        type="email"
                        placeholder="khachhang@gmail.com"
                        className="pl-9 text-xs"
                        {...register('guestEmail')}
                      />
                    </div>
                    {errors.guestEmail && (
                      <p className="text-[11px] text-rose-600 font-medium">{errors.guestEmail.message}</p>
                    )}
                  </div>

                  {/* Guest Note */}
                  <div className="space-y-1.5">
                    <Label htmlFor="guestNote" className="text-xs font-bold text-slate-700">
                      Ghi chú thêm (Giờ đến dự kiến, yêu cầu đặc biệt...)
                    </Label>
                    <Textarea
                      id="guestNote"
                      placeholder="VD: Gia đình có trẻ nhỏ, dự kiến check-in lúc 14h30..."
                      className="text-xs min-h-[90px]"
                      {...register('guestNote')}
                    />
                  </div>

                  {/* Terms check */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded border-slate-300 text-[#243D24] focus:ring-[#243D24]"
                        {...register('termsAgreed')}
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        Tôi đồng ý với <strong className="text-[#243D24]">Chính sách hoàn hủy phòng</strong> và quy định giữ phòng trong 30 phút qua chuyển khoản QR của Homestay.
                      </span>
                    </label>
                    {errors.termsAgreed && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.termsAgreed.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="xl"
                    disabled={isSubmitting}
                    className="w-full bg-[#243D24] text-[#F5F0E1] hover:bg-[#1A2D1A] font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base"
                  >
                    <span>{isSubmitting ? 'Đang tạo đơn phòng...' : 'Tiến hành thanh toán ➔'}</span>
                  </Button>
                </form>
              </div>

            </div>

            {/* Right 1 Col: Booking Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6 sticky top-24">
                <h3 className="font-heading text-lg font-bold text-[#243D24] border-b border-slate-100 pb-3">
                  Tóm tắt đơn đặt phòng
                </h3>

                {selectedRoom && (
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
                      <RoomImage src={selectedRoom.images[0] || ''} alt={selectedRoom.name} fill className="object-cover" />
                      <div className="absolute top-2 left-2">
                        <span className="bg-[#243D24]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {selectedRoom.type}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-heading text-lg font-bold text-slate-900">{selectedRoom.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Sức chứa: {selectedRoom.capacity} người</span>
                      </p>
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-bold text-slate-900">{checkIn ? format(checkIn, 'dd/MM/yyyy') : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-bold text-slate-900">{checkOut ? format(checkOut, 'dd/MM/yyyy') : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số đêm ở:</span>
                        <span className="font-bold text-emerald-800">{nights} đêm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Đơn giá phòng:</span>
                        <span>{formatCurrency(selectedRoom.pricePerNight)}đ / đêm</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="font-bold text-slate-700 text-xs">Tổng số tiền:</span>
                      <span className="font-heading text-2xl font-bold text-[#243D24]">
                        {formatCurrency(totalPrice)}đ
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 text-[11px] text-emerald-800 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Giá đã bao gồm VAT & dịch vụ dọn phòng hàng ngày.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
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
                    {nights} đêm nghỉ ({format(checkIn, 'dd/MM')} → {format(checkOut, 'dd/MM')})
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
