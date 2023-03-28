import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSession } from '../../../../database/sessions';
import { createUser, getUserByUsername } from '../../../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../../../util/cookies';
import { createCsrfSecret } from '../../../../util/csrf';

const userSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string(),
  profilePicture: z.string(),
  profileHeader: z.string(),
  role: z.number(),
});

export type RegisterResponseBodyPost =
  | { errors: { message: string }[] }
  | {
      user: {
        username: string;
        email: string;
        profilePicture: string;
        profileHeader: string;
        role: number;
      };
    };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  // 1. validate the data
  const body = await request.json();

  const result = userSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  if (
    !result.data.username ||
    !result.data.password ||
    !result.data.email ||
    !result.data.role ||
    !result.data.profilePicture ||
    !result.data.profilePicture
  ) {
    return NextResponse.json(
      { errors: [{ message: 'username or password is empty' }] },
      { status: 400 },
    );
  }
  // 2. check if the user already exists & compare the username with the database

  const user = await getUserByUsername(result.data.username);

  if (user) {
    return NextResponse.json(
      { errors: [{ message: 'username is already taken' }] },
      { status: 400 },
    );
  }

  // 3. hash the password

  const passwordHash = await bcrypt.hash(result.data.password, 12);

  // 4. create the user

  const newUser = await createUser(
    result.data.username,
    result.data.email,
    result.data.profilePicture,
    result.data.profileHeader,
    result.data.role,
    passwordHash,
  );

  if (!newUser) {
    return NextResponse.json(
      { errors: [{ message: 'user creation failed' }] },
      { status: 500 },
    );
  }

  // 5. create a session
  // - create the token

  const token = crypto.randomBytes(80).toString('base64');

  const csrfSecret = createCsrfSecret();

  // - create the session
  const session = await createSession(token, newUser.id, csrfSecret);

  if (!session) {
    return NextResponse.json(
      { errors: [{ message: 'session creation failed' }] },
      { status: 500 },
    );
  }
  const serializedCookie = createSerializedRegisterSessionTokenCookie(
    session.token,
  );

  // 6. return the new username and email
  return NextResponse.json(
    {
      user: {
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        profileHeader: newUser.profileHeader,
      },
    },
    {
      status: 200,
      // - Attach the new cookie serialized to the header of the response
      headers: { 'Set-Cookie': serializedCookie },
    },
  );
}
