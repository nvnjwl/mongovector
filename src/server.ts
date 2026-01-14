import { createApp } from './app';
import { env } from './config/env';
import { connectMongo } from './db/mongo';
import { ensureIndexes } from './db/indexes';

async function main() {
  await connectMongo();
  await ensureIndexes();

  const app = createApp();
  app.listen(env.port, () => console.log(`[server] running on :${env.port}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
