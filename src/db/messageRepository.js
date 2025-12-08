const db = require('./index.js');

function addMessage(userId, role, content) {
  const stmt = db.prepare(`
    INSERT INTO messages (user_id, role, content)
    VALUES (?, ?, ?)
  `);

  stmt.run(userId, role, content);
}

function getMessagesByUser(userId, limit = 20) {
  return db.prepare(`
    SELECT role, content, created_at
    FROM messages
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT ?
  `).all(userId, limit).reverse();
}

module.exports = {
  addMessage,
  getMessagesByUser,
};
