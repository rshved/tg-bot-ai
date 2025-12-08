function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id TEXT UNIQUE,
      username TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      role TEXT,
      content TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  try {
    const hasColumn = db
      .prepare(
        `
    PRAGMA table_info(users);
  `
      )
      .all()
      .some((col) => col.name === "response_style");

    if (!hasColumn) {
      db.exec(`
      ALTER TABLE users
      ADD COLUMN response_style TEXT DEFAULT 'normal';
    `);
    }
  } catch (e) {
    console.error("Migration error:", e);
  }
}

module.exports = runMigrations;
