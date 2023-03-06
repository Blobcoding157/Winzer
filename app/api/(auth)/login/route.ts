import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByUsernameWithPasswordHash } from '../../../../database/users';

const userSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string(),
});

export type LoginResponseBodyPost =
  | { error: { message: string }[] }
  | { user: { username: string; email: string } };

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const result = userSchema.safeParse(body);

  if (!result.success) {
    // Inside of result.error.issues you are going to have more granular information about what is failing allowing you to create more specific error massages
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  // check if the string is empty
  if (!result.data.username || !result.data.password || !result.data.email) {
    return NextResponse.json(
      { errors: [{ message: 'username or password is empty' }] },
      { status: 400 },
    );
  }

  // 2. check if the user exist
  const userWithPasswordHash = await getUserByUsernameWithPasswordHash(
    result.data.username,
  );

  if (!userWithPasswordHash) {
    return NextResponse.json(
      { errors: [{ message: 'user or password not valid' }] },
      { status: 401 },
    );
  }

  // 3. validate the password
  const isPasswordValid = await bcrypt.compare(
    result.data.password,
    userWithPasswordHash.passwordHash,
  ); // Boolean

  if (!isPasswordValid) {
    return NextResponse.json(
      { errors: [{ message: 'user or password not valid' }] },
      { status: 401 },
    );
  }
};
