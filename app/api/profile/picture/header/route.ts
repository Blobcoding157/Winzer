import { NextRequest, NextResponse } from 'next/server';
import { updateUserHeader } from '../../../../../database/users';

export type ProfilePictureResponseBodyPut = { error: string } | { user: any };

export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string[]> },
): Promise<NextResponse<ProfilePictureResponseBodyPut>> {
  console.log(params);

  const body = await request.json();

  const newPicture = updateUserHeader(body.id, body.profileHeader);

  return NextResponse.json({ user: newPicture });
}
