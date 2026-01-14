import { MemoryModel } from '../models/Memory';
import { TurnModel } from '../models/Turn';
import { logInfo } from '../config/logger';

export async function ensureIndexes() {
  await Promise.all([MemoryModel.syncIndexes(), TurnModel.syncIndexes()]);
  logInfo('[mongo] indexes ensured');
}
