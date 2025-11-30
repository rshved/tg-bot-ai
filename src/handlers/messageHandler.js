const { addMessage, getHistory, resetHistory } = require('../memory/chatMemory');

function createMessageHandler({ llmClient, config }) {
  return async function handleTextMessage(ctx) {
    const chatId = ctx.chat.id;
    const userText = ctx.message.text;

    if (userText === '/reset') {
      resetHistory(chatId);
      await ctx.reply('История очищена ✅ Начнём с чистого листа.');
      return;
    }

    await ctx.sendChatAction('typing');

    try {
      const history = getHistory(chatId);

      const messagesForLlm = [
        ...history,
        { role: 'user', content: userText },
      ];

      const answer = await llmClient.generateReply(messagesForLlm);

      addMessage(chatId, { role: 'user', content: userText }, config.maxHistoryMessages);
      addMessage(chatId, { role: 'assistant', content: answer }, config.maxHistoryMessages);

      await ctx.reply(answer);
    } catch (error) {
      console.error('Error while handling message:', error);
      await ctx.reply('Что-то пошло не так с ИИ 😔 Попробуй ещё раз позже.');
    }
  };
}

module.exports = { createMessageHandler };
