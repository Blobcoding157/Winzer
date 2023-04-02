import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createParticipation,
  getAllAttendingUserProfilePictures,
  getParticipations,
  getParticipationsByUser,
} from '../../../database/participations';

const participationSchema = z.object({
  userId: z.number(),
  eventId: z.number(),
});

// const participationSchemaGet = z.object({
//   id: z.number(),
//   query: z.string(),
// });

export type ParticipationResponseBodyPost =
  | { errors: { message: string }[] }
  | {
      participation: {
        userId: number;
        eventId: number;
      };
    };

export type ParticipationResponseBodyGet =
  | { errors: { message: string }[] }
  | {
      participations: {
        query: string;
        id: number;
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
  const existingParticipation = await getParticipations();

  const alreadyHere = existingParticipation.find((participation) => {
    return (
      participation.userId === result.data.userId &&
      participation.eventId === result.data.eventId
    );
  });

  if (alreadyHere) {
    return NextResponse.json(
      { errors: [{ message: 'Participation already exists!' }] },
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

// export async function GET(
//   request: NextRequest,
// ): Promise<NextResponse<ParticipationResponseBodyGet>> {
//   let participations = null;
//   const body = await request.json();
//   const result = participationSchemaGet.safeParse(body);

//   if (!result.success) {
//     return NextResponse.json({ errors: result.error.issues }, { status: 400 });
//   }

//   if (result.data.query === 'getParticipationsByUser') {
//     participations = await getParticipationsByUser(result.data.id);
//   } else if (result.data.query === 'getAttendingUserProfilePictures') {
//     participations = await getAllAttendingUserProfilePictures();
//   } else {
//     return NextResponse.json(
//       { errors: [{ message: 'Invalid query!' }] },
//       { status: 400 },
//     );
//   }

//   console.log('participations: ', participations);

//   if (!participations) {
//     return NextResponse.json(
//       { errors: [{ message: 'Participation Failed!' }] },
//       { status: 400 },
//     );
//   }
//   return NextResponse.json(participations);
// }
