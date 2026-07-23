import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { MobileStickyBar } from '@/components/layout/MobileStickyBar';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Tràm Homestay Tam Đảo',
    template: '%s | Tràm Homestay Tam Đảo',
  },
  description: 'Nghỉ dưỡng giữa rừng tràm Tam Đảo - Tỉnh táo từng giấc mơ. 12 phòng nghỉ dưỡng view núi, đặt trực tuyến, thanh toán QR, nhận phòng 24/7.',
  keywords: ['homestay Tam Đảo', 'đặt phòng homestay', 'nghỉ dưỡng Tam Đảo', 'Tràm Homestay'],
  authors: [{ name: 'Tràm Homestay Tam Đảo' }],
  creator: 'Tràm Homestay',
  publisher: 'Tràm Homestay',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://tramhomestay.tamdao.vn',
    siteName: 'Tràm Homestay Tam Đảo',
    title: 'Tràm Homestay Tam Đảo - Nghỉ dưỡng giữa rừng tràm',
    description: '12 phòng nghỉ dưỡng view núi tuyệt đẹp. Đặt trực tuyến, thanh toán QR, nhận phòng 24/7.',
    images: [
      {
        url: '/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Tràm Homestay Tam Đảo - View núi tuyệt đẹp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tràm Homestay Tam Đảo',
    description: 'Nghỉ dưỡng giữa rừng tràm Tam Đảo',
    images: ['/images/og-image.webp'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: '#243D24',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-inter antialiased bg-white text-[#101810] min-h-screen flex flex-col pb-16 md:pb-0`}>
        <Providers>
          {children}
          <MobileStickyBar />
        </Providers>
      </body>
    </html>
  );
}