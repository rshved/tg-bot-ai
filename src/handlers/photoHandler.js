const { addMessage, getHistory } = require("../memory/chatMemory");

function createPhotoHandler({ llmClient, config }) {
  return async function handlePhotoMessage(ctx) {
    const chatId = ctx.chat.id;

    try {
      await ctx.sendChatAction("typing");

      const photoArray = ctx.message.photo;
      if (!photoArray || photoArray.length === 0) {
        return await ctx.reply("Не могу получить фото 😔");
      }

      // Берём самое большое фото
      const largestPhoto = photoArray[photoArray.length - 1];

      const fileLink = await ctx.telegram.getFileLink(largestPhoto.file_id);
      const fileUrl = fileLink.href || fileLink.toString();

      // Анализируем фото через Vision-модель
      const answer = await llmClient.analyzeImageFromUrl(
        fileUrl,
        "Пожалуйста, подробно опиши, что изображено на фото."
      );

      // Обновляем историю
      addMessage(chatId, { role: "user", content: "[📷 прислал фото]" }, config.maxHistoryMessages);
      addMessage(chatId, { role: "assistant", content: answer }, config.maxHistoryMessages);

      await ctx.reply(answer);
    } catch (err) {
      console.error("IMAGE ERROR:", err);
      await ctx.reply("Не смог обработать картинку 😔 Попробуй другое фото.");
    }
  };
}

module.exports = { createPhotoHandler };
