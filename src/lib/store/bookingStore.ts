import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Booking } from '../../types';

interface BookingState {
  // Flow state
  currentStep: 1 | 4 | 5 | 6 | 7 | 8;
  selectedDate: string | null;
  dateRange: { checkIn: string; checkOut: string } | null;
  selectedRoomId: string | null;
  
  // Booking data
  booking: Partial<Booking> & { id?: string };
  
  // Payment
  paymentTimer: number;
  paymentStatus: 'idle' | 'pending' | 'matched' | 'expired' | 'failed';
  
  // Actions
  setStep: (step: BookingState['currentStep']) => void;
  setSelectedDate: (date: string) => void;
  setDateRange: (range: { checkIn: string; checkOut: string }) => void;
  setSelectedRoom: (roomId: string) => void;
  updateBooking: (data: Partial<Booking>) => void;
  createBooking: () => Promise<Booking>;
  startPaymentTimer: () => void;
  stopPaymentTimer: () => void;
  onPaymentMatched: () => void;
  onPaymentExpired: () => void;
  resetFlow: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      selectedDate: null,
      dateRange: null,
      selectedRoomId: null,
      booking: {},
      paymentTimer: 1800,
      paymentStatus: 'idle',
      
      setStep: (step) => set({ currentStep: step }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setDateRange: (range) => set({ dateRange: range }),
      setSelectedRoom: (roomId) => set({ selectedRoomId: roomId }),
      
      updateBooking: (data) => set((state) => ({ 
        booking: { ...state.booking, ...data } 
      })),
      
      createBooking: async () => {
        const { booking, dateRange, selectedRoomId } = get();
        if (!dateRange || !selectedRoomId) throw new Error('Missing data');
        
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: selectedRoomId,
            checkIn: dateRange.checkIn,
            checkOut: dateRange.checkOut,
            guestName: booking.guestName,
            guestPhone: booking.guestPhone,
            guestEmail: booking.guestEmail,
            guestNote: booking.guestNote,
          }),
        });
        
        const data = await res.json();
        const newBooking = data.booking || data;
        set({ booking: newBooking, currentStep: 7 });
        get().startPaymentTimer();
        return newBooking;
      },
      
      startPaymentTimer: () => {
        set({ paymentTimer: 1800, paymentStatus: 'pending' });
      },
      
      stopPaymentTimer: () => set({ paymentStatus: 'idle' }),
      
      onPaymentMatched: () => set({ paymentStatus: 'matched', currentStep: 8 }),
      onPaymentExpired: () => set({ paymentStatus: 'expired', currentStep: 1 }),
      
      resetFlow: () => set({
        currentStep: 1,
        selectedDate: null,
        dateRange: null,
        selectedRoomId: null,
        booking: {},
        paymentTimer: 1800,
        paymentStatus: 'idle',
      }),
    }),
    {
      name: 'tram-homestay-booking-flow',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedDate: state.selectedDate,
        dateRange: state.dateRange,
        selectedRoomId: state.selectedRoomId,
        booking: state.booking,
        paymentTimer: state.paymentTimer,
        paymentStatus: state.paymentStatus,
      }),
    }
  )
);