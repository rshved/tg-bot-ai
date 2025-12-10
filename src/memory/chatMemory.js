const { getUserByTelegramId, createUser } = require('../db/userRepository');
const { addMessage: addMsgDB, getMessagesByUser } = require('../db/messageRepository');
const db = require('../db/index');


function getHistory(chatId, maxHistory = 20) {
  createUser(chatId); // подстраховка
  const user = getUserByTelegramId(chatId);

  return getMessagesByUser(user.id, maxHistory).map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
}

function resetHistory(chatId) {
  createUser(chatId);
  const user = getUserByTelegramId(chatId);

  db.prepare('DELETE FROM messages WHERE user_id = ?').run(user.id);
}

function addMessage(chatId, message, maxHistory = 20) {
  createUser(chatId);
  const user = getUserByTelegramId(chatId);

  // вставляем в БД
  addMsgDB(user.id, message.role, message.content);

  // ограничение истории
  const messages = getMessagesByUser(user.id, maxHistory + 5); // небольшой буфер
  if (messages.length > maxHistory) {
    const idsToDelete = messages
      .slice(0, messages.length - maxHistory)
      .map(m => m.id);

    if (idsToDelete.length > 0) {
      db.prepare(
        `DELETE FROM messages WHERE id IN (${idsToDelete.map(() => '?').join(',')})`
      ).run(...idsToDelete);
    }
  }
}
console.log('chatMemory module loaded');

module.exports = {
  getHistory,
  resetHistory,
  addMessage,
};
