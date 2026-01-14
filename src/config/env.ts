import 'dotenv/config';

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8080),

  mongoUri: must('MONGO_URI'),
  mongoDb: must('MONGO_DB'),

  openaiKey: must('OPENAI_API_KEY'),
  openaiChatModel: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini',
  openaiEmbedModel: process.env.OPENAI_EMBED_MODEL ?? 'text-embedding-3-small',

  vectorIndex: process.env.MEMORY_VECTOR_INDEX ?? 'memory_vector_index',
  vectorPath: process.env.MEMORY_VECTOR_PATH ?? 'embedding',
  vectorDim: Number(process.env.MEMORY_VECTOR_DIM ?? 1536),

  memoryTopK: Number(process.env.MEMORY_TOP_K ?? 12),
  memoryNumCandidates: Number(process.env.MEMORY_NUM_CANDIDATES ?? 200),
};
