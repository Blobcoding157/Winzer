import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '../../../database/events';

export async function GET(request: NextRequest) {
  const events = await getEvents();
  const { searchParams } = new URL(request.url);
  console.log(typeof searchParams.get('id'));
  return NextResponse.json(events);
}
