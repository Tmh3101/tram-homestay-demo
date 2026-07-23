'use client';

import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps?q=21.4549167,105.6388333&entry=gps&lucs=,94231208,94224825,94227247,94227248,47071704,47069508,94218641,94203019,47084304,94208458,94208447&g_ep=CAISDTYuMTI5LjEuODA5MjAYACDXggMqYyw5NDIzMTIwOCw5NDIyNDgyNSw5NDIyNzI0Nyw5NDIyNzI0OCw0NzA3MTcwNCw0NzA2OTUwOCw5NDIxODY0MSw5NDIwMzAxOSw0NzA4NDMwNCw5NDIwODQ1OCw5NDIwODQ0N0ICVk4%3D&g_st=ic';

export const GOOGLE_MAPS_EMBED_SRC =
  'https://maps.google.com/maps?q=21.4549167,105.6388333&hl=vi&z=16&t=k&output=embed';

interface GoogleMapProps {
  className?: string;
  height?: string;
  showOverlayButton?: boolean;
  aspectRatio?: string;
}

export function GoogleMap({
  className,
  height = 'h-80',
  showOverlayButton = true,
}: GoogleMapProps) {
  return (
    <div className={cn('relative w-full rounded-2xl overflow-hidden border border-emerald-950/10 shadow-lg group', className)}>
      <iframe
        title="Google Map - Tràm Homestay Tam Đảo (Vệ tinh)"
        src={GOOGLE_MAPS_EMBED_SRC}
        width="100%"
        height="100%"
        className={cn('w-full border-0 transition-all duration-300', height)}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {showOverlayButton && (
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[#243D24] border border-emerald-900/15 hover:bg-[#243D24] hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transition-all duration-200 group/btn"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-600 group-hover/btn:text-white transition-colors" />
          <span>Mở trên Google Maps</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      )}
    </div>
  );
}
