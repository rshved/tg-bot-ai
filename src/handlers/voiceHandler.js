const { addMessage, getHistory } = require("../memory/chatMemory");

function createVoiceHandler({ llmClient, config }) {
  return async function handleVoiceMessage(ctx) {
    const chatId = ctx.chat.id;
    const voice = ctx.message.voice;

    if (!voice) return;

    try {
      await ctx.sendChatAction("typing");

      // 1. Получаем ссылку на файл голосового у Telegram
      const fileLink = await ctx.telegram.getFileLink(voice.file_id);
      const fileUrl = fileLink.href || fileLink.toString();

      // 2. Расшифровываем голосовое в текст через OpenAI Whisper
      if (typeof llmClient.transcribeVoiceFromUrl !== "function") {
        await ctx.reply(
          "Голосовые пока не поддерживаются для этого провайдера модели."
        );
        return;
      }

      const text = await llmClient.transcribeVoiceFromUrl(fileUrl);

      // 3. Формируем историю + спрашиваем LLM как обычно
      const history = getHistory(chatId);

      const messagesForLlm = [...history, { role: "user", content: text }];

      const answer = await llmClient.generateReply(messagesForLlm);

      // 4. Обновляем историю
      addMessage(
        chatId,
        { role: "user", content: text },
        config.maxHistoryMessages
      );
      addMessage(
        chatId,
        { role: "assistant", content: answer },
        config.maxHistoryMessages
      );

      // 5. Отправляем результат
      await ctx.reply(`Я понял из голосового:\n"${text}"\n\nОтвет:\n${answer}`);
    } catch (error) {
      console.error("Error while handling voice message:", error);
      await ctx.reply(
        "Не смог распознать голосовое 😔 Попробуй ещё раз или напиши текстом."
      );
    }
  };
}

module.exports = { createVoiceHandler };
