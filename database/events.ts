import { Point } from 'leaflet';
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
};

export const getEvents = cache(async () => {
  const events = await sql<Event[]>`
      SELECT * FROM events
    `;
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
  ) => {
    const [events] = await sql<Event[]>`
      INSERT INTO events
        (title, description, event_date, event_start, event_end, latitude, longitude, img_url)
      VALUES
        (${title}, ${description}, ${eventDate} ${eventStart}, ${eventEnd}, ${latitude}, ${longitude}, ${imgUrl})
      RETURNING *
    `;
    return events;
  },
);
