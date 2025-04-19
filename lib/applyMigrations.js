export async function applyMigrations(db) {
  const files = await fetch('/migrations/index.json').then((res) => res.json());

  for (const filename of files) {
    const sql = await fetch(`/migrations/${filename}`).then((res) => res.text());
    await db.exec(sql);
  }
}
