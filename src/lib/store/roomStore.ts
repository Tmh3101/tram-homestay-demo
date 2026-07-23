import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Room } from '@/types';

interface RoomStore {
  rooms: Room[];
  availability: Record<string, Record<string, 'available' | 'booked'>>;
  fetchRooms: () => Promise<void>;
  getAvailability: (roomId: string, date: string) => 'available' | 'booked';
  updateAvailability: (roomId: string, date: string, status: 'available' | 'booked') => void;
}

export const useRoomStore = create<RoomStore>()(
  persist(
    (set, get) => ({
      rooms: [],
      availability: {},
      
      fetchRooms: async () => {
        try {
          const res = await fetch('/api/rooms');
          const data = await res.json();
          set({ 
            rooms: data.rooms,
            availability: data.availability || {},
          });
        } catch (error) {
          console.error('Failed to fetch rooms:', error);
        }
      },
      
      getAvailability: (roomId, date) => get().availability[roomId]?.[date] || 'available',
      
      updateAvailability: (roomId, date, status) => set((state) => ({
        availability: {
          ...state.availability,
          [roomId]: { ...state.availability[roomId], [date]: status },
        },
      })),
    }),
    {
      name: 'tram-homestay-rooms',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rooms: state.rooms,
        availability: state.availability,
      }),
    }
  )
);