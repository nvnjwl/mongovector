import { Router } from 'express';
import { memoryController } from './memory.controller';

export const memoryRouter = Router();

memoryRouter.get('/search', memoryController.search);
memoryRouter.get('/latest', memoryController.latest);
memoryRouter.delete('/purge', memoryController.purge);
