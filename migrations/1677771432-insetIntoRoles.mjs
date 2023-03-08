const newRoles = [
  { id: 1, role_name: 'user' },
  { id: 2, role_name: 'winzer' },
  { id: 3, role_name: 'admin' },
];

export async function up(sql) {
  await sql`
  INSERT INTO roles ${sql(newRoles, 'role_name')}
  `;
}

export async function down(sql) {
  for (const role of newRoles) {
    await sql`
  DELETE FROM roles WHERE id = ${role.id}
  `;
  }
}
