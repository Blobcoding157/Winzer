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

// returns all data from all attending events of a specific user
export const getParticipationsByUser = cache(async (id: number) => {
  const participations = await sql<Participation[]>`
      SELECT events.* FROM events
      INNER JOIN participations ON events.id = participations.event_id
      WHERE participations.user_id = ${id}
    `;
  return participations;
});

// returns all profile pictures from all attending users of a specific event
export const getAttendingUserProfilePictures = cache(async (id: number) => {
  const participations = await sql<Participation[]>`
     SELECT users.id, users.profile_picture FROM users
     INNER JOIN participations ON users.id = participations.user_id
     WHERE participations.event_id = ${id};
    `;
  return participations;
});

export const getParticipationsByUserAndEvent = cache(
  async (userId: number, eventId: number) => {
    const participations = await sql<Participation[]>`
      FROM participations INNER jOIN users ON participations.id = users.id
      INNER jOIN events ON participations.id = events.id

    `;
    return participations;
  },
);

// returns all attending userData from an event
export const getParticipationsByEvent = cache(async (id: number) => {
  const participations = await sql<Participation[]>`
      SELECT users.* FROM users
      INNER JOIN participations ON users.id = participations.user_id
      WHERE participations.event_id = ${id};
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
