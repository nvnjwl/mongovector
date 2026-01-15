import mongoose from 'mongoose';
import { env } from '../config/env';

export async function connectMongo() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, {
    dbName: env.mongoDb,
    autoIndex: false,
  });

  mongoose.connection.on('error', (err) => {
    console.error('[mongo] connection error', err);
  });

  console.log('[mongo] connected');
}
