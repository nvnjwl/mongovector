import express from 'express';
import path from 'path';
import cors from 'cors';

import { chatRouter } from './modules/chat/chat.routes';
import { memoryRouter } from './modules/memory/memory.routes';
import { HttpError } from './utils/httpError';
import { logError } from './config/logger';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(`[http] ${req.method} ${req.path} ${res.statusCode} ${ms}ms`);
    });
    next();
  });

  const publicDir = path.join(process.cwd(), 'public');
  app.use(express.static(publicDir));

  app.get('/api/health', (_, res) => {
    res.json({ ok: true });
  });

  app.use('/api/chat', chatRouter);
  app.use('/api/memory', memoryRouter);

  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(err);

    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Internal Server Error';

    logError('[error]', {
      status,
      message,
      stack: err instanceof Error ? err.stack : undefined,
      path: req.path,
    });

    res.status(status).json({
      error: message,
      code: err instanceof HttpError ? err.code : undefined,
    });
  });

  return app;
}
