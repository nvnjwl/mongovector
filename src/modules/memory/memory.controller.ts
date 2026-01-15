import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireString, optionalString } from '../../utils/validators';
import { embedText } from '../embeddings/embeddings.service';
import { vectorSearchMemories } from './memory.service';
import { MemoryModel } from '../../models/Memory';

export const memoryController = {
  search: asyncHandler(async (req: Request, res: Response) => {
    const userId = requireString(req.query, 'userId', 200);
    const q = requireString(req.query, 'q', 5_000);

    const emb = await embedText(q);
    const results = await vectorSearchMemories({
      userId,
      queryEmbedding: emb,
    });

    res.json({ results });
  }),

  latest: asyncHandler(async (req: Request, res: Response) => {
    const userId = requireString(req.query, 'userId', 200);
    const limitStr = optionalString(req.query, 'limit', 10);
    const limit = Math.min(Number(limitStr ?? '25'), 100);

    const items = await MemoryModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select({ embedding: 0 })
      .lean();

    res.json({ items });
  }),

  purge: asyncHandler(async (req: Request, res: Response) => {
    const userId = requireString(req.query, 'userId', 200);

    const out = await MemoryModel.deleteMany({ userId });

    res.json({ ok: true, deletedCount: out.deletedCount });
  }),
};
