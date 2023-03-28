import { NextRequest, NextResponse } from 'next/server';
import { updateUserHeader } from '../../../../../database/users';

export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string[]> },
) {
  console.log(params);

  const body = await request.json();

  const newPicture = updateUserHeader(body.id, body.profileHeader);

  return NextResponse.json({ user: newPicture });
}
