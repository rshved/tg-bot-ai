require('dotenv').config();

const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  openaiApiKey: process.env.OPENAI_API_KEY,

  llmProvider: process.env.LLM_PROVIDER || 'openai',
  llmModel: process.env.LLM_MODEL || 'gpt-5.1-mini',
  systemPrompt:
    process.env.SYSTEM_PROMPT ||
    'Ты умный ассистент. Отвечай подробно, развёрнуто и максимально информативно. Если пользователь задает короткий вопрос — давай полный объясняющий ответ.',

  maxHistoryMessages: 20,
};


if (!config.telegramToken) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in .env');
}

if (config.llmProvider === 'openai' && !config.openaiApiKey) {
  throw new Error('OPENAI_API_KEY is not set in .env');
}

module.exports = { config };