const db = require('./index.js');

function createUser(telegramId, username) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (telegram_id, username)
    VALUES (?, ?)
  `);

  stmt.run(telegramId, username);
}

function getUserByTelegramId(telegramId) {
  return db.prepare(`
    SELECT * FROM users WHERE telegram_id = ?
  `).get(telegramId);
}

module.exports = {
  createUser,
  getUserByTelegramId,
};
