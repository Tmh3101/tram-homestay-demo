export type RoomType = 'Deluxe' | 'Family' | 'Standard';

export type Amenity = 
  | 'king-bed' 
  | 'queen-bed' 
  | 'twin-bed'
  | 'mountain-view' 
  | 'garden-view'
  | 'ac' 
  | 'wifi' 
  | 'hot-water' 
  | 'bathtub' 
  | 'shower' 
  | 'balcony' 
  | 'mini-fridge' 
  | 'tv' 
  | 'safe' 
  | 'hair-dryer';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  pricePerNight: number;
  capacity: number;
  amenities: Amenity[];
  images: string[];
  description: string;
  calendar: Record<string, 'available' | 'booked' | 'blocked'>;
}

export type BookingStatus = 
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PENDING_CONFIRM'
  | 'CONFIRMED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  orderCode: number;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestNote?: string;
  totalAmount: number;
  status: BookingStatus;
  paymentRef?: string;
  confirmedAt?: string;
  expiredAt?: string;
  createdAt: string;
}

export interface VietQRData {
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  content: string;
  qrDataUrl: string;
  deeplinks: Record<string, string>;
}