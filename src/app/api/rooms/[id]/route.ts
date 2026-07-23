import { NextResponse } from 'next/server';
import roomsData from '@/mocks/data/rooms.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const room = roomsData.rooms.find((r: any) => r.id === params.id);
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }
  return NextResponse.json({ room });
}