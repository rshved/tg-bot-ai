const { config } = require('./config');
const { createLlmClient } = require('./llm');
const { createTelegramBot } = require('./bot/telegramBot');

async function main() {
  const llmClient = createLlmClient(config);
  const bot = createTelegramBot({ config, llmClient });

  await bot.launch();
  console.log('Bot started ✅');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main().catch((err) => {
  console.error('Failed to start bot:', err);
  process.exit(1);
});
