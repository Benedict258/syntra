import OpenAI from 'openai';

const MODEL = process.env.AI_MODEL || 'gpt-4.1-mini';
let openAiClient;

const getClient = () => {
  if (openAiClient) return openAiClient;
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openAiClient;
};

export const invokeAI = async ({ prompt, schema, useWebSearch = false, attachments = [], variables = {} }) => {
  const client = getClient();
  const response = await client.responses.create({
    model: MODEL,
    input: [
      {
        role: 'system',
        content: 'You are Syntra CoPilot. Always return JSON matching the schema when provided.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    metadata: { useWebSearch: Boolean(useWebSearch), attachmentsCount: attachments.length },
    response_format: schema ? { type: 'json_schema', json_schema: schema } : undefined,
    temperature: 0.2,
    max_output_tokens: 800,
    additional_instructions: variables ? JSON.stringify(variables) : undefined,
  });

  const first = response?.output?.[0];
  if (first?.content?.[0]?.type === 'output_text') {
    return JSON.parse(first.content[0].text || '{}');
  }
  if (typeof response.output_text === 'string') {
    return response.output_text;
  }
  return response;
};
