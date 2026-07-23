'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  SlidersHorizontal, Search, RefreshCw, Mountain, 
  Users, Check, ArrowUpDown, Filter, ChevronRight
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoomCard } from '@/components/booking/RoomCard';
import { Button } from '@/components/ui/Button';
import roomsDataJson from '@/mocks/data/rooms.json';
import { Room } from '@/types';

export default function AllRoomsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#243D24] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AllRoomsContent />
    </Suspense>
  );
}

function AllRoomsContent() {

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state sync
  const initialType = searchParams.get('type') || 'ALL';
  const initialSort = searchParams.get('sort') || 'recommended';

  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [sortOption, setSortOption] = useState<string>(initialSort);
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [selectedCapacity, setSelectedCapacity] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const roomsList = roomsDataJson.rooms as Room[];

  // Filter & Sort Logic
  const filteredRooms = useMemo(() => {
    return roomsList
      .filter((room) => {
        // Filter by Type
        if (selectedType !== 'ALL' && room.type.toLowerCase() !== selectedType.toLowerCase()) {
          return false;
        }
        // Filter by Price
        if (room.pricePerNight > maxPrice) {
          return false;
        }
        // Filter by Capacity
        if (selectedCapacity > 0 && room.capacity < selectedCapacity) {
          return false;
        }
        // Filter by Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = room.name.toLowerCase().includes(q);
          const matchesDesc = room.description.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price_asc') return a.pricePerNight - b.pricePerNight;
        if (sortOption === 'price_desc') return b.pricePerNight - a.pricePerNight;
        if (sortOption === 'capacity_desc') return b.capacity - a.capacity;
        return 0; // recommended / default
      });
  }, [roomsList, selectedType, maxPrice, selectedCapacity, searchQuery, sortOption]);

  const handleResetFilters = () => {
    setSelectedType('ALL');
    setMaxPrice(5000000);
    setSelectedCapacity(0);
    setSearchQuery('');
    setSortOption('recommended');
    router.push('/rooms');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#101810] flex flex-col">
      <Header />

      <main className="flex-1 pb-24">
        {/* Page Hero Header */}
        <div className="bg-[#243D24] text-[#F5F0E1] py-12 px-4 sm:px-6 shadow-md mb-8">
          <div className="max-w-7xl mx-auto text-center space-y-3">
            <span className="text-xs font-semibold text-emerald-300 tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/10">
              12 Không gian nghỉ dưỡng sinh thái
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight">
              Danh sách phòng Tràm Homestay
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl mx-auto">
              View núi rừng Tam Đảo tuyệt đẹp, trang thiết bị tự nhiên cao cấp & dịch vụ phục vụ tận tâm 24/7.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Filter Sidebar (Left 3 Cols) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-24">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-heading font-bold text-lg text-[#243D24]">
                    <Filter className="w-4 h-4 text-emerald-700" />
                    <span>Bộ lọc tìm kiếm</span>
                  </div>

                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-emerald-700 hover:text-[#243D24] font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Đặt lại</span>
                  </button>
                </div>

                {/* Search Text Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tên phòng hoặc từ khóa</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm Deluxe, Family..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#243D24]"
                    />
                  </div>
                </div>

                {/* Room Type Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Loại phòng / Căn</label>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'ALL', label: 'Tất cả lựa chọn' },
                      { id: 'VIP', label: 'VIP (Vuông T1 / Tròn T2)' },
                      { id: 'Family', label: 'Phòng Gia đình (A02, B01, C01)' },
                      { id: 'Deluxe', label: 'Phòng Deluxe (A03, B02, C02, C03)' },
                      { id: 'Standard', label: 'Phòng Standard (A01, B03, C04)' },
                      { id: 'FullKhu', label: 'Thuê Full Khu / Full Căn' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedType(item.id)}
                        className={`px-3 py-2 rounded-xl text-xs text-left font-medium transition-all flex items-center justify-between ${
                          selectedType === item.id 
                            ? 'bg-[#243D24] text-[#F5F0E1] font-bold shadow-sm' 
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{item.label}</span>
                        {selectedType === item.id && <Check className="w-3.5 h-3.5 text-emerald-300" />}
                      </button>
                    ))}
                  </div>
                </div>


                {/* Price Slider Filter */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">Giá tối đa / đêm</span>
                    <span className="font-bold text-[#243D24]">{maxPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <input
                    type="range"
                    min={800000}
                    max={5000000}
                    step={100000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#243D24] cursor-pointer"
                  />
                </div>

                {/* Capacity Filter */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700">Số lượng khách</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 2, 4, 6].map((cap) => (
                      <button
                        key={cap}
                        onClick={() => setSelectedCapacity(cap)}
                        className={`py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedCapacity === cap
                            ? 'bg-[#243D24] text-white border-[#243D24]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cap === 0 ? 'Tất cả' : `${cap}+`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Room Grid Display (Right 9 Cols) */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Header Toolbar: Results count & Sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="text-xs text-slate-600 font-medium">
                  Hiển thị <strong className="text-[#243D24] text-sm">{filteredRooms.length}</strong> / 12 phòng nghỉ dưỡng
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">Sắp xếp:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#243D24]"
                  >
                    <option value="recommended">Nổi bật nhất</option>
                    <option value="price_asc">Giá: Thấp → Cao</option>
                    <option value="price_desc">Giá: Cao → Thấp</option>
                    <option value="capacity_desc">Sức chứa nhiều nhất</option>
                  </select>
                </div>
              </div>

              {/* Grid of Room Cards */}
              {filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900">Không tìm thấy phòng phù hợp</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Thử điều chỉnh lại mức giá tối đa hoặc chọn loại phòng khác để tìm được không gian ưng ý nhất.
                  </p>
                  <Button onClick={handleResetFilters} variant="outline" className="rounded-full text-xs px-5">
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
