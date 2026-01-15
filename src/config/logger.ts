export function logInfo(msg: string, meta?: unknown) {
  if (meta) console.log(msg, meta);
  else console.log(msg);
}

export function logError(msg: string, meta?: unknown) {
  if (meta) console.error(msg, meta);
  else console.error(msg);
}
