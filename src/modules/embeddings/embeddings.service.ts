import OpenAI from 'openai';
import { env } from '../../config/env';

const openai = new OpenAI({ apiKey: env.openaiKey });

export async function embedText(text: string): Promise<number[]> {
  const resp = await openai.embeddings.create({
    model: env.openaiEmbedModel,
    input: text,
  });

  return resp.data[0].embedding;
}
