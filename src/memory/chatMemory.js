// chatId -> [{ role, content }]
const historyByChatId = new Map();

function getHistory(chatId) {
  return historyByChatId.get(chatId) || [];
}

function setHistory(chatId, messages) {
  historyByChatId.set(chatId, messages);
}

function resetHistory(chatId) {
  historyByChatId.delete(chatId);
}

function addMessage(chatId, message, maxHistory = 20) {
  const history = getHistory(chatId);
  history.push(message);

  const trimmed =
    history.length > maxHistory
      ? history.slice(history.length - maxHistory)
      : history;

  setHistory(chatId, trimmed);
}

module.exports = {
  getHistory,
  setHistory,
  resetHistory,
  addMessage,
};
