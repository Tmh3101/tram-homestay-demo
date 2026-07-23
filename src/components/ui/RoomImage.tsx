'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trees, Mountain, Sparkles } from 'lucide-react';

interface RoomImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function RoomImage({ src, alt, className, fill, width, height, priority }: RoomImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#243D24] via-[#1A2D1A] to-[#0F180F] flex flex-col items-center justify-center text-[#F5F0E1] p-6 text-center select-none ${className || ''}`}
        style={fill ? { width: '100%', height: '100%' } : { width: width || 400, height: height || 260 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,240,225,0.15),transparent_60%)]" />
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner border border-white/10">
          <Trees className="w-6 h-6 text-emerald-300" />
        </div>
        <span className="font-heading text-lg font-bold text-white tracking-wide leading-tight px-2">
          {alt || 'Tràm Homestay Tam Đảo'}
        </span>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-200/80 font-medium bg-black/20 px-3 py-1 rounded-full border border-white/5">
          <Mountain className="w-3.5 h-3.5 text-emerald-400" />
          <span>View núi rừng tự nhiên</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width || 400 : undefined}
      height={!fill ? height || 260 : undefined}
      priority={priority}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
