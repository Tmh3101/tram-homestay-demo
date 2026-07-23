import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Booking } from '../../types';

export type FlowStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface BookingState {
  // Flow state
  currentStep: FlowStep;
  selectedDate: string | null;
  dateRange: { checkIn: string; checkOut: string } | null;
  selectedRoomId: string | null;
  
  // Booking data
  booking: Partial<Booking> & { id?: string };
  
  // Payment
  paymentTimer: number;
  timerStartTime: number | null;
  paymentStatus: 'idle' | 'pending' | 'matched' | 'expired' | 'failed';
  
  // Actions
  setStep: (step: FlowStep) => void;
  setSelectedDate: (date: string | null) => void;
  setDateRange: (range: { checkIn: string; checkOut: string } | null) => void;
  setSelectedRoom: (roomId: string | null) => void;
  setGuestInfo: (info: { guestName: string; guestPhone: string; guestEmail: string; guestNote?: string }) => void;
  updateBooking: (data: Partial<Booking>) => void;
  createBooking: () => Promise<Booking>;
  startPaymentTimer: (durationSeconds?: number) => void;
  stopPaymentTimer: () => void;
  decrementTimer: () => void;
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
      timerStartTime: null,
      paymentStatus: 'idle',
      
      setStep: (step) => set({ currentStep: step }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setDateRange: (range) => set({ dateRange: range }),
      setSelectedRoom: (roomId) => set({ selectedRoomId: roomId }),
      
      setGuestInfo: (info) => set((state) => ({
        booking: {
          ...state.booking,
          guestName: info.guestName,
          guestPhone: info.guestPhone,
          guestEmail: info.guestEmail,
          guestNote: info.guestNote,
        }
      })),

      updateBooking: (data) => set((state) => ({ 
        booking: { ...state.booking, ...data } 
      })),
      
      createBooking: async () => {
        const { booking, dateRange, selectedRoomId } = get();
        if (!dateRange || !selectedRoomId) throw new Error('Thiếu thông tin ngày hoặc phòng chọn');
        
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
            guestNote: booking.guestNote || '',
          }),
        });
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Tạo phòng không thành công');
        }

        const data = await res.json();
        const newBooking = data.booking || data;
        set({ booking: newBooking, currentStep: 5 });
        get().startPaymentTimer(1800);
        return newBooking;
      },
      
      startPaymentTimer: (duration = 1800) => {
        set({ 
          paymentTimer: duration, 
          timerStartTime: Date.now(), 
          paymentStatus: 'pending' 
        });
      },
      
      stopPaymentTimer: () => set({ paymentStatus: 'idle', timerStartTime: null }),

      decrementTimer: () => set((state) => {
        if (state.paymentTimer <= 1) {
          return { paymentTimer: 0, paymentStatus: 'expired' };
        }
        return { paymentTimer: state.paymentTimer - 1 };
      }),
      
      onPaymentMatched: () => set({ paymentStatus: 'matched', currentStep: 7 }),
      onPaymentExpired: () => set({ paymentStatus: 'expired', currentStep: 1 }),
      
      resetFlow: () => set({
        currentStep: 1,
        selectedDate: null,
        dateRange: null,
        selectedRoomId: null,
        booking: {},
        paymentTimer: 1800,
        timerStartTime: null,
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
        timerStartTime: state.timerStartTime,
        paymentStatus: state.paymentStatus,
      }),
    }
  )
);