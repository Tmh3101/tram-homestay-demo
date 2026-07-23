// @ts-nocheck
import { http, HttpResponse } from 'msw';
import roomsData from './data/rooms.json' with { type: 'json' };
import bookingsData from './data/bookings.json' with { type: 'json' };
import { generateOrderCode, getNights, formatPhoneForQR, addDays } from '@/lib/utils';

import { generateVietQRContent, getBankDeeplinks, HOMESTAY_BANK_ACCOUNT } from '@/lib/vietqr';

// In-memory storage for demo (resets on reload)
let mockRooms = roomsData.rooms;
let mockBookings = bookingsData.bookings;

// Helper to find room by ID
const findRoom = (id: string) => mockRooms.find(r => r.id === id);

// Helper to find booking by ID
const findBooking = (id: string) => mockBookings.find(b => b.id === id);

// Helper to get availability for a date range
const getAvailability = (roomId: string, checkIn: string, checkOut: string) => {
  const room = findRoom(roomId);
  if (!room) return { available: false, reason: 'Room not found' };
  
  const nights = getNights(checkIn, checkOut);
  for (let i = 0; i < nights; i++) {
    const date = addDays(checkIn, i);
    if (room.calendar[date] === 'booked') {
      return { available: false, reason: `Đã đặt ngày ${date}` };
    }
  }
  return { available: true };
}

// API Handlers
export const handlers = [
  // GET /api/rooms - Get all rooms with optional query: checkIn, checkOut for availability
  http.get('/api/rooms', ({ request }) => {
    const url = new URL(request.url);
    const checkIn = url.searchParams.get('checkIn');
    const checkOut = url.searchParams.get('checkOut');
    
    let rooms = mockRooms.map(room => {
      const roomCopy = { ...room };
      
      if (checkIn && checkOut) {
        const avail = getAvailability(room.id, checkIn, checkOut);
        roomCopy.isAvailable = avail.available;
        if (!avail.available) roomCopy.unavailableReason = avail.reason;
      } else {
        roomCopy.isAvailable = true;
      }
      
      // Remove calendar for list view (keep only for detail)
      const { calendar, ...roomData } = roomCopy;
      return roomData;
    });
    
    return HttpResponse.json({ rooms });
  }),

  // GET /api/rooms/:id - Get room detail with full calendar
  http.get('/api/rooms/:id', ({ params }) => {
    const room = findRoom(params.id as string);
    if (!room) {
      return HttpResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    return HttpResponse.json({ room });
  }),

  // POST /api/bookings - Create new booking (DRAFT)
  http.post('/api/bookings', async ({ request }) => {
    const body = await request.json();
    
    const { roomId, checkIn, checkOut, guestName, guestPhone, guestEmail, guestNote } = body;
    
    // Validate
    if (!roomId || !checkIn || !checkOut || !guestName || !guestPhone || !guestEmail) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const room = findRoom(roomId);
    if (!room) {
      return HttpResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    const avail = getAvailability(roomId, checkIn, checkOut);
    if (!avail.available) {
      return HttpResponse.json({ error: avail.reason || 'Room not available' }, { status: 400 });
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
      status: 'PENDING_PAYMENT' as const,
      paymentRef: `DATPHONG ${orderCode} ${formatPhoneForQR(guestPhone)}`,
      expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    mockBookings.push(newBooking);
    
    // Mark calendar as booked (for demo - in real app this would be after payment confirmation)
    for (let i = 0; i < nights; i++) {
      const date = addDays(checkIn, i);
      room.calendar[date] = 'booked';
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json({ booking: newBooking });
  }),

  // GET /api/bookings/:id - Get booking detail
  http.get('/api/bookings/:id', ({ params }) => {
    const booking = findBooking(params.id as string);
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return HttpResponse.json({ booking });
  }),

  // PATCH /api/bookings/:id - Update booking status (for webhook/manual match)
  http.patch('/api/bookings/:id', async ({ params, request }) => {
    const body = await request.json();
    const booking = findBooking(params.id as string);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    Object.assign(booking, body);
    
    // If cancelled/expired, release room
    if (body.status === 'CANCELLED' || body.status === 'EXPIRED') {
      const room = mockRooms.find(r => r.id === booking.roomId);
      if (room) {
        const nights = getNights(booking.checkIn, booking.checkOut);
        for (let i = 0; i < nights; i++) {
          const date = addDays(booking.checkIn, i);
          room.calendar[date] = 'available';
        }
      }
    }
    
    return HttpResponse.json({ booking });
  }),

  // GET /api/payment/qr - Generate VietQR for payment
  http.get('/api/payment/qr', ({ request }) => {
    const url = new URL(request.url);
    const bookingId = url.searchParams.get('bookingId');
    const amount = url.searchParams.get('amount');
    const phone = url.searchParams.get('phone');
    
    if (!bookingId || !amount || !phone) {
      return HttpResponse.json({ error: 'Missing params' }, { status: 400 });
    }
    
    const orderCode = generateOrderCode();
    const qrContent = generateVietQRContent({
      bankBin: HOMESTAY_BANK_ACCOUNT.bankBin,
      accountNumber: HOMESTAY_BANK_ACCOUNT.accountNumber,
      accountName: HOMESTAY_BANK_ACCOUNT.accountName,
      amount: parseInt(amount),
      orderCode,
      phone,
    });
    
    const deeplinks = getBankDeeplinks(qrContent, parseInt(amount));
    
    return HttpResponse.json({
      qrContent,
      deeplinks,
      orderCode,
      amount: parseInt(amount),
    });
  }),

  // POST /api/payment/match - Manual payment match (for demo)
  http.post('/api/payment/match', async ({ request }) => {
    const { bookingId, paymentRef } = await request.json();
    
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    if (!paymentRef.includes(String(booking.orderCode))) {
      return HttpResponse.json({ error: 'Payment reference does not match booking' }, { status: 400 });
    }
    
    booking.status = 'CONFIRMED';
    booking.paymentRef = paymentRef;
    booking.confirmedAt = new Date().toISOString();
    
    return HttpResponse.json({ 
      booking,
      message: 'Payment matched successfully! Booking confirmed.'
    });
  }),

  // POST /api/payment/webhook - Bank webhook (mock)
  http.post('/api/payment/webhook', async ({ request }) => {
    const body = await request.json();
    const { orderCode, amount, reference, status } = body;
    
    const booking = mockBookings.find(b => b.orderCode === orderCode);
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    if (status === 'SUCCESS' && amount === booking.totalAmount) {
      booking.status = 'CONFIRMED';
      booking.paymentRef = reference;
      booking.confirmedAt = new Date().toISOString();
    } else {
      booking.status = 'FAILED';
    }
    
    return HttpResponse.json({ success: true });
  }),

  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  }),
];
