import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createEvent, getEvents } from '../../../database/events';

const eventSchema = z.object({
  title: z.string(),
  description: z.string(),
  eventDate: z.string(),
  eventStart: z.string(),
  eventEnd: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  imgUrl: z.string(),
  userId: z.number(),
});

export type EventResponseBodyPost =
  | { errors: { message: string }[] }
  | {
      event: {
        title: string;
        description: string;
        eventDate: string;
        eventStart: string;
        eventEnd: string;
        latitude: number;
        longitude: number;
        imgUrl: string;
        userId: number;
      };
    };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<EventResponseBodyPost>> {
  const body = await request.json();

  const result = eventSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ errors: result.error.issues }, { status: 400 });
  }

  if (
    !result.data.title ||
    !result.data.description ||
    !result.data.eventDate ||
    !result.data.eventStart ||
    !result.data.eventEnd ||
    !result.data.latitude ||
    !result.data.longitude ||
    !result.data.imgUrl ||
    !result.data.userId
  ) {
    return NextResponse.json(
      { errors: [{ message: 'please fill all options' }] },
      { status: 400 },
    );
  }

  const newEvent = await createEvent(
    result.data.title,
    result.data.description,
    result.data.eventDate,
    result.data.eventStart,
    result.data.eventEnd,
    result.data.latitude,
    result.data.longitude,
    result.data.imgUrl,
    result.data.userId,
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
      eventDate: newEvent.eventDate,
      eventStart: newEvent.eventStart,
      eventEnd: newEvent.eventEnd,
      latitude: newEvent.latitude,
      longitude: newEvent.longitude,
      imgUrl: newEvent.imgUrl,
      userId: newEvent.userId,
    },
  });
}

export async function GET(request: NextRequest) {
  const events = await getEvents();
  const { searchParams } = new URL(request.url);
  console.log(events);
  console.log(typeof searchParams.get('id'));
  return NextResponse.json(events);
}
