export async function up(sql) {
  await sql`
  CREATE TABLE events (
    id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(400) NOT NULL,
    event_date DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    img_url VARCHAR(100)
  )`;
}

export async function down(sql) {
  await sql`
  DROP TABLE events
  `;
}
