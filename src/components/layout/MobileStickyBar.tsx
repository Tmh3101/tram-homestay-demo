'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Calendar } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function MobileStickyBar() {
  const pathname = usePathname();

  // Hide sticky bar on payment or success page if desired, or keep everywhere
  const isSuccess = pathname?.startsWith('/success');

  if (isSuccess) return null;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-2.5 shadow-[0_-8px_25px_rgba(0,0,0,0.12)] flex items-center gap-2.5 transition-all">
      {/* Hotline Call Button */}
      <a
        href="tel:0988123456"
        className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
      >
        <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>Gọi điện</span>
      </a>

      {/* Zalo Chat Button */}
      <a
        href="https://zalo.me/0988123456"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 px-3 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200/80 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
      >
        <Image src="/icons/zalo.png" width={18} height={18} alt="Zalo" className="rounded-md shrink-0" />
        <span>Chat Zalo</span>
      </a>

      {/* Primary Booking Button */}
      <Link href="/booking" className="flex-[1.5]">
        <button
          type="button"
          className="w-full py-2.5 px-4 rounded-2xl bg-[#243D24] text-[#F5F0E1] font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Đặt ngay</span>
        </button>
      </Link>
    </div>
  );
}
