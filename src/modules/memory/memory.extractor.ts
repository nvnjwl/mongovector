import OpenAI from 'openai';
import { env } from '../../config/env';
import { MemoryType } from './memory.types';

const openai = new OpenAI({ apiKey: env.openaiKey });

export type ExtractedMemory = {
  type: MemoryType;
  summary: string;
  rawText: string;
  importance: number;
  tags: string[];
};

export async function extractMemoriesFromMessage(input: {
  userMessage: string;
}): Promise<ExtractedMemory[]> {
  const system = `
You are a memory extraction engine for an AI assistant.

Extract only stable, reusable memories.
Do NOT extract greetings, filler, or one-off chit-chat.

Return JSON array only.
Schema:
[
  {
    "type": "...",
    "summary": "...",
    "rawText": "...",
    "importance": 0.0-1.0,
    "tags": ["..."]
  }
]

Rules:
- If nothing is worth remembering: return []
- summary must be short (<= 120 chars)
- importance: preference/identity/project=0.7-1.0, small info=0.2-0.6
`;

  const resp = await openai.chat.completions.create({
    model: env.openaiChatModel,
    temperature: 0.2,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: input.userMessage },
    ],
  });

  const content = resp.choices[0]?.message?.content?.trim() ?? '[]';

  try {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}
