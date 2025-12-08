const { getUserByTelegramId } = require("../db/userRepository");

async function llmReply(ctx, messages, llmClient) {
  const chatId = ctx.chat.id;
  const user = getUserByTelegramId(String(chatId));

  const style = user?.response_style || "long";

  const stylePrompt = {
  short: "Отвечай очень кратко. Максимум 1–2 предложения.",
  normal: "",
  long: "ПИШИ ОЧЕНЬ ДОКРУЖНО. ОТВЕЧАЙ НЕ МЕНЬШЕ ЧЕМ НА 15 ПРЕДЛОЖЕНИЙ. ЕСЛИ КОРОТЬ — ТО ЭТО ОШИБКА. ПИШИ МНОГО.
}[style];

  return await llmClient.generateReply(messages, stylePrompt);
}

module.exports = { llmReply };
