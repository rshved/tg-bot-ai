const db = require('./index.js');

// Гарантированно создаёт пользователя, если его нет
function ensureUserExists(telegramId, username = null) {
  db.prepare(`
    INSERT INTO users (telegram_id, username, response_style)
    VALUES (?, ?, 'normal')
    ON CONFLICT(telegram_id) DO NOTHING
  `).run(telegramId, username);
}

function createUser(telegramId, username) {
  ensureUserExists(telegramId, username);
}

function getUserByTelegramId(telegramId) {
  ensureUserExists(telegramId);

  return db.prepare(`
    SELECT * FROM users WHERE telegram_id = ?
  `).get(telegramId);
}

function setUserStyle(telegramId, style) {
  ensureUserExists(telegramId);

  db.prepare(`
    UPDATE users SET response_style = ?
    WHERE telegram_id = ?
  `).run(style, telegramId);
}

function getUserStyle(telegramId) {
  ensureUserExists(telegramId);

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
