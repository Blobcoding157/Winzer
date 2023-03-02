import { cache } from 'react';
import { sql } from './connect';

// events database

// CREATE TABLE events (
//   id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   title VARCHAR(50) NOT NULL,
//   description VARCHAR(400) NOT NULL,
//   event_date DATE NOT NULL,
//   time_start TIME NOT NULL,
//   time_end TIME NOT NULL,
//   img_url VARCHAR(100)
// )`;

export type Event = {
  id: number;
  title: string;
  description: string;
  event_date: Date;
  time_start: Date | null;
  time_end: Date | null;
  img_url: string | null;
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

// bitte noch event-location in die DB du bob!!!
export const createEvent = cache(
  async (
    title: string,
    description: string,
    event_date: Date,
    time_start: Date | null,
    time_end: Date | null,
    img_url: string | null,
  ) => {
    const [events] = await sql<Event[]>`
      INSERT INTO events
        (title, description, event_date, time_start, time_end, img_url)
      VALUES
        (${title}, ${description}, ${event_date}, ${time_start}, ${time_end}, ${img_url})
      RETURNING *
    `;
    return events;
  },
);

// CREATE TABLE events (
//   id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   title VARCHAR(50) NOT NULL,
//   description VARCHAR(400) NOT NULL,
//   event_date DATE NOT NULL,
//   time_start TIME NOT NULL,
//   time_end TIME NOT NULL,
//   img_url VARCHAR(100)
// )`;
