import { cache } from 'react';
import { sql } from './conect';

type Session = {
  id: number;
  token: string;
  userId: number | null;
  csrfSecret: string;
};

export const createSession = cache(
  async (token: string, id: number, csrfSecret: string) => {
    const [session] = await sql<{ id: number; token: string }[]>`
      INSERT INTO sessions
        (token, user_id, csrf_secret)
      VALUES
        (${token}, ${id}, ${csrfSecret})
      RETURNING
        id,
        token
    `;

    await deleteExpiredSessions();

    return session;
  },
);

export const deleteExpiredSessions = cache(async () => {
  await sql`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < now()
  `;
});

export const deleteSessionByToken = cache(async (token: string) => {
  const [session] = await sql<{ id: number; token: string }[]>`
    DELETE FROM
      sessions
    WHERE
      sessions.token = ${token}
    RETURNING
      id,
      token
  `;

  return session;
});

export const getValidSessionByToken = cache(async (token: string) => {
  const [session] = await sql<Session[]>`
    SELECT
      sessions.id,
      sessions.token,
      sessions.user_id,
      sessions.csrf_secret
     FROM
      sessions
    WHERE
      sessions.token = ${token}
    AND
      sessions.expiry_timestamp > now()
  `;

  return session;
});
