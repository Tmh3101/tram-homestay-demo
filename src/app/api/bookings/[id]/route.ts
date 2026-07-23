import { NextResponse } from 'next/server';
import bookingsData from '@/mocks/data/bookings.json';

// In-memory reference for simulation
let globalBookings = bookingsData.bookings as any[];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const booking = globalBookings.find((b: any) => b.id === params.id);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  return NextResponse.json({ booking });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const booking = globalBookings.find((b: any) => b.id === params.id);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const body = await request.json();
  Object.assign(booking, body);

  return NextResponse.json({ booking });
}