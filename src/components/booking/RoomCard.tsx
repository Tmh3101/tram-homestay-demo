'use client';

import Link from 'next/link';
import { Users, Mountain, Wifi, Wind, Bath, ChevronRight, Check, Star, Info } from 'lucide-react';
import { Room, Amenity } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RoomImage } from '@/components/ui/RoomImage';

const amenityIcons: Record<string, { label: string; icon: any }> = {
  'king-bed': { label: 'Giường King', icon: Users },
  'queen-bed': { label: 'Giường Queen', icon: Users },
  'twin-bed': { label: '2 Giường đơn', icon: Users },
  'mountain-view': { label: 'View Núi', icon: Mountain },
  'garden-view': { label: 'View Vườn', icon: Mountain },
  'ac': { label: 'Điều hòa', icon: Wind },
  'wifi': { label: 'Wifi tốc độ cao', icon: Wifi },
  'bathtub': { label: 'Bồn tắm', icon: Bath },
};

interface RoomCardProps {
  room: Room;
  selectedDate?: string | null;
  onSelect?: (roomId: string) => void;
}

export function RoomCard({ room, selectedDate, onSelect }: RoomCardProps) {
  const isAvailable = (room as any).isAvailable !== false;
  const unavailableReason = (room as any).unavailableReason;

  return (
    <div className="group relative rounded-3xl bg-white border border-emerald-950/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <RoomImage
          src={room.images[0] || ''}
          alt={room.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge
            variant={isAvailable ? 'success' : 'danger'}
            className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide shadow-md backdrop-blur-md"
          >
            {isAvailable ? '● Còn phòng trống' : '✕ ' + (unavailableReason || 'Hết phòng')}
          </Badge>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </div>
        </div>

        {/* Room Type Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-[#243D24]/90 backdrop-blur-md text-[#F5F0E1] text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
            {room.type}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#101810] group-hover:text-[#243D24] transition-colors leading-tight">
            {room.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Key Features / Capacity */}
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {room.standardCapacity ? `${room.standardCapacity} - ${room.capacity} khách` : `Tối đa ${room.capacity} khách`}
              </span>
            </div>

            {room.amenities.slice(0, 2).map((amenityKey) => {
              const meta = amenityIcons[amenityKey];
              if (!meta) return null;
              const Icon = meta.icon;
              return (
                <div key={amenityKey} className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Icon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Pricing & Optimized Action Buttons */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          
          {/* Row 1: Pricing */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="font-heading text-2xl font-bold text-[#243D24]">
                {formatCurrency(room.pricePerNight)}đ
              </span>
              <span className="text-[11px] text-slate-500 font-normal ml-1">/ đêm (T2-CN)</span>
            </div>

            {room.saturdayPrice && (
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md font-semibold">
                T7: {formatCurrency(room.saturdayPrice)}đ
              </span>
            )}
          </div>

          {/* Row 2: Action Buttons (Equal/Proportional Spacing) */}
          <div className="flex items-center gap-2 pt-1">
            <Link href={`/rooms/${room.id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-2xl text-xs font-bold py-2.5 border-slate-200 text-slate-700 hover:bg-slate-50 justify-center"
              >
                Chi tiết
              </Button>
            </Link>

            <Link 
              href={`/booking?roomId=${room.id}${selectedDate ? `&checkIn=${selectedDate}` : ''}`}
              className="flex-[1.4]"
            >
              <Button
                size="sm"
                disabled={!isAvailable}
                className="w-full bg-[#243D24] text-[#F5F0E1] hover:bg-[#1A2D1A] rounded-2xl text-xs font-bold py-2.5 flex items-center justify-center gap-1 shadow-md"
              >
                <span>Đặt ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
