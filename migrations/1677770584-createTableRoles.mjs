export async function up(sql) {
  await sql` CREATE TABLE roles (
    id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_name VARCHAR(10) NOT NULL UNIQUE
  )`;
}

export async function down(sql) {
  await sql`
  DROP TABLE roles
  `;
}
