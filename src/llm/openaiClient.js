const OpenAI = require("openai");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const os = require("os");

class OpenAiClient {
  /**
   * @param {{ apiKey: string, model: string, systemPrompt?: string }} options
   */
  constructor(options) {
    this.client = new OpenAI({ apiKey: options.apiKey });
    this.model = options.model;
    this.systemPrompt =
      options.systemPrompt ||
      "Ты дружелюбный ассистент. Отвечай кратко и по делу.";
  }

  async generateReply(messages, stylePrompt = "") {
    const fullMessages = [{ role: "system", content: this.systemPrompt }];

    if (stylePrompt) {
      fullMessages.push({ role: "system", content: stylePrompt });
    }

    fullMessages.push(...messages);

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: fullMessages,
    });

    return response.choices[0].message.content;
  }

  async transcribeVoiceFromUrl(fileUrl) {
    // 1. Скачиваем файл
    const res = await fetch(fileUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to download voice file: ${res.status} ${res.statusText}`
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Пишем во временный файл (Whisper любит файлы/стримы)
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, `tg-voice-${Date.now()}.ogg`);
    fs.writeFileSync(filePath, buffer);

    try {
      const readStream = fs.createReadStream(filePath);

      const transcription = await this.client.audio.transcriptions.create({
        file: readStream,
        model: "whisper-1", // можно поменять на gpt-4o-transcribe, если захочешь
        language: "ru", // подсказываем, что говоришь по-русски
      });

      return transcription.text;
    } finally {
      // 3. Чистим за собой
      fs.unlink(filePath, () => {});
    }
  }

  async analyzeImageFromUrl(fileUrl, prompt = "Опиши изображение подробно.") {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: fileUrl,
              },
            },
          ],
        },
      ],
    });

    return response.choices[0].message.content;
  }

  async generateImage(prompt) {
    const response = await this.client.images.generate({
      model: "gpt-image-1", // модель для генерации картинок
      prompt,
      size: "1024x1024",
      n: 1,
    });

    // в новом SDK ответы лежат в response.data[]
    const image = response.data[0];

    // если вернули url — используем его
    if (image.url) {
      return image.url;
    }

    // если вдруг вернётся base64 — можно будет допилить, но пока не заморачиваемся
    throw new Error("Image URL not found in OpenAI response");
  }
}

module.exports = { OpenAiClient };
