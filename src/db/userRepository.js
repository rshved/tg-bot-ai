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

function setUserStyle(telegramId, style) {
  db.prepare(`
    UPDATE users SET response_style = ?
    WHERE telegram_id = ?
  `).run(style, telegramId);
}

function getUserStyle(telegramId) {
  const row = db.prepare(`
    SELECT response_style FROM users WHERE telegram_id = ?
  `).get(telegramId);
  return row?.response_style || 'normal';
}

module.exports = {
  createUser,
  getUserByTelegramId,
  setUserStyle,
  getUserStyle,
};
