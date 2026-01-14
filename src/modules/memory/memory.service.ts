import { MemoryModel } from '../../models/Memory';
import { env } from '../../config/env';

export async function vectorSearchMemories(input: {
  userId: string;
  queryEmbedding: number[];
  limit?: number;
}) {
  const limit = input.limit ?? env.memoryTopK;

  const pipeline: Record<string, unknown>[] = [
    {
      $vectorSearch: {
        index: env.vectorIndex,
        path: env.vectorPath,
        queryVector: input.queryEmbedding,
        numCandidates: env.memoryNumCandidates,
        limit,
        filter: { userId: { $eq: input.userId } },
      },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        type: 1,
        summary: 1,
        tags: 1,
        importance: 1,
        createdAt: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ];

  const results = await MemoryModel.aggregate(pipeline);
  return results;
}

export async function touchMemories(memoryIds: string[]) {
  if (!memoryIds.length) return;
  await MemoryModel.updateMany(
    { _id: { $in: memoryIds } },
    { $inc: { accessCount: 1 }, $set: { lastAccessedAt: new Date() } }
  );
}
