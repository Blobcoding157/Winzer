import { cache } from 'react';
import { sql } from './conect';

export type User = {
  id: number;
  username: string;
  email: string;
  profilePicture: string;
  profileHeader: string;
  aboutMe: string | null;
  role_id: number;
  passwordHash: string;
};

type UserWithPasswordHash = User & {
  passwordHash: string;
};

export const getUsers = cache(async () => {
  const user = await sql<User[]>`
      SELECT id,
      username, email, profile_picture, profile_header, about_me, role_id FROM users
    `;
  return user;
});

export const getUsersById = cache(async (id: number) => {
  const user = await sql<User[]>`
      SELECT id,
      username, email, profile_picture, profile_header, about_me, role_id FROM user WHERE id = ${id}
    `;
  return user;
});

export const getUserBySessionToken = cache(async (token: string) => {
  const [user] = await sql<
    {
      id: number;
      username: string;
      roleId: number;
      profilePicture: string;
      csrfSecret: string;
    }[]
  >`
    SELECT
      users.id,
      users.username,
      users.role_id,
      users.profile_picture,
      sessions.csrf_secret
    FROM
      users
    INNER JOIN
      sessions ON (
        sessions.token = ${token} AND
        sessions.user_id = users.id AND
        sessions.expiry_timestamp > now()
      )
  `;
  return user;
});

export const getUserByUsernameWithPasswordHash = cache(
  async (username: string) => {
    const [user] = await sql<UserWithPasswordHash[]>`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username}
  `;
    return user;
  },
);

export const getUserByUsername = cache(async (username: string) => {
  const [user] = await sql<
    {
      id: number;
      username: string;
      profilePicture: string;
      profileHeader: string;
      email: string;
      about_me: string | null;
      role_id: number;
    }[]
  >`
    SELECT
      id,
      username, email, profile_picture, profile_header, about_me, role_id
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user;
});

export const updateUserPicture = cache(
  async (id: number, profilePicture: string) => {
    const [user] = await sql<{ id: number; username: string }[]>`
    UPDATE users
    SET profile_picture = ${profilePicture}
    WHERE id = ${id}
    RETURNING id, username;
  `;
    return user;
  },
);

export const updateUserHeader = cache(
  async (id: number, profileHeader: string) => {
    const [user] = await sql<{ id: number; username: string }[]>`
    UPDATE users
    SET profile_header = ${profileHeader}
    WHERE id = ${id}
    RETURNING id, username;
  `;
    return user;
  },
);

export const updateUser = cache(async (id: number, aboutMe: string) => {
  const [user] = await sql<{ id: number; username: string }[]>`
    UPDATE users
    SET about_me = ${aboutMe}
    WHERE id = ${id}
    RETURNING id, username;
    `;
  return user;
});

export const createUser = cache(
  async (
    username: string,
    email: string,
    profilePicture: string,
    profileHeader: string,
    role_id: number,
    passwordHash: string,
  ) => {
    const [user] = await sql<
      {
        id: number;
        username: string;
        email: any;
        profilePicture: string;
        profileHeader: string;
        role_id: number;
      }[]
    >`
      INSERT INTO users
        (username, email, profile_picture, profile_header, role_id, password_hash)
      VALUES
        (${username}, ${email}, ${profilePicture}, ${profileHeader}, ${role_id}, ${passwordHash})
      RETURNING
        id, username
    `;
    return user;
  },
);
