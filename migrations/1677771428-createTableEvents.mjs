export async function up(sql) {
  await sql`
  CREATE TABLE events (
    id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(400) NOT NULL,
    event_date VARCHAR(50) NOT NULL,
    event_start VARCHAR(50) NOT NULL,
    event_end VARCHAR(50) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    img_url TEXT,
    user_id INTEGER NOT NULL
  )`;
}

export async function down(sql) {
  await sql`
  DROP TABLE events
  `;
}
