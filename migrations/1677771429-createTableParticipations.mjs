export async function up(sql) {
  await sql`
  CREATE TABLE participations (
    id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL
  )`;
}

export async function down(sql) {
  await sql`
  DROP TABLE participations
  `;
}
