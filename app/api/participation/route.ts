import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createParticipation,
  getParticipations,
} from '../../../database/participations';

const participationSchema = z.object({
  userId: z.number(),
  eventId: z.number(),
});

export type ParticipationResponseBodyPost =
  | { errors: { message: string }[] }
  | {
      participation: {
        userId: number;
        eventId: number;
      };
    };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ParticipationResponseBodyPost>> {
  const body = await request.json();

  const result = participationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ errors: result.error.issues }, { status: 400 });
  }

  if (!result.data.userId || !result.data.eventId) {
    return NextResponse.json(
      { errors: [{ message: 'User or Event Data missing!' }] },
      { status: 400 },
    );
  }

  const newParticipation = await createParticipation(
    result.data.userId,
    result.data.eventId,
  );

  if (!newParticipation) {
    return NextResponse.json(
      { errors: [{ message: 'Participation Failed!' }] },
      { status: 400 },
    );
  }

  return NextResponse.json({
    participation: {
      userId: newParticipation.userId,
      eventId: newParticipation.eventId,
    },
  });
}

export async function GET(request: NextRequest) {
  const participations = await getParticipations();
  const { searchParams } = new URL(request.url);

  if (!participations) {
    return NextResponse.json(
      { errors: [{ message: 'Participation Failed!' }] },
      { status: 400 },
    );
  }
  console.log(participations);
  console.log(typeof searchParams.get('id'));
  return NextResponse.json(participations);
}
