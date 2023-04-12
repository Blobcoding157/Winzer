import { NextRequest, NextResponse } from 'next/server';
import { updateUserPicture } from '../../../../../database/users';

export type ProfilePictureResponseBodyPut =
  | { error: string }
  | { user: Promise<{ id: number; profilePicture: string } | undefined> };

export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string[]> },
): Promise<NextResponse<ProfilePictureResponseBodyPut>> {
  console.log(params);

  const body = await request.json();

  const newPicture = updateUserPicture(body.id, body.profilePicture);

  return NextResponse.json({ user: newPicture });
}
