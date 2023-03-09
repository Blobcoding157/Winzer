import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createEvent, getEvents } from '../../../database/events';

const eventSchema = z.object({
  title: z.string(),
  description: z.string(),
  event_date: z.date(),
  time_start: z.date(),
  time_end: z.date(),
  coordinates: z.array(z.number()),
  img_url: z.string(),
});

export type EventResponseBodyPost =
  | { errors: { message: string }[] }
  | {
      event: {
        title: string;
        description: string;
        event_date: Date;
        time_start: Date;
        time_end: Date;
        coordinates: number[];
        img_url: string;
      };
    };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<EventResponseBodyPost>> {
  const body = await request.json();

  const result = eventSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  if (
    !result.data.title ||
    !result.data.description ||
    !result.data.event_date ||
    !result.data.time_start ||
    !result.data.time_end ||
    !result.data.coordinates ||
    !result.data.img_url
  ) {
    return NextResponse.json(
      { errors: [{ message: 'please fill all options' }] },
      { status: 400 },
    );
  }

  const newEvent = await createEvent(
    result.data.title,
    result.data.description,
    result.data.event_date,
    result.data.time_start,
    result.data.time_end,
    result.data.coordinates,
    result.data.img_url,
  );
  if (!newEvent) {
    return NextResponse.json(
      { errors: [{ message: 'event creation failed' }] },
      { status: 500 },
    );
  }

  return NextResponse.json({
    event: {
      title: newEvent.title,
      description: newEvent.description,
      event_date: newEvent.event_date,
      time_start: newEvent.time_start,
      time_end: newEvent.time_end,
      coordinates: newEvent.coordinates,
      img_url: newEvent.img_url,
    },
  });
}

export async function GET(request: NextRequest) {
  const events = await getEvents();
  const { searchParams } = new URL(request.url);
  console.log(typeof searchParams.get('id'));
  return NextResponse.json(events);
}
