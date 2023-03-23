import { cache } from 'react';
import { sql } from './conect';

// events database

export type Event = {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventStart: string;
  eventEnd: string;
  latitude: number;
  longitude: number;
  imgUrl: string;
  userId: number;
};

export const getEvents = cache(async () => {
  const events = await sql<Event[]>`
      SELECT * FROM events
    `;
  return events;
});

export const getEventsWithHostData = cache(async () => {
  const events = await sql<Event[]>`
      SELECT events.*, users.profile_picture, users.username
FROM events
JOIN users ON events.user_id = users.id;`;
  return events;
});

export const getEventsById = cache(async (id: number) => {
  const event = await sql<Event[]>`
      SELECT * FROM events WHERE id = ${id}
    `;
  return event;
});

export const getEventsByUser = cache(async (id: number) => {
  const events = await sql<Event[]>`
      FROM events INNER jOIN users ON events.id = users.id
    `;
  return events;
});

export const createEvent = cache(
  async (
    title: string,
    description: string,
    eventDate: string,
    eventStart: string,
    eventEnd: string,
    latitude: number,
    longitude: number,
    imgUrl: string,
    userId: number,
  ) => {
    const [events] = await sql<Event[]>`
      INSERT INTO events
        (title, description, event_date, event_start, event_end, latitude, longitude, img_url, user_id)
      VALUES
        (${title}, ${description}, ${eventDate}, ${eventStart}, ${eventEnd}, ${latitude}, ${longitude}, ${imgUrl}, ${userId})
      RETURNING *
    `;
    return events;
  },
);

export const deleteEvent = cache(async (id: number) => {
  const [events] = await sql<Event[]>`
      DELETE FROM events WHERE id = ${id}
    `;
  return events;
});
