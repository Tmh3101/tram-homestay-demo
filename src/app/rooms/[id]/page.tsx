'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronRight, Star, Mountain, Users, Bed, Maximize2, ShieldCheck, 
  Clock, Sparkles, Heart, Check, ArrowLeft, Wifi, Wind, Bath, Coffee,
  Car, Calendar, Phone, Share2
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RoomImage } from '@/components/ui/RoomImage';
import { useBookingStore } from '@/lib/store/bookingStore';
import { useRoomStore } from '@/lib/store/roomStore';
import { formatCurrency, getNights, addDays } from '@/lib/utils';
import { Room, Amenity } from '@/types';
import roomsDataJson from '@/mocks/data/rooms.json';

const amenityDetails: Record<string, { label: string; icon: any; desc: string }> = {
  'king-bed': { label: 'Giường King Size', icon: Bed, desc: 'Đệm cao cấp, ga cotton 100%' },
  'queen-bed': { label: 'Giường Queen Size', icon: Bed, desc: 'Êm ái, đệm lò xo túi độc lập' },
  'twin-bed': { label: '2 Giường Đơn', icon: Bed, desc: 'Phù hợp nhóm bạn/đồng nghiệp' },
  'mountain-view': { label: 'View Núi Tam Đảo', icon: Mountain, desc: 'Cửa kính tràn viền ngắm mây' },
  'garden-view': { label: 'View Vườn Tràm', icon: Mountain, desc: 'Tầm nhìn xanh mát yên bình' },
  'ac': { label: 'Điều hòa 2 chiều', icon: Wind, desc: 'Ấm áp mùa đông, mát lạnh mùa hè' },
  'wifi': { label: 'Wifi Tốc độ cao', icon: Wifi, desc: 'Băng thông rộng 100Mbps' },
  'hot-water': { label: 'Nước nóng 24/7', icon: Bath, desc: 'Bình nước nóng công suất lớn' },
  'bathtub': { label: 'Bồn tắm ngâm sương', icon: Bath, desc: 'Bồn tắm ngắm mây outdoor/indoor' },
  'shower': { label: 'Vòi tắm hoa sen', icon: Bath, desc: 'Áp lực nước mạnh mẽ' },
  'balcony': { label: 'Ban công riêng', icon: Mountain, desc: 'Có bàn trà ngắm bình minh/hoàng hôn' },
  'mini-fridge': { label: 'Tủ lạnh mini', icon: Coffee, desc: 'Nước suối miễn phí mỗi ngày' },
  'tv': { label: 'Smart TV 55 inch', icon: Sparkles, desc: 'Sẵn ứng dụng Netflix, YouTube' },
  'hair-dryer': { label: 'Máy sấy tóc', icon: Sparkles, desc: 'Công suất 2000W' },
};

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const { setSelectedRoom, setDateRange, dateRange } = useBookingStore();

  // Selected Check-in & Check-out dates (default today & 2 days later)
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultCheckOutStr = addDays(todayStr, 2);

  const [checkIn, setCheckIn] = useState(dateRange?.checkIn || todayStr);
  const [checkOut, setCheckOut] = useState(dateRange?.checkOut || defaultCheckOutStr);

  const nights = getNights(checkIn, checkOut) || 1;

  useEffect(() => {
    // Find room from mock JSON or store
    const foundRoom = roomsDataJson.rooms.find((r: any) => r.id === roomId);
    if (foundRoom) {
      setRoom(foundRoom as Room);
    }
    setLoading(false);
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="w-12 h-12 border-4 border-[#243D24] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-600">Đang tải thông tin phòng...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="font-heading text-3xl font-bold text-[#243D24] mb-3">Không tìm thấy phòng</h1>
          <p className="text-slate-600 mb-6">Phòng bạn đang tìm kiếm không tồn tại hoặc đã tạm dừng hoạt động.</p>
          <Link href="/rooms">
            <Button className="bg-[#243D24] text-white rounded-full">Xem danh sách phòng</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPrice = room.pricePerNight * nights;

  const handleBooking = () => {
    setSelectedRoom(room.id);
    setDateRange({ checkIn, checkOut });
    router.push(`/booking?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#101810] flex flex-col">
      <Header />

      <main className="flex-1 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#243D24] transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/rooms" className="hover:text-[#243D24] transition-colors">Danh sách phòng</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#243D24] font-semibold">{room.name}</span>
          </div>
        </div>

        {/* Hero Title & Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success" className="rounded-full px-3 py-0.5 text-xs font-semibold">
                  ● Còn phòng trống
                </Badge>
                <span className="text-xs font-medium text-slate-500">{room.type}</span>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.9/5 (48 đánh giá)</span>
                </div>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#243D24] tracking-tight">
                {room.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-full border transition-all ${
                  isFavorite 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Lưu vào danh sách yêu thích"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>
              
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: room.name, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Đã sao chép liên kết phòng!');
                  }
                }}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Chia sẻ phòng"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Carousel & Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Featured Image / Carousel */}
            <div className="lg:col-span-2 relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-lg bg-slate-200">
              <RoomImage
                src={room.images[selectedImageIndex] || room.images[0]}
                alt={room.name}
                fill
                priority
                className="object-cover transition-all duration-300"
              />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">
                Ảnh {selectedImageIndex + 1} / {room.images.length || 1}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative flex-1 min-w-[120px] lg:min-w-0 aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-[#243D24] ring-2 ring-[#243D24]/30 scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <RoomImage src={img} alt={`${room.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content & Booking Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left 2 Cols: Details, Amenities & Policies */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Highlights bar */}
              <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Sức chứa</span>
                  <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#243D24]">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>{room.capacity} Khách</span>
                  </div>
                </div>
                <div className="space-y-1 border-x border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Diện tích</span>
                  <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#243D24]">
                    <Maximize2 className="w-4 h-4 text-emerald-700" />
                    <span>35 - 45 m²</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Tầm nhìn</span>
                  <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#243D24]">
                    <Mountain className="w-4 h-4 text-emerald-700" />
                    <span>View Núi Mây</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="font-heading text-2xl font-bold text-[#243D24]">Giới thiệu không gian</h2>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {room.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-4">
                <h2 className="font-heading text-2xl font-bold text-[#243D24]">Tiện nghi căn phòng</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {room.amenities.map((amenityKey) => {
                    const item = amenityDetails[amenityKey] || {
                      label: amenityKey,
                      icon: Sparkles,
                      desc: 'Tiện ích tiêu chuẩn homestay'
                    };
                    const Icon = item.icon;
                    return (
                      <div key={amenityKey} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#243D24]/10 text-[#243D24] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{item.label}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Homestay Policies */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <h2 className="font-heading text-2xl font-bold text-[#243D24]">Chính sách & Quy định</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="p-4 rounded-2xl bg-emerald-900/5 border border-emerald-800/10 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#243D24]">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      <span>Giờ nhận & trả phòng</span>
                    </div>
                    <p>• Check-in: từ 14:00 mỗi ngày</p>
                    <p>• Check-out: trước 12:00 trưa</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-900/5 border border-emerald-800/10 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#243D24]">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Chính sách hủy phòng</span>
                    </div>
                    <p>• Hủy trước 3 ngày: Hoàn 100% cọc</p>
                    <p>• Hủy trong vòng 24h: Hỗ trợ đổi ngày 1 lần</p>
                  </div>
                </div>
              </div>

              {/* Guest Reviews */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl font-bold text-[#243D24]">Đánh giá từ du khách</h2>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.9 / 5 (Được kiểm duyệt)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Nguyễn Văn Minh', date: 'Tháng 6/2026', comment: 'Phòng view núi tuyệt đẹp, sáng mở cửa ra ngắm mây bay qua ngay cửa sổ. Giường ngủ siêu êm!', rating: 5 },
                    { name: 'Trần Thị Thu Hà', date: 'Tháng 5/2026', comment: 'Không gian yên tĩnh giữa rừng tràm. Bạn chủ nhà hỗ trợ BBQ buổi tối cực nhiệt tình.', rating: 5 },
                  ].map((rev, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#243D24] text-white flex items-center justify-center font-bold text-xs">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                            <span className="text-[10px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sticky Sidebar: Price & Booking Trigger */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-3xl bg-white border border-emerald-950/15 p-6 shadow-xl space-y-6">
                
                {/* Price Display */}
                <div>
                  <span className="text-xs font-medium text-slate-500">Giá nghỉ dưỡng</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-heading text-3xl font-bold text-[#243D24]">
                      {formatCurrency(room.pricePerNight)}đ
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ đêm</span>
                  </div>
                </div>

                {/* Date Inputs */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Chọn khoảng ngày nghỉ</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500">Check-in</span>
                      <input
                        type="date"
                        value={checkIn}
                        min={todayStr}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#243D24]"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500">Check-out</span>
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#243D24]"
                      />
                    </div>
                  </div>
                </div>

                {/* Cost calculation */}
                <div className="p-4 rounded-2xl bg-[#F5F0E1]/60 border border-amber-900/10 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{formatCurrency(room.pricePerNight)}đ × {nights} đêm</span>
                    <span>{formatCurrency(totalPrice)}đ</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí dịch vụ & dọn dẹp</span>
                    <span className="text-emerald-700 font-medium">Miễn phí</span>
                  </div>
                  <div className="pt-2 border-t border-amber-900/10 flex justify-between font-bold text-sm text-[#243D24]">
                    <span>Tổng tạm tính</span>
                    <span>{formatCurrency(totalPrice)}đ</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <Button
                  onClick={handleBooking}
                  className="w-full bg-[#243D24] text-[#F5F0E1] hover:bg-[#1A2D1A] rounded-2xl py-3.5 font-bold text-sm shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Đặt ngay phòng này</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-[11px] text-center text-slate-400">
                  Xác nhận tức thì • Không mất phí hủy trước 3 ngày
                </p>

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
