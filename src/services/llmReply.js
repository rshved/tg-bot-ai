const { getUserByTelegramId } = require("../db/userRepository");

async function llmReply(ctx, messages, llmClient) {
  const chatId = ctx.chat.id;
  const user = getUserByTelegramId(String(chatId));

  const style = user?.response_style || "normal";

  const stylePrompt = {
  short: "Отвечай очень кратко. Максимум 1–2 предложения.",
  normal: "",
  long: "Пиши максимально подробно, в большом объёме, раскрывая каждый аспект вопроса, добавляя объяснения, примеры и контекст. Не сокращай.",
}[style];

  return await llmClient.generateReply(messages, stylePrompt);
}

module.exports = { llmReply };
