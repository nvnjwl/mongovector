import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireString } from '../../utils/validators';
import { chatWithMemory } from './chat.service';

export const chatController = {
  chat: asyncHandler(async (req: Request, res: Response) => {
    const userId = requireString(req.body, 'userId', 200);
    const sessionId = requireString(req.body, 'sessionId', 200);
    const message = requireString(req.body, 'message', 20_000);

    const out = await chatWithMemory({ userId, sessionId, message });
    res.json(out);
  }),
};
