const { OpenAiClient } = require('./openaiClient');

function createLlmClient(config) {
  if (config.llmProvider === 'openai') {
    return new OpenAiClient({
      apiKey: config.openaiApiKey,
      model: config.llmModel,
      systemPrompt: config.systemPrompt,
    });
  }

  throw new Error(`Unknown LLM provider: ${config.llmProvider}`);
}

module.exports = { createLlmClient };
