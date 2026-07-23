import { NextResponse } from 'next/server';
import bookingsData from '@/mocks/data/bookings.json';
import { generateOrderCode, getNights, formatPhoneForQR, addDays } from '@/lib/utils';
import roomsData from '@/mocks/data/rooms.json';

// Simple in-memory DB simulate for Vercel demo
let globalBookings = bookingsData.bookings as any[];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, checkIn, checkOut, guestName, guestPhone, guestEmail, guestNote } = body;

    if (!roomId || !checkIn || !checkOut || !guestName || !guestPhone || !guestEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const room = roomsData.rooms.find((r: any) => r.id === roomId);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const nights = getNights(checkIn, checkOut);
    const totalAmount = room.pricePerNight * nights;
    const orderCode = generateOrderCode();

    const newBooking = {
      id: `BK${orderCode}`,
      orderCode,
      roomId,
      roomName: room.name,
      checkIn,
      checkOut,
      nights,
      guestName,
      guestPhone,
      guestEmail,
      guestNote: guestNote || '',
      totalAmount,
      status: 'PENDING_PAYMENT',
      paymentRef: `DATPHONG ${orderCode} ${formatPhoneForQR(guestPhone)}`,
      expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    globalBookings.push(newBooking);

    return NextResponse.json(newBooking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}