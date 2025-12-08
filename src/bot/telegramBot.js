const { Telegraf } = require("telegraf");
const { createMessageHandler } = require("../handlers/messageHandler");
const { createVoiceHandler } = require("../handlers/voiceHandler");
const { createPhotoHandler } = require("../handlers/photoHandler");

const { createUser } = require("../db/userRepository.js");

function createTelegramBot({ config, llmClient }) {
  const bot = new Telegraf(config.telegramToken);

  const handleTextMessage = createMessageHandler({ llmClient, config });
  const handleVoiceMessage = createVoiceHandler({ llmClient, config });
  const handlePhotoMessage = createPhotoHandler({ llmClient, config });

  bot.start((ctx) => {
    const tgId = String(ctx.from.id);
    const username = ctx.from.username || null;
    
    createUser(tgId, username);
    return ctx.reply(
      "Привет! Я ИИ-бот 🤖\n" +
        "— Пиши текст\n" +
        "— Отправляй голосовые\n" +
        "— Шли картинки\n" +
        "Команда /reset — очистить историю диалога."
    );
  });

  bot.help((ctx) =>
    ctx.reply(
      "Я ИИ-бот.\n" +
        "Текст — просто напиши сообщение.\n" +
        "Голос — отправь voice.\n" +
        "Картинка — просто пришли фото, я опишу.\n" +
        "/reset — очистить историю."
    )
  );
  // '/image <описание> — сгенерирую картинку.\n' + '— Команда /image <описание> — сгенерировать картинку\n' +

  // bot.command('image', async (ctx) => {
  //   const text = ctx.message.text.replace('/image', '').trim();

  //   if (!text) {
  //     return ctx.reply(
  //       'Напиши описание картинки после команды.\n' +
  //         'Пример:\n' +
  //         '/image кот-космонавт, летящий в космосе',
  //     );
  //   }

  //   try {
  //     await ctx.sendChatAction('upload_photo');

  //     const imageUrl = await llmClient.generateImage(text);

  //     // отправляем как фото
  //     await ctx.replyWithPhoto(imageUrl, {
  //       caption: `Вот твоя картинка по запросу:\n"${text}"`,
  //     });
  //   } catch (error) {
  //     console.error('IMAGE GENERATION ERROR:', error);
  //     await ctx.reply('Не смог сгенерировать картинку 😔 Попробуй другое описание sss.');
  //   }
  // });

  bot.on("text", handleTextMessage);

  if (typeof llmClient.transcribeVoiceFromUrl === "function") {
    bot.on("voice", handleVoiceMessage);
  }

  if (typeof llmClient.analyzeImageFromUrl === "function") {
    bot.on("photo", handlePhotoMessage);
  }

  return bot;
}

module.exports = { createTelegramBot };
