import { NextResponse } from 'next/server';
import roomsData from '@/mocks/data/rooms.json';
import bookingsData from '@/mocks/data/bookings.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  const getAvailability = (roomId: string, checkIn: string, checkOut: string) => {
    const room = roomsData.rooms.find((r: any) => r.id === roomId);
    if (!room) return { available: false, reason: 'Room not found' };

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < nights; i++) {
      const d = new Date(checkIn);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isBooked = bookingsData.bookings.some((b: any) => 
        b.roomId === roomId && 
        b.status === 'CONFIRMED' &&
        dateStr >= b.checkIn && 
        dateStr < b.checkOut
      );
      if (isBooked || (room.calendar as any)[dateStr] === 'booked') {
        return { available: false, reason: `Đã đặt ngày ${dateStr}` };
      }
    }
    return { available: true };
  };

  const rooms = roomsData.rooms.map((room: any) => {
    const roomCopy = { ...room };
    if (checkIn && checkOut) {
      const avail = getAvailability(room.id, checkIn, checkOut);
      roomCopy.isAvailable = avail.available;
      if (!avail.available) roomCopy.unavailableReason = avail.reason;
    } else {
      roomCopy.isAvailable = true;
    }
    // Remove calendar from list to save size
    const { calendar, ...roomData } = roomCopy;
    return roomData;
  });

  return NextResponse.json({ rooms });
}