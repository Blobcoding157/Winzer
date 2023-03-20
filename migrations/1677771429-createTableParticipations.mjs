export async function up(sql) {
  await sql`
  CREATE TABLE participation (
    id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL
  )`;
}

export async function down(sql) {
  await sql`
  DROP TABLE participation
  `;
}
