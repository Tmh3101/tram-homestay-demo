'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trees, Phone, Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/rooms', label: 'Danh sách phòng' },
    { href: '/booking', label: 'Đặt phòng' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 pt-4 pb-2 transition-all">
      <div className="max-w-7xl mx-auto backdrop-blur-xl bg-[#243D24]/90 text-[#F5F0E1] border border-emerald-500/20 rounded-full px-5 py-3 shadow-xl flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#F5F0E1] text-[#243D24] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
            <Trees className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-tight text-[#F5F0E1] leading-none">
              Tràm Homestay
            </span>
            <span className="text-[10px] tracking-widest text-emerald-200/80 uppercase font-medium">
              Tam Đảo • Vĩnh Phúc
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-black/15 px-3 py-1.5 rounded-full border border-white/5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
                  isActive
                    ? 'bg-[#F5F0E1] text-[#243D24] shadow-sm font-semibold'
                    : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Hotline */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:0988123456"
            className="flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white font-medium transition-colors px-2.5 py-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>0988.123.456</span>
          </a>
          
          <Link href="/booking">
            <Button
              size="sm"
              className="bg-[#F5F0E1] text-[#243D24] hover:bg-white font-semibold rounded-full px-4 py-2 text-xs shadow-md flex items-center gap-1 group"
            >
              <span>Đặt ngay</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full bg-white/10 text-emerald-100 hover:text-white hover:bg-white/20 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 z-50 backdrop-blur-2xl bg-[#1A2D1A]/95 text-[#F5F0E1] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-2xl text-sm font-medium flex items-center justify-between transition-colors',
                    isActive
                      ? 'bg-[#F5F0E1] text-[#243D24] font-bold'
                      : 'hover:bg-white/10 text-emerald-100'
                  )}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </Link>
              );
            })}

            <div className="pt-4 border-t border-emerald-800/60 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:0988123456"
                  className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-100 py-3 px-3 rounded-2xl bg-white/10 border border-white/10"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0988.123.456</span>
                </a>

                <a
                  href="https://zalo.me/0988123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-100 py-3 px-3 rounded-2xl bg-white/10 border border-white/10"
                >
                  <Image src="/icons/zalo.png" width={18} height={18} alt="Zalo" className="rounded-md shrink-0" />
                  <span>Chat Zalo</span>
                </a>
              </div>

              <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#F5F0E1] text-[#243D24] font-extrabold rounded-2xl py-3.5 text-sm shadow-lg mt-1">
                  Đặt phòng ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
