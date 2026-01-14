import OpenAI from 'openai';
import { env } from '../../config/env';
import { TurnModel } from '../../models/Turn';
import { embedText } from '../embeddings/embeddings.service';
import { extractMemoriesFromMessage } from '../memory/memory.extractor';
import { MemoryModel } from '../../models/Memory';
import { vectorSearchMemories, touchMemories } from '../memory/memory.service';
import { buildSystemPrompt } from './prompt.builder';

const openai = new OpenAI({ apiKey: env.openaiKey });

export async function chatWithMemory(input: {
  userId: string;
  sessionId: string;
  message: string;
}) {
  await TurnModel.create({
    userId: input.userId,
    sessionId: input.sessionId,
    role: 'user',
    text: input.message,
  });

  const extracted = await extractMemoriesFromMessage({
    userMessage: input.message,
  });

  if (extracted.length) {
    for (const mem of extracted) {
      const emb = await embedText(mem.summary);
      await MemoryModel.create({
        userId: input.userId,
        type: mem.type,
        text: mem.rawText,
        summary: mem.summary,
        tags: mem.tags ?? [],
        importance: mem.importance ?? 0.5,
        embedding: emb,
      });
    }
  }

  const qEmb = await embedText(input.message);
  const memories = await vectorSearchMemories({
    userId: input.userId,
    queryEmbedding: qEmb,
  });

  await touchMemories(memories.map((m) => String(m._id)));

  const recentTurns = await TurnModel.find({
    userId: input.userId,
    sessionId: input.sessionId,
  })
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  const stm = recentTurns.reverse().map((t) => ({
    role: t.role,
    content: t.text,
  }));

  const systemPrompt = buildSystemPrompt({ memories });

  const resp = await openai.chat.completions.create({
    model: env.openaiChatModel,
    temperature: 0.6,
    messages: [{ role: 'system', content: systemPrompt }, ...stm],
  });

  const reply = resp.choices[0]?.message?.content ?? '';

  await TurnModel.create({
    userId: input.userId,
    sessionId: input.sessionId,
    role: 'assistant',
    text: reply,
  });

  return {
    reply,
    memoriesUsed: memories,
    extractedMemories: extracted,
  };
}
