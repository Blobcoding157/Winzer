export async function up(sql) {
  await sql`
  CREATE TABLE users (
    id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(110) NOT NULL UNIQUE,
    about_me VARCHAR(500),
    profile_picture VARCHAR(100) NOT NULL,
    role_id INTEGER NOT NULL
  )`;
}

export async function down(sql) {
  await sql`
  DROP TABLE users
  `;
}
