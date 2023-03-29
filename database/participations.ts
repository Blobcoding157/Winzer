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
  SELECT events.*, u.username AS host_username,
       u.profile_picture AS host_profile_picture
FROM events
JOIN users u ON events.user_id = u.id
JOIN participations p ON events.id = p.event_id
JOIN users up ON events.user_id = up.id
WHERE p.user_id = ${id};`;
  return participations;
});

// returns all profile pictures from all attending users of a specific event
export const getAllAttendingUserProfilePictures = cache(async () => {
  const participations = await sql<Participation[]>`
     SELECT participations.event_id, users.profile_picture FROM users
     INNER JOIN participations ON users.id = participations.user_id
    `;
  return participations;
});

export const getParticipationsByUserAndEvent = cache(async () => {
  const participations = await sql<Participation[]>`
      FROM participations INNER jOIN users ON participations.id = users.id
      INNER jOIN events ON participations.id = events.id

    `;
  return participations;
});

// returns all attending userData from an event
export const getParticipationsByEvent = cache(async (id: number) => {
  const participations = await sql<Participation[]>`
      SELECT
      users.id,
      users.username, users.email, users.profile_picture, users.profile_header, users.about_me, users.role_id
       FROM users
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
