export async function up(sql) {
  await sql`
  CREATE TABLE participations (
    id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events (id) ON DELETE CASCADE
  )`;
}

export async function down(sql) {
  await sql`
  DROP TABLE participations
  `;
}
