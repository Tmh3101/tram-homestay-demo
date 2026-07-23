import Link from 'next/link';
import { Trees, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0F180F] text-[#F5F0E1] border-t border-emerald-900/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#243D24] text-[#F5F0E1] flex items-center justify-center font-bold border border-emerald-500/30">
                <Trees className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                Tràm Homestay
              </span>
            </div>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Nghỉ dưỡng tĩnh lặng giữa rừng tràm Tam Đảo. 12 không gian sinh thái view núi mây tuyệt đẹp, dịch vụ tự nhiên 24/7.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <span>★ 4.9/5</span>
              <span className="text-emerald-500">•</span>
              <span className="text-emerald-200/80">230+ đánh giá trên Google Maps</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-semibold text-white tracking-wide border-b border-emerald-900/60 pb-2">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-white transition-colors">
                  Danh sách 12 phòng nghỉ
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white transition-colors">
                  Đặt phòng nhanh
                </Link>
              </li>
              <li>
                <Link href="/rooms?type=Deluxe" className="hover:text-white transition-colors">
                  Phòng Deluxe View Núi
                </Link>
              </li>
              <li>
                <Link href="/rooms?type=Family" className="hover:text-white transition-colors">
                  Family Suite Gia Đình
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-semibold text-white tracking-wide border-b border-emerald-900/60 pb-2">
              Thông tin liên hệ
            </h4>
            <ul className="space-y-3 text-xs text-emerald-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Thị trấn Tam Đảo, Huyện Tam Đảo, Tỉnh Vĩnh Phúc</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:0988123456" className="hover:text-white transition-colors font-medium">
                  0988.123.456 (Hotline/Zalo)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>booking@tramhomestay.tamdao.vn</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Check-in: 14:00 | Check-out: 12:00</span>
              </li>
            </ul>
          </div>

          {/* Location & Info Preview */}
          <div className="space-y-4">
            <h4 className="font-heading text-base font-semibold text-white tracking-wide border-b border-emerald-900/60 pb-2">
              Vị trí Tam Đảo
            </h4>
            <div className="p-4 rounded-2xl bg-[#1A2D1A] border border-emerald-800/40 text-xs text-emerald-200/80 space-y-2">
              <p className="font-medium text-emerald-100">📍 Cách trung tâm thị trấn 1.2km</p>
              <p className="text-[11px] text-emerald-300/70">
                Đường ô tô vào tận cổng, có bãi đỗ xe riêng 24/7 an toàn.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-400/60 gap-4">
          <p>© 2026 Tràm Homestay Tam Đảo. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Thiết kế & vận hành bởi VIPCare</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
