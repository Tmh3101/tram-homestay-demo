import { NextResponse } from 'next/server';
import bookingsData from '@/mocks/data/bookings.json';

export const dynamic = 'force-dynamic';

// In-memory reference for simulation
let globalBookings = bookingsData.bookings as any[];


export async function POST(request: Request) {
  try {
    const { bookingId, paymentRef } = await request.json();
    
    const booking = globalBookings.find((b: any) => b.id === bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    if (!paymentRef.includes(String(booking.orderCode))) {
      return NextResponse.json({ error: 'Payment reference does not match booking' }, { status: 400 });
    }
    
    booking.status = 'CONFIRMED';
    booking.paymentRef = paymentRef;
    booking.confirmedAt = new Date().toISOString();
    
    return NextResponse.json({ 
      booking,
      message: 'Payment matched successfully! Booking confirmed.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}