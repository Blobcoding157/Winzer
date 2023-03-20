import { cache } from 'react';
import { sql } from './conect';

export type Participation = {
  id: number;
  userId: number;
  eventId: number;
};

export const getParticipations = cache(async () => {
  const participations = await sql<Participation[]>`
      SELECT * FROM participations
    `;
  return participations;
});

export const getParticipationsById = cache(async (id: number) => {
  const participations = await sql<Participation[]>`
      SELECT * FROM participations WHERE id = ${id}
    `;
  return participations;
});

export const getParticipationsByUser = cache(async (id: number) => {
  const participations = await sql<Participation[]>`
      FROM participations INNER jOIN users ON participations.id = users.id
    `;
  return participations;
});

export const getParticipationWithUserProfilePicture = cache(
  async (id: number) => {
    const participations = await sql<Participation[]>`
      FROM participations INNER jOIN users ON participations.id = users.id
      INNER jOIN user_profile_pictures ON participations.id = user_profile_pictures.id
    `;
    return participations;
  },
);
export const getParticipationsByUserAndEvent = cache(
  async (userId: number, eventId: number) => {
    const participations = await sql<Participation[]>`
      FROM participations INNER jOIN users ON participations.id = users.id
      INNER jOIN events ON participations.id = events.id

    `;
    return participations;
  },
);

export const getParticipationsByEvent = cache(async (id: number) => {
  const participations = await sql<Participation[]>`
      FROM participations INNER jOIN events ON participations.id = events.id
    `;
  return participations;
});

export const createParticipation = cache(
  async (userId: number, eventId: number) => {
    const [participations] = await sql<Participation[]>`
      INSERT INTO participations
        (user_id, event_id)
      VALUES
        (${userId}, ${eventId})
      RETURNING *
    `;
    return participations;
  },
);

export const deleteParticipation = cache(async (id: number) => {
  const [participations] = await sql<Participation[]>`
      DELETE FROM participations WHERE id = ${id}
    `;
  return participations;
});
