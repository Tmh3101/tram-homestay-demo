'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, Star, MapPin, Phone, Mail, Heart, CheckCircle, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { vi } from 'date-fns/locale';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, isAfter, isSameMonth } from 'date-fns';
import { formatCurrency, getNights, addDays, isPastDate, isToday, formatDate, formatPhoneForQR } from '@/lib/utils';
import { useRoomStore } from '@/lib/store/roomStore';
import { useBookingStore } from '@/lib/store/bookingStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { roomsData } from '@/mocks/data/rooms';
import { cn } from '@/lib/utils';
import { Room } from '@/types';

const typedRoomsData = roomsData as { rooms: Room[] };

export default function HomePage() {
  const [selectedDate, setSelectedDateLocal] = useState<Date | null>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  const { rooms, fetchRooms } = useRoomStore();
  const { setSelectedDate, setSelectedRoom, setStep } = useBookingStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date) && !isToday(date)) return;
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDateLocal(date);
    setSelectedDate(dateStr);
    setShowCalendar(false);
    setStep(4);
  };

  const availableRoomsCount = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return typedRoomsData.rooms.filter(room => room.calendar[dateStr] !== 'booked').length;
  };

  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
  const availableCount = selectedDate ? availableRoomsCount(selectedDate) : typedRoomsData.rooms.length;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="container-main flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#243D24] flex items-center justify-center">
              <span className="text-white font-cormorant font-bold text-xl">T</span>
            </div>
            <span className="font-cormorant font-bold text-xl text-[#243D24] hidden sm:block">Tràm Homestay Tam Đảo</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#phong" className="text-sm font-medium text-[#243D24] hover:text-[#243D24]/70">Phòng</Link>
            <Link href="#tien-nghi" className="text-sm font-medium text-[#243D24] hover:text-[#243D24]/70">Tiện nghi</Link>
            <Link href="#lien-he" className="text-sm font-medium text-[#243D24] hover:text-[#243D24]/70">Liên hệ</Link>
            <a href="tel:0901234567" className="flex items-center gap-1 text-sm font-medium text-[#243D24]">
              <Phone className="w-4 h-4" /> 090 123 4567
            </a>
          </nav>
          
          <Button className="md:hidden" variant="ghost">Menu</Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/hero.webp")' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#243D24]/80 via-[#243D24]/40 to-transparent" />
          </div>

          <div className="container-main relative z-10 py-20">
            <div className="max-w-3xl text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-in fade-in-0">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">4.9/5 • 230+ đánh giá Google</span>
              </div>
              
              <h1 className="font-cormorant font-semibold text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 text-balance animate-in fade-in-0 zoom-in-95 duration-500">
                Nghỉ dưỡng giữa rừng tràm
                <br />
                <span className="text-[#F5F0E1]">Tỉnh táo từng giấc mơ</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto text-balance">
                12 phòng nghỉ dưỡng giữa rừng tràm Tam Đảo, view núi tuyệt đẹp. Đặt trực tuyến, thanh toán QR, nhận phòng 24/7.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 max-w-xl mx-auto animate-in fade-in-0 zoom-in-95 duration-500 delay-200">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                  <div className="w-full md:w-auto flex-1">
                    <label className="block text-xs font-medium text-white/70 mb-2">Chọn ngày nhận phòng</label>
                    <div className="relative">
                      <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white text-left focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-white/70" />
                            {selectedDate 
                              ? format(selectedDate, 'dd/MM/yyyy', { locale: vi })
                              : 'Chọn ngày'}
                          </div>
                          <ChevronRightIcon className="w-5 h-5 text-white/50" />
                        </div>
                      </button>
                      
                      {showCalendar && (
                        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-4 w-full z-50 animate-in fade-in-0 zoom-in-95 max-h-[70vh] overflow-y-auto text-[#243D24]">
                          <div className="flex items-center justify-between mb-4">
                            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-[#F5F0E1] text-[#243D24]">
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="font-cormorant font-semibold text-lg">
                              {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                            </span>
                            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-[#F5F0E1] text-[#243D24]">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-sm text-[#243D24] mb-2">
                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                              <div key={d} className="font-medium text-[#9CA3AF] py-1">{d}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, i) => (
                              <div key={`prev-${i}`} className="aspect-square flex items-center justify-center text-[#D1D5DB] text-sm" />
                            ))}
                            {calendarDays.map(day => {
                              const isSelected = selectedDate && isSameDay(day, selectedDate);
                              const isCurrentMonth = isSameMonth(day, currentMonth);
                              const isAvailable = availableRoomsCount(day) > 0;
                              const disabled = isPastDate(day) && !isToday(day);
                              
                              return (
                                <button
                                  key={day.toISOString()}
                                  onClick={() => handleDateSelect(day)}
                                  disabled={disabled}
                                  className={cn(
                                    'aspect-square flex items-center justify-center text-sm rounded-xl transition-all',
                                    isSelected && 'bg-[#243D24] text-white',
                                    !isSelected && isAvailable && 'hover:bg-[#F5F0E1] text-[#243D24]',
                                    !isCurrentMonth && 'text-[#D1D5DB]',
                                    disabled && 'opacity-40 cursor-not-allowed'
                                  )}
                                >
                                  {format(day, 'd', { locale: vi })}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto flex-1">
                    <Button 
                      size="xl" 
                      className="w-full md:w-auto bg-white text-[#243D24] hover:bg-[#F5F0E1] font-bold py-4 px-8"
                      onClick={() => setShowCalendar(true)}
                    >
                      Xem phòng trống & Đặt ngay
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{availableCount} phòng trống</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Tam Đảo, Vĩnh Phúc</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>090 123 4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRightIcon className="w-6 h-6 text-white/60 rotate-90" />
          </div>
        </section>

        <section id="phong" className="section bg-white">
          <div className="container-main">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <h2 className="font-cormorant font-semibold text-3xl md:text-4xl text-[#243D24]">
                  {selectedDate ? `Phòng trống ngày ${format(selectedDate, 'dd/MM/yyyy', { locale: vi })}` : 'Tất cả phòng'}
                </h2>
                <p className="text-[#6B7280] mt-2">
                  {availableCount} phòng trống • 12 phòng tổng cộng
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typedRoomsData.rooms.map(room => {
                const isAvailable = selectedDateStr 
                  ? room.calendar[selectedDateStr] !== 'booked'
                  : true;
                
                return (
                  <RoomCard 
                    key={room.id} 
                    room={room} 
                    isAvailable={isAvailable}
                    selectedDate={selectedDateStr ?? undefined}
                    onSelect={() => {
                      setSelectedRoom(room.id);
                      setStep(4);
                    }}
                  />
                );
              })}
            </div>

            {!selectedDateStr && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Xem tất cả 12 phòng
                </Button>
              </div>
            )}
          </div>
        </section>

        <section id="tien-nghi" className="section bg-[#F5F0E1]">
          <div className="container-main">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-cormorant font-semibold text-3xl md:text-4xl text-[#243D24] mb-4">
                Tiện nghi hoàn hảo cho kỳ nghỉ
              </h2>
              <p className="text-[#6B7280] text-lg">
                Mọi thứ bạn cần cho kỳ nghỉ trọn vẹn đã được chuẩn bị sẵn sàng
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '🛏️', title: 'Giường êm ái', desc: 'Giường King/Queen size, ga trắng cao cấp' },
                { icon: '🌄', title: 'View núi tuyệt đẹp', desc: 'Ban công riêng ngắm mây rừng tràm' },
                { icon: '🛁', title: 'Bồn tắm riêng', desc: 'Bồn tắm độc lập hoặc jacuzzi outdoor' },
                { icon: '🍽️', title: 'Đặc sản Tam Đảo', desc: 'Combo ăn uống giá ưu đãi, BBQ buổi tối' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-cormorant font-semibold text-xl text-[#243D24] mb-2">{item.title}</h3>
                  <p className="text-[#6B7280]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="lien-he" className="section bg-[#243D24] text-white">
          <div className="container-main">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h2 className="font-cormorant font-semibold text-3xl md:text-4xl mb-6">Tràm Homestay Tam Đảo</h2>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Nghỉ dưỡng giữa rừng tràm - Tỉnh táo từng giấc mơ. 12 phòng nghỉ dưỡng giữa rừng tràm, view núi tuyệt đẹp.
                </p>
                <div className="flex items-center gap-3 text-white/70">
                  <MapPin className="w-5 h-5" />
                  <span>Tổ 3, Thôn Yên Thịnh, Xã Tam Đảo, Huyện Tam Đảo, Vĩnh Phúc</span>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-cormorant font-semibold text-xl mb-4">Liên hệ đặt phòng</h3>
                  <div className="space-y-4">
                    <a href="tel:0901234567" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                      <Phone className="w-6 h-6 text-white/50" />
                      <span>090 123 4567 (Zalo/Call)</span>
                    </a>
                    <a href="mailto:tramhomestay@gmail.com" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                      <Mail className="w-6 h-6 text-white/50" />
                      <span>tramhomestay@gmail.com</span>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-cormorant font-semibold text-xl mb-4">Địa chỉ & Bản đồ</h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <MapPin className="w-5 h-5 mb-2" />
                      <p className="text-white/80 mb-2">Tổ 3, Thôn Yên Thịnh, Xã Tam Đảo</p>
                      <p className="text-white/60 text-sm">Huyện Tam Đảo, Vĩnh Phúc</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => window.open('https://maps.app.goo.gl/xyz', '_blank')}>
                      Mở Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a2d1f] text-white/60 py-8">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Tràm Homestay Tam Đảo. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Zalo OA</a>
          </div>
        </div>
      </footer>

      {showCalendar && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setShowCalendar(false)} />
      )}
    </div>
  );
}

function RoomCard({ room, isAvailable, selectedDate, onSelect }: { 
  room: any; 
  isAvailable: boolean; 
  selectedDate?: string; 
  onSelect: () => void;
}) {
  const nights = 2;
  const totalPrice = room.pricePerNight * nights;

  return (
    <Card className={`relative ${!isAvailable ? 'opacity-50' : ''}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={room.images[0]} 
          alt={room.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold">Hết phòng</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
            isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          )}>
            <CheckCircle className="w-3 h-3" />
            {isAvailable ? 'Còn phòng' : 'Hết phòng'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <button className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-[#243D24]" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-cormorant text-xl font-semibold text-[#243D24]">{room.name}</h3>
            <p className="text-sm text-[#6B7280] capitalize">{room.type}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 4).map((amenity: string, i: number) => (
            <span key={i} className="px-2 py-1 text-xs rounded-full bg-[#F5F0E1] text-[#243D24]">
              {amenity}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="text-xs text-[#9CA3AF]">+{room.amenities.length - 4} tiện nghi khác</span>
          )}
        </div>

        <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
          <div>
            <p className="text-sm text-[#6B7280]">Giá / đêm</p>
            <p className="font-cormorant text-2xl font-semibold text-[#243D24]">
              {formatCurrency(room.pricePerNight)}
            </p>
          </div>
          <Button 
            className="w-full sm:w-auto" 
            disabled={!isAvailable}
            onClick={onSelect}
          >
            {isAvailable ? 'Đặt phòng' : 'Hết phòng'}
            <ChevronRightIcon className="w-4 h-4 ml-1 inline" />
          </Button>
        </div>
      </div>
    </Card>
  );
}