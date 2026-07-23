import { NextResponse } from 'next/server';
import bookingsData from '@/mocks/data/bookings.json';

export const dynamic = 'force-dynamic';

// In-memory reference for simulation
let globalBookings = bookingsData.bookings as any[];


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderCode, amount, reference, status } = body;
    
    const booking = globalBookings.find((b: any) => b.orderCode === orderCode);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    if (status === 'SUCCESS' && amount === booking.totalAmount) {
      booking.status = 'CONFIRMED';
      booking.paymentRef = reference;
      booking.confirmedAt = new Date().toISOString();
    } else {
      booking.status = 'FAILED';
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}